import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { api } from '../../../utils/api';
import ServerForm from '../../../components/ServerForm';

export default function EditServer() {
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      loadServer();
    }
  }, [id]);

  const loadServer = async () => {
    try {
      setLoading(true);
      const serverData = await api.getServer(id);
      setServer(serverData);
    } catch (error) {
      console.error('Error loading server:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      await api.updateServer(id, formData);
      router.push(`/servers/${id}`);
    } catch (error) {
      console.error('Error updating server:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
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

  return (
    <>
      <Head>
        <title>Редактирование {server.host} - Мониторинг серверов</title>
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
              <Link href={`/servers/${id}`} className="hover:text-gray-700">
                {server.host}
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-gray-900">Редактирование</span>
            </nav>
          </div>

          {/* Заголовок и кнопки действий */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Редактирование сервера</h1>
              <p className="text-gray-600 mt-2">
                Обновление информации о сервере {server.host}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/servers/${id}`}
                className="inline-flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Отмена
              </Link>
              
              <Link
                href="/servers"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Все серверы
              </Link>
            </div>
          </div>

          {/* Форма редактирования */}
          <ServerForm 
            initialData={server} 
            onSubmit={handleSubmit}
            loading={submitting}
          />

          {/* Дополнительная информация */}
          <div className="mt-8 bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Важная информация
            </h3>
            <ul className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Изменения вступят в силу после сохранения
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Мониторинг продолжится с новыми параметрами
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                История проверок сохранится
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                Проверьте правильность всех полей перед сохранением
              </li>
            </ul>
          </div>

          {/* Состояние загрузки */}
          {submitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-900 font-medium">Сохранение изменений...</div>
                <div className="text-gray-600 text-sm mt-1">Пожалуйста, подождите</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}