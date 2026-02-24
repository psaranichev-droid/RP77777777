import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { adminService } from '../../services/adminService';
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
  description: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    category: '',
    description: '',
  });

  const token = useAdminStore((state) => state.token) || '';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminProducts(token);
      setProducts(data.products || []);
    } catch (err) {
      setError('Ошибка загрузки товаров');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateProduct(token, editingId, formData);
      } else {
        await adminService.createProduct(token, formData);
      }
      loadProducts();
      setFormOpen(false);
      setEditingId(null);
      setFormData({ name: '', price: '', quantity: '', category: '', description: '' });
    } catch (err) {
      setError('Ошибка при сохранении товара');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены?')) {
      try {
        await adminService.deleteProduct(token, id);
        loadProducts();
      } catch (err) {
        setError('Ошибка при удалении товара');
        console.error(err);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      description: product.description,
    });
    setEditingId(product.id);
    setFormOpen(true);
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Товары</h2>
        <button
          onClick={() => {
            setFormOpen(true);
            setEditingId(null);
            setFormData({ name: '', price: '', quantity: '', category: '', description: '' });
          }}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Добавить товар
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {formOpen && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {editingId ? 'Редактировать товар' : 'Новый товар'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="number"
                placeholder="Цена"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="number"
                placeholder="Количество"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="text"
                placeholder="Категория"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <textarea
              placeholder="Описание"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {editingId ? 'Обновить' : 'Создать'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormOpen(false);
                  setEditingId(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Название</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Цена</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Количество</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Категория</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Нет товаров
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900 font-medium">{product.name}</td>
                  <td className="px-6 py-3 text-gray-900">₽ {product.price}</td>
                  <td className="px-6 py-3 text-gray-900">{product.quantity}</td>
                  <td className="px-6 py-3 text-gray-900">{product.category}</td>
                  <td className="px-6 py-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-indigo-600 hover:text-indigo-700 p-1"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
