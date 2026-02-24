/**
 * SEO утилиты для управления meta tags и структурированными данными
 */

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
}

/**
 * Устанавливает meta tags в head документа
 */
export const setSEOTags = (config: SEOConfig) => {
  const {
    title,
    description,
    keywords,
    canonical,
    ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
  } = config;

  // Title
  document.title = title;
  updateMetaTag('og:title', title);
  updateMetaTag('twitter:title', title);

  // Description
  updateMetaTag('description', description);
  updateMetaTag('og:description', description);
  updateMetaTag('twitter:description', description);

  // Keywords
  if (keywords) {
    updateMetaTag('keywords', keywords);
  }

  // Canonical URL
  if (canonical) {
    updateOrCreateTag('canonical', () => {
      const link = document.createElement('link');
      link.rel = 'canonical';
      link.href = canonical;
      return link;
    });
  }

  // OG Tags
  updateMetaTag('og:type', ogType);
  if (ogImage) {
    updateMetaTag('og:image', ogImage);
    updateMetaTag('twitter:image', ogImage);
  }

  // Twitter Card
  updateMetaTag('twitter:card', twitterCard);

  // Additional OG
  updateMetaTag('og:site_name', 'Paper Shop');
  updateMetaTag('og:locale', 'ru_RU');
};

/**
 * Обновляет или создает meta tag
 */
function updateMetaTag(name: string, content: string) {
  let tag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    const isProperty = ['og:', 'twitter:'].some(prefix => name.startsWith(prefix));
    if (isProperty) {
      tag.setAttribute('property', name);
    } else {
      tag.setAttribute('name', name);
    }
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
}

/**
 * Обновляет или создает обычный тег
 */
function updateOrCreateTag(id: string, createFn: () => HTMLElement) {
  let tag = document.getElementById(id);

  if (tag) {
    tag.remove();
  }

  tag = createFn();
  tag.id = id;
  document.head.appendChild(tag);
}

/**
 * Добавляет структурированные данные (Schema.org JSON-LD)
 */
export const addSchemaMarkup = (schema: Record<string, any>) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'schema-markup';
  script.textContent = JSON.stringify(schema);

  // Удаляем старый схему если есть
  const oldScript = document.getElementById('schema-markup');
  if (oldScript) {
    oldScript.remove();
  }

  document.head.appendChild(script);
};

/**
 * Схема для организации
 */
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Paper Shop',
  description: 'Интернет-магазин качественной бумаги и картона',
  url: window.location.origin,
  image: `${window.location.origin}/logo.png`,
  logo: {
    '@type': 'ImageObject',
    url: `${window.location.origin}/logo.png`,
  },
  sameAs: [
    'https://www.instagram.com/papershop',
    'https://www.facebook.com/papershop',
  ],
  contact: {
    '@type': 'ContactPoint',
    contactType: 'Customer Service',
    telephone: '+7-XXX-XXX-XXXX',
  },
});

/**
 * Схема для товара
 */
export const getProductSchema = (product: {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  description: string;
  rating?: number;
  reviewCount?: number;
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  image: product.image,
  description: product.description,
  offers: {
    '@type': 'Offer',
    url: `${window.location.origin}/product/${product.id}`,
    priceCurrency: 'RUB',
    price: product.price.toString(),
    priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
  },
  ...(product.oldPrice && {
    aggregateOffer: {
      '@type': 'AggregateOffer',
      lowPrice: product.price.toString(),
      highPrice: product.oldPrice.toString(),
      priceCurrency: 'RUB',
    },
  }),
  ...(product.rating && {
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating.toString(),
      reviewCount: product.reviewCount?.toString() || '1',
    },
  }),
});

/**
 * Схема для страницы с товарами
 */
export const getBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});
