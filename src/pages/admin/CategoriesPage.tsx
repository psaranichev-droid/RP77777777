import { useEffect, useState } from 'react';
import { useAdminStore } from '../../store/useAdminStore';
import { adminService } from '../../services/adminService';
import { Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
  });

  const token = useAdminStore((state) => state.token) || '';

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAdminCategories(token);
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Здесь должен быть API запрос для создания категории
      setCategories([...categories, { id: Date.now().toString(), ...formData }]);
      setFormOpen(false);
      setFormData({ name: '', description: '', slug: '' });
    } catch (err) {
      console.error('Ошибка при сохранении категории:', err);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Категории</h2>
        <button
          onClick={() => setFormOpen(!formOpen)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Добавить категорию
        </button>
      </div>

      {formOpen && (
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Новая категория</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Название категории"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
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
                Создать
              </button>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-lg transition-colors"
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h3 className="font-bold text-gray-900">{category.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{category.slug}</p>
            <p className="text-gray-600 mt-2">{category.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
