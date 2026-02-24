# 📸 Загрузка картинок на сервер

## Структура директорий

На VPS должна быть следующая структура:

```
/home/app/paper-shop/backend/public/
├── images/
│   ├── products/        # Картинки товаров
│   ├── categories/      # Картинки категорий
│   ├── banners/         # Баннеры
│   └── ...
└── fonts/              # Шрифты (уже есть)
```

---

## Способ 1: Загрузка через скрипт (РЕКОМЕНДУЕТСЯ)

### Шаг 1: Загрузка всех картинок из Yandex S3

Создайте файл `download-images.sh`:

```bash
#!/bin/bash

# Параметры
IMAGES_DIR="backend/public/images/products"
YANDEX_S3_URL="https://yastore-prod-persist.s3.yandex.net"
YML_URL="$YANDEX_S3_URL/feeds/yml/019a4608-b88b-7916-8afb-3558dd6d2eda.xml"

# Создаем директории
mkdir -p "$IMAGES_DIR"

echo "📥 Загружаю каталог YML..."

# Скачиваем YML и парсим картинки
curl -s "$YML_URL" | grep -oP '<picture>\K[^<]+' | while read -r image_url; do
    if [ ! -z "$image_url" ]; then
        filename=$(basename "$image_url")

        # Пропускаем если файл уже есть
        if [ -f "$IMAGES_DIR/$filename" ]; then
            echo "✓ $filename (уже есть)"
        else
            echo "⬇️  Загружаю $filename..."
            wget -q -O "$IMAGES_DIR/$filename" "$image_url" 2>/dev/null

            if [ $? -eq 0 ]; then
                echo "✅ $filename"
            else
                echo "❌ Ошибка при загрузке $filename"
            fi
        fi
    fi
done

# Устанавливаем права доступа
chmod -R 755 "$IMAGES_DIR"

echo "
╔════════════════════════════════════════╗
║  ✅ Загрузка завершена!                 ║
║  Картинки в: $IMAGES_DIR        ║
╚════════════════════════════════════════╝
"
```

### Шаг 2: Запуск скрипта

```bash
# На локальной машине (для предварительной подготовки)
bash download-images.sh

# Или на VPS (после деплоя)
cd /home/app/paper-shop
bash download-images.sh
```

---

## Способ 2: Загрузка вручную через SFTP

### Используя FileZilla или WinSCP:

1. Подключаемся к VPS:
   - Host: `ваш-ip-адрес`
   - Port: `22`
   - Username: `app`
   - Password: `ваш-пароль`

2. Переходим в `/home/app/paper-shop/backend/public/images/products/`

3. Загружаем все картинки с локальной машины

### Используя scp команду:

```bash
# С локальной машины
scp -r ./local-images/* app@ваш-ip:/home/app/paper-shop/backend/public/images/products/

# Проверяем права
ssh app@ваш-ip "chmod -R 755 /home/app/paper-shop/backend/public/images"
```

---

## Способ 3: Автоматическая загрузка при запуске backend

Добавьте в `server/index.js`:

```javascript
import fs from 'fs';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, 'public/images');

// Проверяем если нет картинок - загружаем
async function ensureImages() {
  try {
    const imagesExist = fs.existsSync(imagesDir);

    if (!imagesExist) {
      console.log('📥 Первый запуск - загружаю картинки...');
      fs.mkdirSync(imagesDir, { recursive: true });

      // Здесь можно добавить логику загрузки
      // Например, использовать axios для загрузки с CDN
    }
  } catch (error) {
    console.warn('⚠️ Ошибка при подготовке картинок:', error.message);
  }
}

// Вызываем при старте
await ensureImages();
```

---

## Способ 4: Загрузка через админ-панель (Future)

Когда будет админ-панель, можно создать upload endpoint:

```javascript
// server/routes/admin.js
import multer from 'multer';
import path from 'path';

const upload = multer({
  dest: 'public/images/products',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

app.post('/api/admin/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided' });
  }

  res.json({
    success: true,
    file: `/public/images/products/${req.file.filename}`,
  });
});
```

---

## 🔧 Оптимизация картинок после загрузки

### Конвертирование в WebP (опционально)

```bash
#!/bin/bash
# convert-webp.sh

IMAGES_DIR="backend/public/images/products"

# Требует ImageMagick: sudo apt install imagemagick

for img in $IMAGES_DIR/*.{jpg,jpeg,png}; do
    [ -e "$img" ] || continue

    webp_file="${img%.*}.webp"
    convert "$img" -quality 80 "$webp_file"
    echo "✅ Конвертировал $(basename $img) → WebP"
done
```

### Сжатие изображений

```bash
#!/bin/bash
# compress-images.sh

IMAGES_DIR="backend/public/images/products"

# Требует ImageMagick
for img in $IMAGES_DIR/*.{jpg,jpeg,png}; do
    [ -e "$img" ] || continue

    convert "$img" -strip -quality 85 "$img"
    echo "✅ Сжал $(basename $img)"
done
```

---

## 📊 Проверка загрузки

### Проверяем на сервере:

```bash
# Считаем картинки
find /home/app/paper-shop/backend/public/images -type f | wc -l

# Смотрим размер директории
du -sh /home/app/paper-shop/backend/public/images

# Проверяем права доступа
ls -la /home/app/paper-shop/backend/public/images/ | head
```

### Проверяем в браузере:

```
https://yoursite.com/public/images/products/image-name.jpg
```

Если картинка загружается - все работает!

---

## 🚀 Автоматическая загрузка картинок на фронтенд

В `productService.ts` уже настроено на загрузку с сервера:

```typescript
// Если картинка с вашего сервера
const imageUrl = `/public/images/products/image-name.jpg`;

// Если картинка с Yandex S3 (fallback)
const imageUrl = 'https://example.yandex.net/images/image-name.jpg';
```

---

## ⚠️ Решение проблем

### Проблема: "403 Forbidden"

```bash
# Проверяем права доступа
sudo chown -R app:app /home/app/paper-shop/backend/public
sudo chmod -R 755 /home/app/paper-shop/backend/public
```

### Проблема: Картинки не загружаются через API

1. Проверяем логи бэкенда:
```bash
pm2 logs paper-shop-api
```

2. Проверяем конфиг Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

### Проблема: Медленная загрузка картинок

Включаем кэширование в Nginx (см. DEPLOYMENT.md в секции Nginx).

---

## 📋 Чек-лист

- [ ] Создана директория `/home/app/paper-shop/backend/public/images/`
- [ ] Загружены картинки товаров
- [ ] Проверены права доступа (755)
- [ ] Картинки доступны по URL `/public/images/products/image.jpg`
- [ ] Бэкенд API возвращает картинки в JSON
- [ ] Фронтенд загружает картинки с нового хоста
- [ ] Service Worker кэширует картинки
- [ ] Nginx конфиг правильно проксирует статику
