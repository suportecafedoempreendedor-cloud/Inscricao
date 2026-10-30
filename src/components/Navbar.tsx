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
  MapPin,
  Mic,
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
    { id: 'inscricoes', label: 'Inscrições & Pagamento', icon: Ticket },
    { id: 'oradores', label: 'Oradores', icon: Mic },
    { id: 'localizacao', label: 'Localização', icon: MapPin },
    { id: 'sobre', label: 'Sobre', icon: Layers },
    { id: 'conferencia', label: 'Conferência', icon: Briefcase },
    { id: 'agenda', label: 'Agenda', icon: Calendar },
    { id: 'certificados', label: 'Certificados', icon: Award },
    { id: 'expositores', label: 'Expositores', icon: Layers },
    { id: 'contactos', label: 'Contactos', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#032877]/95 backdrop-blur-md border-b border-[#0173EF]/30 transition-all text-white shadow-lg">
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
                      ? 'text-[#F8D21C] border-b-2 border-[#F8D21C]'
                      : 'text-blue-100 hover:text-white hover:border-b-2 hover:border-[#65A6F4]'
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
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-blue-100 hover:text-white border border-[#0173EF]/40 hover:bg-[#0152D9]/40 rounded-lg transition-colors cursor-pointer"
              title="Validação Pública de Certificados"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F8D21C]" />
              <span>Validar Certificado</span>
            </button>

            <button
              onClick={onOpenLookupTicket}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-blue-100 hover:text-white border border-[#0173EF]/40 hover:bg-[#0152D9]/40 rounded-lg transition-colors cursor-pointer"
              title="Consultar o seu ingresso com código"
            >
              <Search className="w-3.5 h-3.5 text-[#65A6F4]" />
              <span>Consultar Ingresso</span>
            </button>

            {onOpenStaffPortal && (
              <button
                onClick={onOpenStaffPortal}
                className="flex items-center space-x-1 px-2.5 py-2 text-xs font-semibold text-white bg-[#0173EF]/30 hover:bg-[#0173EF]/50 border border-[#65A6F4]/60 rounded-lg transition-colors cursor-pointer"
                title="Portaria & Controlo de Entradas no Dia do Evento"
              >
                <QrCode className="w-3.5 h-3.5 text-[#F8D21C]" />
                <span>Portaria</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 px-2.5 py-2 text-xs font-medium text-blue-100 hover:text-white border border-[#0173EF]/40 hover:bg-[#0152D9]/40 rounded-lg transition-colors cursor-pointer"
              title="Área Administrativa e Validação de Check-In"
            >
              <Shield className="w-3.5 h-3.5 text-[#F8D21C]" />
              <span>Gestão</span>
            </button>

            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider text-[#032877] rounded-lg bg-[#F8D21C] hover:bg-amber-300 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] border border-white cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-[#032877]" />
              <span>Fazer Inscrição</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={onOpenRegister}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-black uppercase text-[#032877] rounded-lg bg-[#F8D21C] cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Inscrição</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-blue-200 hover:text-white focus:outline-none cursor-pointer"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#021B54] border-b border-[#0173EF]/30 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="flex items-center space-x-2 px-3 py-2 text-left text-xs font-medium text-blue-100 hover:bg-[#0152D9]/40 rounded-md"
              >
                <item.icon className="w-3.5 h-3.5 text-[#F8D21C]" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#0173EF]/30 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRegister();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 text-xs font-black uppercase tracking-wider text-[#032877] rounded-lg bg-[#F8D21C] shadow"
            >
              <Ticket className="w-4 h-4 text-[#032877]" />
              <span>Fazer Inscrição no Evento</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLookupTicket();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-blue-100 border border-[#0173EF]/40 rounded-lg hover:bg-[#0152D9]/40"
              >
                <Search className="w-3.5 h-3.5 text-[#65A6F4]" />
                <span>Consultar Ingresso</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenVerifyModal();
                }}
                className="flex items-center justify-center space-x-1.5 py-2 text-xs font-semibold text-blue-100 border border-[#0173EF]/40 rounded-lg hover:bg-[#0152D9]/40"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#F8D21C]" />
                <span>Validar Certificado</span>
              </button>
            </div>

            {onOpenStaffPortal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStaffPortal();
                }}
                className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-bold text-white bg-[#0173EF]/30 border border-[#65A6F4]/60 rounded-lg hover:bg-[#0173EF]/50"
              >
                <QrCode className="w-3.5 h-3.5 text-[#F8D21C]" />
                <span>Portaria & Validação de Ingressos (Check-in)</span>
              </button>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-blue-200 border border-[#0173EF]/30 rounded-lg hover:bg-[#0152D9]/30"
            >
              <Shield className="w-3.5 h-3.5 text-[#F8D21C]" />
              <span>Painel Administrativo & Gestão</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
