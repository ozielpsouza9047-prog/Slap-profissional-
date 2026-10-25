import React, { useState } from 'react';
import { BeautyService, Stylist, Appointment, CartItem, VIPClient } from '../types';
import { SALON_SERVICES, SALON_STYLISTS, INITIAL_APPOINTMENTS } from '../data/mockData';
import { 
  Calendar as CalendarIcon, Clock, User, CheckCircle2, Sparkles, ChevronRight, 
  ChevronLeft, ArrowLeft, Filter, Plus, Search, Edit3, Trash2, X, RefreshCw, AlertCircle, Phone
} from 'lucide-react';

interface AgendaViewProps {
  appointments: Appointment[];
  onAddAppointment: (newApt: Appointment) => void;
  onUpdateAppointment: (updatedApt: Appointment) => void;
  onCancelAppointment: (id: string) => void;
  onAddToCart: (item: CartItem) => void;
  onOpenCart: () => void;
  initialService?: BeautyService | null;
  clients?: VIPClient[];
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onCancelAppointment,
  onAddToCart,
  onOpenCart,
  initialService = null,
  clients = []
}) => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'booking' | 'list'>('calendar');

  // Interactive Calendar Date State (default to Oct 2026)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>('2026-10-25');
  const [calendarMonth, setCalendarMonth] = useState<number>(9); // 0-indexed: 9 = October
  const [calendarYear, setCalendarYear] = useState<number>(2026);

  // Filters for Schedule & List
  const [stylistFilter, setStylistFilter] = useState<string>('todos');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Booking Wizard States
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedService, setSelectedService] = useState<BeautyService | null>(initialService || SALON_SERVICES[0]);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(SALON_STYLISTS[0]);
  const [bookingDate, setBookingDate] = useState<string>('2026-10-26');
  const [bookingTime, setBookingTime] = useState<string>('14:00');
  const [categoryFilter, setCategoryFilter] = useState<string>('todos');
  const [clientNameInput, setClientNameInput] = useState('Helena Cavalcanti');
  const [clientPhoneInput, setClientPhoneInput] = useState('(11) 98765-4321');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Reschedule Modal States
  const [reschedulingApt, setReschedulingApt] = useState<Appointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<string>('');
  const [rescheduleTime, setRescheduleTime] = useState<string>('15:00');

  const availableTimeSlots = [
    '08:30', '09:30', '10:30', '11:30', '13:30', '14:30', '16:00', '17:30', '18:30'
  ];

  // Calendar Helpers
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const formatDateStr = (year: number, month: number, day: number) => {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Filtered Appointments for Calendar & List
  const filteredAppointments = appointments.filter(a => {
    const matchStylist = stylistFilter === 'todos' || a.stylistId === stylistFilter;
    const matchStatus = statusFilter === 'todos' || a.status === statusFilter;
    const matchSearch = a.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        a.stylistName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStylist && matchStatus && matchSearch;
  });

  const calendarDayAppointments = filteredAppointments.filter(a => a.date === selectedCalendarDate);

  // Confirm New Booking
  const handleConfirmBooking = () => {
    if (!selectedService || !selectedStylist) return;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: clientNameInput || 'Cliente VIP',
      clientPhone: clientPhoneInput || '(11) 99999-8888',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      stylistId: selectedStylist.id,
      stylistName: selectedStylist.name,
      date: bookingDate,
      time: bookingTime,
      durationMinutes: selectedService.durationMinutes,
      price: selectedService.price,
      status: 'confirmado',
      paymentMethod: 'No Salão / Sacola'
    };

    onAddAppointment(newAppointment);
    setBookingSuccess(true);

    // Also add to cart
    onAddToCart({
      type: 'service',
      id: newAppointment.id,
      title: selectedService.name,
      subtitle: `${selectedStylist.name} — ${bookingDate} às ${bookingTime}`,
      price: selectedService.price,
      quantity: 1,
      selectedStylistName: selectedStylist.name,
      selectedDate: bookingDate,
      selectedTime: bookingTime
    });
  };

  // Reschedule Save
  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingApt || !rescheduleDate || !rescheduleTime) return;

    const updated: Appointment = {
      ...reschedulingApt,
      date: rescheduleDate,
      time: rescheduleTime,
      status: 'confirmado'
    };

    onUpdateAppointment(updated);
    setReschedulingApt(null);
  };

  const filteredServices = categoryFilter === 'todos'
    ? SALON_SERVICES
    : SALON_SERVICES.filter(s => s.category === categoryFilter);

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

        {/* View Mode Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#121214] border border-[#D4AF37]/30 rounded-xl">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'calendar'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendário</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('booking');
              setBookingSuccess(false);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'booking'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Agendar VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('list')}
            className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Lista ({appointments.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: VISUALIZAÇÃO EM CALENDÁRIO */}
      {activeTab === 'calendar' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Stylist & Search Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#121214] p-4 rounded-2xl border border-[#D4AF37]/30">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[#C5A059]" />
              <span className="text-xs font-bold text-[#FFF1C5]">Profissional:</span>
              <select
                value={stylistFilter}
                onChange={(e) => setStylistFilter(e.target.value)}
                className="bg-[#0B0B0C] border border-[#26242A] rounded-xl px-3 py-1.5 text-xs text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
              >
                <option value="todos">Todos os Profissionais</option>
                {SALON_STYLISTS.map(st => (
                  <option key={st.id} value={st.id}>{st.name}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-[#8E8A80] absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar cliente, serviço..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#FFF1C5] placeholder-[#8E8A80] outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Calendar Grid Box */}
            <div className="lg:col-span-2 bg-[#121214] p-6 rounded-3xl border border-[#D4AF37]/30 space-y-4">
              
              {/* Month Header */}
              <div className="flex items-center justify-between border-b border-[#26242A] pb-4">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-[#D4AF37] hover:border-[#D4AF37]"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <h3 className="font-cinzel text-lg font-bold gold-gradient-text uppercase tracking-wider">
                  {monthNames[calendarMonth]} {calendarYear}
                </h3>

                <button
                  onClick={handleNextMonth}
                  className="p-2 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-[#D4AF37] hover:border-[#D4AF37]"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Day Labels */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-[#C5A059] uppercase font-mono">
                <span>Dom</span>
                <span>Seg</span>
                <span>Ter</span>
                <span>Qua</span>
                <span>Qui</span>
                <span>Sex</span>
                <span>Sáb</span>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty cells before start of month */}
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-16 bg-transparent" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const dateStr = formatDateStr(calendarYear, calendarMonth, dayNum);
                  const isSelected = selectedCalendarDate === dateStr;

                  // Find appointments on this day
                  const dayApts = filteredAppointments.filter(a => a.date === dateStr && a.status !== 'cancelado');
                  const hasAppointments = dayApts.length > 0;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => setSelectedCalendarDate(dateStr)}
                      className={`h-16 p-1.5 rounded-xl border flex flex-col justify-between text-left transition-all relative ${
                        isSelected
                          ? 'bg-[#D4AF37]/20 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 scale-105 z-10'
                          : 'bg-[#0B0B0C] border-[#26242A] hover:border-[#D4AF37]/40'
                      }`}
                    >
                      <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#FFF1C5]' : 'text-[#E2D4B7]'}`}>
                        {dayNum}
                      </span>

                      {hasAppointments && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                          <span className="text-[10px] font-mono text-[#D4AF37] font-bold">
                            {dayApts.length} {dayApts.length === 1 ? 'agend.' : 'agend.'}
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Appointments Sidebar */}
            <div className="bg-[#121214] p-6 rounded-3xl border border-[#D4AF37]/30 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#C5A059] uppercase block">
                      Data Selecionada
                    </span>
                    <h3 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                      {selectedCalendarDate}
                    </h3>
                  </div>

                  <button
                    onClick={() => {
                      setBookingDate(selectedCalendarDate);
                      setActiveTab('booking');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-xs font-extrabold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Agendar Neste Dia</span>
                  </button>
                </div>

                <div className="space-y-3 pt-3 overflow-y-auto max-h-[380px]">
                  {calendarDayAppointments.length === 0 ? (
                    <div className="text-center py-12 text-[#E2D4B7]/60 space-y-2">
                      <CalendarIcon className="w-8 h-8 text-[#C5A059] mx-auto opacity-50" />
                      <p className="text-xs">Nenhum agendamento para esta data.</p>
                      <button
                        onClick={() => {
                          setBookingDate(selectedCalendarDate);
                          setActiveTab('booking');
                        }}
                        className="text-xs text-[#D4AF37] underline font-semibold"
                      >
                        Clique aqui para agendar
                      </button>
                    </div>
                  ) : (
                    calendarDayAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-xl bg-[#0B0B0C] border border-[#26242A] space-y-2 hover:border-[#D4AF37]/40 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold text-[#D4AF37]">
                            ⏱ {apt.time} ({apt.durationMinutes} min)
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            apt.status === 'confirmado' ? 'bg-blue-950 text-blue-300' :
                            apt.status === 'em_andamento' ? 'bg-amber-950 text-amber-300' :
                            apt.status === 'concluido' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                          }`}>
                            {apt.status}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">
                            {apt.clientName}
                          </h4>
                          <p className="text-xs text-[#E2D4B7]/80">
                            {apt.serviceName}
                          </p>
                          <p className="text-[11px] text-[#C5A059]">
                            Profissional: {apt.stylistName}
                          </p>
                        </div>

                        {/* Action Buttons: Remarcar & Cancelar */}
                        <div className="pt-2 border-t border-[#26242A] flex justify-end gap-2 text-xs">
                          {apt.status !== 'cancelado' && (
                            <>
                              <button
                                onClick={() => {
                                  setReschedulingApt(apt);
                                  setRescheduleDate(apt.date);
                                  setRescheduleTime(apt.time);
                                }}
                                className="px-2.5 py-1 rounded bg-[#222127] text-[#D4AF37] hover:bg-[#D4AF37]/20 font-semibold flex items-center gap-1"
                              >
                                <RefreshCw className="w-3 h-3" />
                                <span>Remarcar</span>
                              </button>

                              <button
                                onClick={() => onCancelAppointment(apt.id)}
                                className="px-2.5 py-1 rounded bg-red-950/50 text-red-300 hover:bg-red-900/80 font-semibold"
                              >
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: AGENDAR SERVIÇO (Wizard Flow) */}
      {activeTab === 'booking' && (
        <div className="space-y-6">
          {bookingSuccess ? (
            <div className="p-8 rounded-3xl bg-[#121214] border border-[#D4AF37]/40 max-w-xl mx-auto text-center space-y-4 animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="font-cinzel text-2xl font-bold gold-gradient-text">
                Agendamento Confirmado!
              </h2>
              <p className="text-xs text-[#E2D4B7]/80">
                Sua reserva no Studio Royale foi registrada. O serviço também foi adicionado à sua Sacola.
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
                    {bookingDate} às {bookingTime}
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
                  onClick={() => {
                    setBookingSuccess(false);
                    setStep(1);
                  }}
                  className="px-4 py-3 rounded-xl bg-[#18181B] border border-[#D4AF37]/30 text-xs font-semibold text-[#FFF1C5]"
                >
                  Fazer Outro Agendamento
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wizard Steps Navigation */}
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
                      Escolha a Data e o Horário
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#121214] p-6 rounded-2xl border border-[#D4AF37]/30">
                    <div>
                      <label className="block text-xs font-bold text-[#C5A059] mb-2">
                        Selecione a Data
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-3 text-xs text-[#FFF1C5] focus:border-[#D4AF37] outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#C5A059] mb-2">
                        Horários Disponíveis (Turnos VIP)
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingTime(time)}
                            className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                              bookingTime === time
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
                          {bookingDate} às {bookingTime}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-xs font-bold text-[#C5A059] mb-1">
                          Nome da Cliente *
                        </label>
                        <input
                          type="text"
                          required
                          value={clientNameInput}
                          onChange={(e) => setClientNameInput(e.target.value)}
                          className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-xs text-[#FFF1C5] outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#C5A059] mb-1">
                          Telefone *
                        </label>
                        <input
                          type="text"
                          required
                          value={clientPhoneInput}
                          onChange={(e) => setClientPhoneInput(e.target.value)}
                          className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-xs text-[#FFF1C5] outline-none font-mono"
                        />
                      </div>
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

      {/* TAB 3: LISTA COMPLETA DE AGENDAMENTOS */}
      {activeTab === 'list' && (
        <div className="space-y-6 animate-in fade-in">
          
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

                {apt.status !== 'cancelado' && (
                  <div className="pt-2 flex justify-end gap-2 border-t border-[#26242A]">
                    <button
                      onClick={() => {
                        setReschedulingApt(apt);
                        setRescheduleDate(apt.date);
                        setRescheduleTime(apt.time);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#222127] hover:bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-semibold border border-[#D4AF37]/30 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Remarcar</span>
                    </button>
                    <button
                      onClick={() => onCancelAppointment(apt.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold border border-red-800/40"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: REMARCAR AGENDAMENTO */}
      {reschedulingApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => setReschedulingApt(null)}
          />

          <div className="relative w-full max-w-md bg-[#121214] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5E6C8] z-10 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <RefreshCw className="w-5 h-5" />
                <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
                  Remarcar Agendamento
                </h3>
              </div>
              <button
                onClick={() => setReschedulingApt(null)}
                className="p-1 rounded-lg text-[#C5A059] hover:text-[#FFF1C5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-1 p-3 rounded-xl bg-[#0B0B0C] border border-[#26242A]">
              <p><strong className="text-[#C5A059]">Cliente:</strong> {reschedulingApt.clientName}</p>
              <p><strong className="text-[#C5A059]">Serviço:</strong> {reschedulingApt.serviceName}</p>
              <p><strong className="text-[#C5A059]">Profissional:</strong> {reschedulingApt.stylistName}</p>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Nova Data
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Novo Horário
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setRescheduleTime(time)}
                      className={`py-2 rounded-lg text-xs font-mono font-bold border transition-all ${
                        rescheduleTime === time
                          ? 'bg-[#D4AF37] text-[#0B0B0C] border-[#D4AF37]'
                          : 'bg-[#0B0B0C] border-[#26242A] text-[#E2D4B7]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingApt(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-semibold text-[#E2D4B7]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg"
                >
                  Salvar Remarcação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
