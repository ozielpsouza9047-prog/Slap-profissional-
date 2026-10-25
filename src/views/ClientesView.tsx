import React, { useState } from 'react';
import { VIPClient, UserRole } from '../types';
import { MOCK_VIP_CLIENTS } from '../data/mockData';
import { 
  Crown, Gift, Star, Search, UserCheck, ShieldCheck, Phone, Mail, Award, Calendar, 
  Plus, Edit3, Trash2, X, Check, MessageSquare, UserPlus, Filter, Info, FileText
} from 'lucide-react';

interface ClientesViewProps {
  userRole: UserRole;
  onNavigate: (view: string) => void;
  clients: VIPClient[];
  onAddClient: (newClient: VIPClient) => void;
  onUpdateClient: (updatedClient: VIPClient) => void;
  onDeleteClient: (clientId: string) => void;
  onSelectClientForBooking?: (client: VIPClient) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({
  userRole,
  onNavigate,
  clients,
  onAddClient,
  onUpdateClient,
  onDeleteClient,
  onSelectClientForBooking
}) => {
  const [activeTab, setActiveTab] = useState<'my_profile' | 'directory'>(
    userRole === 'admin' ? 'directory' : 'my_profile'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('todos');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<VIPClient | null>(null);
  const [viewingProfileClient, setViewingProfileClient] = useState<VIPClient | null>(null);

  // Form State for Add / Edit Client
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formTier, setFormTier] = useState<VIPClient['tier']>('Bronze');
  const [formPoints, setFormPoints] = useState(100);
  const [formNotes, setFormNotes] = useState('');
  const [formBirthdate, setFormBirthdate] = useState('');

  // Primary featured client profile (Helena Cavalcanti or first in list)
  const myClientProfile = clients.find(c => c.name.includes('Helena')) || clients[0];

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormTier('Bronze');
    setFormPoints(100);
    setFormNotes('');
    setFormBirthdate('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (client: VIPClient) => {
    setEditingClient(client);
    setFormName(client.name);
    setFormEmail(client.email);
    setFormPhone(client.phone);
    setFormTier(client.tier);
    setFormPoints(client.loyaltyPoints);
    setFormNotes(client.notes || '');
    setFormBirthdate(client.birthdate || '');
  };

  // Submit Add Client
  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const newClientObj: VIPClient = {
      id: `cli-${Date.now()}`,
      name: formName,
      email: formEmail || `${formName.toLowerCase().replace(/\s+/g, '.')}@exemplo.com`,
      phone: formPhone,
      tier: formTier,
      loyaltyPoints: Number(formPoints) || 100,
      totalVisits: 1,
      totalSpent: 0,
      lastVisit: 'Hoje',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
      notes: formNotes,
      birthdate: formBirthdate
    };

    onAddClient(newClientObj);
    setIsAddModalOpen(false);
  };

