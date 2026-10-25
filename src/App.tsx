/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserRole, CartItem, BeautyService, SalonProduct, VIPClient, Appointment, SalonSettings, SalonOrder } from './types';
import { 
  MOCK_VIP_CLIENTS, 
  INITIAL_APPOINTMENTS, 
  SALON_PRODUCTS, 
  SALON_SERVICES, 
  DEFAULT_SALON_SETTINGS, 
  INITIAL_ORDERS,
  SALON_STYLISTS 
} from './data/mockData';
import { storageService, STORAGE_KEYS } from './services/storageService';
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
  
  // Shared Top-Level State with localStorage Initialization
  const [settings, setSettings] = useState<SalonSettings>(() => 
    storageService.loadFromStorage<SalonSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SALON_SETTINGS)
  );

  const [clients, setClients] = useState<VIPClient[]>(() =>
    storageService.loadFromStorage<VIPClient[]>(STORAGE_KEYS.CLIENTS, MOCK_VIP_CLIENTS)
  );

  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    storageService.loadFromStorage<Appointment[]>(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS)
  );

  const [products, setProducts] = useState<SalonProduct[]>(() =>
    storageService.loadFromStorage<SalonProduct[]>(STORAGE_KEYS.PRODUCTS, SALON_PRODUCTS)
  );

  const [services, setServices] = useState<BeautyService[]>(() =>
    storageService.loadFromStorage<BeautyService[]>(STORAGE_KEYS.SERVICES, SALON_SERVICES)
  );

  const [orders, setOrders] = useState<SalonOrder[]>(() =>
    storageService.loadFromStorage<SalonOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );

  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    storageService.loadFromStorage<CartItem[]>(STORAGE_KEYS.CART, [])
  );

  const [stylists] = useState(SALON_STYLISTS);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [preSelectedService, setPreSelectedService] = useState<BeautyService | null>(null);

  // Auto-Save Effects to localStorage on any state change
  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.SERVICES, services);
  }, [services]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    storageService.saveToStorage(STORAGE_KEYS.CART, cartItems);
  }, [cartItems]);

  // Navigation Handler
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

  // Client Handlers
  const handleAddClient = (newClient: VIPClient) => {
    setClients(prev => [newClient, ...prev]);
  };

  const handleUpdateClient = (updatedClient: VIPClient) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const handleDeleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
  };

  const handleSelectClientForBooking = (client: VIPClient) => {
    setUserName(client.name);
  };

  // Appointment Handlers
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => [newApt, ...prev]);
  };

  const handleUpdateAppointment = (updatedApt: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedApt.id ? updatedApt : a));
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelado' as const } : a));
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  // Product CRUD Handlers
  const handleAddProduct = (newProd: SalonProduct) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: SalonProduct) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateStock = (productId: string, delta: number) => {
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, stock: Math.max(0, p.stock + delta) } : p))
    );
  };

  // Service CRUD Handlers
  const handleAddService = (newServ: BeautyService) => {
    setServices(prev => [newServ, ...prev]);
  };

  const handleUpdateService = (updatedServ: BeautyService) => {
    setServices(prev => prev.map(s => s.id === updatedServ.id ? updatedServ : s));
  };

  const handleDeleteService = (serviceId: string) => {
    setServices(prev => prev.filter(s => s.id !== serviceId));
  };

  // Order Handlers
  const handleUpdateOrderStatus = (orderId: string, newStatus: SalonOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Settings Handlers
  const handleUpdateSettings = (newSettings: SalonSettings) => {
    setSettings(newSettings);
  };

  // Reset Storage Handler
  const handleResetToFactoryDefaults = () => {
    storageService.clearAllStorage();
    setSettings(DEFAULT_SALON_SETTINGS);
    setClients(MOCK_VIP_CLIENTS);
    setAppointments(INITIAL_APPOINTMENTS);
    setProducts(SALON_PRODUCTS);
    setServices(SALON_SERVICES);
    setOrders(INITIAL_ORDERS);
    setCartItems([]);
  };

  // Cart Handlers
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
        salonName={settings.salonName}
        tagline={settings.tagline}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentView === 'home' && (
          <HomeView
            onNavigate={handleNavigate}
            onBookService={handleBookService}
            onAddToCart={handleAddToCart}
            slides={settings.carouselSlides}
          />
        )}

        {currentView === 'agenda' && (
          <AgendaView
            appointments={appointments}
            onAddAppointment={handleAddAppointment}
            onUpdateAppointment={handleUpdateAppointment}
            onCancelAppointment={handleCancelAppointment}
            onAddToCart={handleAddServiceCartItem}
            onOpenCart={() => setIsCartOpen(true)}
            initialService={preSelectedService}
            clients={clients}
          />
        )}

        {currentView === 'vitrine' && (
          <VitrineView
            products={products}
            onAddToCart={handleAddToCart}
            onNavigateToAdmin={() => handleNavigate('admin')}
          />
        )}

        {currentView === 'clientes' && (
          <ClientesView
            userRole={userRole}
            onNavigate={handleNavigate}
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onSelectClientForBooking={handleSelectClientForBooking}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateStock={handleUpdateStock}
            
            appointments={appointments}
            onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
            
            clients={clients}
            onAddClient={handleAddClient}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}

            services={services}
            onAddService={handleAddService}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}

            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}

            settings={settings}
            onUpdateSettings={handleUpdateSettings}

            stylists={stylists}
            onNavigate={handleNavigate}
            onResetToFactoryDefaults={handleResetToFactoryDefaults}
          />
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
              {settings.salonName} — {settings.tagline}
            </div>
            <p className="text-[#8E8A80]">
              © 2026 {settings.salonName}. Todos os direitos reservados. Design de Luxo & Alta Performance.
            </p>
            <div className="flex gap-4 text-[11px] text-[#E2D4B7]">
              <button onClick={() => handleNavigate('home')} className="hover:underline">Início</button>
              <button onClick={() => handleNavigate('agenda')} className="hover:underline">Agendar</button>
              <button onClick={() => handleNavigate('vitrine')} className="hover:underline">Boutique</button>
              <button onClick={() => handleNavigate('clientes')} className="hover:underline">Clientes</button>
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
