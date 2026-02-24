import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { adminService } from '../../services/adminService';

interface Order {
  id: string;
  customer_name: string;
  email: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  pending: 'Ожидание',
  processing: 'В обработке',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const token = useAdminStore((state) => state.token) || '';

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminOrders(token);
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Ошибка загрузки заказов:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Заказы</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">ID заказа</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Клиент</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Сумма</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Статус</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Дата</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Нет заказов
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900 font-medium">#{order.id}</td>
                  <td className="px-6 py-3 text-gray-900">{order.customer_name}</td>
                  <td className="px-6 py-3 text-gray-900">{order.email}</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">₽ {order.total}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-900">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
