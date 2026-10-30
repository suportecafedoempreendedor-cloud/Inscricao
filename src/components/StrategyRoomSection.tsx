import React, { useState } from 'react';
import { Mentor, StrategySessionBooking } from '../types';
import { Users, Calendar, Clock, CheckCircle2, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';

interface StrategyRoomSectionProps {
  mentors: Mentor[];
  onBookSession: (
    mentorId: string,
    slotTime: string,
    attendee: { name: string; email: string; phone: string; company: string; challenges: string }
  ) => void;
}

export const StrategyRoomSection: React.FC<StrategyRoomSectionProps> = ({
  mentors,
  onBookSession,
}) => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor>(mentors[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingFormData, setBookingFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    challenges: '',
  });
  const [successBooking, setSuccessBooking] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    onBookSession(selectedMentor.id, selectedSlot, bookingFormData);
    setSuccessBooking(
      `Sessão confirmada com ${selectedMentor.name} no horário ${selectedSlot}! A nossa equipa entrará em contacto para envio da confirmação.`
    );
    setSelectedSlot('');
    setBookingFormData({ name: '', email: '', phone: '', company: '', challenges: '' });
  };

  return (
    <section id="estrategia" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header strictly matching Section 12 */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest">
            SALA DE ESTRATÉGIA DE NEGÓCIOS
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            PARE DE APENAS PENSAR NO CRESCIMENTO.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#DC1037] to-[#B20D64]">
              COMECE A PLANEAR O PRÓXIMO PASSO.
            </span>
          </h2>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            A Sala de Estratégia de Negócios é o ambiente dedicado a empresários e empreendedores que procuram conhecimento aplicado, troca de experiências e perspectivas estratégicas para os seus desafios.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {[
              'Diagnóstico Empresarial',
              'Mentoria e Aconselhamento',
              'Estratégias Comerciais',
              'Gestão e Crescimento',
              'Networking Executivo',
            ].map((exp, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 border border-white/10 text-amber-300"
              >
                ✓ {exp}
              </span>
            ))}
          </div>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mentors.map((mentor) => {
            const isSelected = selectedMentor.id === mentor.id;
            return (
              <div
                key={mentor.id}
                onClick={() => {
                  setSelectedMentor(mentor);
                  setSelectedSlot('');
                  setSuccessBooking(null);
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-zinc-900 border-[#BE123C] shadow-lg shadow-rose-950/30 ring-1 ring-[#BE123C]'
                    : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-950 border border-purple-800 text-amber-400 flex items-center justify-center font-bold text-lg">
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{mentor.name}</h3>
                      <p className="text-xs text-amber-400 font-medium">{mentor.specialty}</p>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300">{mentor.role} · {mentor.organization}</p>
                  <p className="text-xs text-zinc-400 leading-relaxed">{mentor.bio}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-rose-400' : 'text-zinc-500'}>
                    {mentor.slots.filter((s) => !s.booked).length} Vagas Disponíveis
                  </span>
                  <span className={isSelected ? 'text-white' : 'text-zinc-400'}>
                    {isSelected ? 'Mentor Selecionado' : 'Selecionar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Booking Form for Selected Mentor */}
        <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Agendamento de Sessão</p>
              <h3 className="text-xl font-bold text-white mt-0.5">
                Reservar Horário com {selectedMentor.name} ({selectedMentor.specialty})
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 self-start sm:self-auto">
              Sessão Individual (30 min)
            </span>
          </div>

          {successBooking && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{successBooking}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Slot Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                1. Escolha o Horário Disponível:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {selectedMentor.slots.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.booked}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono font-semibold transition-all border ${
                      slot.booked
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-600 line-through cursor-not-allowed'
                        : selectedSlot === slot.time
                        ? 'bg-[#BE123C] border-rose-500 text-white shadow-md'
                        : 'bg-zinc-950 border-zinc-700 text-zinc-200 hover:border-zinc-500'
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-1 text-amber-400" />
                    {slot.time} {slot.booked ? '(Ocupado)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Attendee Data Form */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                2. Os Seus Dados de Contacto & Desafio de Negócio:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Seu Nome Completo"
                  value={bookingFormData.name}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, name: e.target.value })}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
                <input
                  type="email"
                  required
                  placeholder="Seu Email"
                  value={bookingFormData.email}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Telefone (+244)"
                  value={bookingFormData.phone}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, phone: e.target.value })}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
                <input
                  type="text"
                  required
                  placeholder="Empresa / Projecto"
                  value={bookingFormData.company}
                  onChange={(e) => setBookingFormData({ ...bookingFormData, company: e.target.value })}
                  className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
                />
              </div>

              <textarea
                required
                rows={2}
                placeholder="Qual é o principal desafio ou dúvida que deseja abordar com o mentor?"
                value={bookingFormData.challenges}
                onChange={(e) => setBookingFormData({ ...bookingFormData, challenges: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#BE123C]"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-zinc-400">
                Acesso gratuito para detentores de Passe VIP Executivo ou por ordem de inscrição prévia.
              </span>

              <button
                type="submit"
                disabled={!selectedSlot}
                className="px-6 py-2.5 text-xs font-bold text-white rounded-lg bg-[#BE123C] hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-1.5"
              >
                <span>Confirmar Reserva de Horário</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
