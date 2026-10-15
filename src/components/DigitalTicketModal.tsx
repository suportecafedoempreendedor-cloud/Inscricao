import React, { useEffect, useState, useRef } from 'react';
import { Registration, TicketTier, EventSettings } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  Printer,
  Download,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  ShieldCheck,
  X,
  Award,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import {
  generateQrDataUrl,
  createTicketCanvas,
  downloadTicketPdf,
  downloadTicketImage,
  printCanvasDirectly,
} from '../utils/documentExport';

interface DigitalTicketModalProps {
  registration: Registration;
  tier: TicketTier;
  settings: EventSettings;
  onClose: () => void;
  onNavigateToCertificates?: () => void;
}

export const DigitalTicketModal: React.FC<DigitalTicketModalProps> = ({
  registration,
  tier,
  settings,
  onClose,
  onNavigateToCertificates,
}) => {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImg, setIsExportingImg] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate secure QR code for event door scanning
    const secureQrString = `CE79-VALIDATE:${registration.ticketCode}:${registration.id}`;
    generateQrDataUrl(secureQrString, '#111827')
      .then((url) => setQrUrl(url))
      .catch(() => {});
  }, [registration]);

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      const canvas = await createTicketCanvas(registration, tier, settings, qrUrl);
      await printCanvasDirectly(
        canvas,
        `Ingresso Digital - ${registration.ticketCode} - ${registration.fullName}`,
        'portrait'
      );
    } catch (e) {
      console.error('Erro ao imprimir ingresso:', e);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    setDownloadSuccessMsg(null);
    try {
      await downloadTicketPdf(registration, tier, settings, qrUrl);
      setDownloadSuccessMsg('Ingresso em PDF descarregado com sucesso!');
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Erro ao gerar PDF do ingresso:', e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsExportingImg(true);
    setDownloadSuccessMsg(null);
    try {
      await downloadTicketImage(registration, tier, settings, qrUrl);
      setDownloadSuccessMsg('Imagem da credencial PNG descarregada com sucesso!');
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Erro ao gerar imagem do ingresso:', e);
    } finally {
      setIsExportingImg(false);
    }
  };

  const isCheckedIn = registration.checkInStatus === 'CHECKED_IN';
  const isConfirmed = registration.status === 'CONFIRMADO';

  const hasCertificateEntitlement =
    tier.certificateIncluded || (registration.wantsConferenceCertificate && registration.conferenceCertificatePaid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
        {/* Modal Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between no-print border-b border-zinc-800 pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Credencial & Ingresso Digital Oficial
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              id="btn-download-ticket-pdf"
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-90 rounded-lg flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              title="Descarregar ingresso oficial em PDF (A5)"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Descarregar PDF</span>
                </>
              )}
            </button>

            {/* Download PNG Button */}
            <button
              id="btn-download-ticket-img"
              onClick={handleDownloadImage}
              disabled={isExportingImg}
              className="px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg flex items-center space-x-1 cursor-pointer disabled:opacity-50"
              title="Descarregar credencial em imagem PNG"
            >
              {isExportingImg ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  <span>Imagem...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Imagem</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              id="btn-print-ticket"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3 py-1.5 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Imprimir ingresso"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>A imprimir...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Imprimir</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-zinc-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success message banner */}
        {downloadSuccessMsg && (
          <div className="no-print p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMsg}</span>
          </div>
        )}

        {/* Printable Ticket Pass Container */}
        <div
          ref={ticketRef}
          className="rounded-2xl overflow-hidden border border-zinc-700/80 bg-zinc-950 text-white shadow-xl relative"
        >
          {/* Top banner */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[#3B0764] via-[#881337] to-[#BE123C] flex items-center justify-between border-b border-white/10">
            <BrandLogo variant="compact" theme="dark" className="h-8 sm:h-9 w-auto" />
            <div className="text-right space-y-0.5">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-amber-400 text-zinc-950 shadow-sm">
                {tier.name}
              </span>
              <p className="text-[11px] text-white font-mono font-bold">
                CÓD: {registration.ticketCode}
              </p>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-6 space-y-5">
            {/* Attendee Details: Mandatory Full Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-800/80 pb-4">
              <div>
                <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Titular da Credencial</p>
                <h4 className="text-xl font-black text-white mt-0.5 leading-snug">
                  {registration.fullName}
                </h4>
                <p className="text-xs text-zinc-300 font-medium mt-1">
                  {registration.jobTitle} · <span className="text-amber-400">{registration.company}</span>
                </p>
                <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{registration.email}</p>
              </div>

              <div className="space-y-1.5 sm:text-right">
                <div>
                  <p className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">Evento Oficial</p>
                  <p className="text-sm font-bold text-white">79.ª Edição do Café do Empreendedor</p>
                  <p className="text-xs text-zinc-400">{settings.venueName} · {settings.city}</p>
                  <p className="text-[11px] text-amber-400 font-medium">{settings.eventDateText}</p>
                </div>

                <div className="pt-1 flex flex-wrap gap-1 justify-start sm:justify-end">
                  <span
                    className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      isConfirmed
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    <span>Pagamento: {registration.status}</span>
                  </span>

                  {hasCertificateEntitlement && (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span>Certificado Incluído</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* QR Code and Check-in State */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
              <div className="space-y-2 text-center sm:text-left flex-1">
                <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs">
                  {isCheckedIn ? (
                    <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span>CHECK-IN EFECTUADO às {registration.checkInTime}</span>
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1 text-amber-400 font-semibold">
                      <Clock className="w-4 h-4" />
                      <span>Apresentar este código QR na portaria do evento</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  Válido para entrada individual. Apresente este código no telemóvel ou impresso para leitura no scanner.
                </p>

                <div className="pt-1 text-[11px] text-zinc-400 font-mono">
                  Ref: {registration.paymentReference} · ID: {registration.id}
                </div>
              </div>

              {/* QR Code Box */}
              <div className="p-2.5 bg-white rounded-xl shadow-md shrink-0">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt={`Código QR ${registration.ticketCode}`}
                    className="w-28 h-28 object-contain"
                  />
                ) : (
                  <div className="w-28 h-28 flex items-center justify-center text-xs text-zinc-600">
                    A gerar QR...
                  </div>
                )}
              </div>
            </div>

            {/* Access Instructions */}
            <div className="text-[10px] text-zinc-500 space-y-1 border-t border-zinc-900 pt-2">
              <p>• Obrigatório apresentar documento de identidade com foto coincidente com o nome completo no ingresso.</p>
              <p>• Apoio oficial: WhatsApp +244 921 152 162 · gdangola12@gmail.com · Geração Digital Angola</p>
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div className="no-print flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
          <span>Código do ingresso para certificados: <strong className="text-amber-400 font-mono">{registration.ticketCode}</strong></span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-90 rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>A Gerar...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Descarregar PDF</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3 py-1.5 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isPrinting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>A Imprimir...</span>
                </>
              ) : (
                <>
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Imprimir</span>
                </>
              )}
            </button>

            {onNavigateToCertificates && hasCertificateEntitlement && (
              <button
                onClick={onNavigateToCertificates}
                className="px-3 py-1.5 text-xs font-semibold text-purple-300 hover:text-white bg-purple-950/60 hover:bg-purple-900 border border-purple-800/80 rounded-xl transition-colors cursor-pointer"
              >
                Ver Certificados
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
