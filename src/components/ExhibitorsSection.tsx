import React, { useState } from 'react';
import { Exhibitor } from '../types';
import feiraImg from '../assets/images/feira_expositores_79_1793380523095.jpg';
import {
  Store,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Armchair,
  Mic,
  Table,
  Phone,
  Mail,
  ExternalLink,
  Search,
  MapPin,
  Building2,
  Tag,
  Check,
} from 'lucide-react';

interface ExhibitorsSectionProps {
  exhibitors: Exhibitor[];
  onOpenStandBooking: () => void;
}

export const ExhibitorsSection: React.FC<ExhibitorsSectionProps> = ({
  exhibitors,
  onOpenStandBooking,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeExhibitorModal, setActiveExhibitorModal] = useState<Exhibitor | null>(null);

  // Only display approved exhibitors in public showcase directory
  const approvedExhibitors = exhibitors.filter((e) => e.status === 'APROVADO' || e.status === 'Aprovado');

  const sectors = ['todos', ...Array.from(new Set(approvedExhibitors.map((e) => e.sector)))];

  const filtered = approvedExhibitors.filter((exh) => {
    if (selectedSector !== 'todos' && exh.sector !== selectedSector) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = exh.companyName.toLowerCase().includes(q);
      const matchDesc = exh.description.toLowerCase().includes(q);
      const matchSector = exh.sector.toLowerCase().includes(q);
      const matchProd = (exh.products || []).some((p) => p.toLowerCase().includes(q));
      return matchName || matchDesc || matchSector || matchProd;
    }
    return true;
  });

  return (
    <section id="expositores" className="py-20 bg-zinc-950 text-zinc-100 relative overflow-hidden border-t border-b border-white/10">
      {/* Decorative ambient lights in purple and magenta */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#75116E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#B20D64]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* =========================================================================
            SECÇÃO MODERNA E DESTACADA DE EXPOSITORES (Requisitos 3 & 5)
            ========================================================================= */}
        <div className="rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-950 to-[#22072F] border-2 border-purple-500/40 p-6 sm:p-10 lg:p-12 shadow-2xl space-y-10 relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/10 via-[#DC1037]/20 to-transparent rounded-full blur-2xl pointer-events-none" />

          {/* Top Title & Subtitle */}
          <div className="space-y-4 max-w-4xl">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black uppercase tracking-widest text-amber-300">
              <Store className="w-4 h-4 text-amber-400" />
              <span>FEIRA DE NEGÓCIOS & MOSTRA COMERCIAL</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-[1.05]">
              SEJA EXPOSITOR NA 79.ª EDIÇÃO DO CAFÉ DO EMPREENDEDOR
            </h2>

            <p className="text-base sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 leading-snug">
              Apresente a sua marca, promova os seus produtos e serviços e estabeleça novas conexões de negócios.
            </p>
          </div>

          {/* Two-column layout: Professional Photo + Price & CTAs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Professional Photography of Business Fair / Exhibition */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border-2 border-purple-500/30 shadow-2xl group relative">
              <img
                src={feiraImg}
                alt="Feira Empresarial e Exposição de Marcas — 79.ª Edição Café do Empreendedor"
                className="w-full h-[320px] sm:h-[380px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white uppercase text-xs tracking-wider">Mostra Comercial Oficial</p>
                  <p className="text-zinc-300 text-[11px]">Mediateca Zé Dú — Cazenga · Luanda</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-amber-400 text-zinc-950 font-black text-xs uppercase shadow">
                  Vagas Limitadas
                </span>
              </div>
            </div>

            {/* Right: Big Price Tag & Conversion */}
            <div className="lg:col-span-5 space-y-6">
              {/* Valor da Inscrição em Grande Destaque */}
              <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border-2 border-amber-500/60 shadow-xl space-y-2 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400 font-mono">
                    VALOR DA INSCRIÇÃO
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/40">
                    Oportunidade Comercial
                  </span>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
                    25.000
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
                    Kz
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                  Espaço completo para exposição e contacto directo com centenas de empresários, executivos e decisores.
                </p>
              </div>

              {/* Botão Principal: QUERO SER EXPOSITOR */}
              <button
                onClick={onOpenStandBooking}
                className="w-full py-4 sm:py-5 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-[#DC1037] to-[#75116E] hover:from-amber-400 hover:to-[#B20D64] shadow-2xl shadow-rose-950/60 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 cursor-pointer border-2 border-amber-400/40"
              >
                <span>QUERO SER EXPOSITOR</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <div className="flex items-center justify-center space-x-2 text-xs text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Apoio e dúvidas: <strong>+244 921 152 162</strong></span>
              </div>
            </div>
          </div>

          {/* =========================================================================
              3 CARTÕES COM OS BENEFÍCIOS INCLUÍDOS
              ✓ Uma mesa para exposição.
              ✓ Uma cadeira.
              ✓ Pitch empresarial de 1 minuto para apresentar a marca, o produto ou serviço ao público.
              ========================================================================= */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-400">
              BENEFÍCIOS INCLUÍDOS NA PARTICIPAÇÃO:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Benefício 1: Uma mesa para exposição */}
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-purple-500/30 hover:border-amber-400/60 transition-all space-y-3 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-700/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Table className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="text-base font-bold text-white">Uma Mesa para Exposição</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Espaço físico identificado para exposição de mostruários, panfletos, produtos e materiais de divulgação da sua marca.
                  </p>
                </div>
              </div>

              {/* Benefício 2: Uma cadeira */}
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-purple-500/30 hover:border-amber-400/60 transition-all space-y-3 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-700/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Armchair className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="text-base font-bold text-white">Uma Cadeira</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Acomodação confortável para o representante ou gestor da marca durante todo o período do evento.
                  </p>
                </div>
              </div>

              {/* Benefício 3: Pitch empresarial de 1 minuto */}
              <div className="p-6 rounded-2xl bg-zinc-900/80 border border-purple-500/30 hover:border-amber-400/60 transition-all space-y-3 group shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-purple-950/70 border border-purple-700/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Mic className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="text-base font-bold text-white">Pitch Empresarial de 1 Minuto</h4>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Momento dedicado perante o auditório e público geral para apresentar a marca, o produto ou serviço e conquistar clientes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              MENSAGEM DE DESTAQUE REQUISITADA
              "Transforme a sua participação numa oportunidade de dar visibilidade
              à sua marca, conquistar novos contactos e apresentar o seu negócio."
              ========================================================================= */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#43085C]/80 via-[#75116E]/70 to-[#B20D64]/80 border-2 border-amber-400/50 shadow-xl text-center space-y-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-base sm:text-lg md:text-xl font-bold text-white italic max-w-3xl mx-auto leading-relaxed">
              "Transforme a sua participação numa oportunidade de dar visibilidade à sua marca, conquistar novos contactos e apresentar o seu negócio."
            </p>
            <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
              79.ª Edição · Empreendedorismo que Gera Resultados
            </p>
          </div>
        </div>

        {/* Directory of Approved Exhibitor Brands */}
        {approvedExhibitors.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Marcas e Empresas na Mostra Comercial
                </h3>
                <p className="text-xs text-zinc-400">
                  Conheça os expositores confirmados que estarão presentes na 79.ª Edição.
                </p>
              </div>

              {/* Search */}
              <div className="relative min-w-[260px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Pesquisar expositor ou produto..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedSector === sec
                      ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                      : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
                  }`}
                >
                  {sec === 'todos' ? 'Todos os Sectores' : sec}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((exh) => (
                <div
                  key={exh.id}
                  className="rounded-2xl p-6 bg-zinc-900/60 border border-zinc-800 hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-950 to-zinc-900 border border-purple-800/40 flex items-center justify-center text-amber-400 font-black text-lg">
                          {exh.companyName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                            {exh.companyName}
                          </h4>
                          <p className="text-xs text-zinc-400">{exh.sector}</p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] font-mono font-semibold text-amber-300 shrink-0 flex items-center space-x-1">
                        <Store className="w-3 h-3 text-amber-400" />
                        <span>Expositor</span>
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                      {exh.description}
                    </p>

                    {exh.productOrServiceToExpose && (
                      <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 space-y-0.5">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                          Destaque na Mostra:
                        </span>
                        <p className="truncate">{exh.productOrServiceToExpose}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() => setActiveExhibitorModal(exh)}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Ver Detalhes</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>

                    {exh.phone && (
                      <a
                        href={`https://wa.me/${exh.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 text-[11px]"
                      >
                        <Phone className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Exhibitor Details Modal */}
      {activeExhibitorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 space-y-5 text-zinc-200">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-semibold">{activeExhibitorModal.sector}</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeExhibitorModal.companyName}</h3>
              </div>
              <button
                onClick={() => setActiveExhibitorModal(null)}
                className="text-zinc-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div>
                <strong className="text-zinc-400 block text-[11px] uppercase">Descrição:</strong>
                <p className="text-zinc-200 mt-1">{activeExhibitorModal.description}</p>
              </div>

              {activeExhibitorModal.productOrServiceToExpose && (
                <div>
                  <strong className="text-zinc-400 block text-[11px] uppercase">Produtos/Serviços em Exposição:</strong>
                  <p className="text-amber-300 mt-1 font-medium">{activeExhibitorModal.productOrServiceToExpose}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-[11px]">
                {activeExhibitorModal.responsibleName && (
                  <div>
                    <span className="text-zinc-500 block">Responsável:</span>
                    <span className="text-white font-semibold">{activeExhibitorModal.responsibleName}</span>
                  </div>
                )}
                {activeExhibitorModal.province && (
                  <div>
                    <span className="text-zinc-500 block">Localização:</span>
                    <span className="text-white font-semibold">{activeExhibitorModal.municipality || ''}, {activeExhibitorModal.province}</span>
                  </div>
                )}
                <div>
                  <span className="text-zinc-500 block">Contacto:</span>
                  <span className="text-white font-mono">{activeExhibitorModal.phone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">E-mail:</span>
                  <span className="text-white font-mono truncate block">{activeExhibitorModal.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveExhibitorModal(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
