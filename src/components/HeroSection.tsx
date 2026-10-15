import React from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings } from '../types';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Store,
  Sparkles,
  Award,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface HeroSectionProps {
  settings: EventSettings;
  onOpenRegister: () => void;
  onOpenStandBooking: () => void;
  onOpenPitchForm: () => void;
  onOpenSponsorModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenRegister,
  onOpenStandBooking,
  onOpenPitchForm,
  onOpenSponsorModal,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
      {/* Background Lighting & Atmospheric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#3B0764]/35 via-[#9F1239]/20 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute -top-24 right-0 w-96 h-96 bg-[#F59E0B]/10 blur-3xl pointer-events-none -z-10" />

      {/* Decorative subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)',
          backgroundSize: '36px 36px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Organization kicker */}
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-wider text-amber-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Produção Oficial: {settings.organizerName}</span>
            <span className="text-zinc-600">·</span>
            <span className="text-zinc-300">{settings.statusBadge}</span>
          </div>

          {/* Official Emblem & Logo Display */}
          <div className="py-2 flex justify-center">
            <div className="p-3 sm:p-5 rounded-2xl bg-zinc-900/60 border border-white/10 shadow-2xl backdrop-blur-md max-w-xl w-full">
              <BrandLogo variant="full" theme="dark" className="h-16 sm:h-24 md:h-28 mx-auto w-auto" />
            </div>
          </div>

          {/* Hero Slogan & Impact Statements */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Conectando pessoas.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F59E0B] via-[#E11D48] to-[#C026D3]">
                Transformando ideias em negócios.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-zinc-300 max-w-3xl mx-auto leading-relaxed">
              {settings.description}
            </p>
          </div>

          {/* 4 Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenRegister}
              className="px-6 py-3.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#881337] hover:from-[#BE123C] hover:to-[#9F1239] shadow-lg shadow-rose-950/60 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>Participar do Evento</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenStandBooking}
              className="px-5 py-3.5 text-sm font-semibold text-zinc-200 hover:text-white rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 transition-all flex items-center space-x-2"
            >
              <Store className="w-4 h-4 text-purple-400" />
              <span>Reservar Stand</span>
            </button>

            <button
              onClick={onOpenPitchForm}
              className="px-5 py-3.5 text-sm font-semibold text-zinc-200 hover:text-white rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 hover:border-amber-500/50 transition-all flex items-center space-x-2"
            >
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Inscrever no Pitch</span>
            </button>

            <button
              onClick={onOpenSponsorModal}
              className="px-5 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white rounded-xl bg-transparent hover:bg-zinc-900/50 border border-zinc-700/60 transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-zinc-400" />
              <span>Tornar-se Patrocinador</span>
            </button>
          </div>

          {/* Real announcement warning if dates/venue are pending official final confirmation */}
          <div className="pt-2 text-xs text-zinc-400">
            <span>Nota informativa: A data e o local específicos serão anunciados em breve pela organização oficial.</span>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div className="mt-14 max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-md shadow-xl">
            <div className="flex items-start space-x-3 p-2">
              <div className="p-2.5 rounded-lg bg-purple-950/50 border border-purple-800/40 text-purple-300">
                <Calendar className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Data Oficial</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-100">
                  {settings.eventDateText}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2">
              <div className="p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/40 text-rose-300">
                <MapPin className="w-5 h-5 text-[#BE123C]" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Localização</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-100">
                  {settings.venueName}
                </p>
                <p className="text-[11px] text-zinc-400">{settings.venueAddress}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2">
              <div className="p-2.5 rounded-lg bg-amber-950/50 border border-amber-800/40 text-amber-300">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Horário Previsto</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-100">
                  {settings.eventTimeText}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-2">
              <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/40 text-emerald-300">
                <Users className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-400 font-medium">Participantes</p>
                <p className="text-xs sm:text-sm font-bold text-zinc-100">
                  500+ Empreendedores
                </p>
                <p className="text-[11px] text-emerald-400 font-medium">Networking & Feira</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
