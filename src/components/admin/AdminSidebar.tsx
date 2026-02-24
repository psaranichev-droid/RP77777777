import { Link, useLocation } from 'react-router-dom';
import { useAdminStore } from '../../store/useAdminStore';
import { LayoutDashboard, Package, Layers, ShoppingCart, BarChart3, LogOut } from 'lucide-react';

export function AdminSidebar() {
  const location = useLocation();
  const logout = useAdminStore((state) => state.logout);

  const isActive = (path: string) => location.pathname === path;

  const links = [
    { path: '/admin', label: 'Дашборд', icon: LayoutDashboard },
    { path: '/admin/products', label: 'Товары', icon: Package },
    { path: '/admin/categories', label: 'Категории', icon: Layers },
    { path: '/admin/orders', label: 'Заказы', icon: ShoppingCart },
    { path: '/admin/analytics', label: 'Аналитика', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Paper Shop</h2>
        <p className="text-sm text-gray-500 mt-1">Админ-панель</p>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {links.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive(path)
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => {
            logout();
            window.location.href = '/admin/login';
          }}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Выход</span>
        </button>
      </div>
    </aside>
  );
}
