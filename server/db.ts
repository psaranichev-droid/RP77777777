import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { eq, and, desc } from 'drizzle-orm';
import path from 'path';
import { fileURLToPath } from 'url';
import * as schema from './schema';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'shop.db');

// ─── Initialize Database ───────────────────
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });

// ─── Database Functions ────────────────────

/**
 * Get all categories ordered by name
 */
export async function getCategories() {
  try {
    const result = await db.query.categories.findMany({
      orderBy: desc(schema.categories.name),
    });
    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

/**
 * Get paginated products with category info
 */
export async function getProducts(limit: number = 100, offset: number = 0) {
  try {
    const products = await db.query.products.findMany({
      with: {
        category: true,
        images: {
          orderBy: schema.images.order,
        },
      },
      orderBy: desc(schema.products.created_at),
      limit,
      offset,
    });

    // Get total count
    const countResult = await db
      .select({ count: schema.products.id })
      .from(schema.products);

    return {
      products: products.map((p) => ({
        ...p,
        category_name: p.category?.name || null,
        image_urls: p.images.map((i) => i.url).join(',') || '',
      })),
      total: countResult.length > 0 ? countResult.length : 0,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get single product by ID or external_id
 */
export async function getProductById(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: (fields, { or, eq }) =>
        or(eq(fields.id, id), eq(fields.external_id, id)),
      with: {
        category: true,
        subcategory: true,
        images: {
          orderBy: schema.images.order,
        },
      },
    });

    if (!product) {
      return null;
    }

    return {
      ...product,
      image_urls: product.images.map((i) => i.url).join(',') || '',
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

/**
 * Get database statistics
 */
export async function getStats() {
  try {
    const productCount = await db
      .select({ count: schema.products.id })
      .from(schema.products);

    const categoryCount = await db
      .select({ count: schema.categories.id })
      .from(schema.categories);

    const imageCount = await db
      .select({ count: schema.images.id })
      .from(schema.images);

    return {
      products: productCount.length || 0,
      categories: categoryCount.length || 0,
      images: imageCount.length || 0,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
}

/**
 * Initialize database (create tables if not exist)
 * Since we're using an existing shop.db, this just verifies connection
 */
export async function initDatabase() {
  try {
    // Test connection
    const test = await db.select().from(schema.categories).limit(1);
    console.log('✅ Database connection successful');
    return db;
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
}

export default db;
