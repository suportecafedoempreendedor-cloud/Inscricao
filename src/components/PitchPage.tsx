import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings, PitchCandidate } from '../types';
import { eventStore } from '../services/store';
import {
  TrendingUp,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  Users,
  Target,
  FileText,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface PitchPageProps {
  settings: EventSettings;
  onBackToHome: () => void;
  onCandidateSubmitted?: (candidate: PitchCandidate) => void;
}

export const PitchPage: React.FC<PitchPageProps> = ({
  settings,
  onBackToHome,
  onCandidateSubmitted,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    founderName: '',
    email: '',
    phone: '',
    sector: 'Tecnologia & Inovação',
    problem: '',
    solution: '',
    businessModel: '',
    targetMarket: '',
    investmentRequestedAoa: '5000000',
    pitchDeckUrl: '',
    videoUrl: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCandidate, setSubmittedCandidate] = useState<PitchCandidate | null>(null);

  const sectors = [
    'Tecnologia & Inovação',
    'FinTech & Pagamentos',
    'Agronegócio & Alimentação',
    'Comércio & E-Commerce',
    'Serviços Corporativos & Logística',
    'Educação & Formação',
    'Saúde & Bem-Estar',
    'Energia & Sustentabilidade',
    'Indústria & Transformação',
    'Outro Sector',
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.projectName.trim()) errs.projectName = 'Introduza o nome do projecto ou startup.';
    if (!formData.founderName.trim()) errs.founderName = 'Introduza o nome completo do fundador ou representante.';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Introduza um endereço de e-mail válido para contacto.';
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      errs.phone = 'Introduza um número de telefone ou WhatsApp válido (+244...).';
    }
    if (!formData.problem.trim() || formData.problem.length < 20) {
      errs.problem = 'Descreva o problema com clareza (mínimo de 20 caracteres).';
    }
    if (!formData.solution.trim() || formData.solution.length < 20) {
      errs.solution = 'Descreva a sua solução e proposta de valor (mínimo de 20 caracteres).';
    }
    if (!formData.businessModel.trim()) {
      errs.businessModel = 'Explique como a sua empresa gera ou pretende gerar receita.';
    }
    if (!formData.targetMarket.trim()) {
      errs.targetMarket = 'Identifique quem são os seus clientes-alvo em Angola ou no exterior.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newCand = eventStore.addPitchCandidate({
        projectName: formData.projectName.trim(),
        founderName: formData.founderName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        sector: formData.sector,
        problem: formData.problem.trim(),
        solution: formData.solution.trim(),
        businessModel: formData.businessModel.trim(),
        targetMarket: formData.targetMarket.trim(),
        investmentRequestedAoa: Number(formData.investmentRequestedAoa) || 0,
        pitchDeckUrl: formData.pitchDeckUrl.trim() || undefined,
        videoUrl: formData.videoUrl.trim() || undefined,
      });

      setSubmittedCandidate(newCand);
      setIsSubmitting(false);
      if (onCandidateSubmitted) {
        onCandidateSubmitted(newCand);
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
              27 de Novembro · Mediateca Zé Dú
            </span>
            <button
              onClick={() => {
                const el = document.getElementById('formulario-pitch');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-[#DC1037] to-[#B20D64] hover:from-[#ED3038] hover:to-[#DC1037] shadow-lg transition-all"
            >
              Inscrever Projecto
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Hero Section of Pitch */}
        <div className="text-center space-y-6 pt-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-xs font-black text-amber-300 uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Página Oficial de Candidatura · /pitch</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white leading-[1.05]">
            PITCH EMPRESARIAL
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC928] via-[#DC1037] to-[#B20D64]">
              A SUA IDEIA NO PALCO DOS INVESTIDORES
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-300 max-w-3xl mx-auto leading-relaxed">
            Tem um negócio inovador, um produto com tracção ou uma solução de alto potencial para Angola?
            Submeta a sua candidatura para apresentar o seu pitch de <strong>5 minutos</strong> perante a banca oficial de investidores, empresários e jurados na 79.ª Edição do Café do Empreendedor.
          </p>

          {/* Quick Value Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
              <Clock className="w-5 h-5 text-amber-400" />
              <p className="text-xs font-black text-white">5 Minutos de Palco</p>
              <p className="text-[11px] text-zinc-400">Apresentação concisa perante investidores</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
              <Award className="w-5 h-5 text-rose-400" />
              <p className="text-xs font-black text-white">Avaliação em Directo</p>
              <p className="text-[11px] text-zinc-400">Júri com feedback e pontuação oficial</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
              <Users className="w-5 h-5 text-purple-400" />
              <p className="text-xs font-black text-white">Visibilidade Máxima</p>
              <p className="text-[11px] text-zinc-400">Audiência de 950 líderes empresariais</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-white/10 space-y-1">
              <Target className="w-5 h-5 text-emerald-400" />
              <p className="text-xs font-black text-white">Acesso a Capital</p>
              <p className="text-[11px] text-zinc-400">Conexão directa com fundos e parceiros</p>
            </div>
          </div>
        </div>

        {/* Success Confirmation State */}
        {submittedCandidate ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-zinc-950 border border-emerald-500/40 space-y-8 text-center shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-3 max-w-xl mx-auto">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400 font-mono">
                Candidatura Registada com Sucesso
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Projecto: {submittedCandidate.projectName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                A sua candidatura foi gravada na base de dados e já se encontra disponível para triagem no painel administrativo do Café do Empreendedor.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/60 border border-white/10 max-w-md mx-auto text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Código da Candidatura:</span>
                <span className="font-mono font-bold text-amber-400">{submittedCandidate.id}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Fundador / Responsável:</span>
                <span className="font-bold text-white">{submittedCandidate.founderName}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <span className="text-zinc-400">Sector Seleccionado:</span>
                <span className="font-bold text-zinc-200">{submittedCandidate.sector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Estado Inicial:</span>
                <span className="px-2 py-0.5 rounded font-black text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {submittedCandidate.status}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedCandidate(null)}
                className="px-6 py-3 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-700 rounded-xl cursor-pointer"
              >
                Submeter Outro Projecto
              </button>

              <button
                onClick={onBackToHome}
                className="px-7 py-3 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#DC1037] to-[#B20D64] rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                Voltar à Página Principal
              </button>
            </div>
          </div>
        ) : (
          /* Application Form Card */
          <div
            id="formulario-pitch"
            className="p-6 sm:p-10 rounded-3xl bg-zinc-950/90 border border-white/15 backdrop-blur-xl shadow-2xl space-y-8"
          >
            <div className="border-b border-zinc-800/80 pb-6 space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-[#DC1037]">
                FORMULÁRIO OFICIAL DE SUBMISSÃO
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                Dados do Projecto & Fundador
              </h2>
              <p className="text-xs text-zinc-400">
                Preencha todos os campos obrigatórios (*). As informações serão avaliadas pela comissão técnica para selecção dos finalistas que sobem ao palco.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              {/* Row 1: Project Name & Sector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Nome do Projecto / Startup *</span>
                    {errors.projectName && <span className="text-rose-400 text-[11px] font-normal">{errors.projectName}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                    placeholder="Ex: KambaPay, AgroFértil Angola..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.projectName ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold">Sector de Actuação *</label>
                  <select
                    value={formData.sector}
                    onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-amber-400"
                  >
                    {sectors.map((s) => (
                      <option key={s} value={s} className="bg-zinc-900 text-white">
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Founder Name, Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Fundador / Representante *</span>
                    {errors.founderName && <span className="text-rose-400 text-[11px] font-normal">{errors.founderName}</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    placeholder="Nome completo"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.founderName ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>E-mail Corporativo ou Pessoal *</span>
                    {errors.email && <span className="text-rose-400 text-[11px] font-normal">{errors.email}</span>}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@dominio.ao"
                    className={`w-full bg-zinc-900/90 border ${
                      errors.email ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Telefone / WhatsApp *</span>
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
              </div>

              {/* Row 3: Problem and Solution */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Qual é o Problema que o Seu Projecto Resolve? *</span>
                    {errors.problem && <span className="text-rose-400 text-[11px] font-normal">{errors.problem}</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Descreva a dor do mercado, a ineficiência que encontrou e quem sofre com este problema em Angola..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.problem ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>A Sua Solução & Proposta de Valor Única *</span>
                    {errors.solution && <span className="text-rose-400 text-[11px] font-normal">{errors.solution}</span>}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    placeholder="Explique como o seu produto ou serviço soluciona a dor descrita e o que o diferencia da concorrência..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.solution ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>
              </div>

              {/* Row 4: Business Model & Target Market */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Modelo de Negócio & Fontes de Receita *</span>
                    {errors.businessModel && <span className="text-rose-400 text-[11px] font-normal">{errors.businessModel}</span>}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.businessModel}
                    onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                    placeholder="Ex: Assinatura mensal B2B, comissão de 5% sobre transacções, venda directa de produto..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.businessModel ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold flex items-center justify-between">
                    <span>Mercado-Alvo & Clientes *</span>
                    {errors.targetMarket && <span className="text-rose-400 text-[11px] font-normal">{errors.targetMarket}</span>}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.targetMarket}
                    onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                    placeholder="Ex: PMEs do sector retalhista em Luanda, jovens universitários, pequenos agricultores..."
                    className={`w-full bg-zinc-900/90 border ${
                      errors.targetMarket ? 'border-rose-500' : 'border-zinc-700 focus:border-amber-400'
                    } rounded-xl p-3 text-white placeholder-zinc-500 outline-none`}
                  />
                </div>
              </div>

              {/* Row 5: Investment & Links */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold">Investimento / Parceria Pretendida (Kz)</label>
                  <input
                    type="number"
                    value={formData.investmentRequestedAoa}
                    onChange={(e) => setFormData({ ...formData, investmentRequestedAoa: e.target.value })}
                    placeholder="Ex: 5000000"
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 text-white outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold">Link para Pitch Deck (Google Drive / PDF)</label>
                  <input
                    type="url"
                    value={formData.pitchDeckUrl}
                    onChange={(e) => setFormData({ ...formData, pitchDeckUrl: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-200 font-bold">Vídeo Pitch / Demonstração (YouTube / Vimeo)</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-zinc-900/90 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Error banner if validation fails */}
              {Object.keys(errors).length > 0 && (
                <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-rose-300 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Por favor corrija os campos assinalados a vermelho antes de submeter.</span>
                </div>
              )}

              {/* Submit CTA */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-zinc-800">
                <p className="text-zinc-400 text-xs">
                  Ao submeter, declara que as informações são verídicas e autoriza a avaliação técnica da organização.
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 text-xs font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-[#DC1037] via-[#B20D64] to-[#75116E] hover:from-[#ED3038] hover:to-[#DC1037] shadow-xl shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'A Gravar Candidatura...' : 'Submeter Candidatura Oficial'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};
