import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { initDatabase, clearAllTables, addCategory, addSubCategory, addProduct, addImage, getStats } from './db.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Транслитерирует кириллицу в латиницу для URL
 */
function transliterate(str) {
  const map = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
  };

  return str
    .toLowerCase()
    .split('')
    .map(char => map[char] || char)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Скачивает изображение на сервер
 */
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const imagesDir = path.join(__dirname, 'public', 'images', 'products');

    // Создаём директорию если её нет
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filepath = path.join(imagesDir, filename);

    // Пропускаем если файл уже существует
    if (fs.existsSync(filepath)) {
      resolve(`/public/images/products/${filename}`);
      return;
    }

    try {
      https.get(url, (response) => {
        if (response.statusCode === 200) {
          const file = fs.createWriteStream(filepath);
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(`/public/images/products/${filename}`);
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
 * Генерирует читаемое имя файла
 */
function generateImageFilename(url, index) {
  const ext = url.split('.').pop().split('?')[0] || 'jpg';
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `product-${timestamp}-${random}-${index}.${ext}`;
}

/**
 * Главная функция импорта
 */
async function importProducts() {
  try {
    console.log('\n📥 Начинаю импорт товаров из Yandex YML...\n');

    // Инициализируем БД
    initDatabase();

    // Очищаем старые данные
    console.log('🗑️  Очищаю старые данные...');
    clearAllTables();

    // Загружаем YML
    console.log('📥 Загружаю YML каталог...');
    const ymlUrl = 'https://yastore-prod-persist.s3.yandex.net/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml';

    const response = await axios.get(ymlUrl, {
      timeout: 30000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });

    // Парсим XML
    console.log('📝 Парсю XML...');
    const parsed = await parseStringPromise(response.data);
    const shop = parsed.yml_catalog?.shop?.[0];

    if (!shop) {
      throw new Error('Неверный формат YML');
    }

    // Парсим категории
    const categories = {};
    if (shop.categories?.[0]?.category) {
      shop.categories[0].category.forEach(cat => {
        const id = cat.$.id;
        const name = cat._;
        const slug = transliterate(name);

        categories[id] = { id, name, slug };

        // Генерируем SEO
        addCategory({
          id,
          name,
          slug,
          seoTitle: `${name} - купить в интернет-магазине`,
          seoDescription: `Большой выбор ${name.toLowerCase()} по доступным ценам. Доставка по России. ✓ Быстро ✓ Надежно`,
          seoKeywords: `${name}, купить ${name.toLowerCase()}`
        });
      });

      console.log(`✅ Загружено ${Object.keys(categories).length} категорий`);
    }

    // Парсим товары
    const offers = shop.offers?.[0]?.offer || [];
    let importedCount = 0;
    let failedCount = 0;

    console.log(`\n📦 Импортирую ${offers.length} товаров...\n`);

    for (let i = 0; i < offers.length; i++) {
      try {
        const offer = offers[i];
        const offerId = offer.$.id;
        const categoryId = offer.categoryId?.[0];
        const categoryData = categories[categoryId];

        if (!categoryData) {
          throw new Error(`Категория не найдена: ${categoryId}`);
        }

        const name = offer.name?.[0] || '';
        const slug = transliterate(name).substring(0, 100);
        const price = parseFloat(offer.price?.[0] || 0);
        const oldPrice = offer.oldprice?.[0] ? parseFloat(offer.oldprice[0]) : undefined;
        const description = offer.description?.[0] || '';
        const vendor = offer.vendor?.[0] || '';

        // Генерируем SEO для товара
        const seoTitle = `${name} - купить`;
        const seoDescription = `${name} - цена ${price}₽. ${description?.substring(0, 100)}...`;
        const seoKeywords = `${name}, ${vendor}, ${categoryData.name}`;

        // Добавляем товар
        addProduct({
          id: offerId,
          externalId: offerId,
          name,
          description,
          price,
          oldPrice,
          vendor,
          inStock: true,
          categoryId: categoryData.id,
          slug,
          seoTitle,
          seoDescription,
          seoKeywords
        });

        // Скачиваем и добавляем изображения
        const pictures = offer.picture || [];
        if (pictures.length > 0) {
          // Скачиваем первое изображение
          try {
            const firstImageUrl = pictures[0];
            const filename = generateImageFilename(firstImageUrl, 0);
            console.log(`  📸 Загружаю ${name.substring(0, 50)}... (${i + 1}/${offers.length})`);

            const localPath = await downloadImage(firstImageUrl, filename);

            // Добавляем это изображение в БД
            addProduct({
              id: offerId,
              externalId: offerId,
              name,
              description,
              price,
              oldPrice,
              vendor,
              inStock: true,
              categoryId: categoryData.id,
              mainImage: localPath,
              slug,
              seoTitle,
              seoDescription,
              seoKeywords
            });

            // Добавляем остальные изображения
            for (let j = 0; j < Math.min(pictures.length, 5); j++) {
              try {
                const imgUrl = pictures[j];
                const imgFilename = generateImageFilename(imgUrl, j);
                const imgLocalPath = await downloadImage(imgUrl, imgFilename);

                addImage({
                  id: uuidv4(),
                  url: imgLocalPath,
                  alt: `${name} - фото ${j + 1}`,
                  order: j,
                  productId: offerId
                });
              } catch (error) {
                console.warn(`    ⚠️  Ошибка загрузки фото ${j}: ${error.message}`);
              }
            }
          } catch (error) {
            console.warn(`  ⚠️  Ошибка при загрузке изображений: ${error.message}`);
          }
        }

        importedCount++;

        // Прогресс каждые 50 товаров
        if ((i + 1) % 50 === 0) {
          console.log(`  ✅ Обработано ${i + 1}/${offers.length}`);
        }
      } catch (error) {
        failedCount++;
        console.error(`  ❌ Ошибка товара ${i + 1}: ${error.message}`);
      }
    }

    // Статистика
    const stats = getStats();

    console.log(`\n╔════════════════════════════════════════╗`);
    console.log(`║  ✅ ИМПОРТ ЗАВЕРШЁН!                   ║`);
    console.log(`╚════════════════════════════════════════╝\n`);

    console.log(`📊 Статистика:`);
    console.log(`  ✅ Категорий: ${stats.categories}`);
    console.log(`  ✅ Товаров: ${stats.products}`);
    console.log(`  ✅ Изображений: ${stats.images}`);
    console.log(`  ❌ Ошибок: ${failedCount}\n`);

    return {
      success: true,
      categories: stats.categories,
      products: stats.products,
      images: stats.images,
      errors: failedCount
    };
  } catch (error) {
    console.error('\n❌ Критическая ошибка импорта:', error.message);
    process.exit(1);
  }
}

// Запускаем импорт если файл запущен напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  importProducts().then(() => {
    process.exit(0);
  });
}

export { importProducts };
