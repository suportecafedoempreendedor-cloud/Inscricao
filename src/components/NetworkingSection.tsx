import React, { useState } from 'react';
import { NetworkingContact } from '../types';
import { Users, Search, MessageSquare, Briefcase, PlusCircle, CheckCircle, Mail, Phone } from 'lucide-react';

interface NetworkingSectionProps {
  contacts: NetworkingContact[];
  onAddContact: (contact: Omit<NetworkingContact, 'id'>) => void;
}

export const NetworkingSection: React.FC<NetworkingSectionProps> = ({
  contacts,
  onAddContact,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('todos');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinForm, setJoinForm] = useState({
    name: '',
    role: '',
    company: '',
    sector: '',
    bio: '',
    interests: '',
    seeking: '',
    email: '',
    phone: '',
    whatsapp: '',
    consent: false,
  });

  const allInterests = [
    'todos',
    'Parcerias B2B',
    'Estratégia Digital',
    'Distribuição',
    'Logística',
    'Tecnologia',
    'Investimento',
  ];

  const filtered = contacts.filter((c) => {
    if (selectedInterest !== 'todos' && !c.interests.some((i) => i.toLowerCase().includes(selectedInterest.toLowerCase()))) {
      return false;
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCompany = c.company.toLowerCase().includes(q);
      const matchRole = c.role.toLowerCase().includes(q);
      const matchBio = c.bio.toLowerCase().includes(q);
      return matchName || matchCompany || matchRole || matchBio;
    }
    return true;
  });

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinForm.consent) return;

    onAddContact({
      name: joinForm.name,
      role: joinForm.role,
      company: joinForm.company,
      sector: joinForm.sector || 'Negócios Gerais',
      bio: joinForm.bio,
      interests: joinForm.interests.split(',').map((s) => s.trim()).filter(Boolean),
      seeking: joinForm.seeking,
      email: joinForm.email,
      phone: joinForm.phone,
      whatsapp: joinForm.whatsapp,
    });

    setShowJoinModal(false);
    setJoinForm({
      name: '',
      role: '',
      company: '',
      sector: '',
      bio: '',
      interests: '',
      seeking: '',
      email: '',
      phone: '',
      whatsapp: '',
      consent: false,
    });
  };

  return (
    <section id="networking" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider">
              Conexões Estratégicas
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Directório de Networking Empresarial
            </h2>
            <p className="text-sm text-zinc-400 mt-1 max-w-xl">
              Conecte-se previamente com participantes e empresários confirmados da 79.ª Edição. Troque contactos e agende encontros no evento.
            </p>
          </div>

          <button
            onClick={() => setShowJoinModal(true)}
            className="self-start md:self-end px-5 py-3 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-[#9F1239] to-[#BE123C] hover:opacity-90 shadow-lg shadow-rose-950/40 transition-all flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4 text-amber-300" />
            <span>Publicar Meu Perfil no Directório</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {allInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => setSelectedInterest(interest)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedInterest === interest
                    ? 'bg-[#BE123C] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {interest === 'todos' ? 'Todos os Interesses' : interest}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar por nome ou empresa..."
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
            />
          </div>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((contact) => (
            <div
              key={contact.id}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between space-y-4 hover:shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-900 to-zinc-900 border border-purple-800/40 text-amber-400 font-bold flex items-center justify-center text-lg">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">{contact.name}</h3>
                    <p className="text-xs text-zinc-400">
                      {contact.role} · <strong className="text-zinc-300">{contact.company}</strong>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{contact.bio}</p>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                  <p className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">Objectivo no Evento:</p>
                  <p className="text-xs text-zinc-300">{contact.seeking}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {contact.interests.map((int, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-zinc-800/80 text-[11px] text-zinc-300 border border-zinc-700/60"
                    >
                      {int}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500 font-mono">Verificado 79.ª Edição</span>

                <div className="flex items-center space-x-2">
                  {contact.whatsapp && (
                    <a
                      href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(
                        contact.name
                      )},%20vi%20o%20seu%20perfil%20no%20Café%20do%20Empreendedor%2079ª%20Edição.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-600 rounded-lg flex items-center space-x-1 transition-colors"
                      title="Conectar no WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  )}

                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}?subject=Contacto%20Networking%20-%20Café%20do%20Empreendedor`}
                      className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
                      title="Enviar Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Join Networking Directory */}
        {showJoinModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-start justify-between pb-3 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white">Publicar Perfil de Networking</h3>
                  <p className="text-xs text-zinc-400">Torne a sua participação visível aos outros empreendedores do evento.</p>
                </div>
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="text-zinc-400 hover:text-white font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleJoinSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu Nome Completo"
                    value={joinForm.name}
                    onChange={(e) => setJoinForm({ ...joinForm, name: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Empresa / Negócio"
                    value={joinForm.company}
                    onChange={(e) => setJoinForm({ ...joinForm, company: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Cargo / Função"
                    value={joinForm.role}
                    onChange={(e) => setJoinForm({ ...joinForm, role: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Sector de Actividade"
                    value={joinForm.sector}
                    onChange={(e) => setJoinForm({ ...joinForm, sector: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <textarea
                  required
                  rows={2}
                  placeholder="Breve resumo profissional (Quem é e o que a sua empresa faz)..."
                  value={joinForm.bio}
                  onChange={(e) => setJoinForm({ ...joinForm, bio: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />

                <input
                  type="text"
                  required
                  placeholder="Objectivo (Ex: Procurar distribuidores, investidores ou parceiros B2B)..."
                  value={joinForm.seeking}
                  onChange={(e) => setJoinForm({ ...joinForm, seeking: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />

                <input
                  type="text"
                  placeholder="Interesses separados por vírgula (Ex: Parcerias B2B, Vendas, Expansão)"
                  value={joinForm.interests}
                  onChange={(e) => setJoinForm({ ...joinForm, interests: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Email Comercial"
                    value={joinForm.email}
                    onChange={(e) => setJoinForm({ ...joinForm, email: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="WhatsApp (+244 9...)"
                    value={joinForm.whatsapp}
                    onChange={(e) => setJoinForm({ ...joinForm, whatsapp: e.target.value })}
                    className="bg-zinc-950 border border-zinc-700 rounded-lg p-2.5 text-white"
                  />
                </div>

                <label className="flex items-start space-x-2 pt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={joinForm.consent}
                    onChange={(e) => setJoinForm({ ...joinForm, consent: e.target.checked })}
                    className="mt-0.5 rounded border-zinc-700 text-[#BE123C] focus:ring-0"
                  />
                  <span className="text-[11px] text-zinc-400">
                    Autorizo a exibição do meu nome, empresa e contacto WhatsApp no directório oficial da 79.ª Edição para fins estritos de networking empresarial.
                  </span>
                </label>

                <div className="pt-3 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowJoinModal(false)}
                    className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 font-bold text-white bg-[#BE123C] hover:bg-rose-600 rounded-lg"
                  >
                    Publicar Perfil
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
