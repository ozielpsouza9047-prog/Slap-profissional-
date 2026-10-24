import React, { useState } from 'react';
import { VIPClient, UserRole } from '../types';
import { MOCK_VIP_CLIENTS } from '../data/mockData';
import { Crown, Gift, Star, Search, UserCheck, ShieldCheck, Phone, Mail, Award, Calendar, ExternalLink } from 'lucide-react';

interface ClientesViewProps {
  userRole: UserRole;
  onNavigate: (view: string) => void;
}

export const ClientesView: React.FC<ClientesViewProps> = ({ userRole, onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'my_profile' | 'directory'>(
    userRole === 'admin' ? 'directory' : 'my_profile'
  );
  const [clients, setClients] = useState<VIPClient[]>(MOCK_VIP_CLIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('todos');

  // Client profile data (Helena Cavalcanti)
  const clientProfile = clients[0];

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
            Programa de Fidelidade & Diretório VIP
          </span>
          <h1 className="font-cinzel text-2xl sm:text-3xl font-bold champagne-gradient-text">
            Clube Royale VIP
          </h1>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#121214] border border-[#D4AF37]/30 rounded-xl">
          <button
            onClick={() => setActiveTab('my_profile')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'my_profile'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>Meu Cartão VIP</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`py-2 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'directory'
                ? 'bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] shadow-md'
                : 'text-[#C5A059] hover:text-[#FFF1C5]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Diretório Clientes ({clients.length})</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MEU CARTÃO VIP & PONTOS */}
      {activeTab === 'my_profile' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Virtual VIP Card */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#1A1A1E] via-[#121214] to-[#0B0B0C] border border-[#D4AF37]/50 shadow-2xl relative overflow-hidden grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4 relative z-10">
              <div className="flex items-center gap-3">
                <img
                  src={clientProfile.avatar}
                  alt={clientProfile.name}
                  className="w-16 h-16 rounded-full border-2 border-[#D4AF37] object-cover"
                />
                <div>
                  <h2 className="font-cinzel text-xl font-bold text-[#FFF1C5]">
                    {clientProfile.name}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Nível: {clientProfile.tier}</span>
                  </span>
                </div>
              </div>

              {/* Points Progress */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-[#C5A059]">Saldo de Pontos Royale</span>
                  <span className="gold-gradient-text font-bold text-base">
                    {clientProfile.loyaltyPoints.toLocaleString()} pts
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#0B0B0C] rounded-full overflow-hidden border border-[#D4AF37]/30">
                  <div
                    className="h-full bg-gradient-to-r from-[#E5C158] to-[#D4AF37] rounded-full"
                    style={{ width: '85%' }}
                  />
                </div>
                <p className="text-[11px] text-[#E2D4B7]/70 text-right font-mono">
                  Faltam 550 pts para o prêmio Royale Black Platinum
                </p>
              </div>
            </div>

            {/* Quick Perks */}
            <div className="p-4 rounded-2xl bg-[#0B0B0C]/80 border border-[#D4AF37]/30 flex flex-col justify-between text-xs">
              <h3 className="font-cinzel font-bold text-sm text-[#FFF1C5] flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#D4AF37]" />
                <span>Benefícios Ativos</span>
              </h3>
              <ul className="space-y-2 text-[#E2D4B7]/90 text-[11px]">
                <li>✓ Drink de Boas-Vindas & Espumante</li>
                <li>✓ Desconto Aniversário (20% OFF)</li>
                <li>✓ Atendimento Preferencial sem Fila</li>
              </ul>
              <button
                onClick={() => onNavigate('agenda')}
                className="mt-3 w-full py-2 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs"
              >
                Resgatar em Novo Agendamento
              </button>
            </div>
          </div>

          {/* Vouchers & Rewards */}
          <div className="space-y-4">
            <h3 className="font-cinzel text-lg font-bold gold-gradient-text">
              Vouchers & Recompensas Disponíveis
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Award className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase">Cupom VIP 10%</span>
                </div>
                <p className="text-xs text-[#E2D4B7]/80">
                  Válido para qualquer serviço de cabelo ou estética nesta semana.
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
                  Resgate 1 escova modelada ao acumular mais 150 pontos.
                </p>
                <button className="w-full py-1.5 rounded-lg bg-[#222127] text-xs font-semibold text-[#C5A059] border border-[#D4AF37]/30">
                  Em Breve
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex flex-col justify-between space-y-3">
                <div className="flex items-center gap-2 text-[#D4AF37]">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-xs font-bold uppercase">Boutique 15% OFF</span>
                </div>
                <p className="text-xs text-[#E2D4B7]/80">
                  Desconto em qualquer sérum ou máscara da marca Royale.
                </p>
                <div className="p-2 rounded-lg bg-[#0B0B0C] border border-[#26242A] text-center font-mono text-xs text-[#FFF1C5] font-bold">
                  VIPGOLD
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRETÓRIO DE CLIENTES (Gestão de Clientes) */}
      {activeTab === 'directory' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Controls: Search & Tier Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#121214] p-4 rounded-2xl border border-[#D4AF37]/30">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-[#8E8A80] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Buscar cliente por nome, tel ou e-mail..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#26242A] rounded-xl pl-10 pr-4 py-2 text-xs text-[#FFF1C5] placeholder-[#8E8A80] outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#FFF1C5]">Nível:</span>
              <div className="flex gap-1.5">
                {['todos', 'Diamond', 'Ouro', 'Prata', 'Bronze'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTierFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      tierFilter === t
                        ? 'bg-[#D4AF37] text-[#0B0B0C]'
                        : 'bg-[#0B0B0C] text-[#C5A059] border border-[#26242A]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client Table / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/30 flex items-center justify-between gap-4 group hover:border-[#D4AF37]/60 transition-all"
              >
                <div className="flex items-center gap-4">
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                        {client.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#E2D4B7]/70 flex items-center gap-2 mt-1">
                      <span><Phone className="w-3 h-3 inline mr-1 text-[#C5A059]" />{client.phone}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-[#C5A059] mt-2">
                      <span>Pontos: {client.loyaltyPoints}</span>
                      <span>Visitas: {client.totalVisits}</span>
                      <span>Total: R$ {client.totalSpent.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => alert(`Iniciando contato via WhatsApp com ${client.name}`)}
                    className="px-3 py-1.5 rounded-lg bg-[#222127] hover:bg-[#D4AF37] text-[#FFF1C5] hover:text-[#0B0B0C] border border-[#D4AF37]/30 text-xs font-bold transition-all"
                  >
                    Contato
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
