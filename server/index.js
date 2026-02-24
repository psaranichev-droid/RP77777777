import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { serveStatic } from 'hono/bun';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from './sitemap.js';
import { initDatabase, getAllCategories, getStats } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = new Hono();
const PORT = process.env.PORT || 3001;

// ─── Middleware ──────────────────────────
// CORS Configuration
app.use('*', cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3004',
    'http://localhost:3005',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3004',
    'http://127.0.0.1:3005',
    'http://127.0.0.1:5173',
    // Добавьте вашу боевую продакшн-ссылку:
    // 'https://yoursite.com',
  ],
  credentials: true,
}));

// Compression Middleware
app.use('*', compress());

// ─── Статические файлы ──────────────────────────
// Картинки, шрифты, документы будут здесь:
// /public/images
// /public/fonts
// /public/documents
app.use('/public/*', serveStatic({
  root: './',
  rewriteRequestPath: (path) => path.replace(/^\/public/, 'public'),
}));

// ─── Initialize Database ──────────────────────────
const db = initDatabase();

// ─── API Routes ──────────────────────────

/**
 * GET /api/products
 * Возвращает все товары с опциями фильтрации
 * Query: ?category=...&subcategory=...&limit=...&offset=...
 */
app.get('/api/products', async (c) => {
  try {
    const { limit = '100', offset = '0' } = c.req.query();
    const limitNum = Math.min(parseInt(limit) || 100, 1000);
    const offsetNum = parseInt(offset) || 0;

    // Получаем товары с названием категории (для фронтенда)
    const products = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
      LIMIT ? OFFSET ?
    `).all(limitNum, offsetNum);

    const countResult = db.prepare('SELECT COUNT(*) as total FROM products').get();
    const total = countResult.total;

    // Загружаем изображения для каждого товара
    const productsWithImages = products.map(p => {
      const images = db.prepare('SELECT url FROM images WHERE product_id = ? ORDER BY "order"').all(p.id);
      return {
        ...p,
        image_urls: images.map(i => i.url).join(',') || ''
      };
    });

    return c.json({
      success: true,
      products: productsWithImages,
      total: total,
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (error) {
    console.error('API Error:', error);
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

/**
 * GET /api/products/:id
 * Возвращает один товар по ID или external_id
 */
app.get('/api/products/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const stmt = db.prepare(`
      SELECT p.*, GROUP_CONCAT(i.url) as image_urls
      FROM products p
      LEFT JOIN images i ON p.id = i.product_id
      WHERE p.id = ? OR p.external_id = ?
      GROUP BY p.id
    `);

    const product = stmt.get(id, id);

    if (!product) {
      return c.json({
        success: false,
        error: 'Product not found',
      }, 404);
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

/**
 * GET /api/categories
 * Возвращает список всех категорий
 */
app.get('/api/categories', async (c) => {
  try {
    const categories = getAllCategories();

    return c.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return c.json({
      success: false,
      error: error.message,
    }, 500);
  }
});

/**
 * GET /api/health
 * Проверка статуса сервера
 */
app.get('/api/health', async (c) => {
  return c.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /sitemap.xml
 * Генерирует динамический sitemap для SEO
 */
app.get('/sitemap.xml', async (c) => {
  try {
    const sitemap = await generateSitemap();
    if (!sitemap) {
      return c.text('Error generating sitemap', 500);
    }
    c.header('Content-Type', 'application/xml');
    return c.text(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    return c.text('Error generating sitemap', 500);
  }
});

// ─── 404 Handler ──────────────────────────
app.notFound(async (c) => {
  return c.json({
    success: false,
    error: 'Not found',
    path: c.req.path,
  }, 404);
});

// ─── Error Handler ──────────────────────────
app.onError(async (err, c) => {
  console.error('❌ Server Error:', err);
  return c.json({
    success: false,
    error: 'Internal server error',
  }, 500);
});

// ─── Start Server ──────────────────────────
const server = Bun.serve({
  port: PORT,
  fetch: app.fetch,
});

console.log(`
╔══════════════════════════════════════════╗
║  🚀 Paper Shop API Server (Hono)         ║
║  Port: ${PORT}                             ║
║  Environment: ${process.env.NODE_ENV || 'development'}        ║
║  Status: Ready                            ║
║  Runtime: Bun                             ║
╚══════════════════════════════════════════╝
`);

export default app;
