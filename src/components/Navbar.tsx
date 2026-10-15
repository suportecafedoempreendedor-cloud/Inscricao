import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import {
  Menu,
  X,
  Ticket,
  Shield,
  Calendar,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  Phone,
  Award,
  ShieldCheck,
  Search,
  QrCode,
} from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenAdmin: () => void;
  onOpenVerifyModal: () => void;
  onOpenLookupTicket: () => void;
  onOpenStaffPortal?: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegister,
  onOpenAdmin,
  onOpenVerifyModal,
  onOpenLookupTicket,
  onOpenStaffPortal,
  onNavigate,
  activeSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início', icon: Sparkles },
    { id: 'sobre', label: 'Sobre', icon: Layers },
    { id: 'conferencia', label: 'Conferência', icon: Briefcase },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'certificados', label: 'Certificados', icon: Award },
    { id: 'expositores', label: 'Expositores', icon: Layers },
    { id: 'pitch', label: 'Pitch Empresarial', icon: Sparkles },
    { id: 'estrategia', label: 'Sala de Estratégia', icon: Users },
    { id: 'networking', label: 'Networking', icon: Users },
    { id: 'contactos', label: 'Contactos', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B10]/95 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Official Logo */}
          <div
            onClick={() => handleNavClick('inicio')}
            className="cursor-pointer flex items-center space-x-3 group"
          >
            <BrandLogo variant="full" theme="dark" className="h-10 sm:h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? 'text-[#F59E0B] border-b-2 border-[#F59E0B]'
                      : 'text-zinc-300 hover:text-white hover:border-b-2 hover:border-zinc-500'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onOpenVerifyModal}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors"
              title="Validação Pública de Certificados"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Validar Certificado</span>
            </button>

            <button
              onClick={onOpenLookupTicket}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors"
              title="Consultar o seu ingresso com código"
            >
              <Search className="w-3.5 h-3.5 text-rose-400" />
              <span>Consultar Ingresso</span>
            </button>

            {onOpenStaffPortal && (
              <button
                onClick={onOpenStaffPortal}
                className="flex items-center space-x-1 px-2.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/40 border border-emerald-700/60 hover:border-emerald-500 rounded-lg transition-colors"
                title="Portaria & Controlo de Entradas no Dia do Evento"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portaria</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-lg transition-colors"
              title="Área Administrativa e Validação de Check-In"
            >
              <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Gestão</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-[#9F1239] via-[#BE123C] to-[#881337] hover:from-[#BE123C] hover:to-[#9F1239] shadow-md shadow-rose-950/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Fazer Inscrição</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold text-white rounded-lg bg-[#BE123C]"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Inscrição</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zinc-400 hover:text-white focus:outline-none"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0F18] border-b border-zinc-800 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center space-x-2 px-3 py-2 text-left text-xs font-medium text-zinc-200 hover:bg-zinc-800/60 rounded-md"
              >
                <item.icon className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-[#9F1239] to-[#BE123C]"
            >
              <Ticket className="w-4 h-4" />
              <span>Fazer Inscrição no Evento</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLookupTicket();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800"
              >
                <Search className="w-3.5 h-3.5 text-rose-400" />
                <span>Consultar Ingresso</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVerifyModal();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-zinc-300 border border-zinc-700 rounded-lg hover:bg-zinc-800"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Validar Certificado</span>
              </button>
            </div>

            {onOpenStaffPortal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaffPortal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-700/60 rounded-lg hover:bg-emerald-900/60"
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Portaria & Validação de Ingressos (Check-in)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-zinc-400 border border-zinc-800 rounded-lg hover:bg-zinc-800"
            >
              <Shield className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Painel Administrativo & Gestão</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
