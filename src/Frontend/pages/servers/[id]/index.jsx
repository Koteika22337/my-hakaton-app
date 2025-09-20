import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api } from '../../../utils/api';
import LogsViewer from '../../../components/LogsViewer';

export default function ServerDetail() {
  const [server, setServer] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
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
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Загрузка...</div>;
  }

  if (!server) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Сервер не найден</div>;
  }

  return (
    <>
      <Head>
        <title>{server.host} - Детали сервера</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => router.push('/servers')}
            className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            ← Назад к списку
          </button>

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">{server.host}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><strong>IP:</strong> {server.ip}</p>
                <p>
                  <strong>Статус:</strong>{' '}
                  <span className={server.status === 'up' ? 'text-green-400' : 'text-red-400'}>
                    {server.status === 'up' ? '🟢 Online' : '🔴 Offline'}
                  </span>
                </p>
              </div>
              
              <div>
                <p><strong>Среднее время ответа:</strong> {server.stats.avgResponseTimeMs}ms</p>
                <p><strong>Успешность:</strong> {server.stats.successRate}%</p>
                <p><strong>Последняя проверка:</strong> {new Date(server.stats.lastCheck).toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Логи сервера</h2>
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