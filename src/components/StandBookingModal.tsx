import React, { useState } from 'react';
import { Exhibitor } from '../types';
import { Store, CheckCircle, ArrowRight, ShieldAlert, Sparkles, X, Check, Building2, Phone, Mail, MapPin, Tag } from 'lucide-react';
import confetti from 'canvas-confetti';

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
    responsibleName: '',
    companyName: '',
    sector: 'Comércio & Serviços',
    productOrServiceToExpose: '',
    phone: '',
    email: '',
    province: 'Luanda',
    municipality: 'Cazenga',
    description: '',
    feeConfirmed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.feeConfirmed) {
      alert('Por favor, confirme que tem conhecimento do valor da inscrição de 25.000 Kz.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        companyName: formData.companyName.trim(),
        responsibleName: formData.responsibleName.trim(),
        sector: formData.sector,
        productOrServiceToExpose: formData.productOrServiceToExpose.trim(),
        description: formData.description.trim(),
        standNumber: 'Mesa & Cadeira (Por atribuir)',
        products: [formData.productOrServiceToExpose.trim()],
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        province: formData.province.trim(),
        municipality: formData.municipality.trim(),
        feeConfirmed: true,
        amountAoa: 25000,
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      });

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#DC1037', '#75116E', '#0152D9'],
        });
      } catch {}

      setIsSubmitting(false);
      setSubmitted(true);
    }, 500);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto text-zinc-100">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider text-amber-300">
              <Store className="w-3.5 h-3.5 text-amber-400" />
              <span>Candidatura Oficial de Expositor · 79.ª Edição</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Inscrição de Expositor
            </h3>
            <p className="text-xs text-zinc-400">
              Valor de participação: <strong className="text-amber-400 font-mono text-sm">25.000 Kz</strong> (Mesa + Cadeira + Pitch de 1 minuto)
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-900 text-lg font-bold transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Confirmation Message strictly matching Requirement 4 */
          <div className="py-6 space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-3 max-w-lg mx-auto">
              <h4 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                Solicitação Recebida com Sucesso!
              </h4>

              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-left space-y-3 text-xs sm:text-sm text-zinc-200 shadow-inner">
                <p className="leading-relaxed">
                  A sua solicitação de inscrição como expositor na <strong>79.ª Edição do Café do Empreendedor</strong> foi recebida com sucesso.
                </p>

                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                  <span className="text-xs text-amber-200 uppercase tracking-wider font-bold">
                    Valor de participação:
                  </span>
                  <span className="text-lg font-black font-mono text-amber-400">
                    25.000 Kz
                  </span>
                </div>

                <p className="leading-relaxed text-zinc-300">
                  A organização entrará em contacto para orientações sobre a confirmação da inscrição.
                </p>

                <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200 flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Nota da Organização:</strong> O registo da candidatura encontra-se pendente de validação. A inscrição não é considerada paga ou definitivamente confirmada antes da validação do pagamento pela equipa organizadora.
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={`https://wa.me/244921152162?text=${encodeURIComponent(
                  `Olá, organização do Café do Empreendedor! Submeti a minha candidatura de expositor para a 79.ª Edição.\n\nEmpresa: ${formData.companyName}\nResponsável: ${formData.responsibleName}\nTelefone: ${formData.phone}\nValor: 25.000 Kz`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer transition-all no-underline"
              >
                <Phone className="w-4 h-4 text-amber-300" />
                <span>Contactar Gestão pelo WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        ) : (
          /* Form with strictly specified fields from Requirement 4 */
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Responsible Name & Company */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Nome Completo do Responsável *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: João Baptista da Silva"
                  value={formData.responsibleName}
                  onChange={(e) => setFormData({ ...formData, responsibleName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Nome da Empresa ou Marca *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luanda Soluções & Tecnologia"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Sector & Product to Expose */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Sector de Actividade *
                </label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  <option value="Comércio & Serviços">Comércio & Serviços</option>
                  <option value="Tecnologia & Inovação">Tecnologia & Inovação</option>
                  <option value="Finanças & Contabilidade">Finanças & Contabilidade</option>
                  <option value="Recursos Humanos & Formação">Recursos Humanos & Formação</option>
                  <option value="Marketing, Design & Publicidade">Marketing, Design & Publicidade</option>
                  <option value="Alimentação & Restauração">Alimentação & Restauração</option>
                  <option value="Moda, Beleza & Bem-Estar">Moda, Beleza & Bem-Estar</option>
                  <option value="Indústria, Logística & Distribuição">Indústria, Logística & Distribuição</option>
                  <option value="Consultoria & Advocacia">Consultoria & Advocacia</option>
                  <option value="Outro Sector">Outro Sector</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Produto ou Serviço a Expor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Linha de cosméticos artesanais / Software de gestão"
                  value={formData.productOrServiceToExpose}
                  onChange={(e) => setFormData({ ...formData, productOrServiceToExpose: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Phone/WhatsApp & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Número de Telefone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 921 152 162"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Ex: contacto@suaempresa.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Province & Municipality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Província *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luanda"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                  Município *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cazenga, Belas, Talatona, etc."
                  value={formData.municipality}
                  onChange={(e) => setFormData({ ...formData, municipality: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Breve Descrição do Negócio */}
            <div className="space-y-1.5">
              <label className="text-zinc-300 font-bold uppercase tracking-wider text-[11px]">
                Breve Descrição do Negócio *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Descreva a atividade da sua marca, o que levará para exposição e o seu público-alvo..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>

            {/* Value confirmation checkbox */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border-2 border-amber-500/50 space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  checked={formData.feeConfirmed}
                  onChange={(e) => setFormData({ ...formData, feeConfirmed: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 border-zinc-700 bg-zinc-900 focus:ring-amber-400 mt-0.5 shrink-0"
                />
                <span className="text-xs text-zinc-200 leading-relaxed">
                  Confirmo que tenho conhecimento do <strong className="text-amber-400 font-black">VALOR DA INSCRIÇÃO DE 25.000 Kz</strong> para a participação como expositor na 79.ª Edição do Café do Empreendedor (incluindo mesa, cadeira e pitch de 1 minuto).
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-500 via-[#DC1037] to-[#75116E] hover:from-amber-400 hover:to-[#B20D64] rounded-xl shadow-xl shadow-rose-950/50 transition-all flex items-center justify-center space-x-2 cursor-pointer border border-amber-400/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <span>{isSubmitting ? 'A REGISTAR...' : 'CONFIRMAR INSCRIÇÃO'}</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
