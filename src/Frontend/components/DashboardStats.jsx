export default function DashboardStats({ stats }) {
  const statCards = [
    {
      title: "Всего серверов",
      value: stats.totalServers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" />
        </svg>
      ),
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Активные",
      value: stats.upServers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200"
    },
    {
      title: "Неактивные",
      value: stats.downServers,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200"
    },
    {
      title: "Инциденты сегодня",
      value: stats.totalIncidentsToday,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`bg-white rounded-xl p-6 border ${card.borderColor} shadow-sm hover:shadow-md transition-shadow duration-200`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <div className={card.color}>
                {card.icon}
              </div>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-2xl font-bold text-gray-900">
              {card.value}
            </div>
            <div className="text-sm text-gray-600">
              {card.title}
            </div>
          </div>

          {/* Progress bar или дополнительная информация */}
          {card.title === "Активные" && stats.totalServers > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(stats.upServers / stats.totalServers) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((stats.upServers / stats.totalServers) * 100)}% доступно
              </div>
            </div>
          )}

          {card.title === "Инциденты сегодня" && stats.totalIncidentsToday > 0 && (
            <div className="mt-2">
              <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                ⚠️ Требуют внимания
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}