import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { TicketTier, PaymentMethod, Registration, EventSettings } from '../types';
import {
  Ticket,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Building2,
  FileCheck,
  Copy,
  Check,
  Award,
  AlertCircle,
  MessageSquare,
  Mail,
  Upload,
  ExternalLink,
} from 'lucide-react';

interface RegistrationModalProps {
  tiers: TicketTier[];
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (reg: Registration) => void;
  preselectedTierId?: string;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tiers,
  settings,
  isOpen,
  onClose,
  onRegistrationComplete,
  preselectedTierId,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTierId, setSelectedTierId] = useState<string>(
    preselectedTierId || tiers[0]?.id
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    nif: '',
  });

  // Certificate choice specifically for free conference
  const [wantsConferenceCert, setWantsConferenceCert] = useState<boolean>(true);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('REFERENCIA_MULTICAIXA');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentProofName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPaymentProofUrl((event.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const isConference = currentTier.isConference;

  // Calculate total amount to pay
  const totalAmountAoa = isConference
    ? (wantsConferenceCert ? (currentTier.certificatePriceAoa || 2000) : 0)
    : currentTier.priceAoa;

  const isFreeParticipation = isConference && !wantsConferenceCert;

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedRef = isFreeParticipation
      ? `GRATIS-${Math.floor(1000 + Math.random() * 9000)}`
      : `99245-${Math.floor(100000 + Math.random() * 900000)}`;

    setTimeout(() => {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#BE123C', '#F59E0B', '#3B0764'],
        });
      } catch {}

      const newRegistration = {
        ticketTierId: currentTier.id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        jobTitle: formData.jobTitle,
        nif: formData.nif,
        amountAoa: totalAmountAoa,
        paymentMethod: isFreeParticipation ? ('NO_LOCAL' as PaymentMethod) : paymentMethod,
        paymentReference: generatedRef,
        status: (isFreeParticipation ||
        paymentMethod === 'REFERENCIA_MULTICAIXA' ||
        paymentMethod === 'MULTICAIXA_EXPRESS'
          ? 'CONFIRMADO'
          : 'PENDENTE') as Registration['status'],
        wantsConferenceCertificate: isConference ? wantsConferenceCert : undefined,
        conferenceCertificatePaid: isConference ? wantsConferenceCert : undefined,
        conferenceCertificatePaymentRef: isConference && wantsConferenceCert ? generatedRef : undefined,
        paymentProofUrl: paymentProofUrl || undefined,
        paymentProofName: paymentProofName || undefined,
        notes: `Inscrição registada. Modalidade: ${currentTier.name}. Certificado: ${
          isConference
            ? wantsConferenceCert
              ? 'Adquirido (2.000 Kz)'
              : 'Não solicitado (Gratuito)'
            : 'Incluído no pacote'
        }${paymentProofName ? ` | Comprovativo anexado: ${paymentProofName}` : ''}`,
      };

      setIsSubmitting(false);
      onRegistrationComplete(newRegistration as any);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span>79.ª Edição Café do Empreendedor</span>
              <span>·</span>
              <span>Passo {step} de 3</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
              Inscrição & Emissão de Ingresso
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { s: 1, label: 'Pacote' },
            { s: 2, label: 'Titular' },
            { s: 3, label: 'Confirmação' },
          ].map((item) => (
            <div
              key={item.s}
              className={`h-1.5 rounded-full transition-colors ${
                step >= item.s ? 'bg-[#BE123C]' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* STEP 1: Select Tier */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Escolha a modalidade de participação desejada:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
              {tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-zinc-900 border-[#BE123C] shadow-md ring-1 ring-[#BE123C]'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-zinc-400 font-semibold">{tier.lote}</span>
                        {tier.isConference && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Entrada Gratuita
                          </span>
                        )}
                        {tier.isPopular && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            Recomendado
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{tier.name}</h4>

                      <div className="text-xl font-black text-amber-400 font-mono">
                        {tier.priceAoa === 0 ? (
                          <span className="text-emerald-400">0 Kz (Gratuito)</span>
                        ) : (
                          <>
                            {tier.priceAoa.toLocaleString('pt-AO')} <span className="text-xs text-zinc-400">Kz</span>
                          </>
                        )}
                      </div>

                      {tier.certificateIncluded ? (
                        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400">
                          <Award className="w-3.5 h-3.5" />
                          <span>Certificado Digital Incluído</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-400">
                          Certificado digital opcional (2.000 Kz)
                        </div>
                      )}

                      {tier.isConference ? (
                        <div className="flex items-center justify-between text-[11px] text-purple-300 font-medium bg-purple-950/40 border border-purple-800/40 px-2 py-1 rounded-lg">
                          <span>Limite: 800 vagas gratuitas</span>
                          <span className="text-emerald-400 font-bold">Vagas Disponíveis</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-zinc-400 font-mono">
                          Lotação limitada: {tier.maxCapacity} vagas
                        </div>
                      )}

                      <p className="text-xs text-zinc-400 leading-relaxed pt-1">{tier.description}</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-800/80 space-y-1">
                      {tier.benefits.slice(0, 3).map((b, i) => (
                        <div key={i} className="flex items-center space-x-1.5 text-[11px] text-zinc-300">
                          <CheckCircle2 className="w-3 h-3 text-[#BE123C] shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-all flex items-center space-x-2"
              >
                <span>Avançar para Dados do Titular</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Attendee Details & Conference Certificate Option */}
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep(3);
            }}
            className="space-y-4"
          >
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-400">Pacote Selecionado: </span>
                <strong className="text-white">{currentTier.name}</strong>
              </div>
              <span className="text-amber-400 font-bold font-mono">
                {currentTier.priceAoa === 0 ? '0 Kz (Gratuito)' : `${currentTier.priceAoa.toLocaleString('pt-AO')} Kz`}
              </span>
            </div>

            {/* MANDATORY RULE FROM PROMPT FOR FREE CONFERENCE */}
            {isConference && (
              <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Pretende adquirir o certificado digital da conferência?</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-400">2.000 Kz</span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  A sua entrada no evento é gratuita. O certificado digital personalizado com chancela oficial e validação por código QR é opcional.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-700/80 cursor-pointer hover:border-purple-500">
                    <input
                      type="radio"
                      name="conferenceCertOption"
                      checked={wantsConferenceCert === true}
                      onChange={() => setWantsConferenceCert(true)}
                      className="accent-[#BE123C]"
                    />
                    <span className="font-semibold text-white">
                      Sim, quero adquirir o certificado por 2.000 Kz.
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-zinc-900/80 border border-zinc-700/80 cursor-pointer hover:border-zinc-500">
                    <input
                      type="radio"
                      name="conferenceCertOption"
                      checked={wantsConferenceCert === false}
                      onChange={() => setWantsConferenceCert(false)}
                      className="accent-[#BE123C]"
                    />
                    <span className="text-zinc-300">
                      Não, pretendo apenas participar gratuitamente.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Attendee Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">
                  Nome Completo (obrigatório para o ingresso e certificado) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alberto Canhanga"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Email Principal *</label>
                <input
                  type="email"
                  required
                  placeholder="alberto@empresa.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Telefone / WhatsApp (+244) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+244 923 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Empresa / Instituição *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: GD Angola / Empresa Lda"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">Cargo / Função *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Director Geral / Empreendedor"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold">NIF da Empresa (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: 5412345678"
                  value={formData.nif}
                  onChange={(e) => setFormData({ ...formData, nif: e.target.value })}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-all flex items-center space-x-2"
              >
                <span>Avançar para Confirmação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment Method & Finalization */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {/* Amount Summary */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-300">Total a Liquidar:</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {totalAmountAoa === 0 ? '0 Kz (Gratuito)' : `${totalAmountAoa.toLocaleString('pt-AO')} Kz`}
                </span>
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1">
                <p><strong>Titular:</strong> {formData.fullName}</p>
                <p><strong>Pacote:</strong> {currentTier.name}</p>
                {isConference ? (
                  <p>
                    <strong>Certificado Digital:</strong>{' '}
                    {wantsConferenceCert ? 'Incluído (2.000 Kz)' : 'Não Solicitado (Gratuito)'}
                  </p>
                ) : (
                  <p><strong>Certificado Digital:</strong> Incluído no valor do pacote</p>
                )}
              </div>
            </div>

            {/* If there is an amount to pay (paid ticket or conference cert) */}
            {totalAmountAoa > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400">
                  Selecione o método de liquidação bancária em Angola:
                </p>

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

                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                  {paymentMethod === 'REFERENCIA_MULTICAIXA' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Entidade:</span>
                        <span className="font-mono font-bold text-white">{settings.multicaixaEntidade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Referência Provisória:</span>
                        <span className="font-mono font-bold text-amber-400">792 458 119</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'MULTICAIXA_EXPRESS' && (
                    <div className="space-y-1">
                      <p className="text-zinc-300">
                        Número associado ao Multicaixa Express para débito de{' '}
                        <strong>{totalAmountAoa.toLocaleString('pt-AO')} Kz</strong>:
                      </p>
                      <input
                        type="tel"
                        defaultValue={formData.phone}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white font-mono"
                      />
                    </div>
                  )}

                  {paymentMethod === 'TRANSFERENCIA_BANCARIA' && (
                    <div className="space-y-1 text-zinc-300">
                      <div className="flex justify-between items-center">
                        <span>IBAN BFA:</span>
                        <span className="font-mono text-zinc-200 text-[11px]">{settings.ibanBFA}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>IBAN BAI:</span>
                        <span className="font-mono text-zinc-200 text-[11px]">{settings.ibanBAI}</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 pt-1">
                        Titular: Geração Digital Angola
                      </p>
                    </div>
                  )}
                </div>

                {/* MANDATORY PAYMENT PROOF (COMPROVATIVO) INSTRUCTION BANNER */}
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/70 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-black text-amber-200 text-xs sm:text-sm uppercase tracking-wide">
                        Envio Obrigatório de Comprovativo
                      </h5>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        Todos os comprovativos devem ser enviados à gestão da plataforma pelo WhatsApp{' '}
                        <strong className="text-amber-300 font-mono text-sm">+244 921 152 162</strong> e pelo email{' '}
                        <strong className="text-amber-300 font-mono text-sm">gdangola12@gmail.com</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <a
                      href={`https://wa.me/244921152162?text=${encodeURIComponent(
                        `Olá, gestão do Café do Empreendedor! Segue o comprovativo de pagamento da 79.ª Edição.\n\nTitular: ${formData.fullName}\nPacote: ${currentTier.name}\nValor: ${totalAmountAoa.toLocaleString('pt-AO')} Kz\nTelefone: ${formData.phone}\nEmpresa: ${formData.company}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow transition-all cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-200" />
                      <span>WhatsApp (+244 921 152 162)</span>
                      <ExternalLink className="w-3 h-3 text-emerald-200 ml-1" />
                    </a>

                    <a
                      href={`mailto:gdangola12@gmail.com?subject=${encodeURIComponent(
                        `Comprovativo de Pagamento - 79ª Edição Café do Empreendedor - ${formData.fullName}`
                      )}&body=${encodeURIComponent(
                        `Olá, gestão do Café do Empreendedor,\n\nSegue o comprovativo de pagamento da 79.ª Edição do Café do Empreendedor.\n\nDados da Inscrição:\n- Titular: ${formData.fullName}\n- Empresa: ${formData.company}\n- Pacote: ${currentTier.name}\n- Montante: ${totalAmountAoa.toLocaleString('pt-AO')} Kz\n- Telefone: ${formData.phone}\n- Email: ${formData.email}\n\nAtenciosamente,\n${formData.fullName}`
                      )}`}
                      className="py-2.5 px-3 bg-[#9F1239] hover:bg-[#BE123C] text-white rounded-xl font-bold text-xs flex items-center justify-center space-x-2 shadow transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4 text-rose-200" />
                      <span>Email (gdangola12@gmail.com)</span>
                    </a>
                  </div>

                  {/* Optional immediate in-app file attachment */}
                  <div className="pt-2 border-t border-amber-800/40 space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 block">
                      Anexar comprovativo no registo da plataforma:
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-zinc-200 flex items-center space-x-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{paymentProofName ? 'Substituir Ficheiro' : 'Carregar Comprovativo (PDF, JPG, PNG)'}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {paymentProofName && (
                        <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate max-w-[200px]">{paymentProofName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* If completely free (0 Kz) */
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/80 text-xs text-emerald-300 space-y-1">
                <p className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Inscrição Gratuita Confirmada</span>
                </p>
                <p className="text-[11px] text-zinc-300">
                  Nenhum pagamento é necessário. A sua credencial digital personalizada será emitida imediatamente com o seu nome completo.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#881337] hover:opacity-95 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>
                  {isSubmitting
                    ? 'A Processar Inscrição...'
                    : totalAmountAoa === 0
                    ? 'Concluir & Emitir Ingresso Gratuito'
                    : 'Concluir & Emitir Ingresso Digital'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
