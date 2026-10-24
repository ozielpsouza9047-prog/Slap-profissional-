import React, { useState, useEffect, useCallback } from 'react';
import { CarouselSlide } from '../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, Pause, Play } from 'lucide-react';

interface HomeCarouselProps {
  slides: CarouselSlide[];
  onNavigate: (view: string) => void;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ slides, onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  }, [slides.length]);

  // Autoplay loop timer (5 seconds)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isPaused]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl border border-[#D4AF37]/30 bg-[#121214] shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Aspect Ratio Container for Responsive Mobile and Desktop */}
      <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[520px] flex items-center">
        {/* Background Image with Measured Contrast Scrim Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transform group-hover:scale-100 transition-transform duration-1000"
              />
              {/* Luxury Gradient Dark Scrim Overlay for WCAG contrast */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/85 to-transparent sm:w-3/4 lg:w-2/3" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0C] via-transparent to-black/40" />
            </div>
          ))}
        </div>

        {/* Slide Content */}
        <div className="relative z-20 max-w-2xl px-6 sm:px-10 py-12 space-y-4">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-xs font-bold text-[#FFF1C5] tracking-widest uppercase backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{currentSlide.tag}</span>
          </div>

          {/* Title */}
          <h1 className="font-cinzel text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight champagne-gradient-text text-wrap-balance">
            {currentSlide.title}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#E2D4B7]/90 leading-relaxed font-body max-w-xl">
            {currentSlide.subtitle}
          </p>

          {/* Action CTA */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate(currentSlide.targetView)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#E5C158] via-[#D4AF37] to-[#B8860B] text-[#0B0B0C] font-extrabold text-sm tracking-wide hover:brightness-110 transition-all shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2 group/btn"
            >
              <span>{currentSlide.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigate('vitrine')}
              className="px-5 py-3 rounded-xl bg-[#121214]/80 hover:bg-[#18181B] border border-[#D4AF37]/40 text-[#FFF1C5] font-semibold text-sm transition-all backdrop-blur-md"
            >
              Ver Boutique de Produtos
            </button>
          </div>
        </div>

        {/* Navigation Arrow Controls (Desktop / Tablet) */}
        <button
          onClick={prevSlide}
          className="hidden sm:flex absolute left-4 z-30 p-3 rounded-full bg-[#0B0B0C]/70 hover:bg-[#D4AF37] text-[#FFF1C5] hover:text-[#0B0B0C] border border-[#D4AF37]/30 transition-all focus:outline-none"
          aria-label="Slide Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden sm:flex absolute right-4 z-30 p-3 rounded-full bg-[#0B0B0C]/70 hover:bg-[#D4AF37] text-[#FFF1C5] hover:text-[#0B0B0C] border border-[#D4AF37]/30 transition-all focus:outline-none"
          aria-label="Próximo Slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Bottom Carousel Controls Bar (Indicators, Counter & Play/Pause) */}
        <div className="absolute bottom-4 left-6 right-6 z-30 flex items-center justify-between">
          {/* Slide Indicators Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-gradient-to-r from-[#E5C158] to-[#D4AF37]'
                    : 'w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/60'
                }`}
                aria-label={`Ir para slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Autoplay status & index counter */}
          <div className="flex items-center gap-3 bg-[#0B0B0C]/80 px-3 py-1 rounded-full border border-[#D4AF37]/20 text-xs font-mono text-[#C5A059] backdrop-blur-md">
            <span>0{currentIndex + 1} / 0{slides.length}</span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="hover:text-[#FFF1C5] focus:outline-none"
              title={isPaused ? "Retomar reprodução automática" : "Pausar carrossel"}
            >
              {isPaused ? <Play className="w-3 h-3 text-[#D4AF37]" /> : <Pause className="w-3 h-3 text-[#C5A059]" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
