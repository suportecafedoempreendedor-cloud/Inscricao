import React, { useState } from 'react';
import { ConferenceTrack, AgendaSession } from '../types';
import { Users2, LineChart, Megaphone, Coins, ArrowRight, Calendar, UserCheck } from 'lucide-react';

interface ConferenceSectionProps {
  tracks: ConferenceTrack[];
  agenda: AgendaSession[];
  onSelectTrackForAgenda: (trackSlug: string) => void;
}

export const ConferenceSection: React.FC<ConferenceSectionProps> = ({
  tracks,
  agenda,
  onSelectTrackForAgenda,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<ConferenceTrack>(tracks[1]); // Default to Negócios

  const getTrackIcon = (slug: string) => {
    switch (slug) {
      case 'recursos-humanos':
        return Users2;
      case 'negocios':
        return LineChart;
      case 'marketing':
        return Megaphone;
      case 'financas':
        return Coins;
      default:
        return LineChart;
    }
  };

  const currentTrackSessions = agenda.filter((s) => s.trackSlug === selectedTrack.slug);

  return (
    <section id="conferencia" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
            Conferência Empresarial Especializada
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            4 Grandes Eixos para Transformar o Seu Negócio
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base">
            Uma abordagem profunda e prática desenhada para empresários e líderes que enfrentam os desafios diários do mercado angolano.
          </p>
        </div>

        {/* 4 Interactive Track Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map((track) => {
            const Icon = getTrackIcon(track.slug);
            const isSelected = selectedTrack.slug === track.slug;
            return (
              <button
                key={track.id}
                onClick={() => setSelectedTrack(track)}
                className={`text-left p-5 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-zinc-900 border-[#BE123C] shadow-lg shadow-rose-950/30 ring-1 ring-[#BE123C]'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900/70 hover:border-zinc-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] via-[#BE123C] to-[#3B0764]" />
                )}
                <div className="space-y-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: track.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{track.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{track.shortDesc}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs font-medium">
                  <span className={isSelected ? 'text-[#F59E0B]' : 'text-zinc-500'}>
                    {isSelected ? 'Eixo Activo' : 'Ver Detalhes'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F59E0B]' : 'text-zinc-500'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Track Deep Dive Box */}
        <div className="rounded-2xl p-6 sm:p-8 bg-zinc-900/70 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span>Eixo Temático Selecionado</span>
                <span>·</span>
                <span className="text-[#F59E0B] font-bold">{selectedTrack.name}</span>
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-1">{selectedTrack.name} em Foco</h3>
              <p className="text-sm text-zinc-300 max-w-2xl mt-1">{selectedTrack.description}</p>
            </div>

            <button
              onClick={() => onSelectTrackForAgenda(selectedTrack.slug)}
              className="self-start lg:self-center px-4 py-2.5 text-xs font-bold text-white rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 transition-colors flex items-center space-x-2"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver Sessões na Agenda Completa</span>
            </button>
          </div>

          {/* Topics in Track */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Tópicos Essenciais Abordados:
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedTrack.topics.map((topic, i) => (
                <div
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs font-medium text-zinc-200"
                >
                  {topic}
                </div>
              ))}
            </div>
          </div>

          {/* Associated Agenda Sessions Preview */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Sessões Programadas Neste Eixo:
            </p>

            {currentTrackSessions.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">
                Sessões adicionais a serem confirmadas pelos oradores desta área.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentTrackSessions.map((session) => (
                  <div
                    key={session.id}
                    className="p-4 rounded-xl bg-zinc-950/70 border border-zinc-800 space-y-2 hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span className="text-amber-400 font-bold">
                        {session.startTime} – {session.endTime}
                      </span>
                      <span>{session.room}</span>
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">{session.title}</h4>

                    <div className="flex items-center space-x-2 text-xs text-zinc-300 pt-1">
                      <UserCheck className="w-3.5 h-3.5 text-[#BE123C] shrink-0" />
                      <span>
                        <strong>{session.speakerName}</strong> · {session.speakerRole} ({session.speakerCompany})
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed pt-1">{session.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
