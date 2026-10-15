import React, { useState } from 'react';
import { PitchCandidate, PitchEvaluation } from '../types';
import { Award, CheckCircle, Star } from 'lucide-react';

interface JuryScoringModalProps {
  candidate: PitchCandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitEvaluation: (candidateId: string, evaluation: Omit<PitchEvaluation, 'total'>) => void;
}

export const JuryScoringModal: React.FC<JuryScoringModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onSubmitEvaluation,
}) => {
  const [juryName, setJuryName] = useState('Dr. Paulo Gaspar (Júri Convidado)');
  const [scores, setScores] = useState({
    innovation: 17,
    feasibility: 16,
    market: 18,
    revenueModel: 17,
    execution: 18,
  });
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !candidate) return null;

  const totalScore =
    scores.innovation +
    scores.feasibility +
    scores.market +
    scores.revenueModel +
    scores.execution;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitEvaluation(candidate.id, {
      juryMemberName: juryName,
      ...scores,
      notes,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Painel Oficial do Júri
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Avaliar: {candidate.projectName}
            </h3>
            <p className="text-xs text-zinc-400">Fundador(a): {candidate.founderName} ({candidate.sector})</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 font-bold text-lg"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">Pontuação Gravada com Sucesso!</h4>
            <p className="text-sm font-bold text-amber-400 font-mono">
              Pontuação Final: {totalScore} / 100 Pontos
            </p>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto">
              A média do candidato foi recalculada automaticamente na tabela de classificação do Pitch.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Identificação do Membro do Júri *</label>
              <input
                type="text"
                required
                value={juryName}
                onChange={(e) => setJuryName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
              />
            </div>

            {/* 5 Criteria sliders / numeric inputs */}
            <div className="space-y-3 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-300">Critérios de Avaliação (0 a 20 pts cada)</span>
                <span className="font-mono font-bold text-amber-400 text-sm">{totalScore} / 100</span>
              </div>

              {[
                { key: 'innovation', label: '1. Inovação & Diferenciação' },
                { key: 'feasibility', label: '2. Viabilidade Técnica & Operacional' },
                { key: 'market', label: '3. Mercado & Potencial de Crescimento' },
                { key: 'revenueModel', label: '4. Modelo de Receita & Sustentabilidade' },
                { key: 'execution', label: '5. Capacidade de Execução da Equipa' },
              ].map((c) => (
                <div key={c.key} className="space-y-1">
                  <div className="flex justify-between items-center text-zinc-300">
                    <span>{c.label}</span>
                    <span className="font-mono font-bold text-amber-400">
                      {scores[c.key as keyof typeof scores]} / 20
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={scores[c.key as keyof typeof scores]}
                    onChange={(e) =>
                      setScores({ ...scores, [c.key]: Number(e.target.value) })
                    }
                    className="w-full accent-[#BE123C] cursor-pointer"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Parecer Técnico & Notas para o Empreendedor</label>
              <textarea
                rows={2}
                placeholder="Observações do júri, pontos fortes e recomendações de melhoria..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg flex items-center space-x-1"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Gravar Avaliação Oficial</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
