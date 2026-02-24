import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { heroTitle, heroSubtitle, heroButtons } from '../utils/animations';
import { TEXTURE_PATTERNS } from '../utils/textures';

interface HeroButton {
  label: string;
  href: string;
  primary?: boolean;
}

interface HeroProps {
  title: string;
  description: string;
  buttons: HeroButton[];
  backgroundImage?: string;
  videoSrc?: string;
  overlayColor?: string;
  theme?: 'light' | 'dark' | 'glass';
}

const Hero: React.FC<HeroProps> = ({
  title,
  description,
  buttons,
  backgroundImage,
  videoSrc,
  overlayColor = 'bg-indigo-950/80',
  theme = 'dark'
}) => {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] lg:min-h-[650px] flex items-center overflow-hidden py-16 md:py-24 lg:py-32">
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {videoSrc ? (
          <video autoPlay loop muted playsInline className="w-full h-full object-cover">
            <source src={videoSrc} type="video/mp4" />
          </video>
        ) : backgroundImage ? (
          <img src={backgroundImage} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
        )}
        <div className={`absolute inset-0 ${overlayColor}`} />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/60 via-transparent to-transparent" />
        {/* Crumpled paper texture overlay - встроенная SVG */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none mix-blend-multiply"
          style={{
            backgroundImage: `url('${TEXTURE_PATTERNS.crumpledPaper}')`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl">
        <div className="max-w-4xl">
          <motion.h1
            {...heroTitle}
            className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-normal font-rubik mb-6 leading-[1.15] whitespace-pre-line ${
              theme === 'light' ? 'text-slate-900' : 'text-white'
            }`}
          >
            {title}
          </motion.h1>

          <motion.p
            {...heroSubtitle}
            className={`text-base md:text-lg mb-10 leading-relaxed max-w-2xl ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-200'
            }`}
          >
            {description}
          </motion.p>

          <motion.div {...heroButtons} className="flex flex-wrap gap-4">
            {buttons.map((button, index) => {
              const isInternal = button.href.startsWith('/');
              const cls = `inline-flex items-center px-8 py-4 rounded-xl font-bold text-base transition-colors duration-200 ${
                button.primary
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30'
                  : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
              }`;

              return isInternal ? (
                <Link key={index} to={button.href} className={cls}>
                  {button.label}
                  {button.primary && <ArrowRight className="ml-2 w-5 h-5" />}
                </Link>
              ) : (
                <a key={index} href={button.href} className={cls}>
                  {button.label}
                  {button.primary && <ArrowRight className="ml-2 w-5 h-5" />}
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
