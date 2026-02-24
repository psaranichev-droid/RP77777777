import { useEffect, useState } from 'react';

/**
 * Hook для определения предпочтения пользователя относительно анимаций
 * Использует prefers-reduced-motion media query
 *
 * Применение:
 * - Отключит анимации на слабых устройствах
 * - Отключит анимации если пользователь включил режим "уменьшение движения" в ОС
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Проверяем настройку ОС
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    // Слушаем изменения настройки
    const listener = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
};

/**
 * Оптимизирует параметры анимации в зависимости от prefers-reduced-motion
 */
export const getOptimizedAnimation = (
  fullAnimation: any,
  reducedAnimation: any,
  prefersReducedMotion: boolean
) => {
  return prefersReducedMotion ? reducedAnimation : fullAnimation;
};

/**
 * Отключает анимацию если нужно
 */
export const getAnimationDuration = (duration: number, prefersReducedMotion: boolean) => {
  return prefersReducedMotion ? 0 : duration;
};
