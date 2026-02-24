import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { getCategories, getProducts, getProductById } from './db';

// ─── Type Definitions ──────────────────────────

export const ProductSchema = z.object({
  id: z.string(),
  external_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  old_price: z.number().nullable(),
  vendor: z.string().nullable(),
  in_stock: z.boolean(),
  category_id: z.string(),
  slug: z.string(),
  main_image: z.string().nullable(),
  rating: z.number().nullable(),
  review_count: z.number(),
  views: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  image: z.string().nullable(),
  seo_title: z.string().nullable(),
  seo_description: z.string().nullable(),
  seo_keywords: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const ProductsResponseSchema = z.object({
  success: z.boolean(),
  products: z.array(ProductSchema),
  total: z.number(),
  limit: z.number(),
  offset: z.number(),
});

export const ProductResponseSchema = z.object({
  success: z.boolean(),
  data: ProductSchema.nullable(),
});

export const CategoriesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(CategorySchema),
});

export const HealthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  uptime: z.number(),
  timestamp: z.string(),
});

// ─── RPC Handler ──────────────────────────

type Bindings = {
  // Add your bindings here if needed
};

export const rpcApp = new Hono<{ Bindings: Bindings }>();

// Query validators
const productsQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(1000).default(100).optional(),
  offset: z.coerce.number().min(0).default(0).optional(),
});

const productIdSchema = z.object({
  id: z.string().min(1),
});

// ─── RPC Routes ──────────────────────────

/**
 * RPC: Get all products with pagination
 */
rpcApp.get(
  '/products',
  zValidator('query', productsQuerySchema),
  async (c) => {
    try {
      const { limit = 100, offset = 0 } = c.req.valid('query');

      const result = await getProducts(limit, offset);

      return c.json({
        success: true,
        products: result.products,
        total: result.total,
        limit,
        offset,
      });
    } catch (error) {
      console.error('RPC Error:', error);
      return c.json(
        {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        500
      );
    }
  }
);

/**
 * RPC: Get product by ID or external_id
 */
rpcApp.get('/products/:id', zValidator('param', productIdSchema), async (c) => {
  try {
    const { id } = c.req.valid('param');

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
    console.error('RPC Error:', error);
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
 * RPC: Get all categories
 */
rpcApp.get('/categories', async (c) => {
  try {
    const categories = await getCategories();

    return c.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('RPC Error:', error);
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
 * RPC: Health check
 */
rpcApp.get('/health', async (c) => {
  return c.json({
    success: true,
    message: 'Server is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Export type for client
export type RPC = typeof rpcApp;
