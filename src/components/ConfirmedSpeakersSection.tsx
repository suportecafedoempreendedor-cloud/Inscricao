import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  X,
  Award,
  Mic,
  Tag,
} from 'lucide-react';

export interface ConfirmedSpeaker {
  id: string;
  name: string;
  title: string;
  roleDescription: string;
  category: 'lideranca' | 'negocios' | 'saude' | 'comunicacao' | 'paineis';
  categoryLabel: string;
  imagePath: string;
  topic?: string;
  highlights?: string[];
  confirmedBadgeText?: string;
}

export const confirmedSpeakersList: ConfirmedSpeaker[] = [
  {
    id: 'spk-benvindo-magalhaes',
    name: 'Benvindo Magalhães',
    title: 'Comunicador, Apresentador & Empreendedor',
    roleDescription: 'Referência nacional em comunicação de massas, branding pessoal e engajamento institucional.',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Vendas',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Benvindo_Magalh_es__20261018_013156_0000_e2a03fb5.jpg',
    topic: 'Comunicação Estratégica & Criação de Autoridade Comercial',
    highlights: ['Comunicação Eficaz', 'Posicionamento Público', 'Networking de Valor'],
  },
  {
    id: 'spk-dra-fatima-gama',
    name: 'Dra. Fátima Gama',
    title: 'Médica & Especialista em Saúde e Liderança',
    roleDescription: 'Foco na integração de saúde, bem-estar e equilíbrio na liderança empresarial sustentável.',
    category: 'saude',
    categoryLabel: 'Saúde & Produtividade',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Dra._F_tima_Gama_20261018_013402_0000_bdfe0f03.jpg',
    topic: 'Gestão da Saúde & Produtividade em Ambientes de Alta Pressão',
    highlights: ['Saúde & Desempenho', 'Liderança Consciente', 'Equilíbrio Executivo'],
  },
  {
    id: 'spk-dr-panda',
    name: 'Dr. Panda',
    title: 'Palestrante Motivacional & Mentor Empresarial',
    roleDescription: 'Inspiração e metodologia prática para desbloquear o potencial criativo e a resiliência no empreendedorismo.',
    category: 'lideranca',
    categoryLabel: 'Liderança',
    imagePath: '/assets/aistudio/Dr._Panda__20261019_205511_0000_b8e505c4.jpg',
    topic: 'Mentalidade Vencedora: Como Superar Desafios e Prosperar',
    highlights: ['Resiliência nos Negócios', 'Motivação Real', 'Foco em Resultados'],
  },
  {
    id: 'spk-filipe-candondo',
    name: 'Filipe Candondo',
    title: 'Gestor Empresarial & Consultor de Negócios',
    roleDescription: 'Especialista em governança, reestruturação corporativa e eficiência financeira no mercado angolano.',
    category: 'negocios',
    categoryLabel: 'Negócios & Estratégia',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Filipe_Candondo__20261018_013252_0000_bfaa3696.jpg',
    topic: 'Finanças e Eficiência Operacional para Pequenas e Médias Empresas',
    highlights: ['Gestão de Custos', 'Governança Corporativa', 'Margens Rentáveis'],
  },
  {
    id: 'spk-tomas-junior',
    name: 'Tomás Júnior',
    title: 'Empreendedor & Inovador de Mercados',
    roleDescription: 'Líder focado em inovação, novos modelos comerciais e geração prática de resultados.',
    category: 'negocios',
    categoryLabel: 'Negócios & Estratégia',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Tom_s_Junior__20261018_013501_0000_3d50dea2.jpg',
    topic: 'Empreendedorismo que Gera Resultados Reais no Mercado Nacional',
    highlights: ['Modelagem de Negócios', 'Inovação Comercial', 'Validação Ágil'],
  },
  {
    id: 'spk-armando-gomes',
    name: 'Armando Gomes',
    title: 'Especialista em Estratégia & Expansão de Negócios',
    roleDescription: 'Mentoria e orientação estratégica para aceleração de receitas e posicionamento empresarial sólido.',
    category: 'negocios',
    categoryLabel: 'Negócios & Estratégia',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Armando_Gomes__20261018_013558_0000_39d78d5b.jpg',
    topic: 'Alavancagem de Receitas e Estratégia de Crescimento',
    highlights: ['Escalabilidade', 'Crescimento Sustentável', 'Parcerias B2B'],
  },
  {
    id: 'spk-laurinda-macedo',
    name: 'Laurinda Macedo',
    title: 'Empreendedora & Mentora de Liderança Feminina',
    roleDescription: 'Destaque no desenvolvimento de negócios liderados por mulheres e fortalecimento de redes empresariais.',
    category: 'lideranca',
    categoryLabel: 'Liderança',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Laurinda_Macedo__20261018_013904_0000_07484fe2.jpg',
    topic: 'Mulheres que Constroem o Futuro Empresarial em Angola',
    highlights: ['Liderança Feminina', 'Empreendedorismo Inclusivo', 'Gestão de Impacto'],
  },
  {
    id: 'spk-mirian-camoxi',
    name: 'Mirian Camoxi',
    title: 'Especialista em Imagem, Comunicação & Branding',
    roleDescription: 'Criação de marcas memoráveis, postura corporativa e reputação empresarial de alto padrão.',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Vendas',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Mirian_Camoxi_20261019_143039_0000_0bb56f78.jpg',
    topic: 'Branding de Excelência e Construção de Marca Pessoal e Coletiva',
    highlights: ['Branding & Imagem', 'Comunicação de Valor', 'Reputação no Mercado'],
  },
  {
    id: 'spk-daize-jose',
    name: 'Daize José',
    title: 'Especialista em Vendas & Expansão Comercial',
    roleDescription: 'Técnicas modernas de prospecção, fecho de negócios e formação de equipas comerciais de topo.',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Vendas',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Daize_jos___20261019_145605_0000_04cd44a1.jpg',
    topic: 'Vendas de Alto Impacto: Da Prospeção ao Fecho Contratual',
    highlights: ['Pipeline de Vendas', 'Negociação', 'Geração de Receita'],
  },
  {
    id: 'spk-victoria-domingos',
    name: 'Victória Domingos',
    title: 'Estrategista de Carreiras & Desenvolvimento Pessoal',
    roleDescription: 'Orientação de profissionais e empreendedores para atingir o topo das suas competências.',
    category: 'lideranca',
    categoryLabel: 'Liderança',
    imagePath: '/assets/aistudio/Caf__do_empreendedor_Vict_ria_Domingos__20261019_135619_0000_c20862f6.jpg',
    topic: 'Desenvolvimento do Capital Humano & Autoliderança',
    highlights: ['Capacitação', 'Produtividade Pessoal', 'Carreira de Sucesso'],
  },
  {
    id: 'spk-marinela-carvalho',
    name: 'Marinela de Carvalho',
    title: 'Consultora de Negócios & Gestão Executiva',
    roleDescription: 'Diagnóstico operacional, processos de negócios e estruturação de equipas com alto rendimento.',
    category: 'negocios',
    categoryLabel: 'Negócios & Estratégia',
    imagePath: '/assets/aistudio/Marinela_de_carvalho__20261020_225100_0000_4958945f.jpg',
    topic: 'Estruturação de Processos e Eficiência no Ambiente Corporativo',
    highlights: ['Eficiência Operacional', 'Otimização de Processos', 'Liderança Executiva'],
  },
  {
    id: 'spk-marisa',
    name: 'Marisa',
    title: 'Empreendedora & Estrategista de Conteúdo de Negócios',
    roleDescription: 'Criação de canais de aquisição de clientes através de conteúdo educativo e engajamento orgânico.',
    category: 'comunicacao',
    categoryLabel: 'Comunicação & Vendas',
    imagePath: '/assets/aistudio/Marisa_20261020_225236_0000_cda81e01.jpg',
    topic: 'Monetização e Conversão de Comunidades no Mercado Angolano',
    highlights: ['Marketing de Conteúdo', 'Comunidades Ativas', 'Autoridade Digital'],
  },
  {
    id: 'spk-painel-lideranca',
    name: 'Painel Temático: Liderança & Gestão de Alto Rendimento',
    title: 'Debate com Líderes de Referência em Angola',
    roleDescription: 'Sessão plenária com análise aprofundada sobre a condução de pessoas em tempos de transformação.',
    category: 'paineis',
    categoryLabel: 'Painéis Plenários',
    imagePath: '/assets/aistudio/Lideran_a__20261020_225321_0000_dce5b467.jpg',
    topic: 'Como Liderar Equipas no Atual Contexto Económico',
    highlights: ['Debate Plenário', 'Q&A com Participantes', 'Casos de Sucesso'],
  },
  {
    id: 'spk-painel-negocios',
    name: 'Painel Temático: Negócios & Escalabilidade',
    title: 'Discussão Estratégica sobre Crescimento Rentável',
    roleDescription: 'Estratégias de expansão territorial, digitalização e diversificação de fontes de receita em Angola.',
    category: 'paineis',
    categoryLabel: 'Painéis Plenários',
    imagePath: '/assets/aistudio/Neg_cio__20261020_225150_0000_ff892e88.jpg',
    topic: 'Inovação e Criação de Valor em Angola',
    highlights: ['Crescimento Sustentável', 'Investimento Privado', 'Visão Prática'],
  },
  {
    id: 'spk-painel-saude',
    name: 'Painel Temático: Saúde Integral & Produtividade',
    title: 'Debate Interdisciplinar de Especialistas',
    roleDescription: 'A correlação direta entre vitalidade física, clareza mental e resultados financeiros sólidos.',
    category: 'paineis',
    categoryLabel: 'Painéis Plenários',
    imagePath: '/assets/aistudio/Sa_de__20261020_225419_0000_b87da325.jpg',
    topic: 'Saúde, Foco e Longevidade na Trajetória Empreendedora',
    highlights: ['Produtividade Saudável', 'Clareza de Decisão', 'Bem-Estar no Trabalho'],
  },
];

