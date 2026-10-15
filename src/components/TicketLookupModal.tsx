import React, { useState } from 'react';
import { Registration } from '../types';
import { eventStore } from '../services/store';
import { Search, Ticket, CheckCircle2, AlertCircle, X, ArrowRight } from 'lucide-react';

interface TicketLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicket: (registration: Registration) => void;
}

export const TicketLookupModal: React.FC<TicketLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectTicket,
}) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<{
    matches: Registration[];
    searched: boolean;
  }>({ matches: [], searched: false });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const matches = eventStore.getRegistrations().filter((r) => {
      return (
        r.ticketCode.toLowerCase() === clean ||
        r.id.toLowerCase() === clean ||
        r.email.toLowerCase() === clean ||
        r.fullName.toLowerCase().includes(clean)
      );
    });

    setResult({ matches, searched: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
        <div className="flex items-start justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <Ticket className="w-5 h-5 text-rose-400" />
            <div>
              <h3 className="text-base font-bold text-white">Consultar Ingresso Digital</h3>
              <p className="text-xs text-zinc-400">Localize a sua credencial personalizada da 79.ª Edição</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 text-base font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-3">
          <div className="space-y-1 text-xs">
            <label className="text-zinc-300 font-semibold">
              Código do Ingresso, Email ou Nome Completo
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Ex: CE79-EXP-7901, REG-7901 ou email..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-zinc-500 font-mono focus:outline-none focus:border-[#BE123C]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-xl transition-colors flex items-center justify-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Localizar Ingresso</span>
          </button>
        </form>

        {result.searched && (
          <div className="space-y-3 pt-1">
            {result.matches.length === 0 ? (
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Nenhum ingresso localizado com os dados fornecidos. Confirme o código do bilhete.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-zinc-400">
                  {result.matches.length} ingresso(s) encontrado(s):
                </p>
                {result.matches.map((reg) => (
                  <div
                    key={reg.id}
                    onClick={() => {
                      onSelectTicket(reg);
                      onClose();
                    }}
                    className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 cursor-pointer flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-white">{reg.fullName}</h4>
                      <p className="text-[11px] text-zinc-400">{reg.company} · {reg.jobTitle}</p>
                      <p className="text-[10px] font-mono text-amber-400 mt-0.5">
                        Cód: {reg.ticketCode} · Estado: {reg.status}
                      </p>
                    </div>

                    <div className="flex items-center space-x-1 text-xs font-bold text-rose-400">
                      <span>Abrir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="text-[10px] text-zinc-500 border-t border-zinc-800/80 pt-2 flex justify-between">
          <span>Apoio: +244 952 908 204</span>
          <button onClick={onClose} className="hover:text-zinc-300">Fechar</button>
        </div>
      </div>
    </div>
  );
};
