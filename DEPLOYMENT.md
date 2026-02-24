# 🚀 Гайд по развертыванию на VPS

## Структура проекта на VPS

```
/home/app/paper-shop/
├── frontend/           # React приложение (dist)
├── backend/            # Node.js сервер
│   ├── index.js
│   ├── sitemap.js
│   ├── package.json
│   └── public/
│       ├── images/     # Все картинки товаров
│       ├── fonts/      # Шрифты
│       └── documents/  # Документы (если нужны)
└── .env               # Переменные окружения
```

---

## 1️⃣ Подготовка VPS (первоначальная настройка)

### Установка зависимостей
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js (v18+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Устанавливаем PM2 для управления процессами
sudo npm install -g pm2

# Устанавливаем Nginx для reverse proxy
sudo apt install -y nginx

# Устанавливаем certbot для HTTPS
sudo apt install -y certbot python3-certbot-nginx
```

---

## 2️⃣ Развертывание приложения

### Клонируем репозиторий
```bash
cd /home/app
git clone <your-repo-url> paper-shop
cd paper-shop
```

### Настраиваем backend
```bash
cd backend
npm install

# Создаем .env файл
cat > .env << 'EOF'
NODE_ENV=production
PORT=3001
BASE_URL=https://yoursite.com
CORS_ORIGIN=https://yoursite.com
EOF

# Стартуем с PM2
pm2 start index.js --name "paper-shop-api"
pm2 save
sudo pm2 startup
```

### Собираем и развертываем frontend
```bash
cd ../frontend
npm install
VITE_API_URL=https://yoursite.com/api npm run build

# Копируем в папку для статики
sudo mkdir -p /var/www/paper-shop
sudo cp -r dist/* /var/www/paper-shop/
```

### Загружаем статические файлы

#### Картинки товаров
Все картинки должны быть в:
```
/home/app/paper-shop/backend/public/images/
```

**Скрипт для скачивания картинок с Yandex S3:**

```bash
#!/bin/bash
# download-images.sh

IMAGES_DIR="backend/public/images"
mkdir -p "$IMAGES_DIR"

# Скачиваем картинки в фоне (замените URL на реальные)
# Пример:
# wget -O "$IMAGES_DIR/product-1.jpg" "https://example.com/image1.jpg"

echo "✅ Картинки загружены в $IMAGES_DIR"
```

#### Шрифты
```bash
cp -r frontend/src/assets/fonts backend/public/fonts/
```

---

## 3️⃣ Настройка Nginx

### Создаем конфиг для Nginx
```bash
sudo nano /etc/nginx/sites-available/paper-shop
```

Вставляем:
```nginx
# Upstream для Node.js приложения
upstream api_backend {
    server localhost:3001;
}

# Redirect HTTP на HTTPS
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS конфигурация
server {
    listen 443 ssl http2;
    server_name yoursite.com www.yoursite.com;

    # SSL сертификаты (from Let's Encrypt via certbot)
    ssl_certificate /etc/letsencrypt/live/yoursite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yoursite.com/privkey.pem;

    # SSL оптимизация
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;
    gzip_vary on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Кэширование статики (шрифты, CSS, JS)
    location ~* \.(js|css|woff2|woff|ttf|otf|eot)$ {
        root /var/www/paper-shop;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Картинки - кэширование на 30 дней
    location /public/images/ {
        root /home/app/paper-shop/backend;
        expires 30d;
        add_header Cache-Control "public";
    }

    # API запросы
    location /api/ {
        proxy_pass http://api_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Кэширование API (если нужно)
        proxy_cache_valid 200 10m;
    }

    # Frontend SPA
    location / {
        root /var/www/paper-shop;
        try_files $uri $uri/ /index.html;
    }

    # robots.txt и sitemap
    location ~ ^/(robots.txt|sitemap.xml)$ {
        proxy_pass http://api_backend;
        expires 7d;
        add_header Cache-Control "public";
    }
}
```

### Активируем конфиг
```bash
sudo ln -s /etc/nginx/sites-available/paper-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Получаем SSL сертификат
```bash
sudo certbot certonly --nginx -d yoursite.com -d www.yoursite.com
```

---

## 4️⃣ Монитоинг и обслуживание

### Просмотр логов
```bash
# Logs бэкенда
pm2 logs paper-shop-api

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Обновление приложения
```bash
cd /home/app/paper-shop

# Обновляем код
git pull origin main

# Обновляем backend
cd backend && npm install
pm2 restart paper-shop-api

# Пересобираем frontend
cd ../frontend && npm install
VITE_API_URL=https://yoursite.com/api npm run build
sudo cp -r dist/* /var/www/paper-shop/
```

### Система автообновлений (optional)
```bash
# Создаем скрипт автообновления
sudo nano /usr/local/bin/update-paper-shop.sh
```

```bash
#!/bin/bash
cd /home/app/paper-shop
git pull origin main

cd backend
npm install
pm2 restart paper-shop-api

cd ../frontend
npm install
VITE_API_URL=https://yoursite.com/api npm run build
sudo cp -r dist/* /var/www/paper-shop/

# Отправляем уведомление
echo "✅ App updated at $(date)" | mail -s "Paper Shop Updated" admin@yoursite.com
```

```bash
sudo chmod +x /usr/local/bin/update-paper-shop.sh

# Добавляем в crontab (каждый день в 2 ночи)
sudo crontab -e
# Добавляем: 0 2 * * * /usr/local/bin/update-paper-shop.sh
```

---

## 5️⃣ Производительность

### Размеры файлов ДО оптимизации:
- index.js: 245K
- CSS: 62K
- productService: 38K (убран - теперь 500 bytes API запрос!)
- animations: 121K (Framer Motion)

### После оптимизации:
- ✅ SVG текстуры встроены (убрано 2 сетевых запроса)
- ✅ YML парсинг на сервере (убрано 38K JS)
- ✅ Service Worker кэширует все (первый визит ~600KB, повторный ~50KB)
- ✅ Картинки и статика на CDN/сервере (быстрая доставка)

### Прогнозируемое улучшение:
```
До:  FCP: 3.2s, LCP: 4.1s, CLS: 0.08
После: FCP: 1.2s, LCP: 2.1s, CLS: 0.02
```

---

## 6️⃣ Backup и восстановление

```bash
# Бэкап БД (если используется)
sudo mysqldump -u root -p paper_shop > backup_$(date +%Y%m%d).sql

# Бэкап картинок
tar -czf images_backup_$(date +%Y%m%d).tar.gz /home/app/paper-shop/backend/public/images/

# Automated backup (crontab)
0 3 * * * tar -czf /backups/paper-shop_$(date +\%Y\%m\%d).tar.gz /home/app/paper-shop/backend/public/
```

---

## 🆘 Troubleshooting

### Проблема: 502 Bad Gateway
```bash
# Проверяем статус бэкенда
pm2 status
pm2 logs paper-shop-api

# Перезапускаем
pm2 restart paper-shop-api
```

### Проблема: Картинки не загружаются
```bash
# Проверяем права доступа
sudo chown -R app:app /home/app/paper-shop/backend/public
sudo chmod -R 755 /home/app/paper-shop/backend/public
```

### Проблема: CORS ошибки
```bash
# Обновляем .env в backend
CORS_ORIGIN=https://yoursite.com

# Перезапускаем
pm2 restart paper-shop-api
```

---

## 📊 Мониторинг производительности

Используйте Google PageSpeed Insights:
- https://pagespeed.web.dev/?url=https://yoursite.com

Цели:
- ✅ Performance: 90+
- ✅ Accessibility: 90+
- ✅ SEO: 95+
- ✅ Best Practices: 90+
