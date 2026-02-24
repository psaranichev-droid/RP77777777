import React, { useState, useEffect } from 'react';
import { cn } from '../utils/cn';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Оптимизированный компонент изображения с:
 * - WebP поддержкой (fallback на PNG/JPG)
 * - Lazy loading
 * - Responsive sizes
 * - Placeholder skeleton
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  loading = 'lazy',
  sizes,
  priority = false,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(!priority);
  const [error, setError] = useState(false);

  // Преобразуем URL для WebP версии (если на своем сервере)
  const getWebPSrc = (imgSrc: string) => {
    // Если это внешний URL (Yandex, и т.д.), оставляем как есть
    if (!imgSrc.startsWith('/public')) {
      return null;
    }
    return imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
  };

  const webpSrc = getWebPSrc(src);

  return (
    <div className={cn('relative overflow-hidden bg-slate-100', className)}>
      {/* Skeleton placeholder при загрузке */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 animate-pulse" />
      )}

      {/* WebP + PNG версии */}
      <picture>
        {webpSrc && (
          <source
            srcSet={webpSrc}
            type="image/webp"
            media="(min-width: 0px)"
          />
        )}
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          sizes={sizes}
          className={cn(
            'w-full h-full object-contain transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={() => {
            setIsLoading(false);
            onLoad?.();
          }}
          onError={() => {
            setError(true);
            setIsLoading(false);
            onError?.();
          }}
          decoding="async"
        />
      </picture>

      {/* Fallback при ошибке загрузки */}
      {error && (
        <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 text-sm">
          <span>Изображение не загружено</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
