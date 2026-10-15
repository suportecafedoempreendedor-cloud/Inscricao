import React, { useState } from 'react';
import { eventStore } from '../services/store';
import { Registration, Certificate, EventSettings } from '../types';
import {
  Award,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  FileCheck,
  Printer,
} from 'lucide-react';
import {
  downloadCertificatePdf,
  createCertificateCanvas,
  printCanvasDirectly,
} from '../utils/documentExport';

interface CertificatesPortalSectionProps {
  settings: EventSettings;
  onOpenCertificateModal: (cert: Certificate) => void;
  onOpenPaymentModalForConference: (reg: Registration) => void;
}

export const CertificatesPortalSection: React.FC<CertificatesPortalSectionProps> = ({
  settings,
  onOpenCertificateModal,
  onOpenPaymentModalForConference,
}) => {
  // Area A: Conference
  const [confSearchName, setConfSearchName] = useState('');
  const [confDisambigEmail, setConfDisambigEmail] = useState('');
  const [confResult, setConfResult] = useState<{
    matches: Registration[];
    needsDisambiguation: boolean;
    registration?: Registration;
    certificate?: Certificate;
    error?: string;
  } | null>(null);

  // Area B: Cafe Experience
  const [expTicketCode, setExpTicketCode] = useState('');
  const [expResult, setExpResult] = useState<{
    registration?: Registration;
    certificate?: Certificate;
    error?: string;
  } | null>(null);

  const handleSearchConference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confSearchName.trim()) return;

    const res = eventStore.lookupConferenceCertificateByName(
      confSearchName.trim(),
      confDisambigEmail.trim() ? { email: confDisambigEmail.trim() } : undefined
    );
    setConfResult(res);
  };

  const handleSearchExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTicketCode.trim()) return;

    const res = eventStore.lookupCertificateByTicketCode(expTicketCode.trim());
    setExpResult(res);
  };

  return (
    <section id="certificados" className="py-20 bg-zinc-950/80 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Portal de Certificados Oficiais</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Consulta e Download de Certificados
          </h2>
          <p className="text-sm sm:text-base text-zinc-300">
            Consulte e descarregue o seu certificado digital da 79.ª Edição do Café do Empreendedor. Introduza os dados solicitados para verificar a sua elegibilidade.
          </p>
        </div>

        {/* 2 Distinct Areas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ÁREA A. CERTIFICADO DA CONFERÊNCIA */}
          <div className="rounded-2xl p-6 sm:p-8 bg-zinc-900/70 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h3 className="text-lg font-bold text-white">Área A · Certificado da Conferência</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 space-y-1">
                <p className="font-semibold text-white">A entrada na conferência é gratuita.</p>
                <p>
                  O Certificado Digital Oficial da Conferência tem o custo de <strong>2.000 Kz</strong>. O download é desbloqueado após confirmação do pagamento.
                </p>
              </div>

              <form onSubmit={handleSearchConference} className="space-y-3">
                <div className="space-y-1 text-xs">
                  <label className="text-zinc-300 font-semibold">
                    Nome Completo utilizado na inscrição *
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Helena Cassoma ou António Silva"
                      value={confSearchName}
                      onChange={(e) => {
                        setConfSearchName(e.target.value);
                        setConfResult(null);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                    />
                  </div>
                </div>

                {/* Disambiguation if needed */}
                {confResult?.needsDisambiguation && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs space-y-2">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-bold">
                      <AlertCircle className="w-4 h-4" />
                      <span>Foram encontrados {confResult.matches.length} participantes com este nome.</span>
                    </div>
                    <p className="text-zinc-300">
                      Por favor, introduza o email utilizado na inscrição para identificar o seu registo específico:
                    </p>
                    <input
                      type="email"
                      required
                      placeholder="seu.email@empresa.ao"
                      value={confDisambigEmail}
                      onChange={(e) => setConfDisambigEmail(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-white"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Consultar Certificado</span>
                </button>
              </form>

              {/* Conference Feedback Result */}
              {confResult && (
                <div className="pt-2">
                  {confResult.error && !confResult.registration && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Inscrição não encontrada</p>
                        <p className="text-[11px] mt-0.5">{confResult.error}</p>
                      </div>
                    </div>
                  )}

                  {confResult.registration && (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-start justify-between border-b border-zinc-800 pb-2">
                        <div>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Participante Localizado</p>
                          <h4 className="text-sm font-bold text-white">{confResult.registration.fullName}</h4>
                          <p className="text-[11px] text-zinc-400">
                            {confResult.registration.company} · ID: {confResult.registration.id}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                          {confResult.registration.ticketCode}
                        </span>
                      </div>

                      {/* Case 1: Certificate Ready for Download */}
                      {confResult.certificate ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Certificado Pago e Disponível para Download!</span>
                          </div>
                          <p className="text-zinc-400 text-[11px]">
                            Número do Documento: <strong className="text-white font-mono">{confResult.certificate.id}</strong>
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => onOpenCertificateModal(confResult.certificate!)}
                              className="py-2.5 px-3 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-colors"
                              title="Visualizar certificado oficial autenticado"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                              <span>Visualizar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                eventStore.incrementCertificateDownload(confResult.certificate!.id);
                                downloadCertificatePdf(confResult.certificate!, settings);
                              }}
                              className="py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-all"
                              title="Descarregar certificado em PDF oficial (A4)"
                            >
                              <Download className="w-3.5 h-3.5 text-amber-300" />
                              <span>Descarregar PDF</span>
                            </button>

                            <button
                              type="button"
                              onClick={async () => {
                                eventStore.incrementCertificateDownload(confResult.certificate!.id);
                                const canvas = await createCertificateCanvas(confResult.certificate!, settings);
                                await printCanvasDirectly(canvas, `Certificado - ${confResult.certificate!.participantName}`, 'landscape');
                              }}
                              className="py-2.5 px-3 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-850 hover:bg-zinc-750 border border-zinc-700 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-colors"
                              title="Imprimir certificado oficial em A4 formato paisagem"
                            >
                              <Printer className="w-3.5 h-3.5 text-amber-400" />
                              <span>Imprimir</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Case 2: Certificate Not Paid yet (2.000 Kz) */
                        <div className="space-y-2.5">
                          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-800/80 text-amber-200 space-y-1">
                            <p className="font-bold flex items-center space-x-1">
                              <CreditCard className="w-3.5 h-3.5 text-amber-400" />
                              <span>Pagamento do Certificado Necessário</span>
                            </p>
                            <p className="text-[11px] text-zinc-300">
                              O seu certificado tem o custo de <strong>2.000 Kz</strong>. Conclua o pagamento para desbloquear o download.
                            </p>
                          </div>

                          <button
                            onClick={() => onOpenPaymentModalForConference(confResult.registration!)}
                            className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-95 rounded-xl flex items-center justify-center space-x-1.5 shadow"
                          >
                            <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                            <span>Pagar Certificado (2.000 Kz)</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
              * A introdução do nome inicia a consulta. A autorização final depende da verificação do registo e do pagamento confirmado.
            </div>
          </div>

          {/* ÁREA B. CERTIFICADO DO CAFÉ EXPERIENCE */}
          <div className="rounded-2xl p-6 sm:p-8 bg-zinc-900/70 border border-zinc-800 shadow-xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-zinc-800">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <h3 className="text-lg font-bold text-white">Área B · Certificado do Café Experience</h3>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 space-y-1">
                <p className="font-semibold text-white">Certificado Incluído em Todos os Pacotes Experience.</p>
                <p>
                  Café Experience Essencial (5.000 Kz), Profissional (15.000 Kz) e Executivo (25.000 Kz) incluem certificado sem custo adicional.
                </p>
              </div>

              <form onSubmit={handleSearchExperience} className="space-y-3">
                <div className="space-y-1 text-xs">
                  <label className="text-zinc-300 font-semibold">
                    Código do Ingresso (recebido após inscrição) *
                  </label>
                  <div className="relative">
                    <QrCode className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: CE79-EXP-7901 ou REG-7901"
                      value={expTicketCode}
                      onChange={(e) => {
                        setExpTicketCode(e.target.value);
                        setExpResult(null);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#BE123C]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-rose-600 to-[#BE123C] hover:opacity-95 rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
                  <span>Validar Ingresso e Descarregar Certificado</span>
                </button>
              </form>

              {/* Experience Feedback Result */}
              {expResult && (
                <div className="pt-2">
                  {expResult.error && (
                    <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-200 flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Validação não autorizada</p>
                        <p className="text-[11px] mt-0.5">{expResult.error}</p>
                      </div>
                    </div>
                  )}

                  {expResult.certificate && (
                    <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 text-xs">
                      <div className="flex items-start justify-between border-b border-zinc-800 pb-2">
                        <div>
                          <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Titular do Ingresso</p>
                          <h4 className="text-sm font-bold text-white">{expResult.certificate.participantName}</h4>
                          <p className="text-[11px] text-amber-400">
                            {expResult.certificate.packageName}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                          {expResult.certificate.ticketCode}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Ingresso Validado · Certificado Disponível!</span>
                        </div>
                        <p className="text-zinc-400 text-[11px]">
                          Número do Certificado: <strong className="text-white font-mono">{expResult.certificate.id}</strong>
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => onOpenCertificateModal(expResult.certificate!)}
                            className="py-2.5 px-3 text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-colors"
                            title="Visualizar certificado oficial autenticado"
                          >
                            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
                            <span>Visualizar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              eventStore.incrementCertificateDownload(expResult.certificate!.id);
                              downloadCertificatePdf(expResult.certificate!, settings);
                            }}
                            className="py-2.5 px-3 text-xs font-bold text-white bg-gradient-to-r from-amber-600 via-rose-600 to-[#BE123C] hover:opacity-95 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-all"
                            title="Descarregar certificado em PDF oficial (A4)"
                          >
                            <Download className="w-3.5 h-3.5 text-amber-200" />
                            <span>Descarregar PDF</span>
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              eventStore.incrementCertificateDownload(expResult.certificate!.id);
                              const canvas = await createCertificateCanvas(expResult.certificate!, settings);
                              await printCanvasDirectly(canvas, `Certificado - ${expResult.certificate!.participantName}`, 'landscape');
                            }}
                            className="py-2.5 px-3 text-xs font-bold text-zinc-200 hover:text-white bg-zinc-850 hover:bg-zinc-750 border border-zinc-700 rounded-xl flex items-center justify-center space-x-1.5 shadow cursor-pointer transition-colors"
                            title="Imprimir certificado oficial em A4 formato paisagem"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span>Imprimir</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
              * O participante não precisa redigitar o nome. O sistema utiliza automaticamente o nome gravado na inscrição oficial.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
