export default function DashboardStats({ stats }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Всего серверов */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm">Всего серверов</div>
        <div className="text-2xl font-bold text-white">{stats.totalServers}</div>
      </div>

      {/* Активные серверы */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm">Активные</div>
        <div className="text-2xl font-bold text-green-400">{stats.upServers}</div>
      </div>

      {/* Неактивные серверы */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm">Неактивные</div>
        <div className="text-2xl font-bold text-red-400">{stats.downServers}</div>
      </div>

      {/* Инциденты сегодня */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-gray-400 text-sm">Инциденты сегодня</div>
        <div className="text-2xl font-bold text-yellow-400">{stats.totalIncidentsToday}</div>
      </div>
    </div>
  );
}