import React, { useState } from 'react';
import { Appointment, SalonProduct, BeautyService, VIPClient } from '../types';
import { INITIAL_APPOINTMENTS, SALON_PRODUCTS, SALON_SERVICES, MOCK_VIP_CLIENTS } from '../data/mockData';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Package, 
  Scissors, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2,
  AlertCircle
} from 'lucide-react';

interface AdminViewProps {
  onNavigate: (view: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onNavigate }) => {
  // Collapsible Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Active Admin Sub-section
  const [activeSection, setActiveSection] = useState<'dashboard' | 'schedule' | 'clients' | 'inventory' | 'services'>('dashboard');

  // Shared Data States for Admin Editing
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [products, setProducts] = useState<SalonProduct[]>(SALON_PRODUCTS);
  const [services, setServices] = useState<BeautyService[]>(SALON_SERVICES);
  const [searchFilter, setSearchFilter] = useState('');

  // Sidebar navigation menu options
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral & KPIs', icon: LayoutDashboard },
    { id: 'schedule', label: 'Agenda do Salão', icon: CalendarDays },
    { id: 'clients', label: 'Clientes & Fidelidade', icon: Users },
    { id: 'inventory', label: 'Estoque de Produtos', icon: Package },
    { id: 'services', label: 'Tabela de Serviços', icon: Scissors }
  ];

  // Helper functions for Admin Actions
  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const handleUpdateStock = (id: string, delta: number) => {
    setProducts(products.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  // Admin KPI Calculations
  const totalRevenue = appointments.filter(a => a.status !== 'cancelado').reduce((sum, a) => sum + a.price, 0);
  const todayAppointmentsCount = appointments.length;
  const completedCount = appointments.filter(a => a.status === 'concluido').length;

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex text-[#F5E6C8]">
      
      {/* 1. COLLAPSIBLE SIDEBAR MENU (Menu Lateral Recolhível) */}
      <aside
        className={`bg-[#121214] border-r border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between relative z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Top Lockup */}
          <div className="p-4 border-b border-[#26242A] flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E5C158] to-[#B8860B] flex items-center justify-center font-cinzel font-bold text-[#0B0B0C] text-xs">
                  SR
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold gold-gradient-text">
                    Painel ADM
                  </h3>
                  <span className="text-[10px] text-[#C5A059] block">Studio Royale</span>
                </div>
              </div>
            )}

            {/* Collapse / Expand Toggle Button */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 rounded-lg bg-[#18181B] hover:bg-[#222127] text-[#D4AF37] border border-[#D4AF37]/30 transition-all mx-auto"
              title={isSidebarCollapsed ? "Expandir Menu Lateral" : "Recolher Menu Lateral"}
            >
              {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-lg shadow-[#D4AF37]/10'
                      : 'text-[#C5A059] hover:text-[#FFF1C5] hover:bg-[#18181B]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#0B0B0C]' : 'text-[#D4AF37]'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#26242A]">
          {!isSidebarCollapsed ? (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0B0B0C] border border-[#26242A]">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
                AD
              </div>
              <div className="truncate text-xs">
                <span className="font-bold text-[#FFF1C5] block truncate">Sophia Royale</span>
                <span className="text-[10px] text-emerald-400">Gerente Geral</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 mx-auto rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] text-xs font-bold">
              AD
            </div>
          )}
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8 max-w-7xl">
        
        {/* SUB-SECTION 1: DASHBOARD & KPIS */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
            {/* KPI Cards Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Faturamento Dia</span>
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono gold-gradient-text">
                  R$ {totalRevenue.toFixed(2)}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">+18.4% em relação a ontem</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Agendamentos</span>
                  <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  {todayAppointmentsCount} Horários
                </div>
                <span className="text-[10px] text-[#C5A059]">{completedCount} concluídos hoje</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Ocupação Salão</span>
                  <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  88.5%
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Alta demanda VIP</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Ticket Médio</span>
                  <Scissors className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  R$ {(totalRevenue / Math.max(1, todayAppointmentsCount)).toFixed(2)}
                </div>
                <span className="text-[10px] text-[#C5A059]">Serviços + Produtos</span>
              </div>
            </div>

            {/* Timeline Agendamentos de Hoje */}
            <div className="p-6 rounded-3xl bg-[#121214] border border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
                    Linha do Tempo dos Agendamentos de Hoje
                  </h3>
                  <p className="text-xs text-[#E2D4B7]/70">
                    Acompanhamento em tempo real das cadeiras do salão.
                  </p>
                </div>
                <button
                  onClick={() => setActiveSection('schedule')}
                  className="px-3.5 py-1.5 rounded-lg bg-[#222127] border border-[#D4AF37]/30 text-xs text-[#D4AF37] font-bold"
                >
                  Gerenciar Agenda
                </button>
              </div>

              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 rounded-xl bg-[#0B0B0C] border border-[#26242A] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-mono font-bold text-[#D4AF37]">
                        {apt.time}
                      </div>
                      <div>
                        <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">
                          {apt.clientName}
                        </h4>
                        <p className="text-xs text-[#E2D4B7]/70">
                          {apt.serviceName} · <span className="text-[#C5A059]">{apt.stylistName}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold gold-gradient-text">
                        R$ {apt.price.toFixed(2)}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'concluido')}
                          className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-[11px] font-semibold border border-emerald-800"
                        >
                          Concluir
                        </button>
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'em_andamento')}
                          className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 text-[11px] font-semibold border border-amber-800"
                        >
                          Em Cadeira
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-SECTION 2: AGENDA COMPLETA DO SALÃO */}
        {activeSection === 'schedule' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Gestão da Agenda do Salão
              </h2>
              <button
                onClick={() => onNavigate('agenda')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Encaixe VIP</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-3"
                >
                  <div className="flex justify-between items-start border-b border-[#26242A] pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-[#C5A059]">{apt.id}</span>
                      <h3 className="font-cinzel font-bold text-base text-[#FFF1C5]">{apt.clientName}</h3>
                      <p className="text-xs text-[#E2D4B7]/70">{apt.clientPhone}</p>
                    </div>
                    <span className="text-xs font-bold font-mono gold-gradient-text">
                      R$ {apt.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-[#E2D4B7]/80">
                    <p><strong className="text-[#C5A059]">Serviço:</strong> {apt.serviceName}</p>
                    <p><strong className="text-[#C5A059]">Profissional:</strong> {apt.stylistName}</p>
                    <p><strong className="text-[#C5A059]">Horário:</strong> {apt.date} às {apt.time}</p>
                  </div>

                  <div className="pt-2 flex justify-between items-center border-t border-[#26242A]">
                    <span className="text-xs font-semibold text-[#D4AF37]">
                      Status: {apt.status}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateAppointmentStatus(apt.id, 'concluido')}
                        className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 text-xs font-bold"
                      >
                        ✓ Finalizar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-SECTION 3: CLIENTES */}
        {activeSection === 'clients' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
              Gestão de Clientes VIP
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_VIP_CLIENTS.map((client) => (
                <div key={client.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={client.avatar} alt={client.name} className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]" />
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{client.name}</h4>
                      <p className="text-xs text-[#C5A059]">{client.tier} · {client.loyaltyPoints} pts</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FFF1C5]">R$ {client.totalSpent.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-SECTION 4: ESTOQUE DE PRODUTOS */}
        {activeSection === 'inventory' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Controle de Estoque da Boutique
              </h2>
            </div>

            <div className="bg-[#121214] rounded-2xl border border-[#D4AF37]/30 overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E2D4B7]">
                <thead className="bg-[#0B0B0C] text-[#C5A059] border-b border-[#26242A] uppercase font-mono">
                  <tr>
                    <th className="p-4">Produto</th>
                    <th className="p-4">Marca</th>
                    <th className="p-4">Preço</th>
                    <th className="p-4">Estoque</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#26242A]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#18181B]">
                      <td className="p-4 flex items-center gap-3 font-semibold text-[#FFF1C5]">
                        <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                        <span>{prod.name}</span>
                      </td>
                      <td className="p-4 text-[#C5A059]">{prod.brand}</td>
                      <td className="p-4 font-mono font-bold text-[#D4AF37]">R$ {prod.price.toFixed(2)}</td>
                      <td className="p-4 font-mono">
                        <span className={`px-2 py-0.5 rounded font-bold ${prod.stock < 15 ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}>
                          {prod.stock} un
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1 font-mono">
                          <button
                            onClick={() => handleUpdateStock(prod.id, -1)}
                            className="w-7 h-7 rounded bg-[#222127] text-[#FFF1C5] font-bold"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleUpdateStock(prod.id, 1)}
                            className="w-7 h-7 rounded bg-[#222127] text-[#FFF1C5] font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUB-SECTION 5: SERVIÇOS CONFIG */}
        {activeSection === 'services' && (
          <div className="space-y-6 animate-in fade-in">
            <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
              Catálogo de Serviços & Preços
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((serv) => (
                <div key={serv.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex justify-between items-center">
                  <div>
                    <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{serv.name}</h4>
                    <p className="text-xs text-[#C5A059]">Duração: {serv.durationMinutes} min</p>
                  </div>
                  <span className="font-mono font-bold text-base gold-gradient-text">R$ {serv.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
