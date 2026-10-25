import { BeautyService, Stylist, SalonProduct, Appointment, VIPClient, CarouselSlide } from '../types';

export const HERO_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 'slide-1',
    tag: 'EXCLUSIVIDADE ROYALE',
    title: 'Transformação & Alto Padrão em Beleza',
    subtitle: 'Ambiente climatizado, atendimento privativo e colorimetria avançada com técnicas internacionais.',
    image: '/src/assets/images/hero_salon_interior_1792883896350.jpg',
    ctaText: 'Agendar Horário VIP',
    targetView: 'agenda'
  },
  {
    id: 'slide-2',
    tag: 'MECHAS & BALAYAGE',
    title: 'Loiros Radiantes & Tratamentos de Luxo',
    subtitle: 'Ilumine seus fios com preservação total da fibra capilar e reconstrução de diamante.',
    image: '/src/assets/images/hero_hair_styling_1792883897275.jpg',
    ctaText: 'Conheça os Serviços',
    targetView: 'agenda'
  },
  {
    id: 'slide-3',
    tag: 'SPA DE UNHAS & ESTÉTICA',
    title: 'Manicure de Luxo & Ritual Champagne',
    subtitle: 'Cuidado minucioso para suas mãos e pés com folha de ouro e essências francesas.',
    image: '/src/assets/images/hero_spa_manicure_1792883897069.jpg',
    ctaText: 'Reservar Tratamento',
    targetView: 'agenda'
  }
];

export const SALON_SERVICES: BeautyService[] = [
  {
    id: 'serv-1',
    name: 'Balayage Royale & Colorimetria VIP',
    category: 'cabelo',
    durationMinutes: 180,
    price: 680,
    description: 'Técnica exclusiva de iluminação capilar com proteção plex e matização personalizada.',
    popular: true,
    recommendedStylistId: 'stylist-1'
  },
  {
    id: 'serv-2',
    name: 'Corte Master Stylist & Escova Modelada',
    category: 'cabelo',
    durationMinutes: 60,
    price: 220,
    description: 'Visagismo facial, lavatório com massagem craniana relaxante e estilização com babyliss.',
    popular: true,
    recommendedStylistId: 'stylist-2'
  },
  {
    id: 'serv-3',
    name: 'Cauterização de Diamante & Ouro 24k',
    category: 'spa',
    durationMinutes: 90,
    price: 390,
    description: 'Reconstrução profunda de lipídios e nanoaminoácidos para fios sensibilizados ou quimicamente tratados.',
    popular: true,
    recommendedStylistId: 'stylist-1'
  },
  {
    id: 'serv-4',
    name: 'Spa de Unhas Royale com Folha de Ouro',
    category: 'unhas',
    durationMinutes: 75,
    price: 180,
    description: 'Cutilagem russa, esfoliação de cristais de ouro, hidratação profunda e esmaltação em gel.',
    popular: false,
    recommendedStylistId: 'stylist-3'
  },
  {
    id: 'serv-5',
    name: 'Maquiagem Social HD & Cílios Magnéticos',
    category: 'estetica',
    durationMinutes: 75,
    price: 290,
    description: 'Preparação de pele blindada, maquiagem de alta definição e aplicação de cílios premium.',
    popular: true,
    recommendedStylistId: 'stylist-4'
  },
  {
    id: 'serv-6',
    name: 'Design de Sobrancelhas com Henna Orgânica',
    category: 'estetica',
    durationMinutes: 45,
    price: 110,
    description: 'Mapeamento facial simétrico, alinhamento dos fios e pigmentação natural de longa duração.',
    popular: false,
    recommendedStylistId: 'stylist-4'
  }
];

