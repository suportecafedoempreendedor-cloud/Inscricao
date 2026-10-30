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
  Shirt,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  X,
} from 'lucide-react';

interface RegistrationModalProps {
  tiers: TicketTier[];
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: (reg: Registration) => void;
  preselectedTierId?: string;
  onOpenTicketPass?: (reg: Registration) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  tiers,
  settings,
  isOpen,
  onClose,
  onRegistrationComplete,
  preselectedTierId,
  onOpenTicketPass,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedTierId, setSelectedTierId] = useState<string>(
    preselectedTierId || tiers[0]?.id
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    jobTitle: '',
    nif: '',
    hasReadEventInfo: false,
  });

  // Certificate choice specifically for free conference
  const [wantsConferenceCert, setWantsConferenceCert] = useState<boolean>(true);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('TRANSFERENCIA_BANCARIA');
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  const [paymentProofName, setPaymentProofName] = useState<string>('');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyFeedbackMsg, setCopyFeedbackMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

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
    ? wantsConferenceCert
      ? currentTier.certificatePriceAoa || 2000
      : 0
    : currentTier.priceAoa;

  const isFreeParticipation = isConference && !wantsConferenceCert;

  const handleCopy = (text: string, fieldName: string, message: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setCopyFeedbackMsg(message);
    setTimeout(() => {
      setCopiedField(null);
      setCopyFeedbackMsg(null);
    }, 5000);
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
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0152D9', '#0173EF', '#F8D21C', '#65A6F4'],
        });
      } catch {}

      const newRegistration: Registration = {
        id: `reg-${Date.now()}`,
        ticketCode: generatedRef,
        internalControlCode: `CTR-${Math.floor(1000 + Math.random() * 9000)}`,
        ticketStatus: 'EMITIDO',
        ticketTierId: currentTier.id,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        whatsapp: (formData.whatsapp || formData.phone).trim(),
        company: (formData.company || 'Participante Individual').trim(),
        jobTitle: (formData.jobTitle || 'Profissional').trim(),
        areaOfExpertise: (formData.jobTitle || 'Profissional').trim(),
        nif: formData.nif?.trim() || undefined,
        hasReadEventInfo: true,
        amountAoa: totalAmountAoa,
        paymentMethod: isFreeParticipation ? 'NO_LOCAL' : paymentMethod,
        paymentReference: generatedRef,
        status: isFreeParticipation ? 'CONFIRMADO' : 'PENDENTE',
        wantsConferenceCertificate: isConference ? wantsConferenceCert : undefined,
        conferenceCertificatePaid: isConference ? wantsConferenceCert : undefined,
        conferenceCertificatePaymentRef: isConference && wantsConferenceCert ? generatedRef : undefined,
        paymentProofUrl: paymentProofUrl || undefined,
        paymentProofName: paymentProofName || undefined,
        qrCodeData: JSON.stringify({
          ticketCode: generatedRef,
          name: formData.fullName.trim(),
          tier: currentTier.name,
          edition: '79.ª Edição',
        }),
        checkInStatus: 'PENDENTE',
        createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        notes: `Inscrição oficial registada no modal. Modalidade: ${currentTier.name}.${
          paymentProofName ? ` Comprovativo: ${paymentProofName}` : ''
        }`,
      };

      setIsSubmitting(false);
      setConfirmedRegistration(newRegistration);
      onRegistrationComplete(newRegistration);
      // Move to Confirmation Screen
      setStep(4);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#021B54] border-2 border-[#0173EF]/50 rounded-3xl max-w-2xl w-full p-5 sm:p-8 space-y-6 shadow-2xl relative my-auto text-[#F9F9FB]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#0173EF]/30 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F8D21C] animate-pulse" />
              <span className="text-[#F8D21C]">79.ª Edição do Café do Empreendedor</span>
              <span className="text-zinc-400">·</span>
              <span className="text-[#65A6F4]">
                {step === 4 ? 'Confirmação' : `Passo ${step} de 3`}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              {step === 4
                ? 'INSCRIÇÃO REGISTADA COM SUCESSO!'
                : 'Inscrição & Emissão de Ingresso'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-300 hover:text-white p-1 rounded-lg hover:bg-[#032877] text-lg font-bold cursor-pointer transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* =========================================================================
            SECÇÃO VISUALMENTE DISTINTA COM ÍCONE: DRESS CODE OBRIGATÓRIO
            (Apresentada com máximo destaque em conformidade com as regras oficiais)
            ========================================================================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#032877] via-[#0152D9] to-[#0173EF] border-2 border-[#F8D21C] shadow-xl flex items-center space-x-3.5 relative overflow-hidden">
          <div className="w-11 h-11 rounded-xl bg-[#F8D21C] text-[#032877] flex items-center justify-center shrink-0 shadow-lg">
            <Shirt className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div className="space-y-0.5 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#F8D21C] text-[#032877]">
                OBRIGATÓRIO
              </span>
              <span className="text-[11px] font-bold text-[#F9F9FB] flex items-center space-x-1">
                <span>Elemento Simbólico</span>
                <span className="text-[#F8D21C]">· Laço Azul</span>
              </span>
            </div>
            <p className="text-sm sm:text-base font-black text-white tracking-wide uppercase">
              DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
            </p>
            <p className="text-[11px] text-blue-100 leading-tight">
              Todos os participantes devem comparecer vestidos de azul. Esta exigência não é opcional e visa a união visual e integração institucional do evento.
            </p>
          </div>
        </div>

        {/* Step Indicator (Steps 1, 2, 3) */}
        {step !== 4 && (
          <div className="grid grid-cols-3 gap-2">
            {[
              { s: 1, label: 'Pacote' },
              { s: 2, label: 'Titular' },
              { s: 3, label: 'Confirmação' },
            ].map((item) => (
              <div
                key={item.s}
                className={`h-1.5 rounded-full transition-colors ${
                  step >= item.s ? 'bg-[#0173EF]' : 'bg-[#032877]'
                }`}
              />
            ))}
          </div>
        )}

        {/* STEP 1: Select Tier */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-300">
              Escolha a modalidade de participação desejada para a 79.ª Edição:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1">
              {tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#0152D9]/40 border-[#0173EF] shadow-lg ring-2 ring-[#0173EF]'
                        : 'bg-[#032877]/60 border-[#0173EF]/30 hover:border-[#65A6F4]'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-[#65A6F4] font-semibold">
                          {tier.lote}
                        </span>
                        {tier.isConference && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            Entrada Gratuita
                          </span>
                        )}
                        {tier.isPopular && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F8D21C] text-[#032877]">
                            Recomendado
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{tier.name}</h4>

                      <div className="text-xl font-black text-[#F8D21C] font-mono">
                        {tier.priceAoa === 0 ? (
                          <span className="text-emerald-400">0 Kz (Gratuito)</span>
                        ) : (
                          <>
                            {tier.priceAoa.toLocaleString('pt-AO')}{' '}
                            <span className="text-xs text-zinc-300">Kz</span>
                          </>
                        )}
                      </div>

                      {tier.certificateIncluded ? (
                        <div className="flex items-center space-x-1 text-[11px] font-bold text-emerald-300">
                          <Award className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Certificado Digital Incluído</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-zinc-300">
                          Certificado digital opcional (2.000 Kz)
                        </div>
                      )}

                      {tier.isConference ? (
                        <div className="flex items-center justify-between text-[11px] text-blue-200 font-medium bg-[#021B54] border border-[#0173EF]/40 px-2.5 py-1 rounded-lg">
                          <span>Lotação: 800 vagas gratuitas</span>
                          <span className="text-emerald-300 font-bold">Vagas Disponíveis</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-zinc-300 font-mono">
                          Lotação máxima: {tier.maxCapacity} vagas
                        </div>
                      )}

                      <p className="text-xs text-zinc-300 leading-relaxed pt-1">
                        {tier.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1">
                      {tier.benefits.slice(0, 3).map((b, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-1.5 text-[11px] text-zinc-200"
                        >
                          <CheckCircle2 className="w-3 h-3 text-[#F8D21C] shrink-0" />
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
                className="px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] hover:from-[#0173EF] hover:to-[#0152D9] rounded-xl transition-all shadow-lg shadow-[#0152D9]/40 flex items-center space-x-2 cursor-pointer border border-[#65A6F4]/40"
              >
                <span>Avançar para Dados do Titular</span>
                <ArrowRight className="w-4 h-4 text-[#F8D21C]" />
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
            <div className="p-3.5 rounded-xl bg-[#032877] border border-[#0173EF]/40 flex items-center justify-between text-xs">
              <div>
                <span className="text-zinc-300">Modalidade Selecionada: </span>
                <strong className="text-white">{currentTier.name}</strong>
              </div>
              <span className="text-[#F8D21C] font-bold font-mono">
                {currentTier.priceAoa === 0
                  ? '0 Kz (Gratuito)'
                  : `${currentTier.priceAoa.toLocaleString('pt-AO')} Kz`}
              </span>
            </div>

            {/* Conference Certificate Option */}
            {isConference && (
              <div className="p-4 rounded-xl bg-[#032877]/80 border-2 border-[#0173EF]/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-[#F8D21C]" />
                    <span>Pretende adquirir o certificado digital da conferência?</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-[#F8D21C]">2.000 Kz</span>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  A sua entrada no evento é gratuita. O certificado digital personalizado com chancela oficial e validação por código QR é opcional.
                </p>

                <div className="space-y-2 pt-1 text-xs">
                  <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#021B54] border border-[#0173EF]/40 cursor-pointer hover:border-[#65A6F4]">
                    <input
                      type="radio"
                      name="conferenceCertOption"
                      checked={wantsConferenceCert === true}
                      onChange={() => setWantsConferenceCert(true)}
                      className="accent-[#0173EF]"
                    />
                    <span className="font-semibold text-white">
                      Sim, quero adquirir o certificado por 2.000 Kz.
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 p-2 rounded-lg bg-[#021B54] border border-[#0173EF]/40 cursor-pointer hover:border-zinc-500">
                    <input
                      type="radio"
                      name="conferenceCertOption"
                      checked={wantsConferenceCert === false}
                      onChange={() => setWantsConferenceCert(false)}
                      className="accent-[#0173EF]"
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
              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Nome Completo do Participante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Alberto Canhanga"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Número de Telefone *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 921 152 162"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-[#0173EF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Número de WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: 921 152 162"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-[#0173EF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  placeholder="participante@empresa.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Profissão ou Área de Atuação *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gestor de Empresas / Empreendedor"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF]"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-semibold uppercase tracking-wider text-[11px]">
                  Nome da Empresa ou Instituição (caso exista)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Geração Digital Angola ou Profissional Independente"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full bg-[#032877] border border-[#0173EF]/40 rounded-xl p-2.5 text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF]"
                />
              </div>
            </div>

            {/* Confirmação de Leitura com DRESS CODE OBRIGATÓRIO em destaque */}
            <div className="p-4 rounded-2xl bg-[#032877] border-2 border-[#0173EF] space-y-2 text-xs shadow-md">
              <div className="flex items-center space-x-2 text-[#F8D21C] pb-1 border-b border-white/10">
                <Shirt className="w-4 h-4 text-[#F8D21C]" />
                <span className="font-black uppercase tracking-wider text-xs">
                  DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
                </span>
              </div>
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={formData.hasReadEventInfo}
                  onChange={(e) => setFormData({ ...formData, hasReadEventInfo: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0173EF] border-[#0173EF] bg-[#021B54] focus:ring-[#0173EF] mt-0.5 shrink-0"
                />
                <span className="text-zinc-200 leading-relaxed">
                  Confirmo que li atentamente as informações oficiais do evento: <strong>79.ª Edição do Café do Empreendedor</strong>, tema <strong>"Empreendedorismo que Gera Resultados"</strong>, em <strong>27 de novembro de 2026</strong>, às <strong>08h30</strong>, na <strong>Mediateca Zé Dú — Cazenga</strong>, com <strong className="text-[#F8D21C]">DRESS CODE: VESTIR AZUL — OBRIGATÓRIO</strong> (com laço azul simbólico).
                </span>
              </label>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="submit"
                className="px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] hover:from-[#0173EF] hover:to-[#0152D9] rounded-xl shadow-lg transition-all flex items-center space-x-2 cursor-pointer border border-[#65A6F4]/40"
              >
                <span>INSCREVER-ME AGORA</span>
                <ArrowRight className="w-4 h-4 text-[#F8D21C]" />
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: Payment Method & Finalization */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-4">
            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-[#032877] border border-[#0173EF]/50 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-[#0173EF]/30 pb-2">
                <span className="font-semibold text-zinc-300 uppercase tracking-wider text-[11px]">
                  Total da Inscrição:
                </span>
                <span className="text-lg font-black text-[#F8D21C] font-mono">
                  {totalAmountAoa === 0
                    ? '0 Kz (Gratuito)'
                    : `${totalAmountAoa.toLocaleString('pt-AO')} Kz`}
                </span>
              </div>

              <div className="text-[11px] text-zinc-300 space-y-1">
                <p>
                  <strong>Titular:</strong> {formData.fullName}
                </p>
                <p>
                  <strong>Modalidade:</strong> {currentTier.name}
                </p>
                {isConference ? (
                  <p>
                    <strong>Certificado Digital:</strong>{' '}
                    {wantsConferenceCert ? 'Incluído (2.000 Kz)' : 'Não Solicitado (Gratuito)'}
                  </p>
                ) : (
                  <p>
                    <strong>Certificado Digital:</strong> Incluído no valor do pacote
                  </p>
                )}
              </div>
            </div>

            {/* If there is an amount to pay (paid ticket or conference cert) */}
            {totalAmountAoa > 0 ? (
              <div className="space-y-4">
                <div className="text-center py-1 space-y-1">
                  <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center justify-center space-x-1.5">
                    <span>💳 EFETUE O PAGAMENTO DA SUA INSCRIÇÃO</span>
                  </h4>
                  <p className="text-[11px] text-zinc-300">
                    Utilize as modalidades oficiais abaixo para efetuar a liquidação da inscrição:
                  </p>
                </div>

                {/* Toast / Feedback Banner for Copy */}
                {copyFeedbackMsg && (
                  <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="font-semibold">{copyFeedbackMsg}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCopyFeedbackMsg(null)}
                      className="text-emerald-400 hover:text-white text-xs px-1 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* OPÇÃO 1 — TRANSFERÊNCIA BANCÁRIA */}
                  <div className="p-4 rounded-2xl bg-[#032877] border-2 border-[#0173EF]/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-black text-[#F8D21C]">
                        OPÇÃO 1
                      </span>
                      <h5 className="text-xs sm:text-sm font-black text-white uppercase">
                        TRANSFERÊNCIA BANCÁRIA
                      </h5>
                      <p className="text-[11px] text-zinc-300 font-medium">
                        IBAN Oficial da Organização:
                      </p>
                      <div className="p-2.5 rounded-xl bg-[#021B54] border border-[#0173EF]/40 font-mono text-xs font-bold text-[#F8D21C] break-all select-all">
                        A006 0005 0000 9139 5050 1019 7
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          'A006 0005 0000 9139 5050 1019 7',
                          'iban',
                          'IBAN copiado com sucesso! Utilize os dados acima para efetuar o pagamento da sua inscrição.'
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase text-white bg-gradient-to-r from-[#0152D9] to-[#0173EF] hover:opacity-95 flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all border border-[#65A6F4]/40"
                    >
                      {copiedField === 'iban' ? (
                        <Check className="w-3.5 h-3.5 text-[#F8D21C]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#F8D21C]" />
                      )}
                      <span>{copiedField === 'iban' ? 'COPIADO!' : 'COPIAR IBAN'}</span>
                    </button>
                  </div>

                  {/* OPÇÃO 2 — MULTICAIXA EXPRESS */}
                  <div className="p-4 rounded-2xl bg-[#032877] border-2 border-[#F8D21C]/60 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase tracking-widest font-black text-[#F8D21C]">
                        OPÇÃO 2
                      </span>
                      <h5 className="text-xs sm:text-sm font-black text-white uppercase">
                        MULTICAIXA EXPRESS
                      </h5>
                      <p className="text-[11px] text-zinc-300 font-medium">
                        Contacto Multicaixa Express:
                      </p>
                      <div className="p-2.5 rounded-xl bg-[#021B54] border border-[#F8D21C]/40 font-mono text-base font-black text-[#F8D21C] select-all">
                        92115262
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopy(
                          '92115262',
                          'express',
                          'Número copiado com sucesso! Utilize este contacto para efetuar o pagamento através do Multicaixa Express.'
                        )
                      }
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-black uppercase text-[#032877] bg-[#F8D21C] hover:bg-amber-300 flex items-center justify-center space-x-1.5 cursor-pointer shadow transition-all"
                    >
                      {copiedField === 'express' ? (
                        <Check className="w-3.5 h-3.5 text-[#032877]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#032877]" />
                      )}
                      <span>{copiedField === 'express' ? 'COPIADO!' : 'COPIAR NÚMERO'}</span>
                    </button>
                  </div>
                </div>

                {/* Envio do Comprovativo de Pagamento */}
                <div className="p-4 rounded-2xl bg-[#032877] border border-[#0173EF]/60 space-y-3">
                  <div className="flex items-start space-x-2.5">
                    <AlertCircle className="w-5 h-5 text-[#F8D21C] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-black text-white text-xs sm:text-sm uppercase tracking-wide">
                        Envio do Comprovativo de Pagamento
                      </h5>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        Após o pagamento, anexe o comprovativo abaixo ou envie diretamente pelo WhatsApp{' '}
                        <strong className="text-[#F8D21C] font-mono text-xs">+244 921 152 162</strong> e pelo email{' '}
                        <strong className="text-[#F8D21C] font-mono text-xs">gdangola12@gmail.com</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Immediate in-modal file attachment */}
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <label className="text-[11px] font-semibold text-zinc-300 block">
                      Anexar ficheiro de comprovativo (JPG, JPEG, PNG, PDF):
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="cursor-pointer px-3 py-2 bg-[#021B54] hover:bg-[#0152D9]/30 border border-[#0173EF]/50 rounded-xl text-xs text-white flex items-center space-x-1.5 transition-colors">
                        <Upload className="w-4 h-4 text-[#F8D21C]" />
                        <span>
                          {paymentProofName ? 'Substituir Comprovativo' : 'Carregar Comprovativo'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      {paymentProofName && (
                        <span className="text-xs text-emerald-300 font-semibold flex items-center space-x-1 bg-emerald-950/80 px-2.5 py-1.5 rounded-lg border border-emerald-700">
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
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-xs text-emerald-200 space-y-1">
                <p className="font-bold flex items-center space-x-1.5 text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Inscrição Gratuita Confirmada</span>
                </p>
                <p className="text-[11px] text-zinc-300">
                  Nenhum pagamento é necessário. A sua credencial de conferência será emitida imediatamente.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white cursor-pointer"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] hover:from-[#0173EF] hover:to-[#0152D9] rounded-xl shadow-xl transition-all flex items-center space-x-2 cursor-pointer border border-[#65A6F4]/40"
              >
                <ShieldCheck className="w-4 h-4 text-[#F8D21C]" />
                <span>
                  {isSubmitting
                    ? 'A PROCESSAR INSCRIÇÃO...'
                    : totalAmountAoa === 0
                    ? 'CONCLUIR INSCRIÇÃO GRATUITA'
                    : 'CONCLUIR & REGISTAR INSCRIÇÃO'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            STEP 4: MENSAGEM OFICIAL DE CONFIRMAÇÃO DA INSCRIÇÃO
            ========================================================================= */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-[#0173EF]/30 border-2 border-[#65A6F4] text-[#F8D21C] flex items-center justify-center mx-auto shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="px-3.5 py-1 rounded-full bg-[#F8D21C] text-[#032877] text-xs font-black uppercase tracking-wider">
                79.ª EDIÇÃO · REGISTO CONCLUÍDO
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                INSCRIÇÃO REGISTADA COM SUCESSO!
              </h3>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed max-w-xl mx-auto">
                Agradecemos o seu interesse em participar na 79.ª edição do Café do Empreendedor.
                <br />
                Para concluir o processo, efetue o pagamento através de uma das modalidades disponibilizadas e envie o respetivo comprovativo.
                <br />
                A confirmação definitiva da sua participação será realizada após a verificação do pagamento pela organização.
              </p>
            </div>

            {/* Event Key Info Card */}
            <div className="p-4 rounded-2xl bg-[#032877] border border-[#0173EF]/60 space-y-2.5 text-xs text-left max-w-xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-200">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#F8D21C] shrink-0" />
                  <span>27 de novembro de 2026</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#65A6F4] shrink-0" />
                  <span>08h30 Pontual</span>
                </div>
                <div className="flex items-center space-x-1.5 truncate">
                  <MapPin className="w-4 h-4 text-[#F8D21C] shrink-0" />
                  <span className="truncate">Mediateca Zé Dú — Cazenga</span>
                </div>
              </div>

              {/* Mandatory Dress Code Box in Confirmation */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#0152D9] to-[#0173EF] border-2 border-[#F8D21C] flex items-center space-x-3 text-white shadow-md">
                <div className="w-9 h-9 rounded-lg bg-[#F8D21C] text-[#032877] flex items-center justify-center shrink-0">
                  <Shirt className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-left">
                  <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                    DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
                  </p>
                  <p className="text-[11px] text-blue-100">
                    Compareça vestido de azul (com laço azul simbólico oficial).
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed max-w-lg mx-auto">
              Prepare-se para uma experiência de aprendizagem, partilha de conhecimentos, networking e oportunidades de negócio.
              <br />
              <strong className="text-[#65A6F4] font-bold">
                Café do Empreendedor — Empreendedorismo que Gera Resultados!
              </strong>
            </p>

            {confirmedRegistration && (
              <div className="p-3.5 rounded-xl bg-[#021B54] border border-[#0173EF]/40 flex flex-wrap items-center justify-between gap-2 text-xs font-mono max-w-xl mx-auto">
                <span className="text-zinc-300">Número de Inscrição:</span>
                <span className="text-[#F8D21C] font-black text-sm">
                  {confirmedRegistration.ticketCode}
                </span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {confirmedRegistration && onOpenTicketPass && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenTicketPass(confirmedRegistration);
                  }}
                  className="px-5 py-3 rounded-xl bg-[#0152D9] hover:bg-[#0173EF] text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer transition-all border border-[#65A6F4]/40"
                >
                  <Ticket className="w-4 h-4 text-[#F8D21C]" />
                  <span>Ver Ingresso / Credencial</span>
                </button>
              )}

              <a
                href={`https://wa.me/244921152162?text=${encodeURIComponent(
                  `Olá, organização da 79.ª Edição do Café do Empreendedor! Concluí a minha inscrição.\n\nTitular: ${formData.fullName}\nCódigo: ${
                    confirmedRegistration?.ticketCode || ''
                  }\nModalidade: ${currentTier.name}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center space-x-2 cursor-pointer transition-all no-underline"
              >
                <MessageSquare className="w-4 h-4 text-[#F8D21C]" />
                <span>Enviar Comprovativo pelo WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl bg-[#032877] hover:bg-[#021B54] text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer border border-[#0173EF]/30 transition-all"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
