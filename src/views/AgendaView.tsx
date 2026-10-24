import React, { useState } from 'react';
import { BeautyService, Stylist, Appointment, CartItem } from '../types';
import { SALON_SERVICES, SALON_STYLISTS, INITIAL_APPOINTMENTS } from '../data/mockData';
import { Calendar, Clock, User, CheckCircle2, Sparkles, ChevronRight, AlertCircle, Phone, ArrowLeft, Filter, Plus } from 'lucide-react';

interface AgendaViewProps {
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
  initialService?: BeautyService | null;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  onAddToCart,
  onOpenCart,
  initialService = null
}) => {
  const [activeTab, setActiveTab] = useState<'booking' | 'appointments'>('booking');
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);

  // Booking Wizard Steps
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<BeautyService | null>(initialService || SALON_SERVICES[0]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(SALON_STYLISTS[0]);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-26');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('todos');
  const [clientNameInput, setClientNameInput] = useState('Helena Cavalcanti');
  const [clientPhoneInput, setClientPhoneInput] = useState('(11) 98765-4321');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableTimeSlots = [
    '09:00', '10:00', '11:30', '13:00', '14:00', '15:30', '17:00', '18:30'
  ];

  const filteredServices = categoryFilter === 'todos'
    ? SALON_SERVICES
    : SALON_SERVICES.filter(s => s.category === categoryFilter);

  const filteredAppointments = appointmentFilter === 'todos'
    ? appointments
    : appointments.filter(a => a.status === appointmentFilter);

  const handleConfirmBooking = () => {
    if (!selectedService || !selectedStylist) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: clientNameInput,
      clientPhone: clientPhoneInput,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
      date: selectedDate,
      time: selectedTime,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      status: 'confirmado',
      paymentMethod: 'No Salão / Sacola'
    };

    setAppointments([newAppointment, ...appointments]);
    setBookingSuccess(true);

    // Also offer adding to Cart drawer
    onAddToCart({
      type: 'service',
      id: newAppointment.id,
      title: selectedService.name,
      subtitle: `${selectedStylist.name} — ${selectedDate} às ${selectedTime}`,
      price: selectedService.price,
      quantity: 1,
      selectedStylistName: selectedStylist.name,
      selectedDate: selectedDate,
      selectedTime: selectedTime
    });
  };

  const handleResetBooking = () => {
    setBookingSuccess(false);
    setStep(1);
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Deseja realmente cancelar este agendamento?')) {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelado' } : a));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26242A] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">
            Sistema Integrado de Reservas
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold champagne-gradient-text">
            Agenda VIP Studio Royale
          </h1>
        </div>

        {/* Top Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#121214] border border-[#D4AF37]/30 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('booking');
              setBookingSuccess(false);
            }}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'booking'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Novo Agendamento</span>
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Minhas Reservas ({appointments.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: NOVO AGENDAMENTO (Wizard Flow) */}
      {activeTab === 'booking' && (
        <div className="space-y-6">
          {bookingSuccess ? (
            /* Booking Confirmation Card */
            <div className="p-8 rounded-3xl bg-[#121214] border border-[#D4AF37]/40 max-w-xl mx-auto text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold gold-gradient-text">
                Agendamento Concluído com Sucesso!
              </h2>
              <p className="text-xs text-[#E2D4B7]/80">
                Seu horário foi reservado em nossa agenda VIP. O item também foi adicionado à sua Sacola.
              </p>

              <div className="p-4 rounded-2xl bg-[#0B0B0C] border border-[#26242A] text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-[#26242A] pb-2 text-[#C5A059]">
                  <span>Serviço:</span>
                  <span className="text-[#FFF1C5] font-bold">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between border-b border-[#26242A] pb-2 text-[#C5A059]">
                  <span>Profissional:</span>
                  <span className="text-[#FFF1C5] font-bold">{selectedStylist?.name}</span>
                </div>
                <div className="flex justify-between text-[#C5A059]">
                  <span>Data & Horário:</span>
                  <span className="text-[#D4AF37] font-bold font-mono">
                    {selectedDate} às {selectedTime}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={onOpenCart}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
                >
                  Abrir Sacola & Efetuar Checkout
                </button>
                <button
                  onClick={handleResetBooking}
                  className="px-4 py-3 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF1C5]"
                >
                  Fazer Outro Agendamento
                </button>
              </div>
            </div>
          ) : (
            /* Wizard Steps Header */
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {[
                  { s: 1, label: '1. Serviço' },
                  { s: 2, label: '2. Profissional' },
                  { s: 3, label: '3. Data & Hora' },
                  { s: 4, label: '4. Confirmação' }
                ].map((st) => (
                  <button
                    key={st.s}
                    disabled={st.s > step}
                    onClick={() => setStep(st.s as any)}
                    className={`py-2 px-1 rounded-lg border font-bold transition-all ${
                      step === st.s
                        ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF1C5]'
                        : step > st.s
                        ? 'bg-[#18181B] border-emerald-500/40 text-emerald-400'
                        : 'bg-[#121214]/50 border-[#26242A] text-[#8E8A80]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* STEP 1: Selecionar Serviço */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="font-cinzel text-lg font-bold text-[#FFF1C5]">
                      Escolha o Serviço Desejado
                    </h3>
                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {['todos', 'cabelo', 'estetica', 'unhas', 'spa'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all ${
                            categoryFilter === cat
                              ? 'bg-[#D4AF37] text-[#0B0B0C] font-bold'
                              : 'bg-[#18181B] text-[#E2D4B7] hover:bg-[#222127]'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredServices.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                          selectedService?.id === service.id
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                            : 'bg-[#121214] border-[#26242A] hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37]">
                              {service.category}
                            </span>
                            <span className="text-xs font-mono text-[#C5A059]">
                              ⏱ {service.durationMinutes} min
                            </span>
                          </div>
                          <h4 className="font-cinzel font-bold text-base text-[#FFF1C5] mt-2">
                            {service.name}
                          </h4>
                          <p className="text-xs text-[#E2D4B7]/70 mt-1 line-clamp-2">
                            {service.description}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#26242A] flex items-center justify-between">
                          <span className="text-base font-bold font-mono gold-gradient-text">
                            R$ {service.price.toFixed(2)}
                          </span>
                          <span className={`text-xs font-bold ${selectedService?.id === service.id ? 'text-[#D4AF37]' : 'text-[#8E8A80]'}`}>
                            {selectedService?.id === service.id ? '✓ Selecionado' : 'Selecionar'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedService}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>Próximo Passo: Selecionar Profissional</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Selecionar Profissional */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="text-xs text-[#C5A059] hover:text-[#FFF1C5] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar para serviços
                    </button>
                    <h3 className="font-cinzel text-lg font-bold text-[#FFF1C5]">
                      Escolha o Profissional
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {SALON_STYLISTS.map((stylist) => (
                      <div
                        key={stylist.id}
                        onClick={() => setSelectedStylist(stylist)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer text-center space-y-3 ${
                          selectedStylist?.id === stylist.id
                            ? 'bg-[#D4AF37]/15 border-[#D4AF37] shadow-lg'
                            : 'bg-[#121214] border-[#26242A] hover:border-[#D4AF37]/40'
                        }`}
                      >
                        <img
                          src={stylist.avatar}
                          alt={stylist.name}
                          className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-[#D4AF37]/40"
                        />
                        <div>
                          <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">
                            {stylist.name}
                          </h4>
                          <p className="text-[11px] text-[#D4AF37] font-medium">
                            {stylist.role}
                          </p>
                        </div>
                        <span className={`inline-block text-xs font-bold ${selectedStylist?.id === stylist.id ? 'text-[#D4AF37]' : 'text-[#8E8A80]'}`}>
                          {selectedStylist?.id === stylist.id ? '✓ Selecionado' : 'Escolher'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-bold text-[#E2D4B7]"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!selectedStylist}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg flex items-center gap-2 disabled:opacity-50"
                    >
                      <span>Próximo Passo: Data & Horário</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Data & Horário */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setStep(2)}
                      className="text-xs text-[#C5A059] hover:text-[#FFF1C5] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-4 h-4" /> Voltar para profissional
                    </button>
                    <h3 className="font-cinzel text-lg font-bold text-[#FFF1C5]">
                      Data e Horário
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121214] p-6 rounded-2xl border border-[#D4AF37]/30">
                    <div>
                      <label className="block text-xs font-bold text-[#C5A059] mb-2">
                        Selecione a Data
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-3 text-xs text-[#FFF1C5] focus:border-[#D4AF37] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#C5A059] mb-2">
                        Horários Disponíveis (Turnos VIP)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                              selectedTime === time
                                ? 'bg-[#D4AF37] text-[#0B0B0C] border-[#D4AF37]'
                                : 'bg-[#0B0B0C] border-[#26242A] text-[#E2D4B7] hover:border-[#D4AF37]/40'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-bold text-[#E2D4B7]"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={() => setStep(4)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg flex items-center gap-2"
                    >
                      <span>Revisar & Confirmar</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Confirmação */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in max-w-2xl mx-auto">
                  <h3 className="font-cinzel text-lg font-bold text-center gold-gradient-text">
                    Resumo do Agendamento Royale
                  </h3>

                  <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/40 space-y-4">
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between border-b border-[#26242A] pb-2">
                        <span className="text-[#C5A059]">Serviço</span>
                        <span className="font-bold text-[#FFF1C5]">{selectedService?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#26242A] pb-2">
                        <span className="text-[#C5A059]">Profissional</span>
                        <span className="font-bold text-[#FFF1C5]">{selectedStylist?.name}</span>
                      </div>
                      <div className="flex justify-between border-b border-[#26242A] pb-2">
                        <span className="text-[#C5A059]">Data & Hora</span>
                        <span className="font-mono font-bold text-[#D4AF37]">
                          {selectedDate} às {selectedTime}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-[#26242A] pb-2">
                        <span className="text-[#C5A059]">Duração estimada</span>
                        <span className="font-mono text-[#E2D4B7]">{selectedService?.durationMinutes} minutos</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold pt-2">
                        <span className="text-[#FFF1C5]">Valor Total</span>
                        <span className="font-mono gold-gradient-text text-base">
                          R$ {selectedService?.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-[#C5A059]">
                        Nome da Cliente
                      </label>
                      <input
                        type="text"
                        value={clientNameInput}
                        onChange={(e) => setClientNameInput(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-xs text-[#FFF1C5] outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-bold text-[#E2D4B7]"
                    >
                      Anterior
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg uppercase tracking-wider"
                    >
                      Confirmar Reserva VIP
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MINHAS RESERVAS */}
      {activeTab === 'appointments' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Status Filters */}
          <div className="flex items-center justify-between gap-4 bg-[#121214] p-4 rounded-2xl border border-[#26242A]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#FFF1C5]">Filtrar Status:</span>
            </div>
            <div className="flex gap-2">
              {['todos', 'confirmado', 'em_andamento', 'concluido', 'cancelado'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppointmentFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                    appointmentFilter === st
                      ? 'bg-[#D4AF37] text-[#0B0B0C]'
                      : 'bg-[#18181B] text-[#C5A059] hover:bg-[#222127]'
                  }`}
                >
                  {st.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-[#C5A059] block">
                      {apt.id}
                    </span>
                    <h4 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                      {apt.serviceName}
                    </h4>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      apt.status === 'confirmado'
                        ? 'bg-blue-950 text-blue-300 border border-blue-800'
                        : apt.status === 'em_andamento'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        : apt.status === 'concluido'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-red-950 text-red-300 border border-red-800'
                    }`}
                  >
                    {apt.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#E2D4B7]/80">
                  <div>
                    <span className="text-[#8E8A80] block text-[10px]">Cliente</span>
                    <span className="font-semibold text-[#FFF1C5]">{apt.clientName}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8A80] block text-[10px]">Profissional</span>
                    <span className="font-semibold text-[#FFF1C5]">{apt.stylistName}</span>
                  </div>
                  <div>
                    <span className="text-[#8E8A80] block text-[10px]">Data & Horário</span>
                    <span className="font-mono font-bold text-[#D4AF37]">
                      {apt.date} às {apt.time}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8E8A80] block text-[10px]">Valor</span>
                    <span className="font-mono font-bold gold-gradient-text">
                      R$ {apt.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {apt.status === 'confirmado' && (
                  <div className="pt-2 flex justify-end gap-2 border-t border-[#26242A]">
                    <button
                      onClick={() => handleCancelAppointment(apt.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-800/40"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => alert(`Reagendamento solicitado para ${apt.id}. O Concierge entrará em contato.`)}
                      className="px-3 py-1.5 rounded-lg bg-[#222127] hover:bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30"
                    >
                      Reagendar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