export const SALON_STYLISTS: Stylist[] = [
  {
    id: 'stylist-1',
    name: 'Jean-Luc Dubois',
    role: 'Master Colorist & Blonde Specialist',
    specialties: ['Balayage', 'Colorimetria Avançada', 'Reconstrução Capilar'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    reviewCount: 142,
    availableDays: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  {
    id: 'stylist-2',
    name: 'Sophia Royale',
    role: 'Creative Director & Visagista',
    specialties: ['Corte Feminino', 'Visagismo', 'Penteados de Gala'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 5.0,
    reviewCount: 210,
    availableDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  {
    id: 'stylist-3',
    name: 'Isabella Vance',
    role: 'Nail Artist & Spa Specialist',
    specialties: ['Manicure Russa', 'Alongamento em Gel', 'Nail Art Ouro'],
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.95,
    reviewCount: 98,
    availableDays: ['Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  },
  {
    id: 'stylist-4',
    name: 'Camila Alencar',
    role: 'Senior Makeup Artist',
    specialties: ['Make Noivas', 'Pele Blindada', 'Micropigmentação'],
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80',
    rating: 4.97,
    reviewCount: 115,
    availableDays: ['Qua', 'Qui', 'Sex', 'Sáb']
  }
];

export const SALON_PRODUCTS: SalonProduct[] = [
  {
    id: 'prod-1',
    name: 'Elixir d\'Or Sérum Nutritivo Ouro 24k',
    brand: 'Royale Private Label',
    category: 'cabelos',
    price: 340,
    oldPrice: 390,
    image: '/src/assets/images/product_gold_elixir_1792883897426.jpg',
    description: 'Óleo disciplinante enriquecido com partículas de ouro 24k e óleo de argan puro. Nutrição instantânea e brilho espelhado.',
    volume: '100ml',
    rating: 5.0,
    stock: 18,
    isBestSeller: true
  },
  {
    id: 'prod-2',
    name: 'Kérastase Elixir Ultime L\'Huile Originale',
    brand: 'Kérastase Paris',
    category: 'cabelos',
    price: 310,
    image: 'https://images.unsplash.com/photo-1608248597261-833258657640?auto=format&fit=crop&w=600&q=80',
    description: 'Óleo sublimador capilar multibenefícios com óleos preciosos de camélia e marula.',
    volume: '100ml',
    rating: 4.9,
    stock: 24,
    isBestSeller: true
  },
  {
    id: 'prod-3',
    name: 'Máscara Reconstructora Caviar & Seda',
    brand: 'Royale Private Label',
    category: 'tratamentos',
    price: 280,
    oldPrice: 320,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80',
    description: 'Tratamento intensivo para fios extremamente ressecados ou danificados por descoloração.',
    volume: '250g',
    rating: 4.95,
    stock: 12,
    isBestSeller: true
  },
  {
    id: 'prod-4',
    name: 'Perfume de Cabelo Champagne & Amber',
    brand: 'Maison Royale',
    category: 'perfumes',
    price: 195,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    description: 'Bruma perfumada leve com proteção UV e neutralizador de odores para fios impecáveis.',
    volume: '50ml',
    rating: 4.88,
    stock: 30,
    isBestSeller: false
  },
  {
    id: 'prod-5',
    name: 'Vela Aromática Velvet Rose & Oud',
    brand: 'Maison Royale Home',
    category: 'homecare',
    price: 160,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80',
    description: 'Vela perfumada em recipiente de cristal negro para perfumar ambientes com sofisticação.',
    volume: '220g',
    rating: 4.92,
    stock: 15,
    isBestSeller: false
  },
  {
    id: 'prod-6',
    name: 'Shampoo Antifrizz Silk Hydration',
    brand: 'L\'Oréal Professionnel',
    category: 'cabelos',
    price: 145,
    image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80',
    description: 'Limpeza delicada sem sulfato para manutenção da cor e maciez das mechas.',
    volume: '300ml',
    rating: 4.8,
    stock: 40,
    isBestSeller: false
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-101',
    clientName: 'Dra. Helena Cavalcanti',
    clientPhone: '(11) 98765-4321',
    serviceId: 'serv-1',
    serviceName: 'Balayage Royale & Colorimetria VIP',
    stylistId: 'stylist-1',
    stylistName: 'Jean-Luc Dubois',
    date: '2026-10-25',
    time: '14:00',
    durationMinutes: 180,
    price: 680,
    status: 'confirmado',
    paymentMethod: 'Cartão de Crédito',
    notes: 'Preferência por tom loiro pérola frio.'
  },
  {
    id: 'apt-102',
    clientName: 'Beatriz Fonseca',
    clientPhone: '(11) 99123-8899',
    serviceId: 'serv-2',
    serviceName: 'Corte Master Stylist & Escova Modelada',
    stylistId: 'stylist-2',
    stylistName: 'Sophia Royale',
    date: '2026-10-25',
    time: '16:30',
    durationMinutes: 60,
    price: 220,
    status: 'confirmado',
    paymentMethod: 'Pix'
  },
  {
    id: 'apt-103',
    clientName: 'Valentina Rossi',
    clientPhone: '(11) 97654-3210',
    serviceId: 'serv-4',
    serviceName: 'Spa de Unhas Royale com Folha de Ouro',
    stylistId: 'stylist-3',
    stylistName: 'Isabella Vance',
    date: '2026-10-25',
    time: '11:00',
    durationMinutes: 75,
    price: 180,
    status: 'em_andamento',
    paymentMethod: 'No Salão'
  },
  {
    id: 'apt-104',
    clientName: 'Camila Mendes',
    clientPhone: '(11) 98877-6655',
    serviceId: 'serv-5',
    serviceName: 'Maquiagem Social HD & Cílios Magnéticos',
    stylistId: 'stylist-4',
    stylistName: 'Camila Alencar',
    date: '2026-10-24',
    time: '18:00',
    durationMinutes: 75,
    price: 290,
    status: 'concluido',
    paymentMethod: 'Pix'
  }
];

export const MOCK_VIP_CLIENTS: VIPClient[] = [
  {
    id: 'cli-1',
    name: 'Dra. Helena Cavalcanti',
    email: 'helena.cavalcanti@exemplo.com',
    phone: '(11) 98765-4321',
    tier: 'Diamond Royale',
    loyaltyPoints: 3450,
    totalVisits: 18,
    totalSpent: 12400,
    lastVisit: '15/10/2026',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cli-2',
    name: 'Beatriz Fonseca',
    email: 'beatriz.fonseca@exemplo.com',
    phone: '(11) 99123-8899',
    tier: 'Ouro',
    loyaltyPoints: 1820,
    totalVisits: 9,
    totalSpent: 5200,
    lastVisit: '02/10/2026',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cli-3',
    name: 'Valentina Rossi',
    email: 'valentina.rossi@exemplo.com',
    phone: '(11) 97654-3210',
    tier: 'Prata',
    loyaltyPoints: 940,
    totalVisits: 5,
    totalSpent: 2850,
    lastVisit: '20/10/2026',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80'
  },
  {
    id: 'cli-4',
    name: 'Mariana Siqueira',
    email: 'mariana.siqueira@exemplo.com',
    phone: '(11) 96543-2109',
    tier: 'Bronze',
    loyaltyPoints: 420,
    totalVisits: 2,
    totalSpent: 890,
    lastVisit: '10/09/2026',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80'
  }
];

export const DEFAULT_SALON_SETTINGS = {
  salonName: 'STUDIO ROYALE',
  tagline: 'Haute Beauté & Spa Exclusivo',
  logoUrl: '',
  address: 'Av. Gabriel Monteiro da Silva, 1420 — Jardins, São Paulo / SP',
  phone: '(11) 3088-0099',
  whatsapp: '(11) 99888-7766',
  email: 'concierge@studioroyale.com.br',
  goldColorIntensity: 'padrao' as const,
  securityTwoFactor: true,
  notifyEmailAppointments: true,
  carouselSlides: HERO_CAROUSEL_SLIDES
};

export const INITIAL_ORDERS = [
  {
    id: 'PED-9041',
    clientName: 'Dra. Helena Cavalcanti',
    clientPhone: '(11) 98765-4321',
    itemsSummary: '1x Elixir d\'Or Sérum Ouro 24k',
    total: 340.00,
    paymentMethod: 'Pix',
    date: '2026-10-24 15:30',
    status: 'Pago' as const
  },
  {
    id: 'PED-9042',
    clientName: 'Beatriz Fonseca',
    clientPhone: '(11) 99123-8899',
    itemsSummary: '1x Kérastase Elixir Ultime, 1x Perfume Champagne',
    total: 505.00,
    paymentMethod: 'Cartão de Crédito 3x',
    date: '2026-10-24 14:10',
    status: 'Concluído' as const
  },
  {
    id: 'PED-9043',
    clientName: 'Valentina Rossi',
    clientPhone: '(11) 97654-3210',
    itemsSummary: '1x Spa de Unhas Royale',
    total: 180.00,
    paymentMethod: 'Pagar no Salão',
    date: '2026-10-24 11:20',
    status: 'Pendente' as const
  }
];

