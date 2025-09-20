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
    const icons = {
      HTTP: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4 4 0 003 15z" />
        </svg>
      ),
      HTTPS: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      ICMP: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    };
    return icons[protocol] || (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  };

  const getStatusConfig = (success, statusCode) => {
    if (success) {
      return {
        text: 'Успех',
        color: 'text-green-600',
        bg: 'bg-green-50',
        border: 'border-green-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      };
    } else {
      return {
        text: statusCode ? `Ошибка (${statusCode})` : 'Ошибка',
        color: 'text-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      };
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">История проверок</h3>

      {/* Фильтры */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">С</label>
          <input
            type="datetime-local"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">По</label>
          <input
            type="datetime-local"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Лимит записей</label>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white"
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
            <option value={500}>500</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => loadLogs()}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Загрузка...
              </>
            ) : (
              'Применить фильтры'
            )}
          </button>
        </div>
      </div>

      {/* Таблица логов */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Протокол
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Время ответа
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Сообщение
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {logs.map((log) => {
              const statusConfig = getStatusConfig(log.success, log.statusCode);
              return (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-medium">
                      {new Date(log.timestamp).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-900">
                      <span className="text-blue-600 mr-2">
                        {getProtocolIcon(log.protocol)}
                      </span>
                      {log.protocol}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.text}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className={`text-sm font-medium ${
                      log.responseTimeMs > 1000 ? 'text-red-600' : 
                      log.responseTimeMs > 500 ? 'text-amber-600' : 'text-green-600'
                    }`}>
                      {log.responseTimeMs}ms
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    {log.errorMessage ? (
                      <div className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                        {log.errorMessage}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-2">Логи не найдены</div>
          <div className="text-gray-500 text-sm">
            Попробуйте изменить параметры фильтрации
          </div>
        </div>
      )}

      {logs.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Показано {logs.length} записей
          </div>
          <button
            onClick={onLoadMore}
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg text-gray-700 text-sm font-medium transition-colors"
          >
            Загрузить еще
          </button>
        </div>
      )}
    </div>
  );
}