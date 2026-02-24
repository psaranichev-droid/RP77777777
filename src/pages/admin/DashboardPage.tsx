import { BarChart3, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const stats = [
    { label: 'Всего товаров', value: '1,234', icon: Package, color: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'Заказов', value: '456', icon: ShoppingCart, color: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'Доход', value: '₽ 45,600', icon: TrendingUp, color: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Рост продаж', value: '+23%', icon: BarChart3, color: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Дашборд</h2>

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
          <h3 className="text-lg font-bold text-gray-900 mb-4">Последние заказы</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Заказ #{1000 + i}</p>
                  <p className="text-sm text-gray-500">2 часа назад</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  Готов
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Популярные товары</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="font-medium text-gray-900">Товар #{i}</p>
                  <p className="text-sm text-gray-500">45 продано</p>
                </div>
                <span className="text-indigo-600 font-medium">₽ 1,200</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
