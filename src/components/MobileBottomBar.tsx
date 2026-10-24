import React from 'react';
import { UserRole } from '../types';
import { Home, Calendar, Store, Users, ShoppingBag, ShieldCheck } from 'lucide-react';

interface MobileBottomBarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  userRole: UserRole;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  currentView,
  onNavigate,
  cartCount,
  onOpenCart,
  userRole
}) => {
  const navItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'agenda', label: 'Agendar', icon: Calendar },
    { id: 'vitrine', label: 'Vitrine', icon: Store },
    { id: 'clientes', label: 'Clientes', icon: Users },
    { id: 'sacola', label: 'Sacola', icon: ShoppingBag, isCart: true },
    { id: 'admin', label: 'ADM', icon: ShieldCheck }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0B0C]/95 backdrop-blur-lg border-t border-[#D4AF37]/30 px-2 py-1.5 shadow-2xl">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          if (item.isCart) {
            return (
              <button
                key={item.id}
                onClick={onOpenCart}
                className="relative flex flex-col items-center justify-center p-1.5 text-center group"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-[#C5A059] group-hover:text-[#D4AF37] transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#0B0B0C]">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium text-[#C5A059] mt-0.5">
                  Sacola
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center p-1.5 transition-all ${
                isActive ? 'text-[#D4AF37]' : 'text-[#8E8A80] hover:text-[#E2D4B7]'
              }`}
            >
              <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110 bg-[#D4AF37]/15' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium mt-0.5 ${isActive ? 'gold-gradient-text font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
