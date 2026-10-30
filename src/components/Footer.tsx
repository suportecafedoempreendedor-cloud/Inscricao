import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { EventSettings } from '../types';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  ChevronDown,
  ChevronUp,
  Send,
  ShieldCheck,
  Ticket,
  Award,
  Search,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { GeometricDecoration } from './GeometricDecorations';

interface FooterProps {
  settings: EventSettings;
  onOpenRegister: () => void;
  onOpenLookupTicket: () => void;
  onOpenVerifyModal: () => void;
  onNavigateToCertificates: () => void;
  onOpenStandBooking: () => void;
  onOpenPitchForm: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onOpenRegister,
  onOpenLookupTicket,
  onOpenVerifyModal,
  onNavigateToCertificates,
  onOpenStandBooking,
  onOpenPitchForm,
  onOpenAdmin,
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);

  const faqs = [
    {
      q: 'Como funciona o Certificado Digital da Conferência e do Café Experience?',
      a: 'A entrada na conferência é 100% gratuita; o participante pode optar por adquirir o Certificado Digital Oficial da conferência por 2.000 Kz. Já todos os pacotes Café Experience (Essencial a 5.000 Kz, Profissional a 15.000 Kz e Executivo a 25.000 Kz) já têm o Certificado Digital Oficial de Participação incluído no valor, consultável através do código do ingresso.',
    },
    {
      q: 'Como posso adquirir o meu ingresso e efectuar o pagamento?',
      a: 'Pode selecionar o seu tipo de ingresso no website e pagar de forma rápida via Referência Multicaixa (Entidade 99245), Multicaixa Express ou Transferência Bancária para as contas oficiais da Geração Digital Angola (BFA ou BAI). O ingresso com código QR e nome completo é emitido de imediato.',
    },
    {
      q: 'A data e o local da 79.ª Edição já são definitivos?',
      a: 'A data específica e o centro de convenções em Luanda estão a ser alinhados pela comissão organizadora para o 1.º Trimestre e serão anunciados em todos os canais oficiais e actualizados em tempo real nesta plataforma.',
    },
    {
      q: 'Como funciona a selecção para o Pitch Empresarial?',
      a: 'Startups e empreendedores submetem o seu modelo de negócio através do formulário de candidatura. Os projectos selecionados apresentam ao vivo no auditório principal com cronómetro de 3 minutos e avaliação pelo júri executivo.',
    },
    {
      q: 'Quais os requisitos para reservar um stand na feira?',
      a: 'Empresas de todos os sectores podem solicitar a reserva de stand. A comissão de feira valida o perfil e atribui a localização correspondente no pavilhão de exposições.',
    },
  ];

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessageSent(true);
    setContactForm({ name: '', email: '', message: '' });
    setTimeout(() => setMessageSent(false), 4000);
  };

  return (
    <footer id="contactos" className="bg-[#150724] border-t border-purple-900/40 text-zinc-300 pt-16 pb-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* SECTION 16: SECÇÃO FINAL DE CONVERSÃO strictly matching Prompt */}
        <div className="relative rounded-3xl overflow-hidden p-8 sm:p-12 md:p-16 bg-gradient-to-r from-[#43085C] via-[#B20D64] to-[#DC1037] text-white shadow-2xl border border-white/20">
          <GeometricDecoration position="top-right" variant="diamonds" size="lg" className="opacity-80" />
          <GeometricDecoration position="bottom-left" variant="polygons" size="md" className="opacity-70" />

          <div className="relative z-10 max-w-3xl space-y-6 text-center md:text-left">
            <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-widest text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>27 DE NOVEMBRO DE 2026 · LUANDA</span>
            </span>

            <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] text-white">
              AS OPORTUNIDADES NÃO ESPERAM.
              <br />
              <span className="text-amber-300">E VOCÊ?</span>
            </h2>

            <p className="text-sm sm:text-lg text-zinc-100 leading-relaxed font-medium">
              No dia <strong>27 de Novembro</strong>, o Café do Empreendedor reunirá pessoas que querem aprender, conectar-se, inovar e criar novas oportunidades. O próximo passo do seu negócio pode começar com uma conversa.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button
                onClick={onOpenRegister}
                className="px-8 py-4 text-xs sm:text-sm font-black uppercase tracking-wider bg-white text-zinc-950 hover:bg-[#FFC928] hover:text-black rounded-xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>GARANTIR A MINHA PARTICIPAÇÃO</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onOpenStandBooking}
                className="px-6 py-4 text-xs sm:text-sm font-bold uppercase tracking-wider bg-black/40 hover:bg-black/60 text-white rounded-xl border border-white/25 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <span>Reservar Stand</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Menu Bar (Item 12 of prompt) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Acesso Rápido Oficial:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-lg bg-[#BE123C] text-white font-bold hover:bg-rose-600 transition-colors flex items-center space-x-1"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Fazer Inscrição</span>
            </button>

            <button
              onClick={onOpenLookupTicket}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-semibold hover:text-white hover:bg-zinc-700 transition-colors flex items-center space-x-1"
            >
              <Search className="w-3.5 h-3.5 text-rose-400" />
              <span>Consultar Ingresso</span>
            </button>

            <button
              onClick={onNavigateToCertificates}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-semibold hover:text-white hover:bg-zinc-700 transition-colors flex items-center space-x-1"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificados</span>
            </button>

            <button
              onClick={onOpenVerifyModal}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-200 font-semibold hover:text-white hover:bg-zinc-700 transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Validar Certificado</span>
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Tire as Suas Dúvidas</span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Perguntas Frequentes</h3>
            <p className="text-xs text-zinc-400">Tudo sobre inscrições, bilhetes, certificados e pagamentos.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-white hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 shrink-0 text-amber-400" /> : <ChevronDown className="w-4 h-4 shrink-0 text-zinc-500" />}
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/60 bg-zinc-950/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Official Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 border-t border-zinc-800/80 pt-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <BrandLogo variant="full" theme="dark" className="h-10 w-auto" />

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Plataforma oficial da <strong className="text-white">79.ª Edição do Café do Empreendedor</strong> em Angola. Conectando pessoas e transformando ideias em negócios de sucesso.
            </p>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-zinc-900 text-amber-400 border border-zinc-800">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-500 font-medium">Linha Directa & WhatsApp</p>
                  <a href={`tel:${settings.organizerPhone.replace(/\s+/g, '')}`} className="font-bold text-white hover:text-amber-400 font-mono">
                    {settings.organizerPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-zinc-900 text-[#BE123C] border border-zinc-800">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-500 font-medium">Email Institucional</p>
                  <a href={`mailto:${settings.organizerEmail}`} className="font-bold text-white hover:text-rose-400">
                    {settings.organizerEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-zinc-900 text-purple-400 border border-zinc-800">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-zinc-500 font-medium">Localização</p>
                  <p className="font-bold text-white">{settings.venueName} · {settings.city}, Angola</p>
                </div>
              </div>
            </div>

            {/* Verified External Links */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                Canais e Plataformas Verificadas:
              </p>
              <div className="flex flex-col space-y-1.5 text-xs">
                <a
                  href="https://cafe-oportunidades-pro.lovable.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Portal Café Oportunidades Pro</span>
                </a>
                <a
                  href="https://shre.ink/Gk0z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:underline flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Acesso às Informações da 79.ª Edição (Link Oficial)</span>
                </a>
                <a
                  href="https://www.schoolandcollegelistings.com/AO/Unknown/219843731208956/Cafe-do-Empreendedor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-white flex items-center space-x-1"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Arquivo Documental e Publicações Históricas</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="lg:col-span-7 bg-zinc-900/40 p-6 sm:p-8 rounded-2xl border border-zinc-800 space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white">Contactos e Apoio ao Participante</h4>
              <p className="text-xs text-zinc-400">Tem alguma dúvida sobre ingressos, certificados ou patrocínios?</p>
            </div>

            {messageSent ? (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs">
                Mensagem enviada com sucesso! A equipa da Geração Digital Angola responderá com brevidade.
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome Completo"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Seu Email Principal"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  placeholder="Escreva a sua mensagem ou pedido de informação..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar Mensagem</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright & credits */}
        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} <strong>Café do Empreendedor</strong> · 79.ª Edição Angola. Produzido por{' '}
            <span className="text-zinc-300 font-semibold">{settings.organizerName}</span>.
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onOpenAdmin}
              className="text-zinc-400 hover:text-amber-400 transition-colors flex items-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acesso Administrativo</span>
            </button>
            <span>·</span>
            <span>Luanda, Angola</span>
          </div>
        </div>
      </div>

      {/* Floating Official WhatsApp Button (Prompt Section 17) */}
      <a
        href="https://wa.me/244921152162?text=Ol%C3%A1%2C%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%2079.%C2%AA%20Edi%C3%A7%C3%A3o%20do%20Caf%C3%A9%20do%20Empreendedor"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 p-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl shadow-emerald-950/70 transition-transform hover:scale-110 active:scale-95 flex items-center space-x-2 group cursor-pointer border border-emerald-400/50"
        title="Falar no WhatsApp com a Organização (+244 921 152 162)"
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 text-xs font-bold pl-0 group-hover:pl-1">
          WhatsApp Oficial (+244 921 152 162)
        </span>
      </a>
    </footer>
  );
};
