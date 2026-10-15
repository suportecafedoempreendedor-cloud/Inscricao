import React from 'react';
import { Compass, Users, BookOpen, Mic, TrendingUp, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const journeySteps = [
    {
      num: '01',
      title: 'Descubra',
      subtitle: 'Conheça o evento e a sua programação',
      description:
        'Aceda a uma programação diversificada e curada por quem compreende as especificidades do mercado empresarial angolano.',
      icon: Compass,
      accent: 'from-purple-600 to-indigo-600',
    },
    {
      num: '02',
      title: 'Conecte',
      subtitle: 'Estabeleça contactos com empresários e parceiros',
      description:
        'Ambiente propício para networking intencional com fundadores, executivos, investidores e tomadores de decisão.',
      icon: Users,
      accent: 'from-rose-600 to-pink-600',
    },
    {
      num: '03',
      title: 'Aprenda',
      subtitle: 'Participe nas conferências, painéis e sessões práticas',
      description:
        'Conteúdos de alto nível em 4 grandes eixos: Recursos Humanos, Estratégia de Negócios, Marketing e Gestão Financeira.',
      icon: BookOpen,
      accent: 'from-amber-500 to-yellow-600',
    },
    {
      num: '04',
      title: 'Apresente',
      subtitle: 'Divulgue o seu negócio e participe no Pitch',
      description:
        'Espaço de visibilidade máxima com stands na feira de negócios e a oportunidade de subir ao palco do Pitch Empresarial.',
      icon: Mic,
      accent: 'from-purple-600 to-rose-600',
    },
    {
      num: '05',
      title: 'Cresça',
      subtitle: 'Transforme contactos em oportunidades reais',
      description:
        'Conclua negócios duradouros, aceda a mentoria de topo na Sala de Estratégia e impulsione a sua presença em Angola.',
      icon: TrendingUp,
      accent: 'from-emerald-600 to-teal-600',
    },
  ];

  return (
    <section id="sobre" className="py-20 bg-zinc-950/60 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Institutional Purpose */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              <span>79 Edições de Impacto em Angola</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              O ponto de encontro dos que constroem a economia real de Angola.
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              O <strong className="text-white">Café do Empreendedor</strong> é uma das iniciativas de empreendedorismo e networking empresarial mais consolidadas em Angola. Produzido pela <strong className="text-white">Geração Digital Angola</strong>, o evento chega à sua monumental <strong>79.ª Edição</strong> com a missão clara de conectar quem tem ideias a quem tem recursos, conhecimento e capacidade de execução.
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              Mais do que uma palestra tradicional, a 79.ª Edição reúne num único dia conferências temáticas especializadas, uma feira vibrante de expositores, o prestigiado palco do <em>Pitch Empresarial</em> perante investidores, e uma Sala de Estratégia para consultoria privada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#BE123C] shrink-0" />
                <span>Casos reais e oradores com experiência em Angola</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#BE123C] shrink-0" />
                <span>Ambiente estruturado para fecho de negócios</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#BE123C] shrink-0" />
                <span>Avaliação rigorosa de projetos inovadores</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-zinc-300">
                <CheckCircle2 className="w-4 h-4 text-[#BE123C] shrink-0" />
                <span>Certificação digital oficial para todos os participantes</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl p-1 bg-gradient-to-br from-[#3B0764] via-[#BE123C] to-[#F59E0B] shadow-2xl">
              <div className="rounded-[14px] bg-zinc-900 p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Trajectória Histórica</p>
                    <p className="text-2xl font-black text-white">79.ª Edição</p>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                    Angola
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Missão</p>
                    <p className="text-sm text-zinc-200 mt-1 font-semibold">
                      Descentralizar o conhecimento empresarial prático e fomentar alianças estratégicas entre empreendedores angolanos.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Entidade Produtora</p>
                    <p className="text-sm text-zinc-200 mt-1 font-semibold">
                      Geração Digital Angola (GD Angola)
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Linha Directa & WhatsApp: +244 921 152 162 · Email: gdangola12@gmail.com
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800">
                    <p className="text-xs text-zinc-400 font-medium">Público-Alvo</p>
                    <p className="text-sm text-zinc-200 mt-1 font-semibold">
                      Empresários, directores, fundadores de startups, gestores de topo, profissionais liberais e investidores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Journey Steps */}
        <div className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <p className="text-xs font-bold text-[#BE123C] uppercase tracking-wider">A Jornada do Participante</p>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">Como vai viver a 79.ª Edição</h3>
            <p className="text-sm text-zinc-400">Cinco etapas pensadas ao detalhe para maximizar o seu retorno sobre o investimento de tempo.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {journeySteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-xl p-5 bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 group hover:-translate-y-1"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-amber-400 transition-colors">
                        {step.num}
                      </span>
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${step.accent} text-white shadow-sm`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{step.title}</h4>
                      <p className="text-xs text-zinc-400 mt-0.5 font-medium">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
