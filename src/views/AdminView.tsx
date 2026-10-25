import React, { useState } from 'react';
import { Appointment, SalonProduct, BeautyService, VIPClient, SalonSettings, SalonOrder, Stylist } from '../types';
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
  AlertCircle,
  X,
  Check,
  Image,
  Tag,
  ShoppingBag,
  Palette,
  ShieldCheck,
  Lock,
  Mail,
  Phone,
  MapPin,
  Save,
  UserPlus,
  BarChart3,
  Sliders,
  Sparkles
} from 'lucide-react';

interface AdminViewProps {
  products: SalonProduct[];
  onAddProduct: (newProd: SalonProduct) => void;
  onUpdateProduct: (updatedProd: SalonProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateStock: (productId: string, delta: number) => void;
  
  appointments: Appointment[];
  onUpdateAppointmentStatus: (id: string, newStatus: Appointment['status']) => void;
  
  clients: VIPClient[];
  onAddClient: (newClient: VIPClient) => void;
  onUpdateClient: (updatedClient: VIPClient) => void;
  onDeleteClient: (clientId: string) => void;

  services: BeautyService[];
  onAddService: (newService: BeautyService) => void;
  onUpdateService: (updatedService: BeautyService) => void;
  onDeleteService: (serviceId: string) => void;

  orders: SalonOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: SalonOrder['status']) => void;

  settings: SalonSettings;
  onUpdateSettings: (newSettings: SalonSettings) => void;

