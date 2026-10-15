import React, { useState, useEffect } from 'react';
import { PitchCandidate, PitchEvaluation } from '../types';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Award,
  DollarSign,
  Briefcase,
  Users,
  Target,
  Sparkles,
  ChevronRight,
  PlusCircle,
  CheckCircle2,
} from 'lucide-react';

interface PitchSectionProps {
  candidates: PitchCandidate[];
  onOpenPitchApplication: () => void;
  onOpenJuryScoring: (candidate: PitchCandidate) => void;
}

export const PitchSection: React.FC<PitchSectionProps> = ({
  candidates,
  onOpenPitchApplication,
  onOpenJuryScoring,
}) => {
  // Live Timer State (3 minutes = 180 seconds)
  const PITCH_DURATION = 180;
  const [timeLeft, setTimeLeft] = useState(PITCH_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<PitchCandidate | null>(
    candidates[0] || null
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimeLeft(PITCH_DURATION);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Ranking calculation
  const rankedCandidates = [...candidates].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <section id="pitch" className="py-20 bg-zinc-950/70 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pitch Empresarial 79.ª Edição</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
              O próximo grande negócio pode nascer aqui.
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              O palco onde ideias visionárias encontram investidores, parceiros comerciais e validação de mercado em tempo real. Apresentações dinâmicas de 3 minutos perante um júri executivo.
            </p>
          </div>

          <button
            onClick={onOpenPitchApplication}
            className="self-start md:self-end px-5 py-3 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-amber-500 via-rose-600 to-[#BE123C] hover:opacity-95 shadow-lg shadow-amber-950/30 transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-white" />
            <span>Candidatar Meu Negócio ao Pitch</span>
          </button>
        </div>

        {/* Live Presentation Arena & Timer Box */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Timer Counter */}
          <div className="lg:col-span-4 text-center p-6 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-4">
            <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              <Timer className="w-4 h-4 text-amber-400" />
              <span>Cronómetro Oficial de Palco</span>
            </div>

            <div
              className={`text-5xl sm:text-6xl font-mono font-black tracking-tight ${
                timeLeft <= 30 && timeLeft > 0
                  ? 'text-rose-500 animate-pulse'
                  : timeLeft === 0
                  ? 'text-rose-600 font-extrabold'
                  : 'text-white'
              }`}
            >
              {formatTime(timeLeft)}
            </div>

            <p className="text-xs text-zinc-500">
              {timeLeft === 0
                ? 'Tempo esgotado! Início das perguntas do júri.'
                : timeLeft <= 30
                ? 'Últimos 30 segundos! Conclusão da proposta de valor.'
                : '3 Minutos estritos para apresentação da solução.'}
            </p>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 text-xs font-bold text-white rounded-lg flex items-center space-x-1.5 transition-colors ${
                  isRunning
                    ? 'bg-amber-600 hover:bg-amber-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>

              <button
                onClick={handleResetTimer}
                className="px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center space-x-1 transition-colors"
                title="Reiniciar Cronómetro"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Right: Selected Candidate Profile In Focus */}
          <div className="lg:col-span-8 space-y-4">
            {selectedCandidate ? (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                      Candidato em Destaque no Palco
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {selectedCandidate.projectName}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Fundador(a): <strong>{selectedCandidate.founderName}</strong> · Sector: {selectedCandidate.sector}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded bg-purple-950 border border-purple-800 text-xs font-mono font-bold text-purple-300">
                      Investimento: {selectedCandidate.investmentRequestedAoa.toLocaleString('pt-AO')} Kz
                    </span>

                    <button
                      onClick={() => onOpenJuryScoring(selectedCandidate)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Avaliar (Júri)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-zinc-300">
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <p className="font-bold text-amber-400 text-[11px] uppercase tracking-wider">O Problema</p>
                    <p className="leading-relaxed text-zinc-300">{selectedCandidate.problem}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <p className="font-bold text-emerald-400 text-[11px] uppercase tracking-wider">A Solução</p>
                    <p className="leading-relaxed text-zinc-300">{selectedCandidate.solution}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <p className="font-bold text-purple-400 text-[11px] uppercase tracking-wider">Modelo de Negócio</p>
                    <p className="leading-relaxed text-zinc-300">{selectedCandidate.businessModel}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
                    <p className="font-bold text-rose-400 text-[11px] uppercase tracking-wider">Mercado-Alvo</p>
                    <p className="leading-relaxed text-zinc-300">{selectedCandidate.targetMarket}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 italic">Selecione um candidato abaixo para carregar os dados no palco.</p>
            )}
          </div>
        </div>

        {/* 5 Evaluation Criteria Presentation */}
        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-zinc-400 uppercase tracking-wider">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Critérios Oficiais de Avaliação do Júri (Total: 100 Pontos)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { label: 'Inovação & Diferenciação', pts: '20 pts', desc: 'Originalidade da proposta no mercado' },
              { label: 'Viabilidade Técnica', pts: '20 pts', desc: 'Capacidade de operacionalização' },
              { label: 'Tamanho de Mercado', pts: '20 pts', desc: 'Potencial de escala em Angola' },
              { label: 'Modelo de Receita', pts: '20 pts', desc: 'Monetização e sustentabilidade financeira' },
              { label: 'Capacidade de Execução', pts: '20 pts', desc: 'Solidez e competência da equipa' },
            ].map((crit, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-left space-y-1">
                <span className="text-xs font-bold text-amber-400 font-mono">{crit.pts}</span>
                <p className="text-xs font-bold text-white leading-snug">{crit.label}</p>
                <p className="text-[11px] text-zinc-400">{crit.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Public Pitch Leaderboard / Candidates Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Quadro de Participantes & Classificação</span>
            </h3>
            <span className="text-xs text-zinc-400">Classificação com base na média do Júri</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rankedCandidates.map((cand, idx) => {
              const isSelected = selectedCandidate?.id === cand.id;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidate(cand)}
                  className={`p-5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-zinc-900 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-zinc-800 text-zinc-300">
                        #{idx + 1} Classificado
                      </span>
                      <span className="text-xs font-extrabold text-amber-400 font-mono">
                        {cand.averageScore > 0 ? `${cand.averageScore}/100 pts` : 'Por Avaliar'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">{cand.projectName}</h4>
                    <p className="text-xs text-zinc-400">{cand.founderName} · {cand.sector}</p>
                    <p className="text-xs text-zinc-300 line-clamp-2 pt-1">{cand.solution}</p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-mono font-semibold">
                      {cand.investmentRequestedAoa.toLocaleString('pt-AO')} Kz
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenJuryScoring(cand);
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center space-x-1"
                    >
                      <span>Avaliar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
