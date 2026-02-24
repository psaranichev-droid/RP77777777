/**
 * Генератор Sitemap XML для SEO
 * Использование: GET /sitemap.xml
 */

import axios from 'axios';
import { parseStringPromise } from 'xml2js';

export async function generateSitemap() {
  try {
    const baseUrl = process.env.BASE_URL || 'https://yoursite.com';

    // Основные страницы (статичные)
    const pages = [
      { url: '/', changefreq: 'weekly', priority: 1.0 },
      { url: '/catalog', changefreq: 'daily', priority: 0.9 },
      { url: '/wholesale', changefreq: 'monthly', priority: 0.7 },
      { url: '/showroom', changefreq: 'monthly', priority: 0.7 },
      { url: '/designer-paper', changefreq: 'monthly', priority: 0.6 },
      { url: '/cutting', changefreq: 'monthly', priority: 0.6 },
    ];

    // Загружаем товары для генерации URL на каждый товар
    let productUrls = [];
    try {
      const response = await axios.get(
        'https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml',
        { timeout: 10000 }
      );

      const parsed = await parseStringPromise(response.data);
      const offers = parsed.yml_catalog?.shop?.[0]?.offers?.[0]?.offer || [];

      productUrls = offers.map((offer) => ({
        url: `/product/${offer.$.id}`,
        changefreq: 'weekly',
        priority: 0.8,
      }));

      console.log(`✅ Добавлено ${productUrls.length} товаров в sitemap`);
    } catch (error) {
      console.warn('⚠️ Не удалось загрузить товары для sitemap:', error.message);
    }

    // Генерируем XML
    const urlset = [...pages, ...productUrls]
      .map((item) => {
        const lastmod = new Date().toISOString().split('T')[0];
        return `
  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
        `;
      })
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset}
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('❌ Ошибка при генерации sitemap:', error);
    return null;
  }
}
