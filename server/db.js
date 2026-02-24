import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'shop.db');

let db = null;

/**
 * Инициализирует БД и создаёт таблицы
 */
export function initDatabase() {
  db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Таблица категорий
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      image TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Таблица подкатегорий
  db.exec(`
    CREATE TABLE IF NOT EXISTS subcategories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      category_id TEXT NOT NULL,
      description TEXT,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      UNIQUE(category_id, slug)
    )
  `);

  // Таблица товаров
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      external_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      old_price REAL,
      vendor TEXT,
      in_stock BOOLEAN DEFAULT 1,
      category_id TEXT NOT NULL,
      subcategory_id TEXT,
      main_image TEXT,
      slug TEXT NOT NULL,
      seo_title TEXT,
      seo_description TEXT,
      seo_keywords TEXT,
      rating REAL,
      review_count INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id),
      FOREIGN KEY (subcategory_id) REFERENCES subcategories(id),
      UNIQUE(category_id, slug)
    )
  `);

  // Таблица изображений
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id TEXT PRIMARY KEY,
      url TEXT NOT NULL,
      alt TEXT,
      "order" INTEGER DEFAULT 0,
      product_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);

  // Таблица логов импорта
  db.exec(`
    CREATE TABLE IF NOT EXISTS import_logs (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      message TEXT,
      total_products INTEGER DEFAULT 0,
      imported_products INTEGER DEFAULT 0,
      failed_products INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ БД инициализирована:', dbPath);
  return db;
}

/**
 * Получает БД инстанс
 */
export function getDatabase() {
  if (!db) {
    return initDatabase();
  }
  return db;
}

/**
 * Очищает все таблицы (для перезагрузки)
 */
export function clearAllTables() {
  const database = getDatabase();
  database.exec(`
    DELETE FROM images;
    DELETE FROM products;
    DELETE FROM subcategories;
    DELETE FROM categories;
    DELETE FROM import_logs;
  `);
  console.log('🗑️ Все таблицы очищены');
}

/**
 * Добавляет категорию
 */
export function addCategory(category) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO categories
    (id, name, slug, description, image, seo_title, seo_description, seo_keywords)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    category.id,
    category.name,
    category.slug,
    category.description,
    category.image,
    category.seoTitle,
    category.seoDescription,
    category.seoKeywords
  );
}

/**
 * Добавляет подкатегорию
 */
export function addSubCategory(subcategory) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO subcategories
    (id, name, slug, category_id, description, seo_title, seo_description, seo_keywords)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    subcategory.id,
    subcategory.name,
    subcategory.slug,
    subcategory.categoryId,
    subcategory.description,
    subcategory.seoTitle,
    subcategory.seoDescription,
    subcategory.seoKeywords
  );
}

/**
 * Добавляет товар
 */
export function addProduct(product) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO products
    (id, external_id, name, description, price, old_price, vendor, in_stock,
     category_id, subcategory_id, main_image, slug, seo_title, seo_description, seo_keywords)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(
    product.id,
    product.externalId,
    product.name,
    product.description,
    product.price,
    product.oldPrice,
    product.vendor,
    product.inStock ? 1 : 0,
    product.categoryId,
    product.subcategoryId,
    product.mainImage,
    product.slug,
    product.seoTitle,
    product.seoDescription,
    product.seoKeywords
  );
}

/**
 * Добавляет изображение товара
 */
export function addImage(image) {
  const db = getDatabase();
  const stmt = db.prepare(`
    INSERT INTO images (id, url, alt, "order", product_id)
    VALUES (?, ?, ?, ?, ?)
  `);

  return stmt.run(
    image.id,
    image.url,
    image.alt,
    image.order,
    image.productId
  );
}

/**
 * Получает категорию по slug
 */
export function getCategoryBySlug(slug) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM categories WHERE slug = ?');
  return stmt.get(slug);
}

/**
 * Получает все категории
 */
export function getAllCategories() {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM categories ORDER BY name');
  return stmt.all();
}

/**
 * Получает подкатегории по категории
 */
export function getSubCategoriesByCategory(categoryId) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM subcategories WHERE category_id = ? ORDER BY name');
  return stmt.all(categoryId);
}

/**
 * Получает товары по категории
 */
export function getProductsByCategory(categoryId, limit = 100) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM products WHERE category_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(categoryId, limit);
}

/**
 * Получает товары по подкатегории
 */
export function getProductsBySubCategory(subcategoryId, limit = 100) {
  const db = getDatabase();
  const stmt = db.prepare(`
    SELECT * FROM products WHERE subcategory_id = ?
    ORDER BY created_at DESC
    LIMIT ?
  `);
  return stmt.all(subcategoryId, limit);
}

/**
 * Получает товар по slug
 */
export function getProductBySlug(slug) {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM products WHERE slug = ?');
  const product = stmt.get(slug);

  if (product) {
    // Загружаем изображения
    const imagesStmt = db.prepare('SELECT * FROM images WHERE product_id = ? ORDER BY "order"');
    product.images = imagesStmt.all(product.id);
  }

  return product;
}

/**
 * Получает общую статистику
 */
export function getStats() {
  const db = getDatabase();
  return {
    categories: db.prepare('SELECT COUNT(*) as count FROM categories').get().count,
    subcategories: db.prepare('SELECT COUNT(*) as count FROM subcategories').get().count,
    products: db.prepare('SELECT COUNT(*) as count FROM products').get().count,
    images: db.prepare('SELECT COUNT(*) as count FROM images').get().count,
  };
}

/**
 * Закрывает БД подключение
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}