  // Submit Edit Client
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient || !formName.trim()) return;

    const updated: VIPClient = {
      ...editingClient,
      name: formName,
      email: formEmail,
      phone: formPhone,
      tier: formTier,
      loyaltyPoints: Number(formPoints),
      notes: formNotes,
      birthdate: formBirthdate
    };

    onUpdateClient(updated);
    setEditingClient(null);
  };

  // Delete Action
  const handleDelete = (client: VIPClient) => {
    if (confirm(`Deseja realmente remover a cliente VIP "${client.name}"?`)) {
      onDeleteClient(client.id);
      if (viewingProfileClient?.id === client.id) {
        setViewingProfileClient(null);
      }
    }
  };

  // WhatsApp Link Helper
  const getWhatsAppLink = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
    return `https://wa.me/${fullPhone}?text=Olá!%20Mensagem%20do%20Studio%20Royale%20para%20você.`;
  };

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        c.phone.includes(searchQuery) ||
                        c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTier = tierFilter === 'todos' || c.tier.toLowerCase().includes(tierFilter.toLowerCase());
    return matchSearch && matchTier;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#26242A] pb-6">
        <div>
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">
            Programa de Fidelidade & Gestão Exclusiva
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold champagne-gradient-text">
            Clientes VIP Studio Royale
          </h1>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {/* Cadastrar Cliente Action Button */}
          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg flex items-center gap-2 hover:brightness-110 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Cliente VIP</span>
          </button>

          {/* View Tab Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#121214] border border-[#D4AF37]/30 rounded-xl">
            <button
              onClick={() => setActiveTab('my_profile')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'my_profile'
                  ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                  : 'text-[#C5A059] hover:text-[#FFF1C5]'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Meu Cartão</span>
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'directory'
                  ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                  : 'text-[#C5A059] hover:text-[#FFF1C5]'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Diretório ({clients.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: MEU CARTÃO VIP & PONTOS */}
      {activeTab === 'my_profile' && myClientProfile && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Virtual VIP Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1A1A1E] via-[#121214] to-[#0B0B0C] border border-[#D4AF37]/50 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <img
                  src={myClientProfile.avatar}
                  alt={myClientProfile.name}
                  className="w-16 h-16 rounded-full border-2 border-[#D4AF37] object-cover"
                />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-[#FFF1C5]">
                    {myClientProfile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Nível: {myClientProfile.tier}</span>
                  </span>
                </div>
              </div>

              {/* Points Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#C5A059]">Saldo de Pontos Royale</span>
                  <span className="gold-gradient-text font-bold text-base">
                    {myClientProfile.loyaltyPoints.toLocaleString()} pts
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#0B0B0C] rounded-full overflow-hidden border border-[#D4AF37]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5C158] to-[#D4AF37] rounded-full"
                    style={{ width: `${Math.min(100, (myClientProfile.loyaltyPoints / 4000) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#E2D4B7]/70 text-right font-mono">
                  Faltam {Math.max(0, 4000 - myClientProfile.loyaltyPoints)} pts para o prêmio Royale Diamond Black
                </p>
              </div>
            </div>

            {/* Quick Perks */}
            <div className="p-4 rounded-2xl bg-[#0B0B0C]/80 border border-[#D4AF37]/30 flex flex-col justify-between text-xs">
              <h3 className="font-cinzel font-bold text-sm text-[#FFF1C5] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#D4AF37]" />
                <span>Benefícios Exclusivos</span>
              </h3>
              <ul className="space-y-2 text-[#E2D4B7]/90 text-[11px]">
                <li>✓ Espumante & Café Gourmet Cortesia</li>
                <li>✓ Desconto de Aniversário (20% OFF)</li>
                <li>✓ Atendimento Preferencial em Cadeira VIP</li>
              </ul>
              <button
                onClick={() => onNavigate('agenda')}
                className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
              >
                Agendar e Acumular Mais Pontos
              </button>
            </div>
          </div>

          {/* Vouchers & Rewards */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
              Vouchers & Cupons Disponíveis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">Cupom VIP 10% OFF</span>
                </div>
                <p className="text-xs text-[#E2D4B7]/80">
                  Válido para qualquer serviço de cabelo, estética ou manicure.
                </p>
                <div className="p-2 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-center font-mono text-xs text-[#FFF1C5] font-bold">
                  ROYALE10
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Gift className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">Escova Cortesia</span>
                </div>
                <p className="text-xs text-[#E2D4B7]/80">
                  Resgate ao atingir 3.500 pontos no Clube Royale.
                </p>
                <button className="w-full py-1.5 rounded-lg bg-[#222127] text-xs font-semibold text-[#C5A059] border border-[#D4AF37]/30">
                  Resgatar em breve
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold uppercase">Boutique 15% OFF</span>
                </div>
                <p className="text-xs text-[#E2D4B7]/80">
                  Desconto em séruns e produtos Kérastase / Royale.
                </p>
                <div className="p-2 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-center font-mono text-xs text-[#FFF1C5] font-bold">
                  VIPGOLD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRETÓRIO DE CLIENTES */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Controls: Search & Tier Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#121214] p-4 rounded-2xl border border-[#D4AF37]/30">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8E8A80] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Pesquisar cliente por nome, tel ou e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl pl-10 pr-4 py-2 text-xs text-[#FFF1C5] placeholder-[#8E8A80] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FFF1C5]">Filtrar Nível:</span>
              <div className="flex flex-wrap gap-1.5">
                {['todos', 'Diamond', 'Ouro', 'Prata', 'Bronze'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      tierFilter === t
                        ? 'bg-[#D4AF37] text-[#0B0B0C] font-bold'
                        : 'bg-[#0B0B0C] text-[#C5A059] border border-[#26242A] hover:border-[#D4AF37]/40'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.length === 0 ? (
              <div className="col-span-2 text-center py-12 bg-[#121214] rounded-2xl border border-[#26242A] text-[#E2D4B7]/70 space-y-2">
                <p className="text-sm font-semibold">Nenhuma cliente encontrada com os filtros aplicados.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setTierFilter('todos');
                  }}
                  className="text-xs text-[#D4AF37] underline"
                >
                  Limpar filtros
                </button>
              </div>
            ) : (
              filteredClients.map((client) => (
                <div
                  key={client.id}
                  className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between gap-4 group hover:border-[#D4AF37]/60 transition-all shadow-lg"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37]/40"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                            {client.name}
                          </h4>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                            client.tier === 'Diamond Royale'
                              ? 'bg-purple-950 text-purple-300 border-purple-800'
                              : client.tier === 'Ouro'
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/40'
                              : 'bg-slate-800 text-slate-200 border-slate-700'
                          }`}>
                            {client.tier}
                          </span>
                        </div>
                        <p className="text-xs text-[#E2D4B7]/80 flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-[#C5A059]" />
                          <span>{client.phone}</span>
                        </p>
                        <p className="text-[11px] text-[#8E8A80] truncate max-w-[220px]">
                          {client.email}
                        </p>
                      </div>
                    </div>

                    {/* Quick Edit & Delete Icons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(client)}
                        className="p-1.5 rounded-lg bg-[#18181B] text-[#C5A059] hover:text-[#FFF1C5] hover:bg-[#D4AF37]/20 transition-colors"
                        title="Editar Dados da Cliente"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client)}
                        className="p-1.5 rounded-lg bg-[#18181B] text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
                        title="Excluir Cliente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Notes / Special Preference preview if available */}
                  {client.notes && (
                    <div className="px-3 py-1.5 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-[11px] text-[#E2D4B7]/80 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="truncate">{client.notes}</span>
                    </div>
                  )}

                  {/* Stats & Actions */}
                  <div className="pt-3 border-t border-[#26242A] flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#C5A059]">
                      <span>Pontos: <strong className="text-[#FFF1C5]">{client.loyaltyPoints}</strong></span>
                      <span>Visitas: <strong className="text-[#FFF1C5]">{client.totalVisits}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={getWhatsAppLink(client.phone)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>

                      <button
                        onClick={() => {
                          if (onSelectClientForBooking) {
                            onSelectClientForBooking(client);
                          }
                          onNavigate('agenda');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#222127] hover:bg-[#D4AF37] text-[#FFF1C5] hover:text-[#0B0B0C] border border-[#D4AF37]/30 text-xs font-bold transition-all"
                      >
                        Agendar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL: CADASTRAR NOVO CLIENTE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#121214] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5E6C8] z-10 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <UserPlus className="w-5 h-5" />
                <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
                  Cadastrar Nova Cliente VIP
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-[#C5A059] hover:text-[#FFF1C5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Ana Clara Siqueira"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Telefone / WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-8888"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    placeholder="cliente@exemplo.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Nível de Fidelidade
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as any)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Bronze">Bronze (Inicial)</option>
                    <option value="Prata">Prata</option>
                    <option value="Ouro">Ouro</option>
                    <option value="Diamond Royale">Diamond Royale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Pontos Iniciais
                  </label>
                  <input
                    type="number"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Observações / Preferências (Alergias, Tom de Cabelo, Bebidas)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Preferência por café sem açúcar. Alergia a amônia."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-semibold text-[#E2D4B7]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg"
                >
                  Salvar Cadastro VIP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR CLIENTE */}
      {editingClient && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-[#0B0B0C]/80 backdrop-blur-sm"
            onClick={() => setEditingClient(null)}
          />

          <div className="relative w-full max-w-lg bg-[#121214] border border-[#D4AF37]/40 rounded-3xl p-6 shadow-2xl space-y-4 text-[#F5E6C8] z-10 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-[#26242A] pb-3">
              <div className="flex items-center gap-2 text-[#D4AF37]">
                <Edit3 className="w-5 h-5" />
                <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
                  Editar Cliente: {editingClient.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingClient(null)}
                className="p-1 rounded-lg text-[#C5A059] hover:text-[#FFF1C5]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] focus:border-[#D4AF37] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Nível de Fidelidade
                  </label>
                  <select
                    value={formTier}
                    onChange={(e) => setFormTier(e.target.value as any)}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
                  >
                    <option value="Bronze">Bronze</option>
                    <option value="Prata">Prata</option>
                    <option value="Ouro">Ouro</option>
                    <option value="Diamond Royale">Diamond Royale</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C5A059] font-semibold mb-1">
                    Pontos de Fidelidade
                  </label>
                  <input
                    type="number"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#C5A059] font-semibold mb-1">
                  Observações & Histórico de Preferências
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl p-2.5 text-[#FFF1C5] outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => handleDelete(editingClient)}
                  className="text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  Excluir Cliente
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingClient(null)}
                    className="px-4 py-2.5 rounded-xl bg-[#18181B] border border-[#26242A] text-xs font-semibold text-[#E2D4B7]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-lg"
                  >
                    Atualizar Dados
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
