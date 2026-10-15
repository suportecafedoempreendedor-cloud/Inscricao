import React, { useState } from 'react';
import { Registration, TicketTier, EventSettings, DispatchChannel } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  MessageSquare,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Phone,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  X,
  Loader2,
  Copy,
  Check,
} from 'lucide-react';
import { eventStore } from '../services/store';

interface TicketDeliveryChannelModalProps {
  registration: Registration;
  tier: TicketTier;
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
  onOpenTicketPass: () => void;
}

export const TicketDeliveryChannelModal: React.FC<TicketDeliveryChannelModalProps> = ({
  registration,
  tier,
  settings,
  isOpen,
  onClose,
  onOpenTicketPass,
}) => {
  const [selectedChannel, setSelectedChannel] = useState<DispatchChannel>('WHATSAPP');
  const [phoneInput, setPhoneInput] = useState(registration.phone || '');
  const [emailInput, setEmailInput] = useState(registration.email || '');

  // Dispatch state
  const [isSending, setIsSending] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<{
    success: boolean;
    status: 'PENDENTE' | 'ENVIADO' | 'ENTREGUE' | 'FALHOU';
    message: string;
    messageId?: string;
    provider?: string;
    whatsappLink?: string;
    requiresConfig?: boolean;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (channel: DispatchChannel) => {
    setSelectedChannel(channel);
    setIsSending(true);
    setDispatchResult({
      success: true,
      status: 'PENDENTE',
      message: 'Envio pendente... A preparar ligação aos canais oficiais.',
    });

    try {
      const res = await eventStore.dispatchTicket(
        registration.id,
        channel,
        phoneInput,
        emailInput
      );

      setDispatchResult({
        success: res.success,
        status: res.dispatch.status,
        message: res.message,
        messageId: res.dispatch.messageId,
        provider: res.dispatch.providerName,
        whatsappLink: res.whatsappLink,
        requiresConfig: res.requiresConfig,
      });
    } catch (e: any) {
      setDispatchResult({
        success: false,
        status: 'FALHOU',
        message: e?.message || 'Falha no envio do ingresso. Por favor tente novamente ou escolha outro canal.',
      });
    } finally {
      setIsSending(false);
    }
  };

  const ticketSecureUrl = `${window.location.origin}?tab=meu-ingresso&codigo=${registration.ticketCode}`;

  const copySecureLink = () => {
    navigator.clipboard.writeText(ticketSecureUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-2xl w-full p-5 sm:p-7 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Inscrição Confirmada · 79.ª Edição
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              A sua inscrição foi registada.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Escolha como pretende receber o seu ingresso digital oficial.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-base font-bold rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ticket Summary Pill */}
        <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="text-[11px] text-zinc-400 font-medium">Titular do Ingresso</p>
            <p className="font-bold text-white text-sm">{registration.fullName}</p>
            <p className="text-zinc-400 text-[11px]">
              {registration.company} · {tier.name}
            </p>
          </div>

          <div className="sm:text-right font-mono space-y-0.5">
            <p className="text-[10px] text-zinc-500 uppercase">Código Único</p>
            <span className="inline-block px-2.5 py-1 rounded bg-[#BE123C]/20 border border-[#BE123C]/50 text-white font-black text-xs">
              {registration.ticketCode}
            </span>
          </div>
        </div>

        {/* Choice Grid: WhatsApp, Email, or Both */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OPÇÃO A. RECEBER POR WHATSAPP */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              selectedChannel === 'WHATSAPP'
                ? 'bg-emerald-950/20 border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Opção A · WhatsApp</h4>
                  <p className="text-[11px] text-zinc-400">WhatsApp Business Platform</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Receba o ingresso oficial com código QR e link seguro directamente no seu telemóvel.
              </p>

              {/* Editable phone field */}
              <div className="space-y-1 text-xs">
                <label className="text-zinc-400 font-semibold text-[11px] flex items-center justify-between">
                  <span>Número de Telefone (WhatsApp)</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Pode corrigir</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+244 9..."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSend('WHATSAPP')}
              disabled={isSending || !phoneInput.trim()}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 to-teal-700 hover:opacity-95 rounded-xl flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending && selectedChannel === 'WHATSAPP' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>A Enviar...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-emerald-200" />
                  <span>Receber por WhatsApp</span>
                </>
              )}
            </button>
          </div>

          {/* OPÇÃO B. RECEBER POR EMAIL */}
          <div
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
              selectedChannel === 'EMAIL'
                ? 'bg-rose-950/20 border-rose-500/70 shadow-lg shadow-rose-950/30'
                : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Opção B · Email</h4>
                  <p className="text-[11px] text-zinc-400">Email Transaccional Oficial</p>
                </div>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Receba o ingresso digital com instruções completas, logótipo oficial e dados do evento na sua caixa de correio.
              </p>

              {/* Editable email field */}
              <div className="space-y-1 text-xs">
                <label className="text-zinc-400 font-semibold text-[11px] flex items-center justify-between">
                  <span>Endereço de Email</span>
                  <span className="text-[10px] text-rose-400 font-normal">Pode corrigir</span>
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="seu.email@empresa.ao"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSend('EMAIL')}
              disabled={isSending || !emailInput.trim()}
              className="w-full py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl flex items-center justify-center space-x-1.5 shadow transition-all cursor-pointer disabled:opacity-50"
            >
              {isSending && selectedChannel === 'EMAIL' ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>A Enviar...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-rose-200" />
                  <span>Receber por Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* OPÇÃO COMBINADA: RECEBER POR AMBOS OS CANAIS */}
        <div className="text-center pt-1">
          <button
            onClick={() => handleSend('AMBOS')}
            disabled={isSending || !phoneInput.trim() || !emailInput.trim()}
            className="text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-950/40 hover:bg-amber-950/70 border border-amber-800/80 px-4 py-2 rounded-xl transition-all inline-flex items-center space-x-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Receber por Ambos os Canais (WhatsApp e Email)</span>
          </button>
        </div>

        {/* Confirmation Status Card (Prompt section 2) */}
        {dispatchResult && (
          <div
            className={`p-4 rounded-2xl border text-xs space-y-3 ${
              dispatchResult.status === 'FALHOU'
                ? 'bg-rose-950/40 border-rose-800/80 text-rose-200'
                : dispatchResult.status === 'PENDENTE'
                ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                : 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2 font-bold text-sm">
                {dispatchResult.status === 'FALHOU' ? (
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                ) : dispatchResult.status === 'PENDENTE' ? (
                  <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  Estado do Envio: {dispatchResult.status === 'ENTREGUE' ? 'Entregue' : dispatchResult.status === 'ENVIADO' ? 'Enviado' : dispatchResult.status === 'PENDENTE' ? 'Envio Pendente' : 'Falha no Envio'}
                </span>
              </div>

              {dispatchResult.messageId && (
                <span className="font-mono text-[10px] text-zinc-400">
                  ID: {dispatchResult.messageId}
                </span>
              )}
            </div>

            <p className="text-zinc-300 text-xs leading-relaxed">
              {dispatchResult.message}
            </p>

            {/* Direct WhatsApp Web Action if link is available */}
            {dispatchResult.whatsappLink && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <a
                  href={dispatchResult.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 text-xs shadow cursor-pointer transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Abrir WhatsApp com Mensagem Formatada Oficial</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>

                <button
                  onClick={copySecureLink}
                  className="w-full sm:w-auto px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl flex items-center justify-center space-x-1 text-xs cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                  <span>{copiedLink ? 'Link Copiado!' : 'Copiar Link do Ingresso'}</span>
                </button>
              </div>
            )}

            {/* In case of failure or pending config */}
            {dispatchResult.status === 'FALHOU' && (
              <div className="pt-1 flex items-center space-x-2">
                <button
                  onClick={() => handleSend(selectedChannel)}
                  className="px-3 py-1.5 bg-rose-800 hover:bg-rose-700 text-white font-bold rounded-lg text-[11px] flex items-center space-x-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  onClick={() => handleSend(selectedChannel === 'WHATSAPP' ? 'EMAIL' : 'WHATSAPP')}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-[11px]"
                >
                  Tentar Outro Canal
                </button>
              </div>
            )}
          </div>
        )}

        {/* Action footer: Go to Digital Ticket */}
        <div className="border-t border-zinc-850 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-zinc-500 text-[11px]">
            O seu ingresso está sempre acessível com o código <strong className="text-amber-400 font-mono">{registration.ticketCode}</strong>
          </p>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenTicketPass();
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-600 via-rose-600 to-[#BE123C] hover:opacity-95 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow cursor-pointer transition-all"
            >
              <Ticket className="w-4 h-4 text-amber-200" />
              <span>Ver & Descarregar Ingresso Agora</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
