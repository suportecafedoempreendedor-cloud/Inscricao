import React, { useState } from 'react';
import { Exhibitor } from '../types';
import { Store, CheckCircle, ArrowRight } from 'lucide-react';

interface StandBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (exhibitorData: Omit<Exhibitor, 'id' | 'status'>) => void;
}

export const StandBookingModal: React.FC<StandBookingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    companyName: '',
    sector: 'Tecnologia & Inovação',
    description: '',
    standPreference: 'Stand Standard (3x2m)',
    products: '',
    email: '',
    phone: '',
    website: '',
  });

  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      companyName: formData.companyName,
      sector: formData.sector,
      description: formData.description,
      standNumber: `Por Atribuir (${formData.standPreference})`,
      products: formData.products.split(',').map((p) => p.trim()).filter(Boolean),
      email: formData.email,
      phone: formData.phone,
      website: formData.website,
    });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Feira de Negócios</span>
            <h3 className="text-xl font-bold text-white mt-0.5">Reservar Stand de Expositor</h3>
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
            <h4 className="text-lg font-bold text-white">Candidatura de Stand Submetida!</h4>
            <p className="text-xs text-zinc-300 max-w-sm mx-auto leading-relaxed">
              A equipa de gestão de expositores da Geração Digital Angola irá rever o perfil da empresa e enviar a planta do pavilhão e dados de liquidação.
            </p>
            <div className="p-3 bg-amber-950/40 border border-amber-600/50 rounded-xl text-left text-xs space-y-1.5">
              <p className="text-amber-200 font-bold uppercase tracking-wider text-[11px]">
                Envio de Comprovativos à Gestão:
              </p>
              <p className="text-zinc-300">
                Após a liquidação da reserva de stand, envie o comprovativo pelo WhatsApp{' '}
                <strong className="text-amber-300 font-mono">+244 921 152 162</strong> ou email{' '}
                <strong className="text-amber-300 font-mono">gdangola12@gmail.com</strong>.
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href="https://wa.me/244921152162?text=Olá,%20gestão%20do%20Café%20do%20Empreendedor!%20Segue%20o%20comprovativo%20de%20reserva%20do%20Stand."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-semibold text-[11px]"
                >
                  WhatsApp Gestão
                </a>
                <a
                  href="mailto:gdangola12@gmail.com?subject=Comprovativo%20de%20Stand%20-%2079%C2%AA%20Edi%C3%A7%C3%A3o"
                  className="px-3 py-1.5 bg-[#9F1239] hover:bg-[#BE123C] text-white rounded-lg font-semibold text-[11px]"
                >
                  Email Gestão
                </a>
              </div>
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
              <label className="text-zinc-300 font-semibold">Nome da Empresa / Marca *</label>
              <input
                type="text"
                required
                placeholder="Ex: Luanda Tech Solutions Lda"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Sector de Actividade *</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Tecnologia & Inovação">Tecnologia & Inovação</option>
                  <option value="FinTech & Pagamentos">FinTech & Pagamentos</option>
                  <option value="Agronegócio & Alimentos">Agronegócio & Alimentos</option>
                  <option value="Serviços Corporativos & RH">Serviços Corporativos & RH</option>
                  <option value="Marketing & Comunicação">Marketing & Comunicação</option>
                  <option value="Indústria & Logística">Indústria & Logística</option>
                  <option value="Outro Sector">Outro Sector</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Tipo de Stand *</label>
                <select
                  value={formData.standPreference}
                  onChange={(e) => setFormData({ ...formData, standPreference: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                >
                  <option value="Stand Standard (3x2m)">Stand Standard (3x2m) - 90.000 Kz</option>
                  <option value="Stand Premium (4x3m)">Stand Premium (4x3m) - 160.000 Kz</option>
                  <option value="Ilha Central (6x4m)">Ilha Central (6x4m) - 280.000 Kz</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Descrição da Actividade da Empresa *</label>
              <textarea
                required
                rows={2}
                placeholder="Breve descrição da empresa e do que levará à feira..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Principais Produtos / Serviços a Expor *</label>
              <input
                type="text"
                required
                placeholder="Separados por vírgula (Ex: Software ERP, Consultoria, POS)"
                value={formData.products}
                onChange={(e) => setFormData({ ...formData, products: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Email Comercial *</label>
                <input
                  type="email"
                  required
                  placeholder="comercial@empresa.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Telefone (+244) *</label>
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
              <label className="text-zinc-300 font-semibold">Website Oficial (opcional)</label>
              <input
                type="url"
                placeholder="https://suaempresa.ao"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
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
                className="px-5 py-2 font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg flex items-center space-x-1"
              >
                <span>Submeter Reserva</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
