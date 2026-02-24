// ─── Единая система анимаций ─────────────────────────
// Все значения согласованы для органичного вида

export const EASE = {
  out: [0.22, 1, 0.36, 1] as const,       // Мягкий выход — основной
  inOut: [0.65, 0, 0.35, 1] as const,     // Симметричный — для overlay
  spring: { type: 'spring' as const, damping: 30, stiffness: 250, mass: 0.8 },
} as const;

export const DURATION = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  xslow: 0.7,
} as const;

// ─── Готовые пресеты для framer-motion ──────────────

/** Плавное появление снизу (для секций при скролле) */
export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: { duration: DURATION.slow, ease: EASE.out },
};

/** Плавное появление (без сдвига) */
export const fadeIn = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: { duration: DURATION.normal, ease: EASE.out },
};

/** Для stagger-эффекта (дочерние элементы с задержкой) */
export const staggerChild = (index: number, baseDelay = 0) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-40px' },
  transition: {
    duration: DURATION.normal,
    ease: EASE.out,
    delay: baseDelay + index * 0.06,
  },
});

/** Hero — последовательное появление текста */
export const heroTitle = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE.out },
};

export const heroSubtitle = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE.out, delay: 0.15 },
};

export const heroButtons = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: DURATION.slow, ease: EASE.out, delay: 0.3 },
};

/** Overlay (затемнение) */
export const overlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.fast, ease: EASE.inOut },
};

/** Drawer (боковая панель) */
export const drawer = {
  initial: { x: '100%' },
  animate: { x: 0 },
  exit: { x: '100%' },
  transition: EASE.spring,
};

/** Мобильное меню (слева) */
export const mobileMenu = {
  initial: { x: '-100%' },
  animate: { x: 0 },
  exit: { x: '-100%' },
  transition: EASE.spring,
};

/** Dropdown (поиск, каталог) — мгновенное появление */
export const dropdown = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: DURATION.instant },
};
