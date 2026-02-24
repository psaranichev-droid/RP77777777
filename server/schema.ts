import {
  sqliteTable,
  text,
  real,
  integer,
  primaryKey,
  unique,
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ─── Categories Table ───────────────────
export const categories = sqliteTable(
  'categories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    image: text('image'),
    seo_title: text('seo_title'),
    seo_description: text('seo_description'),
    seo_keywords: text('seo_keywords'),
    created_at: text('created_at').default('CURRENT_TIMESTAMP'),
    updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  }
);

// ─── Subcategories Table ───────────────────
export const subcategories = sqliteTable(
  'subcategories',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    category_id: text('category_id').notNull().references(() => categories.id),
    description: text('description'),
    seo_title: text('seo_title'),
    seo_description: text('seo_description'),
    seo_keywords: text('seo_keywords'),
    created_at: text('created_at').default('CURRENT_TIMESTAMP'),
    updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  },
  (table) => ({
    unique_category_slug: unique().on(table.category_id, table.slug),
  })
);

// ─── Products Table ───────────────────
export const products = sqliteTable(
  'products',
  {
    id: text('id').primaryKey(),
    external_id: text('external_id').notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    price: real('price').notNull(),
    old_price: real('old_price'),
    vendor: text('vendor'),
    in_stock: integer('in_stock', { mode: 'boolean' }).default(true),
    category_id: text('category_id').notNull().references(() => categories.id),
    subcategory_id: text('subcategory_id').references(() => subcategories.id),
    main_image: text('main_image'),
    slug: text('slug').notNull(),
    seo_title: text('seo_title'),
    seo_description: text('seo_description'),
    seo_keywords: text('seo_keywords'),
    rating: real('rating'),
    review_count: integer('review_count').default(0),
    views: integer('views').default(0),
    created_at: text('created_at').default('CURRENT_TIMESTAMP'),
    updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
  },
  (table) => ({
    unique_category_slug: unique().on(table.category_id, table.slug),
  })
);

// ─── Images Table ───────────────────
export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  url: text('url').notNull(),
  alt: text('alt'),
  order: integer('order').default(0),
  product_id: text('product_id').notNull().references(() => products.id),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
});

// ─── Import Logs Table ───────────────────
export const import_logs = sqliteTable('import_logs', {
  id: text('id').primaryKey(),
  status: text('status').notNull(),
  message: text('message'),
  total_products: integer('total_products').default(0),
  imported_products: integer('imported_products').default(0),
  failed_products: integer('failed_products').default(0),
  created_at: text('created_at').default('CURRENT_TIMESTAMP'),
  updated_at: text('updated_at').default('CURRENT_TIMESTAMP'),
});

// ─── Relations ───────────────────────────
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
  subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
  category: one(categories, {
    fields: [subcategories.category_id],
    references: [categories.id],
  }),
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.category_id],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [products.subcategory_id],
    references: [subcategories.id],
  }),
  images: many(images),
}));

export const imagesRelations = relations(images, ({ one }) => ({
  product: one(products, {
    fields: [images.product_id],
    references: [products.id],
  }),
}));

export const import_logsRelations = relations(import_logs, () => ({}));
