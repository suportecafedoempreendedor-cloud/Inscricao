import React, { useState } from 'react';
import { AgendaSession } from '../types';
import { Bookmark, BookmarkCheck, Search, Filter, Clock, MapPin, User, Sparkles } from 'lucide-react';

interface AgendaSectionProps {
  agenda: AgendaSession[];
  savedSessionIds: string[];
  onToggleSave: (sessionId: string) => void;
  selectedTrackFilter: string;
  onTrackFilterChange: (track: string) => void;
}

export const AgendaSection: React.FC<AgendaSectionProps> = ({
  agenda,
  savedSessionIds,
  onToggleSave,
  selectedTrackFilter,
  onTrackFilterChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [onlySaved, setOnlySaved] = useState(false);

  const tracks = [
    { id: 'todas', label: 'Todas as Sessões' },
    { id: 'plenaria', label: 'Plenária Principal' },
    { id: 'negocios', label: 'Negócios' },
    { id: 'recursos-humanos', label: 'Recursos Humanos' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'financas', label: 'Finanças' },
  ];

  const filteredSessions = agenda.filter((session) => {
    if (onlySaved && !savedSessionIds.includes(session.id)) {
      return false;
    }

    if (selectedTrackFilter !== 'todas' && session.trackSlug !== selectedTrackFilter) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = session.title.toLowerCase().includes(q);
      const matchSpeaker = session.speakerName.toLowerCase().includes(q);
      const matchDesc = session.description.toLowerCase().includes(q);
      return matchTitle || matchSpeaker || matchDesc;
    }

    return true;
  });

  return (
    <section id="agenda" className="py-20 bg-zinc-950/80 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Programação Oficial Completa
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Agenda do Café do Empreendedor
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Monte o seu roteiro personalizado salvando as sessões mais estratégicas para a sua jornada.
            </p>
          </div>

          {/* Personal Agenda Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all flex items-center space-x-2 ${
                onlySaved
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
              }`}
            >
              {onlySaved ? (
                <BookmarkCheck className="w-4 h-4 text-amber-400" />
              ) : (
                <Bookmark className="w-4 h-4 text-zinc-400" />
              )}
              <span>Minha Agenda Salva ({savedSessionIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          {/* Track selector */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-zinc-500 shrink-0 mr-1" />
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => onTrackFilterChange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedTrackFilter === t.id
                    ? 'bg-[#BE123C] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar orador ou tema..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
            />
          </div>
        </div>

        {/* Sessions Timeline List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12 rounded-xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <Clock className="w-8 h-8 text-zinc-600 mx-auto" />
              <p className="text-sm font-semibold text-zinc-300">Nenhuma sessão encontrada com os filtros actuais.</p>
              <p className="text-xs text-zinc-500">Tente ajustar a pesquisa ou exibir todas as sessões.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isSaved = savedSessionIds.includes(session.id);
              return (
                <div
                  key={session.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    session.isKeynote
                      ? 'bg-gradient-to-r from-purple-950/30 via-zinc-900/60 to-rose-950/30 border-purple-800/40 shadow-md'
                      : 'bg-zinc-900/50 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  {/* Left: Time and venue */}
                  <div className="flex md:flex-col items-center md:items-start justify-between md:justify-center min-w-[150px] shrink-0 border-b md:border-b-0 md:border-r border-zinc-800 pb-2 md:pb-0 md:pr-4">
                    <div className="flex items-center space-x-1.5 text-sm font-bold text-amber-400 font-mono">
                      <Clock className="w-4 h-4 text-amber-400/80" />
                      <span>{session.startTime} – {session.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-zinc-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>{session.room}</span>
                    </div>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                        {session.trackSlug === 'plenaria' ? 'Sessão Plenária' : `Eixo: ${session.trackSlug.replace('-', ' ')}`}
                      </span>
                      {session.isKeynote && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>Destaque Principal</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                      {session.title}
                    </h3>

                    <div className="flex items-center space-x-2 text-xs text-zinc-300">
                      <User className="w-3.5 h-3.5 text-[#BE123C] shrink-0" />
                      <span>
                        <strong className="text-white">{session.speakerName}</strong> · {session.speakerRole} ({session.speakerCompany})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">
                      {session.description}
                    </p>
                  </div>

                  {/* Right: Save button */}
                  <div className="self-end md:self-center shrink-0">
                    <button
                      onClick={() => onToggleSave(session.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition-all ${
                        isSaved
                          ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                          : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500'
                      }`}
                      title={isSaved ? 'Remover da Minha Agenda' : 'Guardar na Minha Agenda'}
                    >
                      {isSaved ? (
                        <>
                          <BookmarkCheck className="w-4 h-4 text-amber-400" />
                          <span>Salva</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-4 h-4 text-zinc-400" />
                          <span>Salvar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
