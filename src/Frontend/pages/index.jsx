import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../utils/api';
import DashboardStats from '../components/DashboardStats';
import ServerTable from '../components/ServerTable';
import AvailabilityChart from '../components/Charts/AvailabilityChart';

export default function Dashboard() {
  const [overviewStats, setOverviewStats] = useState(null);
  const [recentServers, setRecentServers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, servers] = await Promise.all([
        api.getOverviewStats(),
        api.getServers({ limit: 10, offset: 0 })
      ]);
      
      setOverviewStats(stats);
      setRecentServers(servers);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard - Мониторинг серверов</title>
        <meta name="description" content="Панель мониторинга серверов" />
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Мониторинг серверов</h1>
            <Link 
              href="/servers"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Управление серверами
            </Link>
          </div>

          {/* Общая статистика */}
          {overviewStats && <DashboardStats stats={overviewStats} />}

          {/* Графики */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Доступность серверов</h2>
              <AvailabilityChart servers={recentServers} />
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Время отклика</h2>
              {/* Здесь будет компонент графика времени отклика */}
              <div className="text-gray-400">График времени отклика</div>
            </div>
          </div>

          {/* Последние серверы */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Последние обновленные серверы</h2>
            <ServerTable servers={recentServers} showActions={false} />
          </div>
        </div>
      </div>
    </>
  );
}