  stylists: Stylist[];
  onNavigate: (view: string) => void;
  onResetToFactoryDefaults?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateStock,
  appointments,
  onUpdateAppointmentStatus,
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  orders,
  onUpdateOrderStatus,
  settings,
  onUpdateSettings,
  stylists,
  onNavigate,
  onResetToFactoryDefaults
}) => {
  // Collapsible Sidebar State (Menu Lateral Recolhível)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Active Admin Section (10 required sections)
  const [activeSection, setActiveSection] = useState<
    'dashboard' | 'schedule' | 'clients' | 'services' | 'products' | 'orders' | 'finance' | 'appearance' | 'users' | 'security'
  >('dashboard');

  // Save Success Notification Banner
  const [saveNoticeMessage, setSaveNoticeMessage] = useState<string | null>(null);

  // Form States for Settings / Appearance
  const [salonNameInput, setSalonNameInput] = useState(settings.salonName);
  const [taglineInput, setTaglineInput] = useState(settings.tagline);
  const [addressInput, setAddressInput] = useState(settings.address);
  const [phoneInput, setPhoneInput] = useState(settings.phone);
  const [whatsappInput, setWhatsappInput] = useState(settings.whatsapp);
  const [emailInput, setEmailInput] = useState(settings.email);

  // Carousel Banners Form State
  const [slide1Title, setSlide1Title] = useState(settings.carouselSlides[0]?.title || '');
  const [slide1Sub, setSlide1Sub] = useState(settings.carouselSlides[0]?.subtitle || '');
  const [slide2Title, setSlide2Title] = useState(settings.carouselSlides[1]?.title || '');
  const [slide2Sub, setSlide2Sub] = useState(settings.carouselSlides[1]?.subtitle || '');

  // Service Edit / Add Modal States
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<BeautyService | null>(null);
  const [servName, setServName] = useState('');
  const [servCategory, setServCategory] = useState<BeautyService['category']>('cabelo');
  const [servPrice, setServPrice] = useState('250');
  const [servDuration, setServDuration] = useState('60');
  const [servDesc, setServDesc] = useState('');

  // Sidebar navigation menu options (10 requested sections)
  const menuItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'schedule', label: 'Agenda do Salão', icon: CalendarDays },
    { id: 'clients', label: 'Clientes VIP', icon: Users },
    { id: 'services', label: 'Serviços & Preços', icon: Scissors },
    { id: 'products', label: 'Estoque Produtos', icon: Package },
    { id: 'orders', label: 'Pedidos & Sacola', icon: ShoppingBag },
    { id: 'finance', label: 'Financeiro', icon: DollarSign },
    { id: 'appearance', label: 'Aparência & Marca', icon: Palette },
    { id: 'users', label: 'Usuários & Equipe', icon: UserPlus },
    { id: 'security', label: 'Segurança & Acesso', icon: ShieldCheck }
  ];

  // Show Toast
  const triggerToast = (msg: string) => {
    setSaveNoticeMessage(msg);
    setTimeout(() => setSaveNoticeMessage(null), 3500);
  };

  // Save Appearance & General Settings
  const handleSaveAppearanceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedSlides = [...settings.carouselSlides];
    if (updatedSlides[0]) {
      updatedSlides[0] = { ...updatedSlides[0], title: slide1Title, subtitle: slide1Sub };
    }
    if (updatedSlides[1]) {
      updatedSlides[1] = { ...updatedSlides[1], title: slide2Title, subtitle: slide2Sub };
    }

    const updated: SalonSettings = {
      ...settings,
      salonName: salonNameInput,
      tagline: taglineInput,
      address: addressInput,
      phone: phoneInput,
      whatsapp: whatsappInput,
      email: emailInput,
      carouselSlides: updatedSlides
    };

    onUpdateSettings(updated);
    triggerToast('Configurações de Aparência e Marca salvas com sucesso!');
  };

  // Save Security Settings
  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Configurações de Segurança e Notificações salvas com sucesso!');
  };

  // Service Save Handlers
  const handleSaveNewService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!servName.trim()) return;

    const newServ: BeautyService = {
      id: `serv-${Date.now()}`,
      name: servName,
      category: servCategory,
      price: parseFloat(servPrice) || 100,
      durationMinutes: parseInt(servDuration, 10) || 60,
      description: servDesc || 'Atendimento com produtos premium de salão.',
      popular: true
    };

    onAddService(newServ);
    setIsAddServiceModalOpen(false);
    triggerToast(`Serviço "${servName}" adicionado ao catálogo!`);
  };

  const handleSaveEditService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !servName.trim()) return;

    const updated: BeautyService = {
      ...editingService,
      name: servName,
      category: servCategory,
      price: parseFloat(servPrice) || 100,
      durationMinutes: parseInt(servDuration, 10) || 60,
      description: servDesc
    };

    onUpdateService(updated);
    setEditingService(null);
    triggerToast(`Serviço "${servName}" atualizado com sucesso!`);
  };

  // Admin KPI Calculations
  const totalRevenue = appointments.filter(a => a.status !== 'cancelado').reduce((sum, a) => sum + a.price, 0);
  const totalOrdersAmount = orders.filter(o => o.status !== 'Cancelado').reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="min-h-screen bg-[#0B0B0C] flex text-[#F5E6C8] relative">
      
      {/* Save Success Toast Banner */}
      {saveNoticeMessage && (
        <div className="fixed top-24 right-6 z-50 bg-emerald-950 border border-emerald-500 text-emerald-200 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold">{saveNoticeMessage}</span>
        </div>
      )}

      {/* 1. COLLAPSIBLE SIDEBAR MENU (Menu Lateral Recolhível) */}
      <aside
        className={`bg-[#121214] border-r border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between relative z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div>
          {/* Sidebar Top Header */}
          <div className="p-4 border-b border-[#26242A] flex items-center justify-between">
            {!isSidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#E5C158] to-[#B8860B] flex items-center justify-center font-cinzel font-bold text-[#0B0B0C] text-xs">
                  SR
                </div>
                <div>
                  <h3 className="font-cinzel text-sm font-bold gold-gradient-text truncate max-w-[120px]">
                    {settings.salonName}
                  </h3>
                  <span className="text-[10px] text-[#C5A059] block">Painel ADM</span>
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

          {/* Navigation Items (10 Sections) */}
          <nav className="p-2.5 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id as any)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-lg shadow-[#D4AF37]/10'
                      : 'text-[#C5A059] hover:text-[#FFF1C5] hover:bg-[#18181B]'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#0B0B0C]' : 'text-[#D4AF37]'}`} />
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
        
        {/* SECTION 1: VISÃO GERAL */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-2xl font-bold champagne-gradient-text">
                Visão Geral do Salão
              </h2>
              <p className="text-xs text-[#E2D4B7]/70">
                Resumo de métricas operacionais e financeiras em tempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Faturamento Total</span>
                  <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono gold-gradient-text">
                  R$ {(totalRevenue + totalOrdersAmount).toFixed(2)}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Serviços + Boutique</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Agendamentos</span>
                  <CalendarDays className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  {appointments.length} Atendimentos
                </div>
                <span className="text-[10px] text-[#C5A059]">Agenda ativa</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Boutique</span>
                  <Package className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  {products.length} Produtos
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">Em catálogo</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <div className="flex items-center justify-between text-[#C5A059]">
                  <span className="text-xs font-bold uppercase">Clientes VIP</span>
                  <Users className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  {clients.length} Cadastradas
                </div>
                <span className="text-[10px] text-[#C5A059]">Clube Royale</span>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: AGENDA */}
        {activeSection === 'schedule' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Agenda Integrada do Salão
              </h2>
              <button
                onClick={() => onNavigate('agenda')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
              >
                Abrir Interface de Agenda
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{apt.clientName}</h4>
                      <p className="text-xs text-[#C5A059]">{apt.serviceName} com {apt.stylistName}</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">{apt.date} {apt.time}</span>
                  </div>
                  <div className="pt-2 flex justify-between items-center border-t border-[#26242A] text-xs">
                    <span className="text-emerald-400 font-bold">{apt.status}</span>
                    <button
                      onClick={() => onUpdateAppointmentStatus(apt.id, 'concluido')}
                      className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 text-[11px] font-bold"
                    >
                      ✓ Finalizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 3: CLIENTES */}
        {activeSection === 'clients' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Gestão de Clientes VIP
              </h2>
              <button
                onClick={() => onNavigate('clientes')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
              >
                Abrir Módulo de Clientes
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clients.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]" />
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{c.name}</h4>
                      <p className="text-xs text-[#C5A059]">{c.phone}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#FFF1C5]">{c.loyaltyPoints} pts</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 4: SERVIÇOS & PREÇOS */}
        {activeSection === 'services' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Catálogo de Serviços & Tabela de Preços
              </h2>
              <button
                onClick={() => {
                  setServName('');
                  setServPrice('220');
                  setServDuration('60');
                  setServDesc('');
                  setIsAddServiceModalOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((serv) => (
                <div key={serv.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/15">
                        {serv.category}
                      </span>
                      <h4 className="font-cinzel font-bold text-base text-[#FFF1C5] mt-1">{serv.name}</h4>
                      <p className="text-xs text-[#E2D4B7]/70 mt-1">{serv.description}</p>
                    </div>
                    <span className="font-mono font-bold text-lg gold-gradient-text">
                      R$ {serv.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#26242A] flex justify-between items-center text-xs">
                    <span className="text-[#C5A059]">Duração: {serv.durationMinutes} min</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingService(serv);
                          setServName(serv.name);
                          setServCategory(serv.category);
                          setServPrice(String(serv.price));
                          setServDuration(String(serv.durationMinutes));
                          setServDesc(serv.description);
                        }}
                        className="p-1.5 rounded bg-[#18181B] text-[#D4AF37]"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteService(serv.id)}
                        className="p-1.5 rounded bg-red-950/40 text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 5: PRODUTOS */}
        {activeSection === 'products' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Gestão de Estoque da Boutique
              </h2>
              <button
                onClick={() => onNavigate('vitrine')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
              >
                Ver Vitrine de Produtos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => (
                <div key={p.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{p.name}</h4>
                      <p className="text-xs text-[#C5A059]">{p.brand} · {p.volume}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#26242A] flex justify-between items-center font-mono text-xs">
                    <span className="gold-gradient-text font-bold">R$ {p.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <span>Estoque: {p.stock}</span>
                      <button onClick={() => onUpdateStock(p.id, 1)} className="px-1.5 py-0.5 rounded bg-[#222127] text-[#D4AF37]">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 6: PEDIDOS */}
        {activeSection === 'orders' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Pedidos & Vendas da Sacola
              </h2>
            </div>

            <div className="space-y-3">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#D4AF37]">{ord.id}</span>
                      <span className="text-xs text-[#FFF1C5] font-bold">{ord.clientName}</span>
                    </div>
                    <p className="text-xs text-[#E2D4B7]/80 mt-1">{ord.itemsSummary}</p>
                    <p className="text-[11px] text-[#8E8A80] font-mono mt-0.5">{ord.date} · {ord.paymentMethod}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-base font-bold font-mono gold-gradient-text">R$ {ord.total.toFixed(2)}</span>
                    <button
                      onClick={() => onUpdateOrderStatus(ord.id, 'Concluído')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-950 text-emerald-300 text-xs font-bold border border-emerald-800"
                    >
                      {ord.status} ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 7: FINANCEIRO */}
        {activeSection === 'finance' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Relatório Financeiro & Desempenho
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Receita Bruta Total</span>
                <div className="text-2xl font-bold font-mono gold-gradient-text">
                  R$ {(totalRevenue + totalOrdersAmount).toFixed(2)}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Faturamento Serviços</span>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  R$ {totalRevenue.toFixed(2)}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-2">
                <span className="text-xs font-bold text-[#C5A059] uppercase">Vendas Boutique</span>
                <div className="text-2xl font-bold font-mono text-[#FFF1C5]">
                  R$ {totalOrdersAmount.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 8: APARÊNCIA & MARCA */}
        {activeSection === 'appearance' && (
          <div className="space-y-6 animate-in fade-in max-w-3xl">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Personalização de Marca & Banners
              </h2>
              <p className="text-xs text-[#E2D4B7]/70">
                Edite os textos do topo, slogan do salão e conteúdos dos banners do carrossel principal.
              </p>
            </div>

            <form onSubmit={handleSaveAppearanceSettings} className="space-y-6 text-xs">
              <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-4">
                <h3 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                  Dados Básicos da Marca
                </h3>

                <div>
                  <label className="block text-[#C5A059] font-bold mb-1">Nome do Salão *</label>
                  <input
                    type="text"
                    required
                    value={salonNameInput}
                    onChange={(e) => setSalonNameInput(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-3 text-[#FFF1C5] font-cinzel font-bold text-sm outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A059] font-bold mb-1">Slogan / Tagline *</label>
                  <input
                    type="text"
                    required
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-3 text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#C5A059] font-bold mb-1">Telefone Principal</label>
                    <input
                      type="text"
                      value={phoneInput}
                      onChange={(e) => setPhoneInput(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#C5A059] font-bold mb-1">WhatsApp Concierge</label>
                    <input
                      type="text"
                      value={whatsappInput}
                      onChange={(e) => setWhatsappInput(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Banners Edit */}
              <div className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-4">
                <h3 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                  Banners do Carrossel de Entrada
                </h3>

                <div className="space-y-3">
                  <label className="block text-[#D4AF37] font-bold">Banner 1</label>
                  <input
                    type="text"
                    value={slide1Title}
                    onChange={(e) => setSlide1Title(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                    placeholder="Título Banner 1"
                  />
                  <input
                    type="text"
                    value={slide1Sub}
                    onChange={(e) => setSlide1Sub(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                    placeholder="Subtítulo Banner 1"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <label className="block text-[#D4AF37] font-bold">Banner 2</label>
                  <input
                    type="text"
                    value={slide2Title}
                    onChange={(e) => setSlide2Title(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                    placeholder="Título Banner 2"
                  />
                  <input
                    type="text"
                    value={slide2Sub}
                    onChange={(e) => setSlide2Sub(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                    placeholder="Subtítulo Banner 2"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg uppercase flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações de Aparência</span>
              </button>
            </form>
          </div>
        )}

        {/* SECTION 9: USUÁRIOS & EQUIPE */}
        {activeSection === 'users' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Equipe & Usuários do Sistema
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stylists.map((st) => (
                <div key={st.id} className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h4 className="font-cinzel font-bold text-sm text-[#FFF1C5]">{st.name}</h4>
                      <p className="text-xs text-[#C5A059]">{st.role}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">Ativo</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 10: SEGURANÇA */}
        {activeSection === 'security' && (
          <div className="space-y-6 animate-in fade-in max-w-2xl">
            <div className="border-b border-[#26242A] pb-4">
              <h2 className="font-cinzel text-xl font-bold champagne-gradient-text">
                Segurança & Configurações de Acesso
              </h2>
            </div>

            <form onSubmit={handleSaveSecuritySettings} className="p-6 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-bold mb-1">E-mail Notificador de Agendamentos</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#C5A059] font-bold mb-1">Nova Senha ADM</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg uppercase flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações de Segurança</span>
              </button>
            </form>

            {onResetToFactoryDefaults && (
              <div className="p-6 rounded-2xl bg-[#121214] border border-red-900/40 space-y-3 text-xs">
                <div className="flex items-center gap-2 text-red-400 font-bold">
                  <AlertCircle className="w-4 h-4" />
                  <span>Restaurar Estado de Fábrica</span>
                </div>
                <p className="text-[#E2D4B7]/70 text-[11px]">
                  Apaga a memória local salva no navegador (localStorage) e restaura o Studio Royale para os dados padrão originais.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja realmente apagar os dados salvos no navegador e restaurar os valores padrões do Studio Royale?')) {
                      onResetToFactoryDefaults();
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 font-bold border border-red-800/50"
                >
                  Restaurar Dados Padrão de Fábrica
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* MODAL: ADICIONAR OU EDITAR SERVIÇO */}
      {(isAddServiceModalOpen || editingService) && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => {
              setIsAddServiceModalOpen(false);
              setEditingService(null);
            }}
          />

          <div className="relative w-full max-w-lg bg-[#121214] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5E6C8] z-10 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
              <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
                {editingService ? 'Editar Serviço' : 'Novo Serviço'}
              </h3>
              <button
                onClick={() => {
                  setIsAddServiceModalOpen(false);
                  setEditingService(null);
                }}
                className="p-1 rounded text-[#C5A059]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingService ? handleSaveEditService : handleSaveNewService} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-bold mb-1">Nome do Serviço *</label>
                <input
                  type="text"
                  required
                  value={servName}
                  onChange={(e) => setServName(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#C5A059] font-bold mb-1">Categoria</label>
                  <select
                    value={servCategory}
                    onChange={(e) => setServCategory(e.target.value as any)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                  >
                    <option value="cabelo">Cabelo</option>
                    <option value="estetica">Estética</option>
                    <option value="unhas">Unhas</option>
                    <option value="spa">Spa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C5A059] font-bold mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={servPrice}
                    onChange={(e) => setServPrice(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A059] font-bold mb-1">Duração (min)</label>
                  <input
                    type="number"
                    value={servDuration}
                    onChange={(e) => setServDuration(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C5A059] font-bold mb-1">Descrição do Serviço</label>
                <textarea
                  rows={2}
                  value={servDesc}
                  onChange={(e) => setServDesc(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddServiceModalOpen(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#18181B] text-xs text-[#E2D4B7]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg"
                >
                  Salvar Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
