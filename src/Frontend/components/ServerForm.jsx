import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ServerForm({ initialData = {}, onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    host: initialData.host || '',
    ip: initialData.ip || '',
    interval: initialData.interval || '5m',
    routes: initialData.routes || [{ route: '/' }]
  });
  
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addRoute = () => {
    setFormData(prev => ({
      ...prev,
      routes: [...prev.routes, { route: '/' }]
    }));
  };

  const removeRoute = (index) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes.filter((_, i) => i !== index)
    }));
  };

  const updateRoute = (index, value) => {
    setFormData(prev => ({
      ...prev,
      routes: prev.routes.map((route, i) => 
        i === index ? { ...route, route: value } : route
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Хост *
        </label>
        <input
          type="text"
          value={formData.host}
          onChange={(e) => setFormData({ ...formData, host: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          IP адрес *
        </label>
        <input
          type="text"
          value={formData.ip}
          onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Интервал проверки *
        </label>
        <select
          value={formData.interval}
          onChange={(e) => setFormData({ ...formData, interval: e.target.value })}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          disabled={loading}
        >
          <option value="1m">1 минута</option>
          <option value="5m">5 минут</option>
          <option value="15m">15 минут</option>
          <option value="30m">30 минут</option>
          <option value="1h">1 час</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Маршруты для проверки *
        </label>
        {formData.routes.map((route, index) => (
          <div key={index} className="flex space-x-2 mb-2">
            <input
              type="text"
              value={route.route}
              onChange={(e) => updateRoute(index, e.target.value)}
              className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
              placeholder="/api/health"
              required
              disabled={loading}
            />
            {formData.routes.length > 1 && (
              <button
                type="button"
                onClick={() => removeRoute(index)}
                className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded disabled:opacity-50"
                disabled={loading}
              >
                Удалить
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addRoute}
          className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Добавить маршрут
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Сохранение...' : (initialData.id ? 'Обновить' : 'Добавить')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}