import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings, SponsorshipRequest } from '../types';
import { eventStore } from '../services/store';
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Building2,
  User,
  Briefcase,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Star,
  Award,
  Crown,
  Layers,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface SponsorPageProps {
  settings: EventSettings;
  onBackToHome: () => void;
  onRequestSubmitted?: (req: SponsorshipRequest) => void;
}

export const SponsorPage: React.FC<SponsorPageProps> = ({
  settings,
  onBackToHome,
  onRequestSubmitted,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    representativeName: '',
    role: '',
    phone: '',
    email: '',
    tier: 'Ouro' as SponsorshipRequest['tier'],
    message: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<SponsorshipRequest | null>(null);

  const tiersList: {
    id: SponsorshipRequest['tier'];
    title: string;
    badge: string;
    badgeColor: string;
    border: string;
    desc: string;
    benefits: string[];
    icon: any;
  }[] = [
    {
      id: 'Diamante',
      title: 'Cota Diamante (Naming)',
      badge: 'Exclusividade Máxima',
      badgeColor: 'bg-amber-400 text-black',
      border: 'border-amber-400/50',
      desc: 'Parceiro principal da 79.ª Edição com máxima visibilidade nacional, naming dos palcos e presença institucional de topo.',
      icon: Crown,
      benefits: [
        'Naming Sponsor nos materiais gráficos e ecrãs centrais',
        'Stand VIP Duplo de alta visibilidade na Mediateca Zé Dú',
        'Palestra magna ou intervenção de honra no palco principal',
        '10 Credenciais VIP Café Experience completas',
        'Campanha de marketing dedicada nas redes sociais e imprensa',
      ],
    },
    {
      id: 'Ouro',
      title: 'Cota Ouro',
      badge: 'Grande Destaque',
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
      border: 'border-amber-500/40',
      desc: 'Associação estratégica a um dos 4 eixos temáticos (Finanças, Negócios, Marketing ou RH) e ampla activação comercial.',
      icon: Star,
      benefits: [
        'Stand Executivo de grande dimensão na área de expositores',
        'Logótipo em destaque em todas as credenciais digitais oficiais',
        'Inserção de vídeo institucional nos intervalos dos painéis',
        '6 Credenciais VIP Café Experience com Certificados Oficiais',
        'Menção honrosa em todos os comunicados e relatórios pós-evento',
      ],
    },
    {
      id: 'Prata',
      title: 'Cota Prata',
      badge: 'Alta Conversão',
      badgeColor: 'bg-zinc-700 text-zinc-200',
      border: 'border-zinc-500/40',
      desc: 'Excelente posicionamento para marcas que procuram gerar leads qualificadas e aproximação com empresários e PMEs.',
      icon: Award,
      benefits: [
        'Stand Comercial Standard na feira de negócios',
        'Logótipo em materiais promocionais impressos e digitais',
        'Distribuição de brindes e material institucional no kit oficial',
        '4 Credenciais de Acesso Completo',
      ],
    },
    {
      id: 'Bronze',
      title: 'Cota Bronze',
      badge: 'Presença Corporativa',
      badgeColor: 'bg-rose-900/60 text-rose-300 border border-rose-700/50',
      border: 'border-rose-500/30',
      desc: 'Apoio directo ao ecossistema com presença da sua marca no directório e ecrãs do evento.',
      icon: Layers,
      benefits: [
        'Logótipo nos ecrãs de transição e directório oficial',
        'Acesso ao catálogo de networking empresarial',
        '2 Credenciais de Acesso à Conferência',
      ],
    },
    {
      id: 'Apoio Institucional',
      title: 'Apoio Institucional & Media Partner',
      badge: 'Cooperação',
      badgeColor: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
      border: 'border-purple-500/30',
      desc: 'Modelos de parceria institucional, cobertura mediática e cooperação técnica personalizada.',
      icon: ShieldCheck,
      benefits: [
        'Reconhecimento institucional como apoiante da 79.ª Edição',
        'Inserção nos canais oficiais de comunicação',
        'Articulação personalizada de activação de marca',
      ],
    },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.companyName.trim()) {
      errs.companyName = 'O nome da empresa ou instituição é obrigatório.';
    }
    if (!formData.representativeName.trim()) {
      errs.representativeName = 'O nome do representante é obrigatório.';
    }
    if (!formData.role.trim()) {
      errs.role = 'O cargo ou função do representante é obrigatório.';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Introduza um número de telefone válido (+244...).';
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Introduza um endereço de e-mail corporativo válido.';
    }
    if (!formData.message.trim() || formData.message.length < 15) {
      errs.message = 'Descreva os objectivos da sua empresa com este patrocínio (mínimo de 15 caracteres).';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 400, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = eventStore.addSponsorshipRequest({
        companyName: formData.companyName.trim(),
        representativeName: formData.representativeName.trim(),
        role: formData.role.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        tier: formData.tier,
        message: formData.message.trim(),
      });

      setSubmittedRequest(newReq);
      setIsSubmitting(false);
      if (onRequestSubmitted) {
        onRequestSubmitted(newReq);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0A0214] text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0E031B]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBackToHome}
              className="flex items-center space-x-1.5 px-3 py-2 text-xs font-bold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>Voltar ao Início</span>
            </button>
            <div className="h-6 w-px bg-white/10 hidden sm:block" />
            <BrandLogo variant="compact" theme="dark" className="h-8 w-auto hidden sm:block" />
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono text-amber-400 font-bold hidden md:inline-block">
              Área Corporativa · Oportunidades de Patrocínio
            </span>
            <button
              onClick={() => {
                const el = document.getElementById('formulario-patrocinador');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-amber-500 to-[#DC1037] hover:from-amber-400 hover:to-[#ED3038] shadow-lg transition-all"
            >
              Propor Patrocínio
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-xs font-black text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Página Oficial de Patrocínios · /patrocinador</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
            POSICIONE A SUA MARCA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC928] via-[#DC1037] to-[#B20D64]">
              NO MAIOR EVENTO DE EMPREENDEDORES DE ANGOLA
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Associe a sua empresa à 79.ª Edição do Café do Empreendedor e ganhe exposição perante mais de <strong>950 decisores</strong>, empresários, investidores e fundadores no dia 27 de Novembro de 2026, na Mediateca Zé Dú - Cazenga.
          </p>
        </div>

        {/* Sponsorship Tiers Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs font-black uppercase tracking-widest text-amber-400">
              COTAS & MODALIDADES DE PATROCÍNIO
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
              Escolha a Presença Ideal para a Sua Organização
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiersList.map((tier) => {
              const Icon = tier.icon;
              const isSelected = formData.tier === tier.id;
              return (
                <div
                  key={tier.id}
                  onClick={() => {
                    setFormData({ ...formData, tier: tier.id });
                    const formEl = document.getElementById('formulario-patrocinador');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-6 rounded-3xl bg-zinc-950/90 border ${
                    isSelected ? 'border-amber-400 ring-2 ring-amber-400/30' : tier.border
                  } shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-5 cursor-pointer transform hover:-translate-y-1`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-zinc-900 border border-white/10 text-amber-400">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${tier.badgeColor}`}>
                        {tier.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-black text-white">{tier.title}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{tier.desc}</p>

                    <div className="pt-2 border-t border-zinc-800 space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                        Benefícios Incluídos:
                      </p>
                      <ul className="space-y-1.5 text-xs text-zinc-300">
                        {tier.benefits.map((b, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-black font-black'
                        : 'bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700'
                    }`}
                  >
                    {isSelected ? 'Modalidade Seleccionada ✓' : 'Seleccionar Esta Cota'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Success Confirmation State */}
        {submittedRequest ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-zinc-950 border border-emerald-500/40 space-y-8 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                Proposta de Parceria Registada com Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Empresa: {submittedRequest.companyName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                A proposta foi guardada na base de dados oficial e disponibilizada de imediato na secção de <strong>Patrocínios</strong> do painel administrativo para análise da direcção comercial.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">ID da Proposta:</span>
                <span className="font-mono font-bold text-amber-400">{submittedRequest.id}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Representante:</span>
                <span className="font-bold text-white">{submittedRequest.representativeName} ({submittedRequest.role})</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Cota Solicitada:</span>
                <span className="font-bold text-amber-300">{submittedRequest.tier}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estado:</span>
                <span className="px-2 py-0.5 rounded font-black text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {submittedRequest.status}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 max-w-md mx-auto text-left space-y-1 text-xs">
              <p className="text-amber-400 font-bold">Linha Directa com a Produção:</p>
              <p className="text-zinc-300">WhatsApp Comercial: <strong className="text-white font-mono">+244 921 152 162</strong></p>
              <p className="text-zinc-300">E-mail: <strong className="text-white font-mono">gdangola12@gmail.com</strong></p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedRequest(null)}
                className="px-6 py-3 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 rounded-xl cursor-pointer"
              >
                Submeter Nova Proposta
              </button>

              <button
                onClick={onBackToHome}
                className="px-7 py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 to-[#DC1037] rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                Voltar à Página Principal
              </button>
            </div>
          </div>
        ) : (
          /* Sponsorship Form Card */
          <div
            id="formulario-patrocinador"
            className="p-6 sm:p-10 rounded-3xl bg-zinc-950/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
          >
            <div className="border-b border-zinc-800/80 pb-6 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                MANIFESTAÇÃO DE INTERESSE CORPORATIVO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Formulário para Empresas Interessadas
              </h2>
              <p className="text-xs text-zinc-400">
                Preencha os dados da sua instituição para receber o dossier executivo de patrocínio e agendar reunião com a organização oficial.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Row 1: Company Name & Selected Tier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Nome da Empresa / Instituição *</span>
                    {errors.companyName && <span className="text-rose-400 text-[11px] font-normal">{errors.companyName}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="Ex: Empresa S.A., Banco Parceiro, Grupo Comercial..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.companyName ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold">Modalidade de Patrocínio Pretendida *</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                  >
                    <option value="Diamante">Cota Diamante (Naming Sponsor)</option>
                    <option value="Ouro">Cota Ouro (Eixos Temáticos & Stand Executivo)</option>
                    <option value="Prata">Cota Prata (Stand Standard & Visibilidade)</option>
                    <option value="Bronze">Cota Bronze (Credenciais & Ecrãs)</option>
                    <option value="Apoio Institucional">Apoio Institucional & Media Partner</option>
                    <option value="Outro">Outro Formato Personalizado</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Representative Name, Role, Phone, Email */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Representante *</span>
                    {errors.representativeName && <span className="text-rose-400 text-[11px] font-normal">{errors.representativeName}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.representativeName}
                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                    placeholder="Nome completo"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.representativeName ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Cargo *</span>
                    {errors.role && <span className="text-rose-400 text-[11px] font-normal">{errors.role}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="Ex: Director Geral, CMO..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.role ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Telefone *</span>
                    {errors.phone && <span className="text-rose-400 text-[11px] font-normal">{errors.phone}</span>}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+244 923 000 000"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.phone ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5 md:col-span-1">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>E-mail Corporativo *</span>
                    {errors.email && <span className="text-rose-400 text-[11px] font-normal">{errors.email}</span>}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="empresa@dominio.ao"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.email ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>
              </div>

              {/* Row 3: Message */}
              <div className="space-y-1.5">
                <label className="text-zinc-200 font-bold flex items-center justify-between">
                  <span>Mensagem / Objectivos da Parceria *</span>
                  {errors.message && <span className="text-rose-400 text-[11px] font-normal">{errors.message}</span>}
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Descreva as expectativas da sua marca, tipo de activação pretendida ou solicitações específicas para a comissão organizadora..."
                  className={`w-full bg-zinc-900/90 border ${
                    errors.message ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                  } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                />
              </div>

              {/* Error banner if validation fails */}
              {Object.keys(errors).length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Por favor preencha todos os campos obrigatórios assinalados antes de submeter.</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                <p className="text-zinc-400 text-xs">
                  A nossa equipa comercial entrará em contacto nas próximas 24 horas para apresentação do dossier executivo.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 text-xs font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-amber-500 via-[#DC1037] to-[#B20D64] hover:from-amber-400 hover:to-[#ED3038] shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'A Registar Proposta...' : 'Submeter Proposta de Patrocínio'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
