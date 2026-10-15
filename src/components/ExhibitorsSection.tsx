import React, { useState } from 'react';
import { Exhibitor } from '../types';
import { Store, Globe, Mail, Phone, ExternalLink, PlusCircle, CheckCircle, Search, MapPin } from 'lucide-react';

interface ExhibitorsSectionProps {
  exhibitors: Exhibitor[];
  onOpenStandBooking: () => void;
}

export const ExhibitorsSection: React.FC<ExhibitorsSectionProps> = ({
  exhibitors,
  onOpenStandBooking,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeExhibitorModal, setActiveExhibitorModal] = useState<Exhibitor | null>(null);

  // Only display approved exhibitors publicly
  const approvedExhibitors = exhibitors.filter((e) => e.status === 'APROVADO');

  // Extract unique sectors
  const sectors = ['todos', ...Array.from(new Set(approvedExhibitors.map((e) => e.sector)))];

  const filtered = approvedExhibitors.filter((exh) => {
    if (selectedSector !== 'todos' && exh.sector !== selectedSector) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = exh.companyName.toLowerCase().includes(q);
      const matchDesc = exh.description.toLowerCase().includes(q);
      const matchSector = exh.sector.toLowerCase().includes(q);
      const matchProd = exh.products.some((p) => p.toLowerCase().includes(q));
      return matchName || matchDesc || matchSector || matchProd;
    }
    return true;
  });

  return (
    <section id="expositores" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Feira de Negócios & Mostra Comercial
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Expositores Confirmados
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Descubra soluções inovadoras, marcas nacionais consolidadas e novos produtos apresentados na feira da 79.ª Edição.
            </p>
          </div>

          <button
            onClick={onOpenStandBooking}
            className="self-start md:self-end px-5 py-3 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:from-[#BE123C] hover:to-[#9F1239] shadow-lg shadow-rose-950/40 transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Candidatar Empresa / Reservar Stand</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {sectors.map((sec) => (
              <button
                key={sec}
                onClick={() => setSelectedSector(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSector === sec
                    ? 'bg-[#BE123C] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {sec === 'todos' ? 'Todos os Sectores' : sec}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar expositor ou produto..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
            />
          </div>
        </div>

        {/* Exhibitors Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((exh) => (
            <div
              key={exh.id}
              className="rounded-2xl p-6 bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl group"
            >
              <div className="space-y-4">
                {/* Header with stand badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-950 to-zinc-900 border border-purple-800/40 flex items-center justify-center text-amber-400 font-black text-lg">
                      {exh.companyName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                        {exh.companyName}
                      </h3>
                      <p className="text-xs text-zinc-400">{exh.sector}</p>
                    </div>
                  </div>

                  <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[11px] font-mono font-semibold text-zinc-300 shrink-0 flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-[#BE123C]" />
                    <span>{exh.standNumber}</span>
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                  {exh.description}
                </p>

                {/* Products & Services pills */}
                <div className="space-y-1.5 pt-1">
                  <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">Produtos & Serviços:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exh.products.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-zinc-950 text-[11px] text-zinc-300 border border-zinc-800"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800/70 flex items-center justify-between">
                <button
                  onClick={() => setActiveExhibitorModal(exh)}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1"
                >
                  <span>Ver Ficha Completa</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                {exh.website && (
                  <a
                    href={exh.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                    title="Website Oficial"
                  >
                    <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Full Exhibitor Details */}
        {activeExhibitorModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-start justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-950 text-amber-400 flex items-center justify-center font-bold text-xl border border-purple-800">
                    {activeExhibitorModal.companyName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{activeExhibitorModal.companyName}</h3>
                    <p className="text-xs text-zinc-400">{activeExhibitorModal.sector} · {activeExhibitorModal.standNumber}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveExhibitorModal(null)}
                  className="text-zinc-400 hover:text-white text-lg font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-300">
                <div>
                  <h4 className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Descrição Institucional</h4>
                  <p className="mt-1 leading-relaxed text-sm text-zinc-200">{activeExhibitorModal.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-zinc-400 uppercase tracking-wider text-[11px]">Produtos / Ofertas em Destaque</h4>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {activeExhibitorModal.products.map((p, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-200">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                  <h4 className="font-semibold text-amber-400 text-xs">Contactos Comerciais Oficiais</h4>
                  <div className="space-y-1 text-zinc-300">
                    <p className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{activeExhibitorModal.email}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{activeExhibitorModal.phone}</span>
                    </p>
                    {activeExhibitorModal.website && (
                      <p className="flex items-center space-x-2">
                        <Globe className="w-3.5 h-3.5 text-zinc-500" />
                        <a
                          href={activeExhibitorModal.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:underline"
                        >
                          {activeExhibitorModal.website}
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  onClick={() => setActiveExhibitorModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 rounded-lg"
                >
                  Fechar
                </button>
                <a
                  href={`mailto:${activeExhibitorModal.email}?subject=Contacto%20Comercial%20-%20Café%20do%20Empreendedor%2079ª%20Edição`}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg flex items-center space-x-1"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Enviar Mensagem</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
