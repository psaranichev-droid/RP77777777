import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { adminService } from '../../services/adminService';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

interface Analytics {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  avg_order_value: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const token = useAdminStore((state) => state.token) || '';

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalytics(token);
      setAnalytics(data);
    } catch (err) {
      console.error('Ошибка загрузки аналитики:', err);
      // Используем фиктивные данные
      setAnalytics({
        total_revenue: 125400,
        total_orders: 234,
        total_customers: 156,
        avg_order_value: 535,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  if (!analytics) {
    return <div className="text-center py-8">Ошибка загрузки данных</div>;
  }

  const stats = [
    {
      label: 'Общий доход',
      value: `₽ ${analytics.total_revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Всего заказов',
      value: analytics.total_orders,
      icon: ShoppingCart,
      color: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Клиентов',
      value: analytics.total_customers,
      icon: Users,
      color: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Средний заказ',
      value: `₽ ${analytics.avg_order_value}`,
      icon: TrendingUp,
      color: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Аналитика</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Продажи по дням</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            График продаж (последние 7 дней)
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Топ товары</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Товар #{i}</p>
                  <p className="text-sm text-gray-500">{120 - i * 20} продано</p>
                </div>
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${100 - i * 15}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
