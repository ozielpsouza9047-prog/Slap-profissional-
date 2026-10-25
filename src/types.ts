export type UserRole = 'client' | 'admin';

export interface BeautyService {
  id: string;
  name: string;
  category: 'cabelo' | 'estetica' | 'unhas' | 'spa';
  durationMinutes: number;
  price: number;
  description: string;
  recommendedStylistId?: string;
  popular?: boolean;
}

export interface Stylist {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  avatar: string;
  rating: number;
  reviewCount: number;
  availableDays: string[];
}

export interface SalonProduct {
  id: string;
  name: string;
  brand: string;
  category: 'cabelos' | 'tratamentos' | 'perfumes' | 'homecare';
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  volume: string;
  rating: number;
  stock: number;
  isBestSeller?: boolean;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceId: string;
  serviceName: string;
  stylistId: string;
  stylistName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  price: number;
  status: 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  paymentMethod?: string;
  notes?: string;
}

export interface VIPClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  tier: 'Bronze' | 'Prata' | 'Ouro' | 'Diamond Royale';
  loyaltyPoints: number;
  totalVisits: number;
  totalSpent: number;
  lastVisit: string;
  avatar: string;
  notes?: string;
  birthdate?: string;
  cpf?: string;
}

export interface CartItem {
  type: 'service' | 'product';
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  quantity: number;
  image?: string;
  selectedStylistName?: string;
  selectedDate?: string;
  selectedTime?: string;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  ctaText: string;
  targetView: 'agenda' | 'vitrine' | 'clientes';
}

export interface SalonSettings {
  salonName: string;
  tagline: string;
  logoUrl: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  goldColorIntensity: 'padrao' | 'intenso' | 'champagne';
  securityTwoFactor: boolean;
  notifyEmailAppointments: boolean;
  carouselSlides: CarouselSlide[];
}

export interface SalonOrder {
  id: string;
  clientName: string;
  clientPhone: string;
  itemsSummary: string;
  total: number;
  paymentMethod: string;
  date: string;
  status: 'Pendente' | 'Pago' | 'Concluído' | 'Cancelado';
  items?: CartItem[];
}

