import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { api } from '../../utils/api';
import ServerTable from '../../components/ServerTable';

export default function ServersPage() {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const router = useRouter();

  const limit = 25;

  useEffect(() => {
    loadServers();
  }, [currentPage, searchTerm]);

  const loadServers = async () => {
    try {
      setLoading(true);
      const params = {
        limit,
        offset: (currentPage - 1) * limit,
        ...(searchTerm && { query: searchTerm })
      };
      
      const data = await api.getServers(params);
      setServers(data);
      setTotalCount(data.length); // В реальности API должно возвращать общее количество
    } catch (error) {
      console.error('Error loading servers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Вы уверены, что хотите удалить этот сервер?')) {
      try {
        await api.deleteServer(id);
        loadServers(); // Перезагружаем список
      } catch (error) {
        console.error('Error deleting server:', error);
      }
    }
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <>
      <Head>
        <title>Управление серверами</title>
      </Head>

      <div className="min-h-screen bg-gray-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Заголовок и кнопка добавления */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Управление серверами</h1>
            <button
              onClick={() => router.push('/servers/add')}
              className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              Добавить хост
            </button>
          </div>

          {/* Поиск */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Поиск серверов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded px-4 py-2 w-full md:w-1/3 text-white"
            />
          </div>

          {/* Таблица */}
          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <>
              <ServerTable 
                servers={servers} 
                onDelete={handleDelete}
                onRefresh={loadServers}
              />
              
              {/* Пагинация */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}