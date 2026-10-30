import React from 'react';
import { GeometricDecoration } from './GeometricDecorations';
import {
  Users,
  Mic,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  Compass,
  Store,
  TrendingUp,
  MapPin,
  Calendar,
  Ticket,
} from 'lucide-react';

interface AboutSectionProps {
  onOpenRegister?: () => void;
  onNavigate?: (sectionId: string) => void;
  onOpenStandBooking?: () => void;
  onOpenPitchForm?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  onOpenRegister,
  onNavigate,
  onOpenStandBooking,
  onOpenPitchForm,
}) => {
  const handleScrollTo = (id: string) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Section 6: Indicadores de Grande Dimensão (Projecções Oficiais da 79.ª Edição)
  const metrics = [
    {
      value: '950',
      label: 'Participantes Esperados',
      sub: 'Líderes, empresários e fundadores de todo o país',
      color: 'from-[#FFC928] to-amber-500',
      icon: Users,
      border: 'border-amber-500/30',
    },
    {
      value: '100%',
      label: 'Foco Comercial & Negócios',
      sub: 'Stands, pitch empresarial e parcerias estratégicas',
      color: 'from-[#DC1037] to-rose-600',
      icon: TrendingUp,
      border: 'border-rose-500/30',
    },
    {
      value: '4',
      label: 'Painéis Principais',
      sub: 'RH, Negócios, Marketing e Gestão Financeira',
      color: 'from-[#B20D64] to-purple-600',
      icon: Layers,
      border: 'border-pink-500/30',
    },
    {
      value: '8H',
      label: 'Duração da Imersão',
      sub: 'Experiência contínua das 08h00 às 16h00 em Luanda',
      color: 'from-[#67206D] to-indigo-600',
      icon: Clock,
      border: 'border-purple-500/30',
    },
  ];

  // Section 7: Mais do que um evento (4 Cartões Interactivos de Experiências)
  const experiences = [
    {
      id: '01',
      title: 'CONFERÊNCIA',
      tagline: 'Conhecimento de Alto Impacto',
      desc: 'Quatro painéis dedicados aos pilares essenciais do crescimento empresarial, com debates aprofundados e casos reais de Angola.',
      img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      badge: '4 Painéis Especializados',
      actionLabel: 'Explorar Conferência',
      action: () => handleScrollTo('conferencia'),
      borderColor: 'hover:border-purple-500/60',
      accentBg: 'bg-[#67206D]',
    },
    {
      id: '02',
      title: 'SALA DE ESTRATÉGIA',
      tagline: 'Mentoria & Aconselhamento Prático',
      desc: 'Um ambiente de aprendizagem aplicada, diagnóstico empresarial e construção de soluções estratégicas com consultores sénior.',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      badge: 'Sessões One-on-One',
      actionLabel: 'Agendar Sessão',
      action: () => handleScrollTo('sala-estrategia'),
      borderColor: 'hover:border-amber-500/60',
      accentBg: 'bg-[#FFC928] text-black',
    },
    {
      id: '03',
      title: 'FEIRA DE NEGÓCIOS',
      tagline: 'Vitrina de Marcas & Networking',
      desc: 'Um espaço vibrante onde empresas e empreendedores apresentam produtos, serviços e inovações a um público qualificado.',
      img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      badge: 'Área de Expositores',
      actionLabel: 'Reservar um Stand',
      action: onOpenStandBooking || (() => handleScrollTo('expositores')),
      borderColor: 'hover:border-rose-500/60',
      accentBg: 'bg-[#B20D64]',
    },
    {
      id: '04',
      title: 'PITCH EMPRESARIAL',
      tagline: 'Palco de Ideias perante Investidores',
      desc: '5 minutos para apresentar o seu projecto a empresários, especialistas e potenciais parceiros com capacidade de alavancar o seu negócio.',
      img: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      badge: 'Competição com Júri',
      actionLabel: 'Inscrever Projecto',
      action: onOpenPitchForm || (() => handleScrollTo('pitch')),
      borderColor: 'hover:border-red-500/60',
      accentBg: 'bg-[#DC1037]',
    },
  ];

  // Section 14: Experiência do Participante (4 Cartões Horizontais Coloridos)
  const journeyCards = [
    {
      id: 'inscricoes',
      title: 'INSCRIÇÕES',
      desc: 'Garantir a sua vaga gratuita na conferência ou pacote Café Experience com credenciamento prioritário.',
      colorBg: 'bg-[#FFC928] text-black',
      textColor: 'text-zinc-950',
      btnColor: 'bg-black text-white hover:bg-zinc-800',
      icon: Ticket,
      action: onOpenRegister || (() => handleScrollTo('ingressos')),
      actionText: 'Inscrever Agora',
    },
    {
      id: 'programa',
      title: 'PROGRAMA',
      desc: 'Conhecer a distribuição horária das 8 horas de evento, os 4 painéis temáticos e as palestras especiais.',
      colorBg: 'bg-[#B20D64] text-white',
      textColor: 'text-white',
      btnColor: 'bg-white text-[#B20D64] hover:bg-zinc-100',
      icon: Calendar,
      action: () => handleScrollTo('agenda'),
      actionText: 'Ver Agenda',
    },
    {
      id: 'como-chegar',
      title: 'COMO CHEGAR',
      desc: 'Informações detalhadas sobre localização, acessos, parque de estacionamento e credenciamento em Luanda.',
      colorBg: 'bg-[#67206D] text-white',
      textColor: 'text-white',
      btnColor: 'bg-white text-[#67206D] hover:bg-zinc-100',
      icon: MapPin,
      action: () => handleScrollTo('sobre'),
      actionText: 'Localização',
    },
    {
      id: 'networking',
      title: 'NETWORKING',
      desc: 'Oportunidades de conexão intencional, directório de participantes e trocas bilaterais de negócios.',
      colorBg: 'bg-[#DC1037] text-white',
      textColor: 'text-white',
      btnColor: 'bg-white text-[#DC1037] hover:bg-zinc-100',
      icon: Users,
      action: () => handleScrollTo('networking'),
      actionText: 'Conectar',
    },
  ];

  return (
    <section id="sobre" className="relative py-20 md:py-28 bg-[#FFFFFF] text-zinc-900 overflow-hidden">
      {/* Decorative Geometric Shapes on Edges */}
      <GeometricDecoration position="top-right" variant="diamonds" size="lg" className="hidden lg:block opacity-60" />
      <GeometricDecoration position="center-left" variant="polygons" size="md" className="hidden md:block opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 relative z-10">
        {/* SECTION 6: INDICADORES DE GRANDE DIMENSÃO */}
        <div className="space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#43085C]/10 text-[#43085C] text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dimensão Oficial da 79.ª Edição</span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-950">
              O MAIOR ENCONTRO DE EMPREENDEDORES DE ANGOLA
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 font-medium">
              Projecções confirmadas para o dia 27 de Novembro de 2026. Oito horas contínuas de aprendizagem, partilha estratégica e celebração do talento nacional.
            </p>
          </div>

          {/* 4 Large Metrics Blocks */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {metrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-8 rounded-3xl bg-zinc-50 border ${m.border} shadow-lg hover:shadow-xl transition-all space-y-3 transform hover:-translate-y-1 relative overflow-hidden group`}
                >
                  {/* Subtle corner colored indicator */}
                  <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none">
                    <div className="w-full h-full bg-gradient-to-br from-transparent via-transparent to-zinc-200 transform rotate-45 translate-x-3 -translate-y-3" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-zinc-900 text-white shadow-md">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-zinc-950">
                      {m.value}
                    </p>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-900">
                      {m.label}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    {m.sub}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 7: MAIS DO QUE UM EVENTO */}
        <div className="space-y-10">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-[#DC1037]">
              EXPERIÊNCIAS INTEGRADAS
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-950 leading-tight">
              NÃO VENHA APENAS ASSISTIR.
              <br />
              <span className="text-[#67206D]">VENHA FAZER ACONTECER.</span>
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
              O <strong>Café do Empreendedor</strong> é um espaço onde conhecimento, estratégia e oportunidades se encontram. Nesta edição, reunimos diferentes experiências para que cada participante tenha a possibilidade de aprender, apresentar soluções, conhecer marcas, estabelecer parcerias e descobrir novos caminhos para os seus negócios.
            </p>
          </div>

          {/* 4 Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {experiences.map((exp) => (
              <div
                key={exp.id}
                className={`rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl flex flex-col justify-between group ${exp.borderColor}`}
              >
                {/* Image with Tag */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={exp.img}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                      {exp.badge}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 font-mono">
                      EXPERIÊNCIA {exp.id}
                    </span>
                    <h3 className="text-lg font-black uppercase tracking-tight leading-tight">
                      {exp.title}
                    </h3>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-[#67206D] uppercase tracking-wide">
                      {exp.tagline}
                    </p>
                    <p className="text-xs text-zinc-600 leading-relaxed">
                      {exp.desc}
                    </p>
                  </div>

                  <button
                    onClick={exp.action}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-zinc-950 text-white hover:bg-[#DC1037] transition-colors flex items-center justify-center space-x-1.5 cursor-pointer shadow-sm group-hover:bg-[#67206D]"
                  >
                    <span>{exp.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 14: EXPERIÊNCIA DO PARTICIPANTE (4 GRANDES CARTÕES HORIZONTAIS COLORIDOS) */}
        <div className="space-y-8 pt-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#B20D64]">
              NAVEGAÇÃO RÁPIDA & GUIA
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-zinc-950">
              A EXPERIÊNCIA COMEÇA ANTES DE CHEGAR AO EVENTO
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Planeie a sua participação com antecedência para tirar o máximo proveito das 8 horas de imersão empresarial.
            </p>
          </div>

          {/* 4 Colored Horizontal Blocks (Reference style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeyCards.map((c) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.id}
                  className={`p-6 sm:p-7 rounded-3xl ${c.colorBg} shadow-xl flex flex-col justify-between space-y-6 transition-transform hover:-translate-y-1 cursor-pointer`}
                  onClick={c.action}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-black/15 backdrop-blur-md">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-black tracking-widest uppercase opacity-75 font-mono">
                        {c.id}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
                      {c.title}
                    </h3>

                    <p className="text-xs leading-relaxed opacity-90 font-medium">
                      {c.desc}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      c.action();
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider ${c.btnColor} shadow transition-all flex items-center justify-center space-x-1.5 cursor-pointer`}
                  >
                    <span>{c.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
