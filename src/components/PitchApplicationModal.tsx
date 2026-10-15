import React, { useState } from 'react';
import { PitchCandidate } from '../types';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface PitchApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (candidateData: Omit<PitchCandidate, 'id' | 'status' | 'evaluations' | 'averageScore'>) => void;
}

export const PitchApplicationModal: React.FC<PitchApplicationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    founderName: '',
    email: '',
    phone: '',
    sector: 'Tecnologia / Digital',
    problem: '',
    solution: '',
    businessModel: '',
    targetMarket: '',
    investmentRequestedAoa: 10000000,
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      projectName: formData.projectName,
      founderName: formData.founderName,
      email: formData.email,
      phone: formData.phone,
      sector: formData.sector,
      problem: formData.problem,
      solution: formData.solution,
      businessModel: formData.businessModel,
      targetMarket: formData.targetMarket,
      investmentRequestedAoa: Number(formData.investmentRequestedAoa) || 0,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Palco do Pitch Empresarial</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Candidatura de Projecto</h3>
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
            <h4 className="text-lg font-bold text-white">Candidatura ao Pitch Submetida!</h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              O seu modelo de negócio foi registado na base de dados do evento. O comité de avaliação entrará em contacto com as instruções para o ensaio de palco e ordem de apresentação.
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
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Nome do Projecto / Startup *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: KwanzaFlow"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Fundador(a) / Apresentador(a) *</label>
                <input
                  type="text"
                  required
                  placeholder="Seu Nome Completo"
                  value={formData.founderName}
                  onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="fundador@startup.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Telefone WhatsApp (+244) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+244 923 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Sector de Actividade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: FinTech, Agronegócio, Logística"
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Necessidade de Capital (Kz)</label>
                <input
                  type="number"
                  required
                  step="500000"
                  value={formData.investmentRequestedAoa}
                  onChange={(e) => setFormData({ ...formData, investmentRequestedAoa: Number(e.target.value) })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Qual é o Problema que resolve no mercado angolano? *</label>
              <textarea
                required
                rows={2}
                placeholder="Descreva a dor específica dos seus clientes..."
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">A Sua Solução / Produto *</label>
              <textarea
                required
                rows={2}
                placeholder="Como o seu produto ou serviço soluciona esse problema..."
                value={formData.solution}
                onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Modelo de Receita *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Venda directa, SaaS, comissão"
                  value={formData.businessModel}
                  onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Mercado-Alvo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: PMEs em Luanda, jovens 18-35"
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-gradient-to-r from-amber-500 to-[#BE123C] rounded-lg flex items-center space-x-1"
              >
                <span>Submeter Candidatura</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
