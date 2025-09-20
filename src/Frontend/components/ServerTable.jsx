import Link from 'next/link';

export default function ServerTable({ servers, onDelete, onRefresh, showActions = true }) {
  const getStatusColor = (status) => {
    return status === 'up' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (status) => {
    return status === 'up' ? '🟢' : '🔴';
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-700">
            <th className="px-4 py-3 text-left">Хост</th>
            <th className="px-4 py-3 text-left">IP</th>
            <th className="px-4 py-3 text-left">Статус</th>
            <th className="px-4 py-3 text-left">Время ответа</th>
            <th className="px-4 py-3 text-left">Успешность</th>
            {showActions && <th className="px-4 py-3 text-left">Действия</th>}
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server.id} className="border-b border-gray-700 hover:bg-gray-750">
              <td className="px-4 py-3">
                <Link 
                  href={`/servers/${server.id}`}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {server.host}
                </Link>
              </td>
              <td className="px-4 py-3">{server.host}</td>
              <td className="px-4 py-3">{server.ip}</td>
              <td className="px-4 py-3">
                <span className={getStatusColor(server.status)}>
                  {getStatusIcon(server.status)} {server.status}
                </span>
              </td>
              <td className="px-4 py-3">{server.stats?.avgResponseTimeMs} ms</td>
              <td className="px-4 py-3">{server.stats?.successRate}%</td>
              
              {showActions && (
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/servers/edit/${server.id}`}
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-sm"
                    >
                      Обновить
                    </Link>
                    <button
                      onClick={() => onDelete(server.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                    >
                      Удалить
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}