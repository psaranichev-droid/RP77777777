import { useEffect } from 'react';
import { setSEOTags, addSchemaMarkup, SEOConfig } from '../utils/seo';

/**
 * Hook для установки SEO tags на странице
 * Использование: useSEO({ title: "...", description: "..." })
 */
export const useSEO = (config: SEOConfig) => {
  useEffect(() => {
    setSEOTags({
      ...config,
      canonical: config.canonical || window.location.href,
    });
  }, [config]);
};

/**
 * Hook для добавления Schema.org структурированных данных
 */
export const useSchema = (schema: Record<string, any>) => {
  useEffect(() => {
    addSchemaMarkup(schema);
  }, [schema]);
};

/**
 * Комбо-hook для установки SEO + Schema
 */
export const useSEOAndSchema = (config: SEOConfig, schema?: Record<string, any>) => {
  useSEO(config);
  if (schema) {
    useSchema(schema);
  }
};
