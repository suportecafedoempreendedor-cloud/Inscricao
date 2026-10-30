import React from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { GeometricDecoration } from './GeometricDecorations';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Store,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
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
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-between pt-12 pb-20 md:pt-20 md:pb-28 bg-[#12051E] text-white">
      {/* Background Photography with Dark Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=85"
          alt="Conferência Empresarial Café do Empreendedor"
          className="w-full h-full object-cover object-center brightness-35 filter contrast-110 saturate-120"
        />
        {/* Dark Vignette and Gradient Overlay using Official Brand Palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#150724]/95 via-[#2A0845]/85 to-[#0D0417]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#100319]/60 to-[#0A0210]" />
      </div>

      {/* Geometric Decorative Compositions at Edges (Visual Reference Inspired) */}
      <GeometricDecoration position="top-left" variant="diamonds" size="lg" className="hidden lg:block -translate-x-12 -translate-y-12" />
      <GeometricDecoration position="top-right" variant="polygons" size="xl" className="-translate-y-10 translate-x-8" />
      <GeometricDecoration position="center-left" variant="diagonal-stripes" size="md" className="hidden md:block" />
      <GeometricDecoration position="bottom-right" variant="triangles-cluster" size="lg" className="hidden md:block translate-y-10" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto space-y-8 text-center">
        {/* Header Kicker Badge & Theme Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black tracking-widest text-amber-300 uppercase shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>79.ª EDIÇÃO DO CAFÉ DO EMPREENDEDOR</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-900/60 to-purple-900/60 backdrop-blur-md border border-blue-400/30 text-xs font-black tracking-wider text-blue-200 uppercase shadow-lg">
            <span className="text-blue-300">🎗️</span>
            <span>DRESS CODE: AZUL · MÊS DA SAÚDE MENTAL · LAÇO AZUL</span>
          </div>
        </div>

        {/* Official Brand Logo */}
        <div className="py-1 flex justify-center">
          <div className="p-3 sm:p-5 rounded-3xl bg-black/50 border border-white/10 shadow-2xl backdrop-blur-xl max-w-lg w-full transform hover:scale-[1.02] transition-transform">
            <BrandLogo variant="full" theme="dark" className="h-16 sm:h-24 md:h-28 mx-auto w-auto" />
          </div>
        </div>

        {/* Theme Highlight Card */}
        <div className="inline-block px-5 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-400/40 backdrop-blur-md shadow-xl">
          <p className="text-[11px] uppercase tracking-widest font-black text-amber-300">TEMA OFICIAL DO EVENTO</p>
          <p className="text-base sm:text-2xl font-black text-white tracking-wide">
            "EMPREENDEDORISMO QUE GERA RESULTADOS"
          </p>
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white">
            O FUTURO DOS NEGÓCIOS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFC928] via-[#DC1037] to-[#B20D64]">
              NÃO SE ESPERA. CONSTRÓI-SE AQUI.
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-zinc-200 max-w-3xl mx-auto leading-relaxed font-medium">
            No dia <strong>27 de novembro de 2026</strong>, às <strong>08h30</strong>, na <strong>Mediateca Zé Dú — Cazenga</strong>, empreendedores, empresários, líderes e especialistas encontram-se para viver uma experiência de alto impacto.
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Participe com <strong>Dress code: Azul</strong> em solidariedade ao Mês da Saúde Mental e receba o laço simbólico oficial.
            <br />
            <span className="text-amber-300 font-semibold">950 participantes esperados · Painéis Temáticos de Alto Nível · Mostra de Negócios & Pitch.</span>
          </p>
        </div>

        {/* COUNTDOWN TIMER COMPONENT (November 27, 2026) */}
        <div className="py-2">
          <CountdownTimer targetDateStr="2026-11-27T08:00:00+01:00" variant="hero" />
        </div>

        {/* Primary Action Buttons (Red, Purple, and Gold styling) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onOpenRegister}
            className="px-7 py-4 text-sm font-black uppercase tracking-wider text-white rounded-xl bg-gradient-to-r from-[#DC1037] via-[#B20D64] to-[#75116E] hover:from-[#ED3038] hover:to-[#B20D64] shadow-2xl shadow-rose-950/80 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2.5 cursor-pointer border border-rose-400/40"
          >
            <span>QUERO PARTICIPAR</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {/* External Redirect: https://cafe-oportunidades-pro.vercel.app/ */}
          <a
            href="https://cafe-oportunidades-pro.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-zinc-100 hover:text-white rounded-xl bg-[#43085C]/90 hover:bg-[#67206D] border border-purple-500/40 hover:border-purple-400 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer no-underline"
          >
            <Store className="w-4 h-4 text-purple-300" />
            <span>RESERVAR UM STAND</span>
          </a>

          {/* Internal Page: /pitch */}
          <button
            onClick={onOpenPitchForm}
            className="px-6 py-4 text-sm font-bold uppercase tracking-wider text-amber-200 hover:text-white rounded-xl bg-zinc-950/90 hover:bg-zinc-900 border border-amber-500/50 hover:border-amber-400 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>PARTICIPAR NO PITCH</span>
          </button>

          {/* Internal Page: /patrocinador */}
          <button
            onClick={onOpenSponsorModal}
            className="px-5 py-4 text-sm font-semibold text-zinc-200 hover:text-white rounded-xl bg-gradient-to-r from-amber-600/30 to-[#DC1037]/30 hover:bg-white/10 border border-amber-500/40 hover:border-amber-400 transition-all flex items-center space-x-2 cursor-pointer shadow-lg hover:scale-105"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>TORNAR-SE PATROCINADOR</span>
          </button>
        </div>

        {/* Operational Notice / Capacity badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-zinc-400">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Entrada Gratuita disponível na Conferência</span>
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-amber-400 font-semibold">
            Pacotes Café Experience com Certificado Digital Oficial
          </span>
        </div>
      </div>

      {/* Bottom Horizontal Quick Info Bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 rounded-3xl bg-zinc-950/90 border border-white/15 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start space-x-3 p-2 border-r border-zinc-800/80 last:border-none">
            <div className="p-2.5 rounded-xl bg-purple-950/60 border border-purple-800/50 text-purple-300 shrink-0">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Data do Evento</p>
              <p className="text-xs sm:text-sm font-black text-white">27 Novembro 2026</p>
              <p className="text-[10px] text-amber-400 font-mono">Sexta-feira</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border-r border-zinc-800/80 last:border-none">
            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/50 text-rose-300 shrink-0">
              <Clock className="w-5 h-5 text-[#DC1037]" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Horário de Início</p>
              <p className="text-xs sm:text-sm font-black text-white">08h30 Pontual</p>
              <p className="text-[10px] text-zinc-400 font-mono">Credenciamento às 07h30</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border-r border-zinc-800/80 last:border-none">
            <div className="p-2.5 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-300 shrink-0">
              <MapPin className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Local do Evento</p>
              <p className="text-xs sm:text-sm font-black text-white">Mediateca Zé Dú</p>
              <p className="text-[10px] text-amber-400 truncate max-w-[130px]">Cazenga, Luanda</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2">
            <div className="p-2.5 rounded-xl bg-blue-950/60 border border-blue-800/50 text-blue-300 shrink-0">
              <span className="text-xl leading-none">🎗️</span>
            </div>
            <div>
              <p className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">Dress Code</p>
              <p className="text-xs sm:text-sm font-black text-blue-300">Azul · Laço Azul</p>
              <p className="text-[10px] text-zinc-400">Mês da Saúde Mental</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
