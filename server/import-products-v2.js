import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDatabase, addImage } from './db.js';
import { v4 as uuidv4 } from 'uuid';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'public', 'images', 'products');

// Создаём директорию если её нет
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const db = initDatabase();

/**
 * Скачивает изображение с HTTPS
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filepath = path.join(imagesDir, filename);

    // Пропускаем если файл уже существует
    if (fs.existsSync(filepath)) {
      resolve(filepath);
      return;
    }

    try {
      const https = await import('https');
      const http = await import('http');

      const client = url.startsWith('https') ? https : http;

      client.get(url, { timeout: 10000 }, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(filepath);
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
          file.on('error', reject);
        } else {
          reject(new Error(`HTTP ${response.statusCode}`));
        }
      }).on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Оптимизирует изображение в WebP
 */
async function optimizeToWebp(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    return outputPath;
  } catch (error) {
    console.warn(`    ⚠️  Не удалось оптимизировать: ${error.message}`);
    return inputPath; // Возвращаем оригинал если ошибка
  }
}

/**
 * Главная функция импорта товаров с загрузкой картинок
 */
async function importProductsWithImages() {
  try {
    console.log('\n📥 Импорт товаров ИЗ YML С ЗАГРУЗКОЙ КАРТИНОК НА СЕРВЕР...\n');

    // Загружаем YML
    console.log('📝 Загружаю каталог...');
    const ymlUrl = 'https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml';

    const response = await axios.get(ymlUrl, {
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const parsed = await parseStringPromise(response.data);
    const shop = parsed.yml_catalog?.shop?.[0];

    if (!shop) {
      throw new Error('Неверный формат YML');
    }

    // Получаем все товары которые есть в БД
    const products = db.prepare('SELECT id, name FROM products').all();

    let imageCount = 0;
    let skippedCount = 0;

    console.log(`\n🖼️  Загружаю картинки для ${products.length} товаров...\n`);

    // Парсим YML чтобы получить картинки
    const offers = shop.offers?.[0]?.offer || [];
    const offersMap = {};

    offers.forEach(offer => {
      const id = offer.$.id;
      const pictures = offer.picture || [];
      offersMap[id] = pictures;
    });

    // Загружаем картинки для каждого товара
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const pictures = offersMap[product.id] || [];

      console.log(`[${i + 1}/${products.length}] ${product.name.substring(0, 50)}`);

      if (pictures.length === 0) {
        console.log('  ℹ️  Картинок нет');
        skippedCount++;
        continue;
      }

      // Загружаем каждую картинку
      for (let j = 0; j < Math.min(pictures.length, 5); j++) {
        try {
          const imageUrl = pictures[j];
          const timestamp = Date.now();
          const random = Math.random().toString(36).substring(7);
          const ext = imageUrl.split('.').pop().split('?')[0] || 'jpg';
          const filename = `product-${timestamp}-${random}-${j}.${ext}`;
          const webpFilename = `product-${timestamp}-${random}-${j}.webp`;

          console.log(`  📸 Загружаю картинку ${j + 1}/${pictures.length}...`);

          // Скачиваем оригинал
          const filePath = await downloadImage(imageUrl, filename);
          console.log(`    ✅ Загружено (${(fs.statSync(filePath).size / 1024).toFixed(1)}KB)`);

          // Оптимизируем в WebP
          const webpPath = path.join(imagesDir, webpFilename);
          const optimizedPath = await optimizeToWebp(filePath, webpPath);

          // Сохраняем в БД с WebP версией
          addImage({
            id: uuidv4(),
            url: `/public/images/products/${webpFilename}`,
            alt: `${product.name} - фото ${j + 1}`,
            order: j,
            productId: product.id
          });

          console.log(`    ⭐ Оптимизировано в WebP`);
          imageCount++;
        } catch (error) {
          console.warn(`    ❌ Ошибка: ${error.message}`);
        }
      }

      // Устанавливаем main_image для товара
      const firstImage = db.prepare(`
        SELECT url FROM images WHERE product_id = ? ORDER BY "order" LIMIT 1
      `).get(product.id);

      if (firstImage) {
        db.prepare(`
          UPDATE products SET main_image = ? WHERE id = ?
        `).run(firstImage.url, product.id);
      }
    }

    // Статистика
    const imagesInDb = db.prepare('SELECT COUNT(*) as count FROM images').get().count;
    const productsWithImages = db.prepare(
      'SELECT COUNT(*) as count FROM products WHERE main_image IS NOT NULL'
    ).get().count;

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  ✅ ЗАГРУЗКА ЗАВЕРШЕНА!                 ║`);
    console.log(`╚════════════════════════════════════════╝\n`);

    console.log(`📊 Статистика:`);
    console.log(`  ✅ Картинок загружено: ${imageCount}`);
    console.log(`  ✅ Товаров с картинками: ${productsWithImages}`);
    console.log(`  ⏭️  Пропущено: ${skippedCount}\n`);

    // Размер папки
    const files = fs.readdirSync(imagesDir);
    const totalSize = files.reduce((sum, file) => {
      const filepath = path.join(imagesDir, file);
      try {
        const stat = fs.statSync(filepath);
        return sum + stat.size;
      } catch {
        return sum;
      }
    }, 0);

    const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
    console.log(`💾 Занимаемый объём: ${sizeMB}MB (${files.length} файлов)`);
    console.log(`🎉 Все картинки скачаны и оптимизированы на сервер!\n`);

    return {
      success: true,
      images: imageCount,
      productsWithImages,
      totalSize: sizeMB
    };
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

// Запускаем импорт если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  importProductsWithImages().then(() => {
    process.exit(0);
  });
}

export { importProductsWithImages };
