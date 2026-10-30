import React, { useState } from 'react';
import { ConferenceTrack, AgendaSession } from '../types';
import { GeometricDecoration } from './GeometricDecorations';
import {
  Users2,
  LineChart,
  Megaphone,
  Coins,
  ArrowRight,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

interface ConferenceSectionProps {
  tracks: ConferenceTrack[];
  agenda: AgendaSession[];
  onSelectTrackForAgenda: (trackSlug: string) => void;
}

export const ConferenceSection: React.FC<ConferenceSectionProps> = ({
  tracks,
  agenda,
  onSelectTrackForAgenda,
}) => {
  const [activePanelId, setActivePanelId] = useState<string>('painel-negocios');

  // 4 Main Panels strictly matching prompt Section 8
  const panels = [
    {
      id: 'painel-rh',
      num: '01',
      title: 'PAINEL 01 — RECURSOS HUMANOS',
      headline: 'As pessoas certas transformam organizações.',
      desc: 'Debates estratégicos sobre liderança, talento, cultura empresarial e gestão de equipas no ambiente desafiante de Angola.',
      speakersCount: 4,
      topics: ['Liderança Consciente', 'Gestão de Quadros Críticos', 'Cultura Corporativa', 'Remuneração Estratégica'],
      slug: 'recursos-humanos',
      icon: Users2,
      accentColor: '#B20D64',
    },
    {
      id: 'painel-negocios',
      num: '02',
      title: 'PAINEL 02 — NEGÓCIOS',
      headline: 'Grandes negócios não crescem por acaso. Crescem com estratégia.',
      desc: 'Debates essenciais sobre empreendedorismo, inovação de modelos, gestão de processos e expansão empresarial escalável.',
      speakersCount: 4,
      topics: ['Estratégia de Escala', 'Cadeia de Valor Nacional', 'Modelos de Receita', 'Fusões & Parcerias'],
      slug: 'negocios',
      icon: LineChart,
      accentColor: '#FFC928',
    },
    {
      id: 'painel-marketing',
      num: '03',
      title: 'PAINEL 03 — MARKETING',
      headline: 'Não basta ter um bom negócio. O mercado precisa de o conhecer.',
      desc: 'Debates sobre posicionamento de mercado, comunicação intencional, fortalecimento de marcas e canais comerciais de alta conversão.',
      speakersCount: 4,
      topics: ['Posicionamento de Marca', 'Growth & Tráfego Digital', 'Storytelling Corporativo', 'Canais de Venda Directa'],
      slug: 'marketing',
      icon: Megaphone,
      accentColor: '#DC1037',
    },
    {
      id: 'painel-financas',
      num: '04',
      title: 'PAINEL 04 — FINANÇAS',
      headline: 'O crescimento começa com decisões financeiras inteligentes.',
      desc: 'Debates sobre sustentabilidade financeira, atracção de investimento, controlo orçamental rigoroso e gestão de tesouraria.',
      speakersCount: 4,
      topics: ['Gestão de Tesouraria', 'Acesso a Crédito Bancário', 'Conformidade Fiscal AGT', 'Valuation & Auditoria'],
      slug: 'financas',
      icon: Coins,
      accentColor: '#67206D',
    },
  ];

  return (
    <section id="conferencia" className="relative py-20 md:py-28 overflow-hidden text-white">
      {/* Background Event Photograph with Purple & Magenta Gradient Overlay (Reference Style) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=2000&q=85"
          alt="Conferência Café do Empreendedor"
          className="w-full h-full object-cover object-center brightness-35 filter contrast-125"
        />
        {/* Deep Purple & Magenta Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#43085C]/95 via-[#75116E]/90 to-[#B20D64]/85 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#150724]/90 via-transparent to-[#150724]" />
      </div>

      <GeometricDecoration position="top-right" variant="triangles-cluster" size="lg" className="opacity-70" />
      <GeometricDecoration position="bottom-left" variant="diamonds" size="lg" className="opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* Header strictly matching Prompt Section 8 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-amber-300">
            <Layers className="w-3.5 h-3.5" />
            <span>4 GRANDES PAINÉIS · 20 ORADORES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight">
            CONFERÊNCIA EMPRESARIAL
          </h2>
          <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-medium">
            Os quatro pilares fundamentais para transformar empresas e impulsionar a economia real em Angola.
          </p>
        </div>

        {/* 4 Large Panel Blocks (Divididos em 4 blocos como na referência) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {panels.map((p) => {
            const Icon = p.icon;
            const isSelected = activePanelId === p.id;
            return (
              <div
                key={p.id}
                className={`p-7 sm:p-9 rounded-3xl backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden group ${
                  isSelected
                    ? 'bg-black/60 border-amber-400/80 shadow-2xl shadow-purple-950/80 ring-1 ring-amber-400/50'
                    : 'bg-black/40 border-white/15 hover:border-white/40 hover:bg-black/50'
                }`}
              >
                {/* Top Corner Geometric Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden pointer-events-none">
                  <div className="w-full h-full bg-gradient-to-br from-transparent to-white/10 transform rotate-45 translate-x-4 -translate-y-4" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-amber-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-widest bg-white/10 border border-white/20 text-amber-300 font-mono">
                      {p.speakersCount} ORADORES
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-amber-400">
                      BLOCO {p.num}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-0.5">
                      {p.title}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base font-bold text-amber-300 italic">
                    "{p.headline}"
                  </p>

                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-normal">
                    {p.desc}
                  </p>

                  {/* Topics Tags */}
                  <div className="pt-2 flex flex-wrap gap-2">
                    {p.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-[11px] font-semibold text-zinc-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botão Oficial: EXPLORAR PAINEL */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    onClick={() => {
                      setActivePanelId(p.id);
                      onSelectTrackForAgenda(p.slug);
                    }}
                    className="w-full py-3 px-5 rounded-xl text-xs font-black uppercase tracking-wider bg-white text-zinc-950 hover:bg-[#FFC928] hover:text-black transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-lg group-hover:scale-[1.01]"
                  >
                    <span>EXPLORAR PAINEL</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Espaço Complementar para 4 Oradores de Palestras Especiais / Keynote */}
        <div className="p-7 sm:p-8 rounded-3xl bg-black/40 border border-white/20 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-xs font-black text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>SESSÕES MAGNAS E PALESTRAS ESTRATÉGICAS</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
              4 Intervenções Especiais Complementares
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
              Além dos 4 painéis temáticos, o programa integra 4 intervenções executivas de oradores de topo sobre tendências globais, inovação e internacionalização no contexto angolano. Total: 20 oradores no palco oficial.
            </p>
          </div>

          <a
            href="#oradores"
            className="px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-[#DC1037] to-[#B20D64] hover:from-[#ED3038] hover:to-[#DC1037] text-white shadow-xl flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <span>Ver os 20 Oradores</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
