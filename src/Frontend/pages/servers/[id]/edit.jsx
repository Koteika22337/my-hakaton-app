import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api } from '../../../utils/api';
import ServerForm from '../../../components/ServerForm';

export default function EditServer() {
  const [server, setServer] = useState(null);
  const [loading, setLoading] = useState(true);
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
      await api.updateServer(id, formData);
    } catch (error) {
      console.error('Error updating server:', error);
      throw error;
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Загрузка...</div>;
  }

  return (
    <>
      <Head>
        <title>Редактирование {server.host}</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => router.push('/servers')}
            className="mb-6 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            ← Назад к списку
          </button>

          <div className="bg-gray-800 rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Редактирование сервера: {server.host}</h1>
            <ServerForm 
              initialData={server} 
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}