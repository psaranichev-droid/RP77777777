import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { compress } from 'hono/compress';
import { serveStatic } from 'hono/serve-static';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateSitemap } from './sitemap.js';
import { initDatabase, getCategories, getProducts, getProductById } from './db';
import { rpcApp } from './rpc';
import { adminApp } from './admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = new Hono();
const PORT = parseInt(process.env.PORT || '3001', 10);

// ─── Initialize Database ──────────────────────────
await initDatabase();

// ─── Middleware ──────────────────────────
// CORS Configuration
app.use(
  '*',
  cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3004',
      'http://localhost:3005',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3004',
      'http://127.0.0.1:3005',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
      'http://127.0.0.1:5176',
      'http://127.0.0.1:5177',
      // Add your production domain here:
      // 'https://yoursite.com',
    ],
    credentials: true,
  })
);

// Compression Middleware
app.use('*', compress());

// ─── Статические файлы ──────────────────────────
app.use('/public/*', serveStatic({
  root: './',
  rewriteRequestPath: (path: string) => path.replace(/^\/public/, 'public'),
}));

// ─── Admin Routes ──────────────────────────
app.route('/api/admin', adminApp);

// ─── RPC Routes ──────────────────────────
app.route('/rpc', rpcApp);

// ─── API Routes ──────────────────────────

/**
 * GET /api/products
 * Returns all products with pagination
 * Query: ?limit=100&offset=0
 */
app.get('/api/products', async (c) => {
  try {
    const limit = Math.min(parseInt(c.req.query('limit') || '100'), 1000);
    const offset = parseInt(c.req.query('offset') || '0');

    const result = await getProducts(limit, offset);

    return c.json({
      success: true,
      products: result.products,
      total: result.total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('API Error:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/products/:id
 * Returns single product by ID or external_id
 */
app.get('/api/products/:id', async (c) => {
  try {
    const { id } = c.req.param();

    const product = await getProductById(id);

    if (!product) {
      return c.json(
        {
          success: false,
          error: 'Product not found',
        },
        404
      );
    }

    return c.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('API Error:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/categories
 * Returns all categories
 */
app.get('/api/categories', async (c) => {
  try {
    const categories = await getCategories();

    return c.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('API Error:', error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    );
  }
});

/**
 * GET /api/health
 * Server health check
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
 * Dynamic XML sitemap for SEO
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
  return c.json(
    {
      success: false,
      error: 'Not found',
      path: c.req.path,
    },
    404
  );
});

// ─── Error Handler ──────────────────────────
app.onError(async (err, c) => {
  console.error('❌ Server Error:', err);
  return c.json(
    {
      success: false,
      error: 'Internal server error',
    },
    500
  );
});

// ─── Start Server ──────────────────────────
const server = http.createServer((req, res) => {
  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
  app.fetch(new Request(`http://localhost:${PORT}${req.url}`, {
    method: req.method,
    headers: req.headers as any,
    ...(hasBody && { body: req, duplex: 'half' }),
  }))
    .then(async (response) => {
      res.statusCode = response.status;
      response.headers.forEach((value, name) => {
        res.setHeader(name, value);
      });
      const body = await response.arrayBuffer();
      res.end(Buffer.from(body));
    })
    .catch((error) => {
      console.error('Request error:', error);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║  🚀 Paper Shop API Server                ║
║  Framework: Hono + Drizzle ORM           ║
║  Port: ${PORT}                             ║
║  Environment: ${process.env.NODE_ENV || 'development'}        ║
║  Status: Ready                            ║
║  Runtime: Node.js                         ║
╚══════════════════════════════════════════╝
  `);
});

export default app;
