/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole, CartItem, BeautyService, SalonProduct } from './types';
import { Header } from './components/Header';
import { MobileBottomBar } from './components/MobileBottomBar';
import { CartDrawer } from './components/CartDrawer';
import { HomeView } from './views/HomeView';
import { AgendaView } from './views/AgendaView';
import { VitrineView } from './views/VitrineView';
import { ClientesView } from './views/ClientesView';
import { AdminView } from './views/AdminView';
import { LoginView } from './views/LoginView';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole>('client');
  const [userName, setUserName] = useState<string>('Helena Cavalcanti (VIP)');
  
  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Selected Service for direct booking shortcut
  const [preSelectedService, setPreSelectedService] = useState<BeautyService | null>(null);

  // Handlers
  const handleNavigate = (view: string) => {
    if (view === 'sacola') {
      setIsCartOpen(true);
      return;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleRole = () => {
    const newRole = userRole === 'admin' ? 'client' : 'admin';
    setUserRole(newRole);
    if (newRole === 'admin') {
      setUserName('Sophia Royale (ADM)');
      setCurrentView('admin');
    } else {
      setUserName('Helena Cavalcanti (VIP)');
      setCurrentView('home');
    }
  };

  const handleLoginSuccess = (role: UserRole, name: string) => {
    setUserRole(role);
    setUserName(name);
  };

  const handleBookService = (service: BeautyService) => {
    setPreSelectedService(service);
    setCurrentView('agenda');
  };

  const handleAddToCart = (product: SalonProduct) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevItems,
        {
          type: 'product',
          id: product.id,
          title: product.name,
          subtitle: `${product.brand} · ${product.volume}`,
          price: product.price,
          quantity: 1,
          image: product.image
        }
      ];
    });
    setIsCartOpen(true);
  };

  const handleAddServiceCartItem = (serviceCartItem: CartItem) => {
    setCartItems(prev => [serviceCartItem, ...prev]);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5E6C8] font-sans flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#FFF8E7]">
      
      {/* Header Bar */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        onToggleRole={handleToggleRole}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        userName={userName}
        onOpenLogin={() => handleNavigate('login')}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onBookService={handleBookService}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'agenda' && (
          <AgendaView
            onAddToCart={handleAddServiceCartItem}
            onOpenCart={() => setIsCartOpen(true)}
            initialService={preSelectedService}
          />
        )}

        {currentView === 'vitrine' && (
          <VitrineView onAddToCart={handleAddToCart} />
        )}

        {currentView === 'clientes' && (
          <ClientesView userRole={userRole} onNavigate={handleNavigate} />
        )}

        {currentView === 'admin' && (
          <AdminView onNavigate={handleNavigate} />
        )}

        {currentView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer (Desktop / General) */}
      {currentView !== 'admin' && (
        <footer className="bg-[#0B0B0C] border-t border-[#D4AF37]/20 py-8 px-4 text-center text-xs text-[#C5A059] hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="font-cinzel text-base font-bold gold-gradient-text">
              STUDIO ROYALE HAUTE BEAUTÉ & SPA
            </div>
            <p className="text-[#8E8A80]">
              © 2026 Studio Royale. Todos os direitos reservados. Design de Luxo & Alta Performance.
            </p>
            <div className="flex gap-4 text-[11px] text-[#E2D4B7]">
              <button onClick={() => handleNavigate('home')} className="hover:underline">Início</button>
              <button onClick={() => handleNavigate('agenda')} className="hover:underline">Agendar</button>
              <button onClick={() => handleNavigate('vitrine')} className="hover:underline">Boutique</button>
              <button onClick={() => handleNavigate('admin')} className="hover:underline">Painel ADM</button>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomBar
        currentView={currentView}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        userRole={userRole}
      />

      {/* Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
