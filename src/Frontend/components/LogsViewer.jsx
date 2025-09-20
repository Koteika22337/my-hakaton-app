import { useState } from 'react';
import { api } from '../utils/api';

export default function LogsViewer({ serverId, initialLogs, onLoadMore }) {
  const [logs, setLogs] = useState(initialLogs);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    limit: 50
  });

  const loadLogs = async (newFilters = {}) => {
    try {
      setLoading(true);
      const mergedFilters = { ...filters, ...newFilters };
      const logsData = await api.getServerLogs(serverId, mergedFilters);
      setLogs(logsData);
      setFilters(mergedFilters);
    } catch (error) {
      console.error('Error loading logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProtocolIcon = (protocol) => {
    switch (protocol) {
      case 'HTTP': return '🌐';
      case 'HTTPS': return '🔒';
      case 'ICMP': return '📡';
      default: return '❓';
    }
  };

  return (
    <div>
      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">С</label>
          <input
            type="datetime-local"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">По</label>
          <input
            type="datetime-local"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-300 mb-1">Лимит</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => loadLogs()}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {loading ? 'Загрузка...' : 'Применить фильтры'}
      </button>

      {/* Таблица логов */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-4 py-2 text-left">Время</th>
              <th className="px-4 py-2 text-left">Протокол</th>
              <th className="px-4 py-2 text-left">Статус</th>
              <th className="px-4 py-2 text-left">Время ответа</th>
              <th className="px-4 py-2 text-left">Ошибка</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-700">
                <td className="px-4 py-2">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-2">
                  {getProtocolIcon(log.protocol)} {log.protocol}
                </td>
                <td className="px-4 py-2">
                  <span className={log.success ? 'text-green-400' : 'text-red-400'}>
                    {log.success ? '✅ Успех' : '❌ Ошибка'}
                  </span>
                  {log.statusCode && ` (${log.statusCode})`}
                </td>
                <td className="px-4 py-2">{log.responseTimeMs}ms</td>
                <td className="px-4 py-2 text-red-400 text-sm">
                  {log.errorMessage || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && !loading && (
        <div className="text-center text-gray-400 py-8">Логи не найдены</div>
      )}
    </div>
  );
}