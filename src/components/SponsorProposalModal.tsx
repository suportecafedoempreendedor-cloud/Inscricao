import React, { useState } from 'react';
import { Sponsor } from '../types';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface SponsorProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sponsor: Omit<Sponsor, 'id'>) => void;
}

export const SponsorProposalModal: React.FC<SponsorProposalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    tier: 'PATROCINADOR_OURO' as Sponsor['tier'],
    description: '',
    benefitsSummary: 'Activação de marca, menção nos palcos e stand executivo.',
    website: '',
    contactPerson: '',
    email: '',
    phone: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      tier: formData.tier,
      description: formData.description,
      benefitsSummary: formData.benefitsSummary,
      website: formData.website,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Parcerias Corporativas</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Tornar-se Patrocinador Oficial</h3>
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
            <h4 className="text-lg font-bold text-white">Proposta de Parceria Registada!</h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              A direcção comercial do Café do Empreendedor e a Geração Digital Angola entrarão em contacto directo com o dossier executivo de patrocínio.
            </p>
            <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-left text-xs space-y-1.5">
              <p className="text-amber-200 font-bold uppercase tracking-wider text-[11px]">
                Contacto Directo com a Gestão da Plataforma:
              </p>
              <p className="text-zinc-300">
                Envio de propostas e comprovativos pelo WhatsApp{' '}
                <strong className="text-amber-300 font-mono">+244 921 152 162</strong> ou email{' '}
                <strong className="text-amber-300 font-mono">gdangola12@gmail.com</strong>.
              </p>
            </div>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl cursor-pointer"
            >
              Concluir
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Nome da Instituição / Empresa *</label>
              <input
                type="text"
                required
                placeholder="Ex: Banco ou Empresa S.A."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Nível de Parceria Desejado *</label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                >
                  <option value="PATROCINADOR_OFICIAL">Patrocinador Oficial (Principal)</option>
                  <option value="PATROCINADOR_OURO">Patrocinador Ouro</option>
                  <option value="PARCEIRO_ESTRATEGICO">Parceiro Estratégico</option>
                  <option value="MEDIA_PARTNER">Media Partner / Imprensa</option>
                  <option value="APOIO_INSTITUCIONAL">Apoio Institucional</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Pessoa de Contacto *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do interlocutor"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Email Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="parcerias@empresa.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Telefone Directo (+244) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+244 9..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Resumo Institucional da Marca *</label>
              <textarea
                required
                rows={2}
                placeholder="Breve apresentação da marca e objectivos com este patrocínio..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Website Oficial (opcional)</label>
              <input
                type="url"
                placeholder="https://empresa.ao"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
              />
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
                className="px-5 py-2 font-bold text-white bg-gradient-to-r from-purple-800 to-[#BE123C] rounded-lg flex items-center space-x-1"
              >
                <span>Solicitar Proposta</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
