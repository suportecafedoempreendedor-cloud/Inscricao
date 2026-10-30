import React from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings } from '../types';
import { CountdownTimer } from './CountdownTimer';
import { GeometricDecoration } from './GeometricDecorations';
import {
  Calendar,
  MapPin,
  Clock,
  Store,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';

interface HeroSectionProps {
  settings: EventSettings;
  onOpenRegister: () => void;
  onOpenStandBooking: () => void;
  onOpenPitchForm?: () => void;
  onOpenSponsorModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenRegister,
  onOpenStandBooking,
}) => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex flex-col justify-between pt-12 pb-20 md:pt-20 md:pb-28 bg-[#032877] text-white">
      {/* Background Photography with Navy & Royal Blue Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=2000&q=85"
          alt="Conferência Empresarial Café do Empreendedor"
          className="w-full h-full object-cover object-center opacity-25 filter contrast-125"
        />
        {/* Navy and Royal Blue Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#032877]/95 via-[#0152D9]/85 to-[#021B54]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#032877]/60 to-[#01143D]" />
      </div>

      {/* Geometric Decorative Compositions at Edges */}
      <GeometricDecoration position="top-left" variant="diamonds" size="lg" className="hidden lg:block -translate-x-12 -translate-y-12 opacity-40" />
      <GeometricDecoration position="top-right" variant="polygons" size="xl" className="-translate-y-10 translate-x-8 opacity-40" />
      <GeometricDecoration position="center-left" variant="diagonal-stripes" size="md" className="hidden md:block opacity-30" />
      <GeometricDecoration position="bottom-right" variant="triangles-cluster" size="lg" className="hidden md:block translate-y-10 opacity-30" />

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto space-y-8 text-center">
        {/* Header Kicker Badge & Dress Code Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-xs font-black tracking-widest text-[#F8D21C] uppercase shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>79.ª EDIÇÃO DO CAFÉ DO EMPREENDEDOR</span>
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0173EF]/40 backdrop-blur-md border border-[#65A6F4]/50 text-xs font-black tracking-wider text-white uppercase shadow-lg">
            <span className="text-white">🎗️</span>
            <span>DRESS CODE: VESTIR AZUL — OBRIGATÓRIO · LAÇO AZUL</span>
          </div>
        </div>

        {/* Official Brand Logo */}
        <div className="py-1 flex justify-center">
          <div className="p-4 sm:p-6 rounded-3xl bg-white/95 border-2 border-[#0173EF]/40 shadow-2xl backdrop-blur-xl max-w-lg w-full transform hover:scale-[1.02] transition-transform">
            <BrandLogo variant="full" theme="light" className="h-16 sm:h-24 md:h-28 mx-auto w-auto" />
          </div>
        </div>

        {/* Theme Highlight Card */}
        <div className="inline-block px-6 py-2.5 rounded-2xl bg-white/10 border-2 border-[#F8D21C]/80 backdrop-blur-md shadow-xl">
          <p className="text-[11px] uppercase tracking-widest font-black text-[#F8D21C]">TEMA OFICIAL DO EVENTO</p>
          <p className="text-lg sm:text-2xl font-black text-white tracking-wide">
            "EMPREENDEDORISMO QUE GERA RESULTADOS"
          </p>
        </div>

        {/* Monumental Headline */}
        <div className="space-y-4 max-w-5xl mx-auto">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.95] text-white">
            O FUTURO DOS NEGÓCIOS
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8D21C] via-white to-[#65A6F4]">
              NÃO SE ESPERA. CONSTRÓI-SE AQUI.
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-medium">
            No dia <strong>27 de novembro de 2026</strong>, às <strong>08h30</strong>, na <strong>Mediateca Zé Dú — Cazenga</strong>, empreendedores, empresários, líderes e especialistas encontram-se para viver uma experiência de alto impacto.
          </p>

          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Participe com <strong className="text-white">Dress code: Vestir Azul</strong> e receba o laço simbólico oficial do evento.
            <br />
            <span className="text-[#F8D21C] font-semibold">Mais de 15 oradores confirmados · Painéis Temáticos de Alto Nível · Mostra de Negócios & Exposição.</span>
          </p>
        </div>

        {/* COUNTDOWN TIMER COMPONENT (November 27, 2026) */}
        <div className="py-2">
          <CountdownTimer targetDateStr="2026-11-27T08:00:00+01:00" variant="hero" />
        </div>

        {/* Primary Action Buttons (Royal Blue, Electric Blue and Gold styling) */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onOpenRegister}
            className="px-8 py-4 text-sm font-black uppercase tracking-wider text-[#032877] rounded-xl bg-[#F8D21C] hover:bg-amber-300 shadow-2xl shadow-[#0152D9]/40 transition-all hover:scale-105 active:scale-95 flex items-center space-x-2.5 cursor-pointer border-2 border-white"
          >
            <span>QUERO PARTICIPAR</span>
            <ArrowRight className="w-4 h-4 ml-1 text-[#032877]" />
          </button>

          {/* Quero Ser Expositor: Abre formulário oficial de expositor */}
          <button
            onClick={onOpenStandBooking}
            className="px-7 py-4 text-sm font-black uppercase tracking-wider text-white rounded-xl bg-[#0173EF] hover:bg-[#0152D9] border-2 border-white/70 transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
          >
            <Store className="w-4 h-4 text-[#F8D21C]" />
            <span>QUERO SER EXPOSITOR (25.000 Kz)</span>
          </button>
        </div>

        {/* Operational Notice / Capacity badge */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-blue-200">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white font-medium">Entrada Gratuita disponível na Conferência</span>
          </span>
          <span className="text-blue-300">·</span>
          <span className="text-[#F8D21C] font-semibold">
            Pacotes Café Experience com Certificado Digital Oficial
          </span>
        </div>
      </div>

      {/* Bottom Horizontal Quick Info Bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 rounded-3xl bg-[#021B54]/95 border-2 border-[#0173EF]/40 backdrop-blur-xl shadow-2xl">
          <div className="flex items-start space-x-3 p-2 border-r border-[#0173EF]/30 last:border-none">
            <div className="p-2.5 rounded-xl bg-[#0173EF]/20 border border-[#65A6F4]/40 text-[#65A6F4] shrink-0">
              <Calendar className="w-5 h-5 text-[#F8D21C]" />
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Data do Evento</p>
              <p className="text-xs sm:text-sm font-black text-white">27 Novembro 2026</p>
              <p className="text-[10px] text-[#F8D21C] font-mono">Sexta-feira</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border-r border-[#0173EF]/30 last:border-none">
            <div className="p-2.5 rounded-xl bg-[#0173EF]/20 border border-[#65A6F4]/40 text-[#65A6F4] shrink-0">
              <Clock className="w-5 h-5 text-[#65A6F4]" />
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Horário de Início</p>
              <p className="text-xs sm:text-sm font-black text-white">08h30 Pontual</p>
              <p className="text-[10px] text-blue-200 font-mono">Credenciamento às 07h30</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2 border-r border-[#0173EF]/30 last:border-none">
            <div className="p-2.5 rounded-xl bg-[#0173EF]/20 border border-[#65A6F4]/40 text-[#65A6F4] shrink-0">
              <MapPin className="w-5 h-5 text-[#F8D21C]" />
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Local do Evento</p>
              <p className="text-xs sm:text-sm font-black text-white">Mediateca Zé Dú</p>
              <p className="text-[10px] text-blue-200 truncate max-w-[130px]">Cazenga, Luanda</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2">
            <div className="p-2.5 rounded-xl bg-[#0173EF]/20 border border-[#65A6F4]/40 text-blue-300 shrink-0">
              <span className="text-xl leading-none">🎗️</span>
            </div>
            <div>
              <p className="text-[11px] text-blue-200 font-semibold uppercase tracking-wider">Dress Code</p>
              <p className="text-xs sm:text-sm font-black text-[#F8D21C]">Azul · Laço Azul</p>
              <p className="text-[10px] text-blue-100">Vestir Azul Obrigatório</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
