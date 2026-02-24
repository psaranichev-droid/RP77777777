import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const isProd = mode === 'production';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      // Оптимизация для продакшена
      target: 'esnext',
      minify: 'esbuild',
      // Разделение кода для лучшего кэширования
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['react', 'react-dom', 'react-router-dom', 'axios'],
            'animations': ['framer-motion'],
            'icons': ['lucide-react'],
            'ui': ['clsx', 'tailwind-merge'],
          },
          // Оптимизированные имена файлов для кэширования
          entryFileNames: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
          chunkFileNames: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|gif|svg/.test(ext)) {
              return `images/[name].[hash][extname]`;
            } else if (/woff|woff2|ttf|otf|eot/.test(ext)) {
              return `fonts/[name].[hash][extname]`;
            } else if (ext === 'css') {
              return `css/[name].[hash][extname]`;
            }
            return `[name].[hash][extname]`;
          },
        },
      },
      // Размеры для警告
      reportCompressedSize: true,
      chunkSizeWarningLimit: 500,
      // Увеличиваем размер инлайна для маленьких файлов
      assetsInlineLimit: 8192,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      hmr: {
        host: 'localhost',
        port: 3000,
      },
      // Proxy для API запросов в dev
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path,
        },
      },
    },
  };
});