interface ConfirmedSpeakersSectionProps {
  onOpenRegister?: () => void;
}

export const ConfirmedSpeakersSection: React.FC<ConfirmedSpeakersSectionProps> = ({
  onOpenRegister,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [selectedSpeaker, setSelectedSpeaker] = useState<ConfirmedSpeaker | null>(null);

  const categories = [
    { id: 'todos', label: 'Todos os Oradores' },
    { id: 'lideranca', label: 'Liderança' },
    { id: 'negocios', label: 'Negócios & Estratégia' },
    { id: 'comunicacao', label: 'Comunicação & Vendas' },
    { id: 'saude', label: 'Saúde' },
    { id: 'paineis', label: 'Painéis Temáticos' },
  ];

  const filteredSpeakers =
    activeCategory === 'todos'
      ? confirmedSpeakersList
      : confirmedSpeakersList.filter((s) => s.category === activeCategory);

  return (
    <section
      id="oradores"
      className="py-20 bg-white border-y border-[#65A6F4]/30 relative overflow-hidden"
    >
      {/* Decorative background elements in blue & white theme */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#0173EF]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#0152D9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#E8F1FD] border border-[#0173EF]/30 text-xs font-black uppercase tracking-wider text-[#0152D9] shadow-sm">
            <Mic className="w-4 h-4 text-[#0173EF]" />
            <span>PAINEL DE ORADORES CONFIRMADOS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#032877]">
            LÍDERES & ESPECIALISTAS QUE
            <br />
            <span className="text-[#0173EF]">GERAM RESULTADOS REAIS</span>
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            Conheça os oradores, empresários, comunicadores e especialistas confirmados para a{' '}
            <strong className="text-[#032877]">79.ª Edição do Café do Empreendedor</strong>. Uma oportunidade
            única para aprender diretamente com quem vive e transforma o mercado angolano.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0152D9] text-white shadow-md shadow-[#0152D9]/30 scale-105'
                    : 'bg-[#F0F6FE] text-[#032877] hover:bg-[#E8F1FD] border border-[#65A6F4]/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Speakers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSpeakers.map((speaker) => (
            <div
              key={speaker.id}
              onClick={() => setSelectedSpeaker(speaker)}
              className="group bg-[#FFFFFF] rounded-2xl border-2 border-[#65A6F4]/30 hover:border-[#0173EF] shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              {/* Speaker Poster Image Container */}
              <div className="relative aspect-[4/3] sm:aspect-square bg-[#032877] overflow-hidden">
                <img
                  src={speaker.imagePath}
                  alt={speaker.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Status Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#032877]/90 backdrop-blur-md border border-[#F8D21C] text-[11px] font-black uppercase tracking-wider text-[#F8D21C] shadow-md">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Confirmado</span>
                  </span>
                </div>

                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0173EF] text-white text-[10px] font-bold uppercase tracking-wider shadow">
                    {speaker.categoryLabel}
                  </span>
                </div>

                {/* Subtle gradient overlay at the bottom of the photo */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#032877]/90 to-transparent opacity-80" />
              </div>

              {/* Speaker Content Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl font-black text-[#032877] group-hover:text-[#0173EF] transition-colors leading-snug">
                    {speaker.name}
                  </h3>
                  <p className="text-xs font-bold text-[#0152D9] leading-tight">
                    {speaker.title}
                  </p>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                    {speaker.roleDescription}
                  </p>
                </div>

                {/* Topic / Highlights preview */}
                {speaker.topic && (
                  <div className="p-3 rounded-xl bg-[#F0F6FE] border border-[#65A6F4]/30 space-y-1.5">
                    <div className="flex items-center space-x-1.5 text-[11px] font-bold text-[#032877]">
                      <Award className="w-3.5 h-3.5 text-[#0173EF]" />
                      <span className="truncate">{speaker.topic}</span>
                    </div>
                  </div>
                )}

                {/* Click to view details button */}
                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs font-bold text-[#0173EF] group-hover:text-[#0152D9]">
                  <span>Ver cartaz e biografia</span>
                  <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Bar at bottom of section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#032877] via-[#0152D9] to-[#0173EF] text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
              QUER APRENDER COM ESTES GRANDES NOMES?
            </h4>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              As vagas presenciais na Mediateca Zé Dú são rigorosamente limitadas. Garanta já a sua inscrição para o dia 27 de novembro de 2026.
            </p>
          </div>

          {onOpenRegister && (
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 rounded-xl bg-[#F8D21C] hover:bg-amber-300 text-[#032877] font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
            >
              INSCREVER-ME AGORA
            </button>
          )}
        </div>
      </div>

      {/* Speaker Poster Modal / Zoom View */}
      {selectedSpeaker && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-[#0173EF] relative max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-[#032877] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#F8D21C]">
                  Orador Confirmado · 79.ª Edição
                </span>
              </div>
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Poster View */}
                <div className="w-full sm:w-1/2 aspect-square rounded-2xl overflow-hidden bg-[#032877] border border-[#65A6F4]/40 shadow-md shrink-0">
                  <img
                    src={selectedSpeaker.imagePath}
                    alt={selectedSpeaker.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="px-2.5 py-1 rounded-md bg-[#E8F1FD] text-[#0152D9] text-[10px] font-bold uppercase tracking-wider">
                      {selectedSpeaker.categoryLabel}
                    </span>
                    <h3 className="text-2xl font-black text-[#032877] mt-1">
                      {selectedSpeaker.name}
                    </h3>
                    <p className="text-xs font-bold text-[#0173EF]">
                      {selectedSpeaker.title}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed">
                    {selectedSpeaker.roleDescription}
                  </p>

                  {selectedSpeaker.topic && (
                    <div className="p-3.5 rounded-xl bg-[#F0F6FE] border border-[#0173EF]/20 space-y-1">
                      <span className="text-[10px] uppercase font-black text-[#0152D9] tracking-wider">
                        TEMA / PAINEL DE DESTAQUE
                      </span>
                      <p className="text-xs font-bold text-[#032877]">
                        {selectedSpeaker.topic}
                      </p>
                    </div>
                  )}

                  {selectedSpeaker.highlights && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-black text-zinc-500 tracking-wider">
                        Especialidades & Tópicos:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedSpeaker.highlights.map((h, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-zinc-100 text-[#032877] text-[10px] font-semibold border border-zinc-200"
                          >
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Event details reminder */}
              <div className="p-4 rounded-xl bg-[#F0F6FE] border border-[#65A6F4]/30 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#032877]">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#0173EF]" />
                  <span>27 de Novembro de 2026</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#0173EF]" />
                  <span>08h30 (Pontual)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#0173EF]" />
                  <span className="truncate">Mediateca Zé Dú — Cazenga</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedSpeaker(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Fechar
              </button>
              {onOpenRegister && (
                <button
                  onClick={() => {
                    setSelectedSpeaker(null);
                    onOpenRegister();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#0152D9] hover:bg-[#0173EF] text-white text-xs font-black uppercase tracking-wider shadow-md transition-colors cursor-pointer"
                >
                  Garantir Inscrição
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
