import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../../utils/api';
import ServerForm from '../../components/ServerForm';

export default function AddServer() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await api.addServer(formData);
      router.push('/servers');
    } catch (error) {
      console.error('Error adding server:', error);
      alert('Ошибка при добавлении сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Добавление сервера - Мониторинг серверов</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Навигация */}
          <div className="mb-6">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">
                Дашборд
              </Link>
              <span className="text-gray-300">/</span>
              <Link href="/servers" className="hover:text-gray-700">
                Серверы
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Добавление</span>
            </nav>
          </div>

          {/* Заголовок и кнопка назад */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Добавление нового сервера</h1>
              <p className="text-gray-600 mt-2">
                Заполните информацию о сервере для начала мониторинга
              </p>
            </div>
            
            <Link
              href="/servers"
              className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Отмена
            </Link>
          </div>

          {/* Форма добавления */}
          <ServerForm 
            onSubmit={handleSubmit}
            loading={loading}
          />

          {/* Дополнительная информация */}
          <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Информация о мониторинге
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Сервер будет проверяться с указанным интервалом
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Для HTTP/HTTPS проверяется статус код ответа
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Для ICMP проверяется доступность ping'ом
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Все проверки логируются и доступны в истории
              </li>
            </ul>
          </div>

          {/* Состояние загрузки */}
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-900 font-medium">Добавление сервера...</div>
                <div className="text-gray-600 text-sm mt-1">Пожалуйста, подождите</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}