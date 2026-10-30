import React, { useState, useEffect } from 'react';
import {
  EventSettings,
  TicketTier,
  Registration,
  PaymentProofSubmission,
} from '../types';
import { eventStore } from '../services/eventStore';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  Building,
  Smartphone,
  Upload,
  FileCheck,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  Info,
  HelpCircle,
  Shirt,
  Users,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationAndPaymentSectionProps {
  settings: EventSettings;
  ticketTiers: TicketTier[];
  onRegistrationCreated?: (reg: Registration) => void;
  onOpenTicketPass?: (reg: Registration) => void;
}

export const RegistrationAndPaymentSection: React.FC<RegistrationAndPaymentSectionProps> = ({
  settings,
  ticketTiers,
  onRegistrationCreated,
  onOpenTicketPass,
}) => {
  // 1. Form state for Registration
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [selectedTierId, setSelectedTierId] = useState<string>(
    ticketTiers[0]?.id || 'tier-conferencia-gratis'
  );
  const [hasReadEventInfo, setHasReadEventInfo] = useState(false);
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);
  const [createdRegistration, setCreatedRegistration] = useState<Registration | null>(null);

  // Dynamic capacity state & real-time subscription to backend eventStore
  const [capacityStats, setCapacityStats] = useState(eventStore.getCapacityStats());
  const isSoldOut = capacityStats.isSoldOut || capacityStats.remainingVacancies <= 0;

  useEffect(() => {
    setCapacityStats(eventStore.getCapacityStats());
    const unsubscribe = eventStore.subscribe(() => {
      setCapacityStats(eventStore.getCapacityStats());
    });
    return unsubscribe;
  }, []);

  // 2. Payment Section state (Clipboard copy toasts)
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedExpress, setCopiedExpress] = useState(false);
  const [ibanToastMsg, setIbanToastMsg] = useState<string | null>(null);
  const [expressToastMsg, setExpressToastMsg] = useState<string | null>(null);

  // 3. Form state for Proof of Payment Upload
  const [proofFullName, setProofFullName] = useState('');
  const [proofPhone, setProofPhone] = useState('');
  const [proofAmount, setProofAmount] = useState<string>('2000');
  const [proofMethod, setProofMethod] = useState<'TRANSFERENCIA_BANCARIA' | 'MULTICAIXA_EXPRESS'>(
    'TRANSFERENCIA_BANCARIA'
  );
  const [proofNotes, setProofNotes] = useState('');
  const [proofFileUrl, setProofFileUrl] = useState('');
  const [proofFileName, setProofFileName] = useState('');
  const [isSubmittingProof, setIsSubmittingProof] = useState(false);
  const [proofSuccessMsg, setProofSuccessMsg] = useState<string | null>(null);

  const selectedTier = ticketTiers.find((t) => t.id === selectedTierId) || ticketTiers[0];

  // Copy IBAN handler strictly using user text & message
  const handleCopyIban = () => {
    const ibanNumber = settings.officialIban || 'A006 0005 0000 9139 5050 1019 7';
    navigator.clipboard.writeText(ibanNumber);
    setCopiedIban(true);
    setIbanToastMsg(
      'IBAN copiado com sucesso! Utilize os dados acima para efetuar o pagamento da sua inscrição.'
    );
    setTimeout(() => {
      setCopiedIban(false);
      setIbanToastMsg(null);
    }, 5000);
  };

  // Copy Multicaixa Express handler strictly using user text & message
  const handleCopyExpress = () => {
    const expressNum = settings.officialExpressNumber || '92115262';
    navigator.clipboard.writeText(expressNum);
    setCopiedExpress(true);
    setExpressToastMsg(
      'Número copiado com sucesso! Utilize este contacto para efetuar o pagamento através do Multicaixa Express.'
    );
    setTimeout(() => {
      setCopiedExpress(false);
      setExpressToastMsg(null);
    }, 5000);
  };

  // Handle proof file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProofFileUrl((event.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Registration form
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSoldOut) {
      alert('INSCRIÇÕES ENCERRADAS — TODAS AS VAGAS FORAM PREENCHIDAS.');
      return;
    }
    if (!hasReadEventInfo) {
      alert('Por favor, confirme a leitura das informações do evento antes de avançar.');
      return;
    }

    setIsSubmittingReg(true);

    setTimeout(() => {
      try {
        const generatedRef = `CD79-${Math.floor(100000 + Math.random() * 900000)}`;
        const newRegData: Registration = {
          id: `reg-${Date.now()}`,
          ticketCode: generatedRef,
          internalControlCode: `CTR-${Math.floor(1000 + Math.random() * 9000)}`,
          ticketStatus: 'EMITIDO',
          ticketTierId: selectedTier.id,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim() || phone.trim(),
          company: company.trim() || 'Participante Individual',
          jobTitle: jobTitle.trim() || 'Profissional',
          areaOfExpertise: jobTitle.trim(),
          hasReadEventInfo: true,
          amountAoa: selectedTier.priceAoa,
          paymentMethod: 'TRANSFERENCIA_BANCARIA',
          paymentReference: generatedRef,
          status: selectedTier.priceAoa === 0 ? 'CONFIRMADO' : 'PENDENTE',
          qrCodeData: JSON.stringify({
            ticketCode: generatedRef,
            name: fullName.trim(),
            tier: selectedTier.name,
            edition: '79.ª Edição',
          }),
          checkInStatus: 'PENDENTE',
          createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
        };

        const created = eventStore.addRegistration(newRegData);
        setCreatedRegistration(created);
        setCapacityStats(eventStore.getCapacityStats());
        setIsSubmittingReg(false);

        // Pre-fill the proof form with registration info
        setProofFullName(fullName.trim());
        setProofPhone(phone.trim());
        if (selectedTier.priceAoa > 0) {
          setProofAmount(selectedTier.priceAoa.toString());
        } else {
          setProofAmount('2000'); // Certificate fee default
        }

        setRegSuccessMsg(
          'INSCRIÇÃO REGISTADA COM SUCESSO! Agradecemos o seu interesse em participar na 79.ª edição do Café do Empreendedor.'
        );

        if (onRegistrationCreated) {
          onRegistrationCreated(created);
        }

        try {
          confetti({
            particleCount: 75,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#0152D9', '#0173EF', '#F8D21C', '#65A6F4'],
          });
        } catch {}

        // Scroll to confirmation
        const confElem = document.getElementById('confirmacao-inscricao');
        if (confElem) {
          confElem.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err: any) {
        setIsSubmittingReg(false);
        alert(err.message || 'Erro ao processar inscrição');
      }
    }, 600);
  };

  // Submit Proof of Payment form
  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFullName.trim() || !proofPhone.trim() || !proofFileUrl) {
      alert('Por favor, preencha o seu nome, contacto e anexe o ficheiro do comprovativo.');
      return;
    }

    setIsSubmittingProof(true);

    setTimeout(() => {
      eventStore.addPaymentProofSubmission({
        fullName: proofFullName.trim(),
        phone: proofPhone.trim(),
        amountAoa: Number(proofAmount) || 0,
        paymentMethod: proofMethod,
        proofFileUrl,
        proofFileName: proofFileName || 'comprovativo_pagamento.pdf',
        notes: proofNotes.trim(),
        registrationId: createdRegistration?.id,
      });

      setIsSubmittingProof(false);
      setProofSuccessMsg(
        'Comprovativo enviado com sucesso! A nossa equipa irá validar o seu pagamento e disponibilizar a confirmação da sua inscrição.'
      );

      try {
        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch {}
    }, 700);
  };

  return (
    <section id="inscricoes" className="py-20 bg-[#021B54] text-[#F9F9FB] relative overflow-hidden border-t border-b border-[#0173EF]/30">
      {/* Decorative ambient lights in official palette */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#0173EF]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#0152D9]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14 relative z-10">
        {/* =========================================================================
            PARTE 1: INFORMAÇÕES DO EVENTO (Organizadas com destaque)
            ========================================================================= */}
        <div className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#032877] border border-[#0173EF]/50 text-xs font-black tracking-widest text-[#65A6F4] uppercase shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F8D21C] animate-pulse" />
            <span>PLATAFORMA OFICIAL DE INSCRIÇÕES E VAGAS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            INSCRIÇÃO NA 79.ª EDIÇÃO DO CAFÉ DO EMPREENDEDOR
          </h2>

          {/* Theme Highlight Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#032877] via-[#0152D9]/80 to-[#032877] border-2 border-[#F8D21C]/60 backdrop-blur-md shadow-xl text-center space-y-1">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#F8D21C]">
              Tema Oficial da 79.ª Edição
            </span>
            <p className="text-xl sm:text-3xl font-black text-white tracking-wide">
              "EMPREENDEDORISMO QUE GERA RESULTADOS"
            </p>
          </div>

          {/* Grid of 4 Key Pillars: Theme, Date, Time, Venue + Dress Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-2">
            <div className="p-4 rounded-2xl bg-[#032877]/80 border border-[#0173EF]/40 backdrop-blur-md space-y-1.5">
              <div className="flex items-center space-x-2 text-[#F8D21C]">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Data do Evento</span>
              </div>
              <p className="text-base font-black text-white">27 de novembro de 2026</p>
              <p className="text-xs text-[#65A6F4] font-medium">Sexta-feira · Luanda</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#032877]/80 border border-[#0173EF]/40 backdrop-blur-md space-y-1.5">
              <div className="flex items-center space-x-2 text-[#65A6F4]">
                <Clock className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Horário Oficial</span>
              </div>
              <p className="text-base font-black text-white">08h30 Pontual</p>
              <p className="text-xs text-zinc-300">Credenciamento às 07h30</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#032877]/80 border border-[#0173EF]/40 backdrop-blur-md space-y-1.5">
              <div className="flex items-center space-x-2 text-[#0173EF]">
                <MapPin className="w-4 h-4 text-[#65A6F4]" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">Local do Evento</span>
              </div>
              <p className="text-base font-black text-white truncate">Mediateca Zé Dú</p>
              <p className="text-xs text-zinc-300">Cazenga, Luanda, Angola</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0152D9]/30 border-2 border-[#F8D21C] backdrop-blur-md space-y-1.5 shadow-lg shadow-[#0152D9]/20">
              <div className="flex items-center space-x-2 text-[#F8D21C]">
                <Shirt className="w-4 h-4 text-[#F8D21C]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">Dress Code Oficial</span>
              </div>
              <p className="text-base font-black text-[#F8D21C]">VESTIR AZUL — OBRIGATÓRIO</p>
              <p className="text-xs text-zinc-200">Em alusão ao Mês da Saúde Mental</p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            DESTAQUE: VAGAS DISPONÍVEIS (Sistema Dinâmico de Controlo de Vagas)
            ========================================================================= */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#032877] via-[#0152D9]/90 to-[#032877] border-2 border-[#0173EF] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-[#0173EF]/30 border border-[#65A6F4]/50 text-[#F8D21C]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-[#F8D21C]">
                  Controlo Automático em Tempo Real
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  VAGAS DISPONÍVEIS
                </h3>
              </div>
            </div>

            <span
              className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-md inline-flex items-center space-x-1.5 ${
                isSoldOut
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 animate-pulse'
                  : capacityStats.remainingVacancies <= 50
                  ? 'bg-[#F8D21C]/20 text-[#F8D21C] border-[#F8D21C]/50 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSoldOut ? 'bg-rose-400' : 'bg-emerald-400'} animate-ping`} />
              <span>{isSoldOut ? 'VAGAS ESGOTADAS' : `${capacityStats.remainingVacancies} VAGAS RESTANTES`}</span>
            </span>
          </div>

          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-[#021B54] border border-[#0173EF]/40 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-300">Capacidade Total</span>
              <p className="text-2xl sm:text-3xl font-black font-mono text-white">
                {capacityStats.totalCapacity} <span className="text-xs font-normal text-zinc-400">lugares</span>
              </p>
              <p className="text-[11px] text-[#65A6F4]">Lotação máxima oficial</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#021B54] border border-[#0173EF]/40 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-300">Inscrições Registadas</span>
              <p className="text-2xl sm:text-3xl font-black font-mono text-[#F8D21C]">
                {capacityStats.registeredCount} <span className="text-xs font-normal text-zinc-400">inscritos</span>
              </p>
              <p className="text-[11px] text-zinc-300">Vagas preenchidas no sistema</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#021B54] border border-[#0173EF]/40 space-y-1">
              <span className="text-[11px] font-bold uppercase text-zinc-300">Vagas Restantes</span>
              <p
                className={`text-2xl sm:text-3xl font-black font-mono ${
                  isSoldOut ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {capacityStats.remainingVacancies} <span className="text-xs font-normal text-zinc-400">disponíveis</span>
              </p>
              <p className="text-[11px] text-zinc-300">{isSoldOut ? 'Lotação esgotada' : 'Acesso imediato'}</p>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-xs text-zinc-200 font-semibold">
              <span>Indicador Visual de Preenchimento das Vagas</span>
              <span className="font-mono text-[#F8D21C] font-bold">{capacityStats.occupancyPercentage}% Preenchido</span>
            </div>
            <div className="w-full h-3.5 rounded-full bg-[#02153D] border border-white/15 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isSoldOut
                    ? 'bg-rose-500'
                    : capacityStats.occupancyPercentage >= 85
                    ? 'bg-gradient-to-r from-[#0173EF] via-[#F8D21C] to-rose-500'
                    : 'bg-gradient-to-r from-[#0152D9] to-[#0173EF]'
                }`}
                style={{ width: `${Math.min(100, capacityStats.occupancyPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Sold out full-width alert when 0 vacancies */}
        {isSoldOut && (
          <div className="max-w-3xl mx-auto p-6 rounded-3xl bg-rose-950/90 border-2 border-rose-500 text-center space-y-3 shadow-2xl animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400 text-rose-300 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                INSCRIÇÕES ENCERRADAS — TODAS AS VAGAS FORAM PREENCHIDAS
              </h3>
              <p className="text-xs sm:text-sm text-rose-200 leading-relaxed max-w-xl mx-auto">
                A capacidade máxima do evento ({capacityStats.totalCapacity} participantes) foi totalmente atingida.
                O formulário de novas inscrições foi bloqueado automaticamente. Agradecemos o grande interesse pela 79.ª Edição do Café do Empreendedor.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            PARTE 2: ATUALIZAÇÃO DA SECÇÃO DE INSCRIÇÕES (Formulário Moderno)
            ========================================================================= */}
        <div className="max-w-3xl mx-auto rounded-3xl bg-[#032877]/90 border-2 border-[#0173EF]/40 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          <div className="border-b border-[#0173EF]/30 pb-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Formulário de Inscrição Oficial
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 mt-1">
                  Preencha os seus dados de forma simples e segura para garantir a sua vaga no evento.
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                  isSoldOut
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {isSoldOut ? 'Inscrições Encerradas' : settings.statusBadge || 'Inscrições Abertas'}
              </span>
            </div>
          </div>

          {/* Success Banner if registered - Exact wording from Requirement 7 */}
          {regSuccessMsg && (
            <div id="confirmacao-inscricao" className="p-6 sm:p-8 rounded-3xl bg-[#021B54] border-2 border-[#0173EF] text-white space-y-5 shadow-2xl animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-[#0173EF]/30 border border-[#65A6F4] text-[#F8D21C] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="text-center space-y-2">
                <span className="px-3.5 py-1 rounded-full bg-[#F8D21C] text-[#032877] text-xs font-black uppercase tracking-wider">
                  Confirmação Oficial
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                  INSCRIÇÃO REGISTADA COM SUCESSO!
                </h3>
                <p className="text-sm text-zinc-200 leading-relaxed max-w-2xl mx-auto">
                  Agradecemos o seu interesse em participar na 79.ª edição do Café do Empreendedor.
                  <br />
                  Prepare-se para uma experiência de aprendizagem, partilha de conhecimentos, networking e oportunidades de negócio.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#032877] border border-[#0173EF]/60 space-y-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-zinc-200">
                  <p>📅 <strong>Data:</strong> 27 de Novembro de 2026</p>
                  <p>⏰ <strong>Horário:</strong> 08h30</p>
                  <p className="sm:col-span-2">📍 <strong>Local:</strong> Mediateca Zé Dú — Cazenga</p>
                </div>

                {/* Dress Code Highlight */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#032877] via-[#0152D9] to-[#0173EF] border-2 border-[#F8D21C] shadow-xl flex items-center space-x-3.5 text-white">
                  <div className="w-10 h-10 rounded-xl bg-[#F8D21C] text-[#032877] flex items-center justify-center shrink-0 shadow-md">
                    <Shirt className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-0.5 text-left flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-[#F8D21C] text-[#032877]">
                        OBRIGATÓRIO
                      </span>
                      <span className="text-[11px] font-bold text-blue-100">Mês da Saúde Mental · Laço Azul</span>
                    </div>
                    <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                      DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
                    </p>
                    <p className="text-[11px] text-blue-100 leading-tight">
                      Compareça vestido de azul. O dress code oficial é de cumprimento obrigatório para todos os participantes.
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-zinc-300 text-center leading-relaxed max-w-xl mx-auto">
                A sua inscrição foi registada. Caso exista pagamento pendente, siga as instruções disponibilizadas no site.
                <br />
                A confirmação definitiva do pagamento será efectuada após a verificação pela organização.
                <br />
                <strong className="text-[#65A6F4] text-sm font-bold">Café do Empreendedor: Empreendedorismo que Gera Resultados!</strong>
              </p>

              {createdRegistration && (
                <div className="pt-3 border-t border-[#0173EF]/40 flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[#F8D21C] font-bold text-sm">
                    Número de Inscrição: {createdRegistration.ticketCode}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {onOpenTicketPass && (
                      <button
                        onClick={() => onOpenTicketPass(createdRegistration)}
                        className="px-4 py-2 bg-[#0152D9] hover:bg-[#0173EF] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                      >
                        <span>Ver Ingresso / Credencial</span>
                      </button>
                    )}
                    <a
                      href="#formas-de-pagamento"
                      className="px-4 py-2 bg-[#F8D21C] text-[#032877] font-black text-xs rounded-xl shadow hover:scale-105 transition-all no-underline inline-flex items-center space-x-1.5"
                    >
                      <span>IR PARA O PAGAMENTO</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            {/* Modalidade / Seleção de Ingresso com Preço Definido */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Modalidade de Participação *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ticketTiers.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => !isSoldOut && setSelectedTierId(tier.id)}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSoldOut
                          ? 'opacity-50 cursor-not-allowed bg-[#021B54] border-zinc-700'
                          : 'cursor-pointer'
                      } flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0152D9]/40 border-[#0173EF] text-white shadow-lg shadow-[#0152D9]/30'
                          : 'bg-[#021B54]/60 border-[#0173EF]/30 text-zinc-300 hover:border-[#65A6F4]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm text-white">{tier.name}</span>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-[#0173EF] bg-[#0173EF]' : 'border-zinc-500'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between">
                        <span className="text-xs text-zinc-300">{tier.lote}</span>
                        <span className="text-sm font-black font-mono text-[#F8D21C]">
                          {tier.priceAoa === 0 ? 'Entrada Grátis' : `${tier.priceAoa.toLocaleString('pt-AO')} Kz`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-400">
                * O valor da inscrição encontra-se estabelecido conforme a modalidade escolhida. A emissão do certificado digital da conferência pode ser adquirida por 2.000 Kz.
              </p>
            </div>

            {/* Nome Completo do Participante */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Nome Completo do Participante *
              </label>
              <input
                type="text"
                required
                disabled={isSoldOut}
                placeholder="Ex: Manuel António da Silva"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Contactos: Telefone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Número de Telefone *
                </label>
                <input
                  type="tel"
                  required
                  disabled={isSoldOut}
                  placeholder="Ex: 921 152 162"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Número de WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  disabled={isSoldOut}
                  placeholder="Ex: 921 152 162"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 font-mono focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email & Profissão */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Endereço de E-mail *
                </label>
                <input
                  type="email"
                  required
                  disabled={isSoldOut}
                  placeholder="Ex: participante@empresa.ao"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Profissão ou Área de Atuação *
                </label>
                <input
                  type="text"
                  required
                  disabled={isSoldOut}
                  placeholder="Ex: Gestor de Negócios / Empreendedor"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Nome da Empresa ou Instituição */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Nome da Empresa ou Instituição (opcional)
              </label>
              <input
                type="text"
                disabled={isSoldOut}
                placeholder="Ex: Geração Digital Angola ou Profissional Independente"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Confirmação de Leitura das Informações do Evento com DRESS CODE OBRIGATÓRIO */}
            <div className="p-4 rounded-xl bg-[#021B54] border-2 border-[#0173EF]/60 space-y-2">
              <label className="flex items-start space-x-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  required
                  disabled={isSoldOut}
                  checked={hasReadEventInfo}
                  onChange={(e) => setHasReadEventInfo(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0173EF] border-[#0173EF] bg-[#032877] focus:ring-[#0173EF] mt-0.5 shrink-0"
                />
                <span className="text-xs text-zinc-200 leading-relaxed">
                  Confirmo que li atentamente as informações oficiais do evento: <strong>79.ª Edição do Café do Empreendedor</strong>, tema <strong>"Empreendedorismo que Gera Resultados"</strong>, no dia <strong>27 de novembro de 2026</strong>, às <strong>08h30</strong>, na <strong>Mediateca Zé Dú — Cazenga</strong>, com <strong className="text-[#F8D21C]">DRESS CODE: VESTIR AZUL — OBRIGATÓRIO</strong>.
                </span>
              </label>
            </div>

            {/* Botão Destacado: INSCREVER-ME AGORA */}
            <button
              type="submit"
              disabled={isSubmittingReg || isSoldOut}
              className={`w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white rounded-xl shadow-2xl transition-all flex items-center justify-center space-x-2 border cursor-pointer ${
                isSoldOut
                  ? 'bg-zinc-800 border-zinc-700 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] hover:from-[#0173EF] hover:to-[#0152D9] border-[#65A6F4]/40 shadow-[#0152D9]/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              <span>
                {isSoldOut
                  ? 'INSCRIÇÕES ENCERRADAS — TODAS AS VAGAS PREENCHIDAS'
                  : isSubmittingReg
                  ? 'A PROCESSAR REGISTO...'
                  : 'INSCREVER-ME AGORA'}
              </span>
              {!isSoldOut && <ArrowRight className="w-5 h-5 text-[#F8D21C]" />}
            </button>
          </form>
        </div>

        {/* =========================================================================
            PARTE 3: NOVA SECÇÃO: FORMAS DE PAGAMENTO
            💳 EFETUE O PAGAMENTO DA SUA INSCRIÇÃO
            ========================================================================= */}
        <div id="formas-de-pagamento" className="scroll-mt-24 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-black uppercase tracking-wider">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Modalidades de Pagamento Oficiais</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              💳 EFETUE O PAGAMENTO DA SUA INSCRIÇÃO
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              Utilize os dados bancários oficiais abaixo para efetuar o pagamento da sua inscrição ou aquisição de certificado. Mantenha os dados exatamente como foram fornecidos.
            </p>
          </div>

          {/* Toast / Feedback Message for IBAN */}
          {ibanToastMsg && (
            <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fade-in">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{ibanToastMsg}</span>
              </div>
              <button
                onClick={() => setIbanToastMsg(null)}
                className="text-emerald-400 hover:text-white text-xs px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Toast / Feedback Message for Multicaixa Express */}
          {expressToastMsg && (
            <div className="max-w-2xl mx-auto p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fade-in">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold">{expressToastMsg}</span>
              </div>
              <button
                onClick={() => setExpressToastMsg(null)}
                className="text-emerald-400 hover:text-white text-xs px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Grid with 2 distinct Payment Cards strictly matching guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* OPÇÃO 1 — TRANSFERÊNCIA BANCÁRIA */}
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border-2 border-purple-500/40 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-6 relative group hover:border-purple-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-purple-950/80 border border-purple-700/50 text-purple-300">
                      <Building className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-purple-400">
                        OPÇÃO 1
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white uppercase">
                        TRANSFERÊNCIA BANCÁRIA
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-900/40 border border-purple-500/30 text-purple-200">
                    Rede Bancária
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Realize a transferência a partir de qualquer banco comercial ou aplicação bancária (BFA Net, BAI Directo, Atlântico Directo, BIC Net, etc.).
                </p>

                {/* IBAN Display Box */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-semibold uppercase tracking-wider">Número de IBAN Oficial:</span>
                    <span className="text-purple-400 font-mono text-[10px]">Angola (AOA)</span>
                  </div>
                  <div className="font-mono text-sm sm:text-base font-black text-amber-300 tracking-wider break-all select-all">
                    A006 0005 0000 9139 5050 1019 7
                  </div>
                </div>
              </div>

              {/* Botão com o texto "COPIAR IBAN" */}
              <button
                type="button"
                onClick={handleCopyIban}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#67206D] to-[#B01165] hover:opacity-95 border border-purple-400/40 shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                {copiedIban ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedIban ? 'IBAN COPIADO!' : 'COPIAR IBAN'}</span>
              </button>
            </div>

            {/* OPÇÃO 2 — MULTICAIXA EXPRESS */}
            <div className="p-6 sm:p-7 rounded-3xl bg-zinc-900/90 border-2 border-amber-500/40 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-6 relative group hover:border-amber-400 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-amber-950/80 border border-amber-700/50 text-amber-300">
                      <Smartphone className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-widest font-black text-amber-400">
                        OPÇÃO 2
                      </span>
                      <h4 className="text-base sm:text-lg font-black text-white uppercase">
                        MULTICAIXA EXPRESS
                      </h4>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-900/40 border border-amber-500/30 text-amber-200">
                    Instantâneo
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Envie o pagamento diretamente pelo telemóvel na aplicação <strong>Multicaixa Express</strong> para o contacto oficial da organização.
                </p>

                {/* Number Display Box */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="font-semibold uppercase tracking-wider">Número Multicaixa Express:</span>
                    <span className="text-amber-400 font-mono text-[10px]">App Express</span>
                  </div>
                  <div className="font-mono text-xl sm:text-2xl font-black text-amber-300 tracking-wider select-all">
                    92115262
                  </div>
                </div>
              </div>

              {/* Botão com o texto "COPIAR NÚMERO" */}
              <button
                type="button"
                onClick={handleCopyExpress}
                className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:opacity-95 border border-amber-400/40 shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
              >
                {copiedExpress ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedExpress ? 'NÚMERO COPIADO!' : 'COPIAR NÚMERO'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            PARTE 4: COMPROVATIVO DE PAGAMENTO
            📄 ENVIO DO COMPROVATIVO DE PAGAMENTO
            ========================================================================= */}
        <div id="comprovativo-pagamento" className="max-w-3xl mx-auto rounded-3xl bg-zinc-900/90 border border-white/15 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-2xl space-y-8">
          <div className="border-b border-zinc-800 pb-5">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-rose-950/70 border border-rose-800/60 text-rose-300">
                <FileCheck className="w-5 h-5 text-[#DC1037]" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  📄 ENVIO DO COMPROVATIVO DE PAGAMENTO
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Anexe o talão ou captura de ecrã do pagamento para a validação rápida da sua inscrição pela equipa.
                </p>
              </div>
            </div>
          </div>

          {/* Proof Submission Success Feedback */}
          {proofSuccessMsg ? (
            <div className="p-6 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Comprovativo Enviado com Sucesso!</h4>
                <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed max-w-lg mx-auto">
                  {proofSuccessMsg}
                </p>
              </div>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setProofSuccessMsg(null);
                    setProofFileUrl('');
                    setProofFileName('');
                  }}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold"
                >
                  Enviar Outro Comprovativo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProofSubmit} className="space-y-5">
              {/* Nome Completo do Participante */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Nome Completo do Participante *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nome utilizado na inscrição"
                  value={proofFullName}
                  onChange={(e) => setProofFullName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Telefone & Valor Pago */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Telefone Utilizado na Inscrição *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 921 152 162"
                    value={proofPhone}
                    onChange={(e) => setProofPhone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Valor Pago (AOA) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Ex: 2000 ou 35000"
                    value={proofAmount}
                    onChange={(e) => setProofAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  />
                </div>
              </div>

              {/* Modalidade de Pagamento Utilizada */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Modalidade de Pagamento Utilizada *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProofMethod('TRANSFERENCIA_BANCARIA')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                      proofMethod === 'TRANSFERENCIA_BANCARIA'
                        ? 'bg-purple-950/70 border-purple-500 text-white shadow'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Building className="w-4 h-4 text-purple-400" />
                    <span>Transferência Bancária (IBAN)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProofMethod('MULTICAIXA_EXPRESS')}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                      proofMethod === 'MULTICAIXA_EXPRESS'
                        ? 'bg-amber-950/70 border-amber-500 text-white shadow'
                        : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-amber-400" />
                    <span>Multicaixa Express (92115262)</span>
                  </button>
                </div>
              </div>

              {/* Campo para Anexar o Comprovativo (Ficheiro / Imagem ou PDF) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Anexar Comprovativo (Imagem ou PDF) *
                </label>
                <div className="p-4 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-zinc-500 bg-zinc-950/60 transition-colors text-center space-y-2">
                  <input
                    type="file"
                    id="comprovativo-file-input"
                    accept="image/*,application/pdf"
                    required
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="comprovativo-file-input"
                    className="inline-flex items-center space-x-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>SELECIONAR COMPROVATIVO NO DISPOSITIVO</span>
                  </label>

                  {proofFileName ? (
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between max-w-sm mx-auto text-xs text-zinc-300">
                      <span className="truncate font-mono font-medium text-amber-300">{proofFileName}</span>
                      <span className="text-[10px] text-emerald-400 font-bold ml-2">Ficheiro carregado</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-zinc-500">
                      Formatos aceites: JPG, PNG, PDF ou captura de ecrã do Multicaixa Express (máx. 10MB)
                    </p>
                  )}

                  {/* Thumbnail Preview if image */}
                  {proofFileUrl && proofFileUrl.startsWith('data:image') && (
                    <div className="pt-2 flex justify-center">
                      <img
                        src={proofFileUrl}
                        alt="Pré-visualização do Comprovativo"
                        className="max-h-36 rounded-lg border border-zinc-700 shadow-md object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Mensagem ou Observação Opcional */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Mensagem ou Observação (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pagamento referente a 2 participantes ou observações sobre o banco..."
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>

              {/* Botão Destacado para Envio do Comprovativo */}
              <button
                type="submit"
                disabled={isSubmittingProof || !proofFileUrl}
                className="w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 shadow-2xl shadow-emerald-950/60 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer border border-emerald-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-5 h-5 text-amber-300" />
                <span>
                  {isSubmittingProof ? 'A ENVIAR COMPROVATIVO...' : 'ENVIAR COMPROVATIVO DE PAGAMENTO'}
                </span>
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
