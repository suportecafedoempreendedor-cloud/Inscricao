import React, { useState, useEffect } from 'react';
import {
  EventSettings,
  TicketTier,
  Registration,
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
  Shirt,
  Users,
  Search,
  RefreshCw,
  MessageCircle,
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

  // 2. Lookup state for retrieving existing registration return
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [showLookupBox, setShowLookupBox] = useState(false);

  // 3. Payment Section state (Clipboard copy toasts)
  const [copiedIban, setCopiedIban] = useState(false);
  const [copiedExpress, setCopiedExpress] = useState(false);
  const [ibanToastMsg, setIbanToastMsg] = useState<string | null>(null);
  const [expressToastMsg, setExpressToastMsg] = useState<string | null>(null);

  // 4. Form state for Proof of Payment Upload
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

        // Scroll to devolution/confirmation
        setTimeout(() => {
          const confElem = document.getElementById('devolucao-inscricao');
          if (confElem) {
            confElem.scrollIntoView({ behavior: 'smooth' });
          }
        }, 150);
      } catch (err: any) {
        setIsSubmittingReg(false);
        alert(err.message || 'Erro ao processar inscrição');
      }
    }, 600);
  };

  // Lookup existing registration return
  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    const q = lookupQuery.trim().toLowerCase();
    if (!q) return;

    const allRegs = eventStore.getRegistrations();
    const found = allRegs.find(
      (r) =>
        r.ticketCode.toLowerCase() === q ||
        r.phone.replace(/\s+/g, '').includes(q.replace(/\s+/g, '')) ||
        (r.whatsapp && r.whatsapp.replace(/\s+/g, '').includes(q.replace(/\s+/g, ''))) ||
        r.email.toLowerCase() === q
    );

    if (found) {
      setCreatedRegistration(found);
      setProofFullName(found.fullName);
      setProofPhone(found.phone);
      setProofAmount(found.amountAoa > 0 ? found.amountAoa.toString() : '2000');
      setLookupError(null);
      setTimeout(() => {
        const confElem = document.getElementById('devolucao-inscricao');
        if (confElem) {
          confElem.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      setLookupError('Nenhuma inscrição encontrada com este número de telefone ou código.');
    }
  };

  // Reset to create another registration
  const handleResetToNewRegistration = () => {
    setCreatedRegistration(null);
    setProofSuccessMsg(null);
    setFullName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setJobTitle('');
    setCompany('');
    setHasReadEventInfo(false);
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
          <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] border-2 border-[#F8D21C] shadow-2xl space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#F8D21C]">
              TEMA OFICIAL DA 79.ª EDIÇÃO
            </span>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-white tracking-wide">
              "Empreendedorismo que Gera Resultados"
            </p>
          </div>

          {/* Key Event Cards Grid: Data, Horário, Local, Dress Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Card 1: Data */}
            <div className="p-5 rounded-2xl bg-[#032877] border border-[#0173EF]/40 shadow-lg space-y-2 hover:border-[#65A6F4] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0152D9] text-[#F8D21C] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-[#65A6F4]">
                  DATA OFICIAL
                </span>
                <p className="text-base sm:text-lg font-black text-white">27 de Novembro de 2026</p>
                <p className="text-xs text-zinc-300">Sexta-feira</p>
              </div>
            </div>

            {/* Card 2: Horário */}
            <div className="p-5 rounded-2xl bg-[#032877] border border-[#0173EF]/40 shadow-lg space-y-2 hover:border-[#65A6F4] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0152D9] text-[#F8D21C] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-[#65A6F4]">
                  HORÁRIO DE INÍCIO
                </span>
                <p className="text-base sm:text-lg font-black text-white">08h30 Pontual</p>
                <p className="text-xs text-zinc-300">Credenciamento às 07h30</p>
              </div>
            </div>

            {/* Card 3: Local */}
            <div className="p-5 rounded-2xl bg-[#032877] border border-[#0173EF]/40 shadow-lg space-y-2 hover:border-[#65A6F4] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0152D9] text-[#F8D21C] flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest font-black text-[#65A6F4]">
                  LOCALIZAÇÃO
                </span>
                <p className="text-base sm:text-lg font-black text-white">Mediateca Zé Dú</p>
                <p className="text-xs text-zinc-300">Cazenga, Luanda</p>
              </div>
            </div>

            {/* Card 4: Dress Code & Laço Azul */}
            <div className="p-5 rounded-2xl bg-[#032877] border-2 border-[#F8D21C] shadow-xl space-y-2 relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-[#F8D21C] text-[#032877] flex items-center justify-center">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] uppercase tracking-widest font-black text-[#F8D21C]">
                    DRESS CODE OBRIGATÓRIO
                  </span>
                </div>
                <p className="text-base sm:text-lg font-black text-white uppercase">VESTIR AZUL</p>
                <p className="text-xs text-[#65A6F4] font-medium">Elemento Simbólico: Laço Azul</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Capacity Counter Banner */}
        <div className="max-w-4xl mx-auto p-5 rounded-2xl bg-[#032877]/80 border border-[#0173EF]/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-[#0152D9] text-[#F8D21C] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-bold text-[#65A6F4]">
                Controlo Automático de Lotação
              </p>
              <p className="text-sm sm:text-base font-black text-white">
                {isSoldOut ? (
                  <span className="text-rose-400">Inscrições Encerradas (Vagas Esgotadas)</span>
                ) : (
                  <span>
                    Vagas Disponíveis:{' '}
                    <strong className="text-[#F8D21C] font-mono text-lg">
                      {capacityStats.remainingVacancies}
                    </strong>{' '}
                    de {capacityStats.totalCapacity}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-48 bg-zinc-950 rounded-full h-3 overflow-hidden border border-[#0173EF]/30">
              <div
                className={`h-full transition-all duration-500 ${
                  isSoldOut
                    ? 'bg-rose-500'
                    : capacityStats.occupancyPercentage >= 90
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-[#0173EF] to-[#65A6F4]'
                }`}
                style={{ width: `${capacityStats.occupancyPercentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-bold text-zinc-300">
              {capacityStats.occupancyPercentage}%
            </span>
          </div>
        </div>

        {/* =========================================================================
            ESTADO A: QUANDO AINDA NÃO SE SUBMETEU UMA INSCRIÇÃO
            As informações de pagamento NÃO ficam visíveis aqui!
            ========================================================================= */}
        {!createdRegistration ? (
          <div className="max-w-3xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#032877]/90 border-2 border-[#0173EF] shadow-2xl space-y-8">
            <div className="text-center space-y-2 border-b border-[#0173EF]/30 pb-6">
              <span className="text-xs font-black uppercase tracking-widest text-[#F8D21C]">
                PASSO 1 DE 2
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                FORMULÁRIO DE INSCRIÇÃO
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
                Preencha os dados abaixo com precisão. Após o envio, será gerada a sua devolução de inscrição com os dados bancários oficiais para pagamento.
              </p>
            </div>

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
                    placeholder="Ex: manuel.silva@exemplo.ao"
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
                    placeholder="Ex: Gestor Comercial, Engenheiro, etc."
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Nome da Empresa ou Instituição */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Nome da Empresa ou Instituição (caso exista)
                </label>
                <input
                  type="text"
                  disabled={isSoldOut}
                  placeholder="Ex: Minha Empresa Lda ou Particular"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-400 focus:outline-none focus:border-[#0173EF] focus:ring-1 focus:ring-[#0173EF] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Confirmação de Leitura das Informações do Evento */}
              <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/40">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    disabled={isSoldOut}
                    checked={hasReadEventInfo}
                    onChange={(e) => setHasReadEventInfo(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-[#0173EF] focus:ring-[#0173EF] border-zinc-500"
                  />
                  <span className="text-xs text-zinc-300 leading-relaxed">
                    Confirmo a leitura de todas as informações do evento: <strong>79.ª Edição do Café do Empreendedor</strong>, tema <em>"Empreendedorismo que Gera Resultados"</em>, no dia <strong>27 de Novembro de 2026</strong>, às <strong>08h30</strong>, na <strong>Mediateca Zé Dú — Cazenga</strong>, com <strong>Dress Code Azul obrigatório</strong>.
                  </span>
                </label>
              </div>

              {/* Botão Destacado: INSCREVER-ME AGORA */}
              <button
                type="submit"
                disabled={isSubmittingReg || isSoldOut}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm sm:text-base uppercase tracking-wider text-white shadow-2xl transition-all duration-300 flex items-center justify-center space-x-2 ${
                  isSoldOut
                    ? 'bg-zinc-700 cursor-not-allowed opacity-60'
                    : 'bg-gradient-to-r from-[#0152D9] via-[#0173EF] to-[#0152D9] hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] border border-[#F8D21C] cursor-pointer'
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

            {/* Atalho Discreto para Consultar Devolução de Inscrição Existente */}
            <div className="pt-6 border-t border-[#0173EF]/30 text-center space-y-3">
              <button
                type="button"
                onClick={() => setShowLookupBox(!showLookupBox)}
                className="text-xs font-bold text-[#65A6F4] hover:text-[#F8D21C] transition-colors flex items-center justify-center space-x-1.5 mx-auto cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Já efectuou a sua inscrição? Consultar Devolução de Inscrição & Pagamento</span>
              </button>

              {showLookupBox && (
                <form onSubmit={handleLookupSubmit} className="max-w-md mx-auto space-y-2 pt-2 animate-fade-in">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Telefone ou Código (Ex: CD79-XXXXXX)"
                      value={lookupQuery}
                      onChange={(e) => setLookupQuery(e.target.value)}
                      className="flex-1 bg-[#021B54] border border-[#0173EF]/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-[#F8D21C]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#0173EF] hover:bg-[#0152D9] text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Consultar
                    </button>
                  </div>
                  {lookupError && (
                    <p className="text-[11px] text-rose-300 font-semibold">{lookupError}</p>
                  )}
                </form>
              )}
            </div>
          </div>
        ) : (
          /* =========================================================================
             ESTADO B: FORMULÁRIO DE DEVOLUÇÃO DE INSCRIÇÃO & PAGAMENTO
             Aqui as informações de pagamento estão devidamente organizadas e disponíveis!
             ========================================================================= */
          <div id="devolucao-inscricao" className="space-y-12 animate-fade-in">
            {/* Cartão Oficial de Devolução da Inscrição */}
            <div className="max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#032877] border-2 border-[#F8D21C] shadow-2xl space-y-8 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#0173EF]/40 pb-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-[#F8D21C] text-[#032877] text-xs font-black uppercase tracking-wider">
                      DEVOLUÇÃO DE INSCRIÇÃO
                    </span>
                    <span className="text-xs text-emerald-300 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Registada no Sistema</span>
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white mt-1">
                    CONFIRMAÇÃO & DADOS DO PARTICIPANTE
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleResetToNewRegistration}
                  className="px-3.5 py-1.5 rounded-xl bg-[#021B54] hover:bg-[#0152D9] text-zinc-300 hover:text-white border border-[#0173EF]/40 text-xs font-semibold flex items-center space-x-1.5 self-start cursor-pointer transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Nova Inscrição</span>
                </button>
              </div>

              {/* Resumo do Registo */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Nome do Participante</span>
                  <p className="text-sm font-bold text-white">{createdRegistration.fullName}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Número de Inscrição</span>
                  <p className="text-sm font-black font-mono text-[#F8D21C]">{createdRegistration.ticketCode}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Telefone / WhatsApp</span>
                  <p className="text-sm font-mono text-zinc-200">{createdRegistration.phone} / {createdRegistration.whatsapp}</p>
                </div>

                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Modalidade</span>
                  <p className="text-sm font-bold text-white">
                    {ticketTiers.find((t) => t.id === createdRegistration.ticketTierId)?.name || 'Conferência'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Valor da Inscrição</span>
                  <p className="text-base font-black font-mono text-[#F8D21C]">
                    {createdRegistration.amountAoa === 0 ? 'Entrada Grátis (Certificado: 2.000 Kz)' : `${createdRegistration.amountAoa.toLocaleString('pt-AO')} Kz`}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#021B54] border border-[#0173EF]/30 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#65A6F4]">Estado da Inscrição</span>
                  <p className="text-sm font-bold text-amber-300 flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span>Aguardando Pagamento & Validação</span>
                  </p>
                </div>
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
                    <span className="text-[11px] font-bold text-blue-100">Elemento Simbólico · Laço Azul</span>
                  </div>
                  <p className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                    DRESS CODE: VESTIR AZUL — OBRIGATÓRIO
                  </p>
                  <p className="text-[11px] text-blue-100 leading-tight">
                    Compareça vestido de azul no dia 27 de Novembro de 2026 às 08h30 na Mediateca Zé Dú — Cazenga.
                  </p>
                </div>
              </div>

              {/* Mensagem orientando para o pagamento */}
              <div className="p-4 rounded-2xl bg-[#0152D9]/30 border border-[#0173EF]/50 text-center space-y-1">
                <p className="text-sm font-bold text-white">
                  Etapa Seguinte: Efetue o pagamento da sua inscrição e envie o comprovativo abaixo.
                </p>
                <p className="text-xs text-zinc-300">
                  Utilize os dados oficiais devidamente identificados para concluir o seu registo de forma rápida e segura.
                </p>
              </div>

              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {onOpenTicketPass && (
                  <button
                    type="button"
                    onClick={() => onOpenTicketPass(createdRegistration)}
                    className="px-4 py-2.5 bg-[#0152D9] hover:bg-[#0173EF] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4 text-[#F8D21C]" />
                    <span>Ver Credencial / Ingresso Digital</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/244921152162?text=Ol%C3%A1%2C%20fiz%20a%20inscri%C3%A7%C3%A3o%20n%C2%BA%20${createdRegistration.ticketCode}%20para%20a%2079.%C2%AA%20Edi%C3%A7%C3%A3o%20do%20Caf%C3%A9%20do%20Empreendedor`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center space-x-1.5 no-underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Apoio WhatsApp Oficial (+244 921 152 162)</span>
                </a>
              </div>
            </div>

            {/* =========================================================================
                SECÇÃO ORGANIZADA: FORMAS DE PAGAMENTO NA DEVOLUÇÃO DE INSCRIÇÃO
                💳 EFETUE O PAGAMENTO DA SUA INSCRIÇÃO
                ========================================================================= */}
            <div id="formas-de-pagamento" className="scroll-mt-24 space-y-8 max-w-4xl mx-auto">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 text-xs font-black uppercase tracking-wider">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Dados Oficiais de Pagamento</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  💳 EFETUE O PAGAMENTO DA SUA INSCRIÇÃO
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                  Escolha uma das opções abaixo para efetuar o pagamento da inscrição de <strong className="text-white">{createdRegistration.fullName}</strong> ({createdRegistration.ticketCode}).
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* OPÇÃO 1 — TRANSFERÊNCIA BANCÁRIA */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#032877] border-2 border-[#0173EF] shadow-2xl flex flex-col justify-between space-y-6 relative group hover:border-[#65A6F4] transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-[#0152D9] text-[#F8D21C]">
                          <Building className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-black text-[#65A6F4]">
                            OPÇÃO 1
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-white uppercase">
                            TRANSFERÊNCIA BANCÁRIA
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#0152D9]/40 border border-[#0173EF]/40 text-[#65A6F4]">
                        Rede Bancária
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Realize a transferência a partir de qualquer banco comercial ou aplicação bancária (BFA Net, BAI Directo, Atlântico Directo, BIC Net, etc.).
                    </p>

                    {/* IBAN Display Box */}
                    <div className="p-4 rounded-2xl bg-[#021B54] border border-[#0173EF]/40 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="font-semibold uppercase tracking-wider">Número de IBAN Oficial:</span>
                        <span className="text-[#65A6F4] font-mono text-[10px]">Angola (AOA)</span>
                      </div>
                      <div className="font-mono text-sm sm:text-base font-black text-[#F8D21C] tracking-wider break-all select-all">
                        A006 0005 0000 9139 5050 1019 7
                      </div>
                    </div>
                  </div>

                  {/* Botão com o texto "COPIAR IBAN" */}
                  <button
                    type="button"
                    onClick={handleCopyIban}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-gradient-to-r from-[#0152D9] to-[#0173EF] hover:opacity-95 border border-[#F8D21C] shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
                  >
                    {copiedIban ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedIban ? 'IBAN COPIADO!' : 'COPIAR IBAN'}</span>
                  </button>
                </div>

                {/* OPÇÃO 2 — MULTICAIXA EXPRESS */}
                <div className="p-6 sm:p-7 rounded-3xl bg-[#032877] border-2 border-[#F8D21C] shadow-2xl flex flex-col justify-between space-y-6 relative group hover:border-amber-400 transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-2xl bg-[#0152D9] text-[#F8D21C]">
                          <Smartphone className="w-6 h-6" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-widest font-black text-[#F8D21C]">
                            OPÇÃO 2
                          </span>
                          <h4 className="text-base sm:text-lg font-black text-white uppercase">
                            MULTICAIXA EXPRESS
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F8D21C]/20 border border-[#F8D21C]/40 text-[#F8D21C]">
                        Instantâneo
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      Envie o pagamento diretamente pelo telemóvel na aplicação <strong>Multicaixa Express</strong> para o contacto oficial da organização.
                    </p>

                    {/* Number Display Box */}
                    <div className="p-4 rounded-2xl bg-[#021B54] border border-[#0173EF]/40 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="font-semibold uppercase tracking-wider">Número Multicaixa Express:</span>
                        <span className="text-[#F8D21C] font-mono text-[10px]">App Express</span>
                      </div>
                      <div className="font-mono text-xl sm:text-2xl font-black text-[#F8D21C] tracking-widest select-all">
                        92115262
                      </div>
                    </div>
                  </div>

                  {/* Botão com o texto "COPIAR NÚMERO" */}
                  <button
                    type="button"
                    onClick={handleCopyExpress}
                    className="w-full py-3.5 px-4 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider text-[#032877] bg-[#F8D21C] hover:bg-amber-300 border border-white/20 shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-95"
                  >
                    {copiedExpress ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedExpress ? 'NÚMERO COPIADO!' : 'COPIAR NÚMERO'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SECÇÃO ORGANIZADA: ENVIO DO COMPROVATIVO DE PAGAMENTO
                📄 ENVIO DO COMPROVATIVO DE PAGAMENTO
                ========================================================================= */}
            <div id="comprovativo" className="scroll-mt-24 max-w-4xl mx-auto p-6 sm:p-10 rounded-3xl bg-[#032877] border-2 border-[#0173EF] shadow-2xl space-y-6">
              <div className="text-center space-y-2 border-b border-[#0173EF]/30 pb-6">
                <span className="text-xs font-black uppercase tracking-widest text-[#F8D21C]">
                  CONFIRMAÇÃO DE PAGAMENTO
                </span>
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  📄 ENVIO DO COMPROVATIVO DE PAGAMENTO
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-lg mx-auto">
                  Após efetuar a transferência ou envio via Multicaixa Express, submeta aqui o ficheiro para validação.
                </p>
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
                      className="px-5 py-2.5 bg-[#0152D9] hover:bg-[#0173EF] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Submeter Novo Comprovativo
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
                      className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0173EF]"
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
                        className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#0173EF]"
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
                        placeholder="Ex: 2000 ou 25000"
                        value={proofAmount}
                        onChange={(e) => setProofAmount(e.target.value)}
                        className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#0173EF]"
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
                            ? 'bg-[#0152D9] border-[#F8D21C] text-white shadow'
                            : 'bg-[#021B54] border-[#0173EF]/30 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Building className="w-4 h-4 text-[#F8D21C]" />
                        <span>Transferência Bancária (IBAN)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setProofMethod('MULTICAIXA_EXPRESS')}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center space-x-2 cursor-pointer transition-all ${
                          proofMethod === 'MULTICAIXA_EXPRESS'
                            ? 'bg-[#0152D9] border-[#F8D21C] text-white shadow'
                            : 'bg-[#021B54] border-[#0173EF]/30 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#F8D21C]" />
                        <span>Multicaixa Express (92115262)</span>
                      </button>
                    </div>
                  </div>

                  {/* Campo para Anexar o Comprovativo (Ficheiro / Imagem ou PDF) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Anexar Comprovativo (Imagem ou PDF) *
                    </label>
                    <div className="p-4 rounded-2xl border-2 border-dashed border-[#0173EF]/50 hover:border-[#F8D21C] bg-[#021B54] transition-colors text-center space-y-2">
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
                        className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0152D9] hover:bg-[#0173EF] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
                      >
                        <Upload className="w-4 h-4 text-[#F8D21C]" />
                        <span>SELECIONAR COMPROVATIVO NO DISPOSITIVO</span>
                      </label>

                      {proofFileName ? (
                        <div className="p-2 rounded-lg bg-[#032877] border border-[#0173EF]/60 flex items-center justify-between max-w-sm mx-auto text-xs text-zinc-200">
                          <span className="truncate font-mono font-medium text-[#F8D21C]">{proofFileName}</span>
                          <span className="text-[10px] text-emerald-400 font-bold ml-2">Ficheiro carregado</span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-zinc-400">
                          Formatos aceites: JPG, PNG, PDF ou captura de ecrã do Multicaixa Express (máx. 10MB)
                        </p>
                      )}

                      {/* Thumbnail Preview if image */}
                      {proofFileUrl && proofFileUrl.startsWith('data:image') && (
                        <div className="pt-2 flex justify-center">
                          <img
                            src={proofFileUrl}
                            alt="Pré-visualização do Comprovativo"
                            className="max-h-36 rounded-lg border border-[#0173EF]/60 shadow-md object-contain"
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
                      className="w-full bg-[#021B54] border border-[#0173EF]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#0173EF]"
                    />
                  </div>

                  {/* Botão Destacado para Envio do Comprovativo */}
                  <button
                    type="submit"
                    disabled={isSubmittingProof || !proofFileUrl}
                    className="w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider text-[#032877] rounded-xl bg-[#F8D21C] hover:bg-amber-300 shadow-2xl transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="w-5 h-5 text-[#032877]" />
                    <span>
                      {isSubmittingProof ? 'A ENVIAR COMPROVATIVO...' : 'ENVIAR COMPROVATIVO DE PAGAMENTO'}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
