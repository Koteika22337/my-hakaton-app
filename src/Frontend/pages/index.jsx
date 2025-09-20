import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { api } from "../utils/api";
import DashboardStats from "../components/DashboardStats";
import ServerTable from "../components/ServerTable";
import AvailabilityChart from "../components/Charts/AvailabilityChart";
import ResponseTimeChart from "../components/Charts/ResponseTimeChart";

export default function Dashboard() {
  const [overviewStats, setOverviewStats] = useState(null);
  const [recentServers, setRecentServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, servers] = await Promise.all([
        api.getOverviewStats(),
        api.getServers({ limit: 10, offset: 0 }),
      ]);

      setOverviewStats(stats);
      setRecentServers(servers);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-600">Загрузка дашборда...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Дашборд - Мониторинг серверов</title>
        <meta name="description" content="Панель мониторинга серверов" />
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок и кнопки действий */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мониторинг серверов</h1>
              <p className="text-gray-600 mt-2">Обзор состояния вашей инфраструктуры</p>
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
                href="/servers"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Управление серверами
              </Link>
            </div>
          </div>

          {/* Общая статистика */}
          {overviewStats && <DashboardStats stats={overviewStats} />}

          {/* Призыв к действию - Добавить сервер */}
          {recentServers.length === 0 && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-center mb-8">
              <div className="max-w-2xl mx-auto">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Добавьте первый сервер</h2>
                <p className="text-blue-100 mb-6">
                  Начните мониторинг вашей инфраструктуры. Добавьте сервер для отслеживания его доступности и производительности.
                </p>
                <Link
                  href="/servers/new"
                  className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Добавить сервер
                </Link>
              </div>
            </div>
          )}

          {/* Графики */}
          {recentServers.length > 0 && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
                <AvailabilityChart servers={recentServers} />
                <ResponseTimeChart servers={recentServers} />
              </div>

              {/* Последние серверы */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Последние серверы
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {recentServers.length} серверов в мониторинге
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-3 sm:mt-0">
                    <Link
                      href="/servers"
                      className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Посмотреть все
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <Link
                      href="/servers/add"
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Добавить сервер
                    </Link>
                  </div>
                </div>
                
                <ServerTable servers={recentServers} showActions={false} />
              </div>
            </>
          )}

          {/* Быстрые действия - только если есть серверы */}
          {recentServers.length > 0 && (
            <div className="mt-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link
                    href="/servers/add"
                    className="flex items-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Добавить сервер</h4>
                      <p className="text-sm text-gray-600 mt-1">Начать мониторинг нового сервера</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>

                  <Link
                    href="/servers"
                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Все серверы</h4>
                      <p className="text-sm text-gray-600 mt-1">Управление всеми серверами</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}