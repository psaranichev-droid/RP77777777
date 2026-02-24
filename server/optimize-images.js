import axios from 'axios';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getDatabase } from './db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Скачивает и оптимизирует изображение
 */
async function downloadAndOptimizeImage(url, filename, index) {
  try {
    const imagesDir = path.join(__dirname, 'public', 'images', 'products');

    // Создаём директорию если её нет
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    // Пропускаем если файл уже существует
    const webpPath = path.join(imagesDir, `${filename}.webp`);
    if (fs.existsSync(webpPath)) {
      return `/public/images/products/${filename}.webp`;
    }

    console.log(`  ⬇️  Загружаю изображение ${index}...`);

    // Скачиваем изображение
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 15000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    const buffer = Buffer.from(response.data, 'binary');

    // Оптимизируем в WebP (уменьшает размер в 2-3 раза)
    await sharp(buffer)
      .resize(1200, 1200, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 })
      .toFile(webpPath);

    console.log(`    ✅ Оптимизировано в WebP`);
    return `/public/images/products/${filename}.webp`;
  } catch (error) {
    console.warn(`    ⚠️  Ошибка: ${error.message}`);
    return null;
  }
}

/**
 * Генерирует имя файла
 */
function generateFilename(productId, index) {
  return `product-${productId}-${index}`;
}

/**
 * Главная функция оптимизации
 */
async function optimizeAllImages() {
  try {
    const db = getDatabase();

    console.log('\n🖼️  Скачивание и оптимизация картинок...\n');

    // Получаем все товары
    const products = db.prepare(`
      SELECT id, name FROM products ORDER BY created_at
    `).all();

    let optimizedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n[${i + 1}/${products.length}] ${product.name.substring(0, 50)}`);

      // Получаем картинки для этого товара
      const images = db.prepare(`
        SELECT id, url FROM images WHERE product_id = ? ORDER BY "order"
      `).all(product.id);

      if (images.length === 0) {
        console.log('  ℹ️  Нет картинок для загрузки');
        skippedCount++;
        continue;
      }

      for (let j = 0; j < images.length; j++) {
        const image = images[j];
        const filename = generateFilename(product.id, j);

        try {
          const localPath = await downloadAndOptimizeImage(image.url, filename, j + 1);

          if (localPath) {
            // Обновляем путь в БД
            db.prepare(`
              UPDATE images SET url = ? WHERE id = ?
            `).run(localPath, image.id);

            optimizedCount++;
          }
        } catch (error) {
          console.warn(`    ❌ Ошибка при загрузке: ${error.message}`);
        }
      }

      // Обновляем main_image для товара (если есть картинки)
      const mainImage = db.prepare(`
        SELECT url FROM images WHERE product_id = ? ORDER BY "order" LIMIT 1
      `).get(product.id);

      if (mainImage) {
        db.prepare(`
          UPDATE products SET main_image = ? WHERE id = ?
        `).run(mainImage.url, product.id);
      }
    }

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  ✅ ОПТИМИЗАЦИЯ ЗАВЕРШЕНА!             ║`);
    console.log(`╚════════════════════════════════════════╝\n`);

    console.log(`📊 Статистика:`);
    console.log(`  ✅ Оптимизировано: ${optimizedCount} картинок`);
    console.log(`  ⏭️  Пропущено: ${skippedCount} товаров\n`);

    // Показываем размер папки
    const imagesDir = path.join(__dirname, 'public', 'images', 'products');
    if (fs.existsSync(imagesDir)) {
      const files = fs.readdirSync(imagesDir);
      const totalSize = files.reduce((sum, file) => {
        const filepath = path.join(imagesDir, file);
        const stat = fs.statSync(filepath);
        return sum + stat.size;
      }, 0);

      const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
      console.log(`💾 Занимаемый объём: ${sizeMB}MB (${files.length} файлов)`);
    }

    console.log(`\n🚀 Готово! Картинки оптимизированы и сохранены на сервер.\n`);

    return {
      success: true,
      optimized: optimizedCount,
      skipped: skippedCount
    };
  } catch (error) {
    console.error('\n❌ Критическая ошибка:', error.message);
    process.exit(1);
  }
}

// Запускаем оптимизацию если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  optimizeAllImages().then(() => {
    process.exit(0);
  });
}

export { optimizeAllImages };
