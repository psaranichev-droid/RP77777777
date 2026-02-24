import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

interface Slide {
  image: string;
}

const slides: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=1920&h=820&fit=crop&crop=center',
    title: 'Дизайнерская бумага',
    subtitle: 'Премиальные коллекции из Европы',
    description: 'Более 500 видов текстур и оттенков для ваших самых смелых идей.',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&h=820&fit=crop&crop=center',
    title: 'Идеальная резка',
    subtitle: 'Точность до миллиметра',
    description: 'Профессиональное оборудование для нарезки бумаги под любые форматы.',
  },
  {
    image: 'https://images.unsplash.com/photo-1601662528567-526cd06f6582?w=1920&h=820&fit=crop&crop=center',
    title: 'Свой шоурум',
    subtitle: 'Приходите вдохновляться',
    description: 'Посмотрите и потрогайте образцы перед покупкой в нашем уютном пространстве.',
  },
];

export const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Автопрокрутка
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  return (
    <section 
      className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out",
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Crumpled paper texture overlay */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,.03) 2px, rgba(0,0,0,.03) 4px),
                  repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.02) 10px, rgba(0,0,0,.02) 20px),
                  repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(0,0,0,.02) 10px, rgba(0,0,0,.02) 20px)
                `,
                backgroundColor: '#f5f5f5',
              }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/20 to-transparent" />
            
            {/* Content */}
            <div className="absolute inset-0 z-20 flex items-center">
              <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentSlide ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2, duration: 0.8 }}
                  >
                    <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest mb-6">
                      {slide.subtitle}
                    </span>
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 font-rubik leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 font-inter leading-relaxed max-w-lg">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <button className="px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-all active:scale-95 shadow-xl shadow-white/10">
                        В каталог
                      </button>
                      <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold rounded-xl hover:bg-white/20 transition-all active:scale-95">
                        О нас
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-slate-900/30 backdrop-blur-md text-white hover:bg-slate-900/60 transition-all duration-300 group border border-white/10"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-6 lg:right-10 top-1/2 -translate-y-1/2 z-30 w-12 h-12 items-center justify-center rounded-full bg-slate-900/30 backdrop-blur-md text-white hover:bg-slate-900/60 transition-all duration-300 group border border-white/10"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300 shadow-lg",
              index === currentSlide 
                ? "w-10 bg-white" 
                : "w-2.5 bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};