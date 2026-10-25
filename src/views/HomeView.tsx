import React from 'react';
import { HomeCarousel } from '../components/HomeCarousel';
import { HERO_CAROUSEL_SLIDES, SALON_SERVICES, SALON_PRODUCTS, SALON_STYLISTS } from '../data/mockData';
import { BeautyService, SalonProduct } from '../types';
import { Sparkles, Calendar, ArrowRight, Star, Clock, MapPin, Phone, ShieldCheck, Heart, Award } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onBookService: (service: BeautyService) => void;
  onAddToCart: (product: SalonProduct) => void;
  slides?: typeof HERO_CAROUSEL_SLIDES;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onBookService,
  onAddToCart,
  slides = HERO_CAROUSEL_SLIDES
}) => {
  const popularServices = SALON_SERVICES.filter(s => s.popular);
  const featuredProducts = SALON_PRODUCTS.slice(0, 3);

  const categories = [
    {
      id: 'cabelo',
      name: 'Cabelos & Mechas VIP',
      desc: 'Balayage, colorimetria e corte master',
      count: '12 Serviços',
      icon: '✨'
    },
    {
      id: 'estetica',
      name: 'Estética & Maquiagem HD',
      desc: 'Make de gala e design de sobrancelhas',
      count: '8 Serviços',
      icon: '💄'
    },
    {
      id: 'unhas',
      name: 'Esmaltaria & Manicure Spa',
      desc: 'Cutilagem russa e folha de ouro 24k',
      count: '6 Serviços',
      icon: '💅'
    },
    {
      id: 'spa',
      name: 'Spa Capilar & Cauterização',
      desc: 'Reconstrução profunda de lipídios',
      count: '10 Serviços',
      icon: '👑'
    }
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Auto Carousel Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <HomeCarousel slides={slides} onNavigate={onNavigate} />
      </section>

      {/* 2. Quick Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">
              Menu Exclusivo
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text">
              Categorias de Beleza Royale
            </h2>
          </div>
          <button
            onClick={() => onNavigate('agenda')}
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFF1C5] flex items-center gap-1 group"
          >
            <span>Ver Todos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('agenda')}
              className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 transition-all cursor-pointer group hover:-translate-y-1 shadow-lg"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-cinzel font-bold text-base text-[#FFF1C5] group-hover:text-[#D4AF37] transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-[#E2D4B7]/70 mt-1 line-clamp-2">
                {cat.desc}
              </p>
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#26242A] text-[11px] font-mono text-[#C5A059]">
                <span>{cat.count}</span>
                <span className="group-hover:translate-x-1 transition-transform">Agendar →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Featured Services Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-[#121214] border border-[#D4AF37]/30 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-bold text-[#FFF1C5]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Mais Desejados</span>
              </div>
              <h2 className="font-cinzel text-2xl font-bold champagne-gradient-text mt-2">
                Serviços Assinatura do Salão
              </h2>
            </div>
            <button
              onClick={() => onNavigate('agenda')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-2 self-start sm:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Abrir Agenda Completa</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {popularServices.map((service) => (
              <div
                key={service.id}
                className="p-5 rounded-2xl bg-[#0B0B0C] border border-[#26242A] hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37]">
                      {service.category}
                    </span>
                    <span className="text-xs font-mono text-[#C5A059] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#D4AF37]" />
                      {service.durationMinutes} min
                    </span>
                  </div>

                  <h3 className="font-cinzel font-bold text-base text-[#FFF1C5] group-hover:text-[#D4AF37] transition-colors">
                    {service.name}
                  </h3>

                  <p className="text-xs text-[#E2D4B7]/80 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#26242A] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-[#8E8A80] block">Investimento VIP</span>
                    <span className="text-lg font-bold font-mono gold-gradient-text">
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => onBookService(service)}
                    className="px-3.5 py-2 rounded-lg bg-[#222127] hover:bg-[#D4AF37] text-[#FFF1C5] hover:text-[#0B0B0C] border border-[#D4AF37]/30 text-xs font-extrabold transition-all"
                  >
                    Agendar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Products Boutique Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest block">
              Boutique Exclusiva
            </span>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold gold-gradient-text">
              Produtos Home Care de Luxo
            </h2>
          </div>
          <button
            onClick={() => onNavigate('vitrine')}
            className="text-xs font-semibold text-[#D4AF37] hover:text-[#FFF1C5] flex items-center gap-1"
          >
            <span>Ir para Vitrine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col justify-between group"
            >
              <div className="relative overflow-hidden rounded-xl mb-3 bg-[#0B0B0C] h-48">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {product.isBestSeller && (
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#E5C158] to-[#B8860B] text-[#0B0B0C] text-[10px] font-extrabold uppercase shadow-md">
                    Mais Vendido
                  </span>
                )}
              </div>

              <div>
                <span className="text-[10px] text-[#C5A059] uppercase font-bold tracking-wider">
                  {product.brand}
                </span>
                <h3 className="text-sm font-semibold text-[#FFF1C5] line-clamp-1 mt-0.5">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 text-amber-400 text-xs mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-bold">{product.rating.toFixed(1)}</span>
                  <span className="text-[#8E8A80] text-[10px]">({product.volume})</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#26242A] flex items-center justify-between">
                <div>
                  {product.oldPrice && (
                    <span className="text-[11px] text-[#8E8A80] line-through block font-mono">
                      R$ {product.oldPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-base font-bold font-mono gold-gradient-text">
                    R$ {product.price.toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => onAddToCart(product)}
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37] border border-[#D4AF37]/40 text-[#FFF1C5] hover:text-[#0B0B0C] text-xs font-bold transition-all"
                >
                  + Sacola
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Team of Master Stylists */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold text-[#C5A059] uppercase tracking-widest">
            Equipe Especializada
          </span>
          <h2 className="font-cinzel text-2xl font-bold champagne-gradient-text">
            Mestres da Beleza Royale
          </h2>
          <p className="text-xs text-[#E2D4B7]/80">
            Profissionais premiados e capacitados com certificações internacionais.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SALON_STYLISTS.map((stylist) => (
            <div
              key={stylist.id}
              className="p-5 rounded-2xl bg-[#121214] border border-[#D4AF37]/20 text-center space-y-3 hover:border-[#D4AF37]/50 transition-all group"
            >
              <div className="relative w-24 h-24 mx-auto rounded-full p-[2px] bg-gradient-to-tr from-[#E5C158] to-[#B8860B]">
                <img
                  src={stylist.avatar}
                  alt={stylist.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              <div>
                <h3 className="font-cinzel font-bold text-base text-[#FFF1C5]">
                  {stylist.name}
                </h3>
                <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                  {stylist.role}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-1">
                {stylist.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-[#18181B] border border-[#26242A] text-[#E2D4B7]"
                  >
                    {spec}
                  </span>
                ))}
              </div>

              <div className="pt-3 border-t border-[#26242A] flex items-center justify-between text-xs text-[#C5A059]">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-bold text-[#FFF1C5]">{stylist.rating}</span>
                </div>
                <button
                  onClick={() => onNavigate('agenda')}
                  className="text-[11px] font-bold text-[#D4AF37] hover:underline"
                >
                  Agendar Comigo
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Salon Location & Operating Hours */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl bg-[#121214] border border-[#D4AF37]/30 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#FFF1C5]">
              Localização Privilegiada
            </h3>
            <p className="text-xs text-[#E2D4B7]/80 leading-relaxed">
              Av. Gabriel Monteiro da Silva, 1420 — Jardins, São Paulo / SP<br />
              Estacione com serviço de Valet Cortesia.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#FFF1C5]">
              Horário de Atendimento
            </h3>
            <p className="text-xs text-[#E2D4B7]/80 leading-relaxed">
              Terça a Sábado: 08:00 às 20:00<br />
              Domingos e Feriados: Sob agendamento VIP antecipado.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/15 flex items-center justify-center text-[#D4AF37]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel font-bold text-lg text-[#FFF1C5]">
              Concierge Royale
            </h3>
            <p className="text-xs text-[#E2D4B7]/80 leading-relaxed">
              WhatsApp VIP: (11) 99888-7766<br />
              Telefone: (11) 3088-0099
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
