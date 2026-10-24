import React from 'react';
import { UserRole } from '../types';
import { ShoppingBag, Crown, User, ShieldCheck, Calendar, Sparkles, Menu, X, Store } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  userRole: UserRole;
  onToggleRole: () => void;
  cartCount: number;
  onOpenCart: () => void;
  userName?: string;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  userRole,
  onToggleRole,
  cartCount,
  onOpenCart,
  userName = 'Cliente VIP',
  onOpenLogin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Início', icon: Sparkles },
    { id: 'agenda', label: 'Agenda VIP', icon: Calendar },
    { id: 'vitrine', label: 'Boutique Produtos', icon: Store },
    { id: 'clientes', label: 'Clientes VIP', icon: User },
    { id: 'admin', label: 'Painel ADM', icon: ShieldCheck }
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B0B0C]/90 backdrop-blur-md border-b border-[#D4AF37]/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNav('home')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E5C158] via-[#D4AF37] to-[#8C6F1E] p-[1px] shadow-lg shadow-[#D4AF37]/10 group-hover:shadow-[#D4AF37]/30 transition-all">
              <div className="w-full h-full bg-[#0B0B0C] rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-bold tracking-wider gold-gradient-text block leading-none">
                STUDIO ROYALE
              </span>
              <span className="text-[10px] tracking-[0.2em] text-[#C5A059] uppercase font-medium block mt-1">
                Haute Beauté & Spa
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links for Desktop */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#D4AF37]/15 text-[#FFF1C5] border border-[#D4AF37]/40 shadow-sm'
                    : 'text-[#E2D4B7]/80 hover:text-[#FFF1C5] hover:bg-[#18181B]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-[#C5A059]'}`} />
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions (Role Switch, Cart & Login) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Role Toggle Button */}
          <button
            onClick={onToggleRole}
            title={`Alternar perfil (Atual: ${userRole === 'admin' ? 'Administrador' : 'Cliente VIP'})`}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#D4AF37]/30 bg-[#121214] text-[#E2D4B7] hover:border-[#D4AF37] transition-colors"
          >
            {userRole === 'admin' ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="gold-gradient-text font-bold">Modo ADM</span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Modo Cliente</span>
              </>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={onOpenCart}
            className="relative p-2.5 rounded-full bg-[#18181B] border border-[#D4AF37]/30 text-[#FFF1C5] hover:border-[#D4AF37] hover:bg-[#222127] transition-all"
            aria-label="Abrir Sacola de compras"
          >
            <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0B0B0C] shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Account / Login Button */}
          <button
            onClick={onOpenLogin}
            className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-medium text-[#FFF1C5] transition-all"
          >
            <User className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="truncate max-w-[100px]">{userName}</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#18181B] text-[#FFF1C5] border border-[#D4AF37]/30 focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0B0C] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#18181B]">
            <span className="text-xs text-[#C5A059] uppercase tracking-wider font-semibold">
              Navegação Studio Royale
            </span>
            <button
              onClick={onToggleRole}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-[#18181B] border border-[#D4AF37]/30 text-[#FFF1C5]"
            >
              {userRole === 'admin' ? 'Alternar p/ Cliente' : 'Alternar p/ ADM'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#FFF1C5]'
                      : 'bg-[#121214] border-[#26242A] text-[#E2D4B7] hover:border-[#D4AF37]/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs font-medium">{link.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" />
              Minha Conta / Autenticação
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
