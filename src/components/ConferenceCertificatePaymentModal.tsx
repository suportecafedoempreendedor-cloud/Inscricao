import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Registration, PaymentMethod, EventSettings } from '../types';
import { eventStore } from '../services/store';
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  X,
  Copy,
  Check,
  AlertCircle,
  MessageSquare,
  Mail,
  ExternalLink,
  Upload,
} from 'lucide-react';

interface ConferenceCertificatePaymentModalProps {
  registration: Registration;
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const ConferenceCertificatePaymentModal: React.FC<ConferenceCertificatePaymentModalProps> = ({
  registration,
  settings,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('REFERENCIA_MULTICAIXA');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState<string>('');

  if (!isOpen) return null;

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      eventStore.payConferenceCertificate(registration.id, paymentMethod);

      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#BE123C', '#F59E0B', '#3B0764'],
        });
      } catch {}

      setIsProcessing(false);
      onPaymentSuccess();
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Certificado Digital Opcional
            </span>
            <h3 className="text-xl font-bold text-white mt-0.5">
              Adquirir Certificado da Conferência
            </h3>
            <p className="text-xs text-zinc-400">
              Titular: <strong>{registration.fullName}</strong> ({registration.ticketCode})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-base font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-zinc-300 space-y-1">
          <div className="flex justify-between items-center text-sm font-bold text-white border-b border-purple-800/40 pb-2">
            <span>Certificado da Conferência 79.ª Edição:</span>
            <span className="font-mono text-amber-400">2.000 Kz</span>
          </div>
          <p className="pt-1 text-[11px] text-zinc-400">
            A sua participação na conferência continua totalmente gratuita. O valor de 2.000 Kz cobre a taxa de emissão, verificação e chancela do Certificado Digital Oficial.
          </p>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div className="space-y-2 text-xs">
            <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
              Selecione a Forma de Pagamento:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'REFERENCIA_MULTICAIXA', label: 'Multicaixa ATM', desc: 'Entidade e Ref.' },
                { id: 'MULTICAIXA_EXPRESS', label: 'MCX Express', desc: 'No telemóvel' },
                { id: 'TRANSFERENCIA_BANCARIA', label: 'BFA / BAI', desc: 'Transferência' },
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                  className={`p-3 rounded-xl border cursor-pointer text-left transition-all ${
                    paymentMethod === m.id
                      ? 'bg-zinc-900 border-[#BE123C] ring-1 ring-[#BE123C]'
                      : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{m.label}</p>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment instructions */}
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
            {paymentMethod === 'REFERENCIA_MULTICAIXA' && (
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Entidade Multicaixa:</span>
                  <span className="font-mono font-bold text-white">{settings.multicaixaEntidade}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Referência do Certificado:</span>
                  <span className="font-mono font-bold text-amber-400">992 450 793</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Montante Exacto:</span>
                  <span className="font-mono font-bold text-white">2.000 Kz</span>
                </div>
              </div>
            )}

            {paymentMethod === 'MULTICAIXA_EXPRESS' && (
              <div className="space-y-1.5">
                <p className="text-zinc-300">
                  Débito instantâneo de <strong>2.000 Kz</strong> via aplicação Multicaixa Express associada ao seu telemóvel:
                </p>
                <input
                  type="tel"
                  defaultValue={registration.phone}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
            )}

            {paymentMethod === 'TRANSFERENCIA_BANCARIA' && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">IBAN BFA:</span>
                  <span className="font-mono text-zinc-200 text-[11px]">{settings.ibanBFA}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">IBAN BAI:</span>
                  <span className="font-mono text-zinc-200 text-[11px]">{settings.ibanBAI}</span>
                </div>
                <p className="text-[10px] text-zinc-500 pt-1">
                  Titular: Geração Digital Angola
                </p>
              </div>
            )}
          </div>

          {/* MANDATORY PAYMENT PROOF (COMPROVATIVO) INSTRUCTION BANNER */}
          <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/70 space-y-2.5">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h5 className="font-bold text-amber-200 text-xs uppercase tracking-wide">
                  Envio Obrigatório de Comprovativo
                </h5>
                <p className="text-xs text-zinc-200 leading-relaxed">
                  Todos os comprovativos devem ser enviados à gestão da plataforma pelo WhatsApp{' '}
                  <strong className="text-amber-300 font-mono">+244 921 152 162</strong> e pelo email{' '}
                  <strong className="text-amber-300 font-mono">gdangola12@gmail.com</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
              <a
                href={`https://wa.me/244921152162?text=${encodeURIComponent(
                  `Olá, gestão do Café do Empreendedor! Segue o comprovativo de pagamento do Certificado da Conferência (2.000 Kz).\n\nTitular: ${registration.fullName}\nCódigo do Ingresso: ${registration.ticketCode}\nTelefone: ${registration.phone}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-200" />
                <span>WhatsApp (+244 921 152 162)</span>
                <ExternalLink className="w-3 h-3 text-emerald-200 ml-1" />
              </a>

              <a
                href={`mailto:gdangola12@gmail.com?subject=${encodeURIComponent(
                  `Comprovativo Certificado Conferência - ${registration.fullName} (${registration.ticketCode})`
                )}&body=${encodeURIComponent(
                  `Olá, gestão do Café do Empreendedor,\n\nSegue o comprovativo de pagamento da taxa de emissão do Certificado da Conferência (2.000 Kz).\n\nDados:\n- Titular: ${registration.fullName}\n- Código do Ingresso: ${registration.ticketCode}\n- Telefone: ${registration.phone}\n- Email: ${registration.email}\n\nAtenciosamente,\n${registration.fullName}`
                )}`}
                className="py-2 px-2.5 bg-[#9F1239] hover:bg-[#BE123C] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-rose-200" />
                <span>Email (gdangola12@gmail.com)</span>
              </a>
            </div>

            {/* Optional file selector */}
            <div className="pt-1.5 border-t border-amber-800/40 flex items-center space-x-2">
              <label className="cursor-pointer px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-[11px] text-zinc-300 flex items-center space-x-1">
                <Upload className="w-3 h-3 text-amber-400" />
                <span>{proofFileName ? 'Substituir' : 'Anexar Ficheiro'}</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleProofFileChange}
                  className="hidden"
                />
              </label>
              {proofFileName && (
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1 truncate max-w-[200px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{proofFileName}</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 font-bold text-white bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#881337] rounded-lg text-xs shadow-lg flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>{isProcessing ? 'A Validar Pagamento...' : 'Confirmar Pagamento (2.000 Kz)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
