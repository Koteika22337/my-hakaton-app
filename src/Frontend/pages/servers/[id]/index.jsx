import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../../../utils/api';
import LogsViewer from '../../../components/LogsViewer';

export default function ServerDetail() {
  const [server, setServer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      loadServerData();
    }
  }, [id]);

  const loadServerData = async () => {
    try {
      setLoading(true);
      const [serverData, logsData] = await Promise.all([
        api.getServer(id),
        api.getServerLogs(id, { limit: 50 })
      ]);
      
      setServer(serverData);
      setLogs(logsData);
    } catch (error) {
      console.error('Error loading server data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadServerData();
  };

  const getStatusConfig = (status) => {
    const config = {
      up: {
        color: 'text-green-600',
        bg: 'bg-green-100',
        border: 'border-green-200',
        text: 'Online',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      down: {
        color: 'text-red-600',
        bg: 'bg-red-100',
        border: 'border-red-200',
        text: 'Offline',
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    };
    return config[status] || config.down;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Загрузка данных сервера...</div>
        </div>
      </div>
    );
  }

  if (!server) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-4">Сервер не найден</div>
          <Link
            href="/servers"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Вернуться к списку серверов
          </Link>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(server.status);

  return (
    <>
      <Head>
        <title>{server.host} - Мониторинг серверов</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Навигация и заголовок */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
              <Link href="/" className="hover:text-gray-700">
                Дашборд
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/servers" className="hover:text-gray-700">
                Серверы
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">{server.host}</span>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{server.host}</h1>
                <p className="text-gray-600 mt-2">Детальная информация о сервере</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg 
                    className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {refreshing ? 'Обновление...' : 'Обновить'}
                </button>
                
                <Link
                  href={`/servers/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Редактировать
                </Link>
                
                <Link
                  href="/servers"
                  className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Назад
                </Link>
              </div>
            </div>
          </div>

          {/* Карточка с основной информацией */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Основная информация</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">Статус</div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                  <span className="mr-1">{statusConfig.icon}</span>
                  {statusConfig.text}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">IP адрес</div>
                <div className="text-gray-900 font-mono">{server.ip}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Время ответа</div>
                <div className={`text-lg font-semibold ${
                  server.stats?.avgResponseTimeMs > 1000 ? 'text-red-600' : 
                  server.stats?.avgResponseTimeMs > 500 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  {server.stats?.avgResponseTimeMs || 0} ms
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Успешность</div>
                <div className={`text-lg font-semibold ${
                  server.stats?.successRate >= 95 ? 'text-green-600' : 
                  server.stats?.successRate >= 80 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {server.stats?.successRate || 0}%
                </div>
              </div>
            </div>

            {/* Дополнительная информация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
              <div>
                <div className="text-sm text-gray-500 mb-1">Последняя проверка</div>
                <div className="text-gray-900">
                  {server.stats?.lastCheck ? new Date(server.stats.lastCheck).toLocaleString() : 'Нет данных'}
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Интервал проверки</div>
                <div className="text-gray-900">
                  {server.interval === '1m' ? '1 минута' :
                   server.interval === '5m' ? '5 минут' :
                   server.interval === '15m' ? '15 минут' :
                   server.interval === '30m' ? '30 минут' :
                   server.interval === '1h' ? '1 час' : server.interval}
                </div>
              </div>
            </div>
          </div>

          {/* Логи сервера */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">История проверок</h2>
              <div className="text-sm text-gray-500">
                Последние {logs.length} записей
              </div>
            </div>
            
            <LogsViewer 
              serverId={id} 
              initialLogs={logs}
              onLoadMore={loadServerData}
            />
          </div>
        </div>
      </div>
    </>
  );
}