import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
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
        <title>Добавление нового сервера</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          {/* Кнопка назад */}
          <button
            onClick={() => router.push('/servers')}
            className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            ← Назад к списку
          </button>

          {/* Форма добавления */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Добавление нового сервера</h1>
            
            <ServerForm 
              onSubmit={handleSubmit}
              loading={loading}
            />
            
            {loading && (
              <div className="mt-4 text-blue-400">Добавление сервера...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}