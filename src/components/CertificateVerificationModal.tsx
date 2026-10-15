import React, { useState, useEffect } from 'react';
import { eventStore } from '../services/store';
import { Certificate } from '../types';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, XCircle, Search, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface CertificateVerificationModalProps {
  initialCode?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateVerificationModal: React.FC<CertificateVerificationModalProps> = ({
  initialCode = '',
  isOpen,
  onClose,
}) => {
  const [queryCode, setQueryCode] = useState(initialCode);
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    statusText: 'VALIDO' | 'ANULADO' | 'INEXISTENTE';
    certificate?: Certificate;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (initialCode) {
      setQueryCode(initialCode);
      const res = eventStore.validateCertificatePublic(initialCode);
      setVerificationResult(res);
    }
  }, [initialCode]);

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryCode.trim()) return;
    const res = eventStore.validateCertificatePublic(queryCode.trim());
    setVerificationResult(res);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Validação Pública de Autenticidade
              </h3>
              <p className="text-xs text-zinc-400">79.ª Edição do Café do Empreendedor · Angola</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-base font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verification Search Bar */}
        <form onSubmit={handleVerify} className="space-y-3">
          <div className="space-y-1 text-xs">
            <label className="text-zinc-300 font-semibold">
              Código do Certificado ou Código QR
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Ex: CERT-79-EXP-7901 ou código do QR..."
                value={queryCode}
                onChange={(e) => setQueryCode(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl p-3 text-xs text-white font-mono placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Verificar Autenticidade</span>
          </button>
        </form>

        {/* Result Display */}
        {verificationResult && (
          <div className="space-y-4 pt-1">
            {verificationResult.statusText === 'VALIDO' && verificationResult.certificate && (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-600/80 space-y-3 text-xs text-zinc-200">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>DOCUMENTO VÁLIDO E AUTÊNTICO</span>
                </div>

                <div className="space-y-1.5 border-t border-emerald-900/60 pt-3">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Titular do Certificado:</span>
                    <strong className="text-white text-right">
                      {verificationResult.certificate.participantName}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Designação do Evento:</span>
                    <span className="text-white text-right">
                      79.ª Edição do Café do Empreendedor
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Modalidade de Participação:</span>
                    <span className="text-amber-400 text-right font-semibold">
                      {verificationResult.certificate.packageName}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-400">Número do Certificado:</span>
                    <span className="text-white font-bold">
                      {verificationResult.certificate.id}
                    </span>
                  </div>
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-400">Data de Emissão:</span>
                    <span className="text-zinc-300">
                      {verificationResult.certificate.issueDate}
                    </span>
                  </div>
                </div>

                <p className="text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-900/60">
                  Emitido sob autorização da Geração Digital Angola. Autenticidade comprovada nos registos centrais.
                </p>
              </div>
            )}

            {verificationResult.statusText === 'ANULADO' && verificationResult.certificate && (
              <div className="p-5 rounded-2xl bg-rose-950/40 border border-rose-600 space-y-3 text-xs text-rose-200">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm">
                  <XCircle className="w-5 h-5" />
                  <span>CERTIFICADO ANULADO / REVOGADO</span>
                </div>

                <p className="text-xs">
                  {verificationResult.message}
                </p>

                <div className="space-y-1 border-t border-rose-900/60 pt-2 text-[11px] text-zinc-300">
                  <p><strong>Titular original:</strong> {verificationResult.certificate.participantName}</p>
                  <p><strong>N.º Documento:</strong> {verificationResult.certificate.id}</p>
                  <p className="text-rose-300">
                    <strong>Motivo da Anulação:</strong> {verificationResult.certificate.annulledReason || 'Revogação administrativa pela organização.'}
                  </p>
                </div>
              </div>
            )}

            {verificationResult.statusText === 'INEXISTENTE' && (
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs text-zinc-300">
                <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5" />
                  <span>DOCUMENTO NÃO LOCALIZADO</span>
                </div>
                <p>{verificationResult.message}</p>
                <p className="text-[11px] text-zinc-500">
                  Certifique-se de que digitou o código exactamente como consta no certificado ou consulte o apoio oficial.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-3 flex items-center justify-between">
          <span>Protecção de dados activa: Detalhes de contacto e pagamento não são divulgados.</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded hover:text-white"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
