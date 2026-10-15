import React, { useRef, useState, useEffect } from 'react';
import { Certificate, EventSettings } from '../types';
import { BrandLogo } from './BrandLogo';
import { Download, Printer, X, ShieldCheck, CheckCircle, Award, Image as ImageIcon, Loader2 } from 'lucide-react';
import { eventStore } from '../services/store';
import {
  generateQrDataUrl,
  createCertificateCanvas,
  downloadCertificatePdf,
  downloadCertificateImage,
  printCanvasDirectly,
} from '../utils/documentExport';

interface OfficialCertificateModalProps {
  certificate: Certificate;
  settings: EventSettings;
  onClose: () => void;
}

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  certificate,
  settings,
  onClose,
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const isConference = certificate.type === 'CONFERENCIA';

  useEffect(() => {
    // Generate QR code pointing to verification link
    const verificationUrl = `${window.location.origin}?tab=validar-certificado&codigo=${encodeURIComponent(
      certificate.verificationCode || certificate.id
    )}`;

    generateQrDataUrl(verificationUrl, '#1E1B4B')
      .then((url) => setQrUrl(url))
      .catch(() => {});
  }, [certificate]);

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setDownloadSuccessMsg(null);
    try {
      eventStore.incrementCertificateDownload(certificate.id);
      await downloadCertificatePdf(certificate, settings, qrUrl);
      setDownloadSuccessMsg('PDF gerado e descarregado com sucesso!');
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Erro ao gerar PDF do certificado:', e);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    setIsGeneratingImg(true);
    setDownloadSuccessMsg(null);
    try {
      eventStore.incrementCertificateDownload(certificate.id);
      await downloadCertificateImage(certificate, settings, qrUrl);
      setDownloadSuccessMsg('Imagem PNG de alta resolução descarregada com sucesso!');
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      console.error('Erro ao descarregar imagem:', e);
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handlePrint = async () => {
    setIsPrinting(true);
    try {
      eventStore.incrementCertificateDownload(certificate.id);
      const canvas = await createCertificateCanvas(certificate, settings, qrUrl);
      await printCanvasDirectly(
        canvas,
        `Certificado Oficial - ${certificate.id} - ${certificate.participantName}`,
        'landscape'
      );
    } catch (e) {
      console.error('Erro ao imprimir certificado:', e);
      window.print();
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-4xl w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto">
        {/* Header Controls (no-print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-3 gap-3">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Certificado Digital Oficial</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {certificate.id}
                </span>
              </h3>
              <p className="text-xs text-zinc-400">
                {isConference ? 'Modelo A: Conferência Empresarial' : 'Modelo B: Café Experience'} · Documento Autenticado
              </p>
            </div>
          </div>

          {/* Action buttons: Descarregar PDF, Descarregar Imagem, Imprimir */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Download PDF Button */}
            <button
              id="btn-download-cert-pdf"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl shadow flex items-center space-x-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Descarregar certificado em formato PDF oficial (A4)"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>A Gerar PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-amber-300" />
                  <span>Descarregar PDF</span>
                </>
              )}
            </button>

            {/* Download PNG Image Button */}
            <button
              id="btn-download-cert-img"
              onClick={handleDownloadImage}
              disabled={isGeneratingImg}
              className="px-3 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Descarregar imagem PNG em alta resolução"
            >
              {isGeneratingImg ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-400" />
                  <span>A Gerar...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Imagem (PNG)</span>
                </>
              )}
            </button>

            {/* Print Button */}
            <button
              id="btn-print-cert"
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center space-x-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Imprimir certificado em folha A4 formato paisagem"
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

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 text-base font-bold ml-1"
              title="Fechar visualização"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feedback message banner if download succeeds */}
        {downloadSuccessMsg && (
          <div className="no-print p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/80 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{downloadSuccessMsg}</span>
          </div>
        )}

        {/* Certificate Paper Sheet (Landscape A4 container) */}
        <div className="overflow-x-auto pb-2 flex justify-center">
          <div
            ref={certificateRef}
            className="w-[840px] h-[594px] bg-[#FCFBF7] text-zinc-900 rounded-xl p-10 flex flex-col justify-between border-[12px] border-[#3B0764] shadow-2xl relative select-none shrink-0"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            }}
          >
            {/* Inner Golden Decorative Border */}
            <div className="absolute inset-2 border-2 border-[#D97706]/70 rounded-md pointer-events-none" />
            <div className="absolute inset-3 border border-[#BE123C]/30 rounded-sm pointer-events-none" />

            {/* Corner Luxury Ornaments */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#D97706]" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#D97706]" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#D97706]" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#D97706]" />

            {/* Header: Logo and Title */}
            <div className="text-center space-y-2 relative z-10 pt-1">
              <div className="flex justify-center pb-1">
                <BrandLogo variant="compact" theme="light" className="h-10 w-auto" />
              </div>

              <div className="inline-block">
                <span className="text-[11px] font-extrabold tracking-[0.25em] text-[#9F1239] uppercase font-mono">
                  REPÚBLICA DE ANGOLA · GERAÇÃO DIGITAL ANGOLA
                </span>
                <h1 className="text-3xl font-black text-[#1E1B4B] tracking-wide uppercase mt-0.5">
                  CERTIFICADO DE PARTICIPAÇÃO
                </h1>
                <div className="w-32 h-0.5 bg-gradient-to-r from-[#D97706] via-[#BE123C] to-[#3B0764] mx-auto mt-1" />
              </div>
            </div>

            {/* Central Body: Name & Participation Text */}
            <div className="text-center space-y-4 px-6 relative z-10">
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Certifica-se formalmente que
              </p>

              {/* Participant Full Name */}
              <div className="border-b-2 border-zinc-300 pb-2 max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#3B0764] tracking-tight">
                  {certificate.participantName}
                </h2>
              </div>

              {/* Text based on Model A (Conference) vs Model B (Cafe Experience) */}
              <div className="max-w-2xl mx-auto text-xs sm:text-[13px] text-zinc-700 leading-relaxed space-y-1">
                {isConference ? (
                  <p>
                    Participou com sucesso na <strong>Conferência Empresarial da 79.ª Edição do Café do Empreendedor</strong>, assistindo e integrando os painéis temáticos dedicados a Recursos Humanos, Estratégia de Negócios, Marketing e Finanças Empresariais em Angola.
                  </p>
                ) : (
                  <p>
                    Concluiu a experiência de participação executiva no <strong>{certificate.packageName}</strong> da <strong>79.ª Edição do Café do Empreendedor</strong>, tendo participado nos fóruns executivos, sessões práticas de estratégia de negócios e momentos de networking empresarial.
                  </p>
                )}
                <p className="text-[11px] text-zinc-500 pt-0.5">
                  {certificate.venueText} · {certificate.eventDateText}
                </p>
              </div>
            </div>

            {/* Footer Signatures, QR and Verification Code */}
            <div className="grid grid-cols-3 items-end pt-4 border-t border-zinc-200 relative z-10">
              {/* Left: Signatory */}
              <div className="text-left space-y-1">
                <div className="w-36 border-b border-zinc-400 pb-1">
                  <span className="font-serif italic text-sm text-[#3B0764] font-bold">
                    Geração Digital
                  </span>
                </div>
                <p className="text-[11px] font-bold text-zinc-800">
                  {settings.authorizedSignatoryName}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">
                  {settings.authorizedSignatoryRole}
                </p>
              </div>

              {/* Center: Unique ID & Seal */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-amber-700" />
                  <span>Autenticidade Verificada</span>
                </div>
                <p className="font-mono text-[10px] font-bold text-zinc-800">
                  N.º: {certificate.id}
                </p>
                <p className="text-[9px] text-zinc-500">
                  Emitido aos: {certificate.issueDate}
                </p>
              </div>

              {/* Right: Validation QR Code */}
              <div className="flex flex-col items-end text-right space-y-1">
                <div className="p-1.5 bg-white border border-zinc-300 rounded-md shadow-sm">
                  {qrUrl ? (
                    <img src={qrUrl} alt="Validação QR" className="w-14 h-14 object-contain" />
                  ) : (
                    <div className="w-14 h-14 flex items-center justify-center text-[9px] text-zinc-400">
                      QR Code
                    </div>
                  )}
                </div>
                <p className="text-[9px] font-mono text-zinc-600">
                  Cód: {certificate.verificationCode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Info Footer */}
        <div className="no-print flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-800 gap-3">
          <span className="text-[11px] text-zinc-400">
            Documento digital com validação pública via código QR. Formato oficial A4 (297 × 210 mm).
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl shadow flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? (
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
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
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

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl font-medium cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
