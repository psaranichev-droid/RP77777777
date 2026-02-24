/**
 * Service Worker регистрация для кэширования и offline поддержки
 */

export const registerServiceWorker = async () => {
  // Проверяем поддержку Service Workers
  if (!('serviceWorker' in navigator)) {
    console.warn('[SW] Service Workers не поддерживаются браузером');
    return null;
  }

  // Отключаем SW в режиме разработки (когда есть localhost)
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('[SW] Service Worker отключен в режиме разработки');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
    });

    console.log('[SW] Service Worker успешно зарегистрирован:', registration);

    // Проверяем на обновления каждые 24 часа
    setInterval(() => {
      registration.update();
    }, 24 * 60 * 60 * 1000);

    // Слушаем обновления
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;

      newWorker?.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Новая версия готова, уведомляем пользователя
          console.log('[SW] Новая версия доступна!');
          // Можно показать notification о необходимости перезагрузки
        }
      });
    });

    return registration;
  } catch (error) {
    console.error('[SW] Ошибка регистрации Service Worker:', error);
    return null;
  }
};

/**
 * Принудительное обновление Service Worker
 */
export const updateServiceWorker = () => {
  if (!('serviceWorker' in navigator)) return;

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      registration.unregister();
      // Перезагружаем страницу для новой версии
      window.location.reload();
    });
  });
};

/**
 * Проверка, есть ли контроллер (SW активен)
 */
export const isServiceWorkerActive = (): boolean => {
  return !!(
    'serviceWorker' in navigator &&
    navigator.serviceWorker.controller
  );
};
