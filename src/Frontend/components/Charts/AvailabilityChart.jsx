import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AvailabilityChart({ servers }) {
  // Преобразуем данные для графика
  const chartData = servers.map(server => ({
    name: server.host,
    availability: server.status === 'up' ? 100 : 0,
    responseTime: server.stats?.avgResponseTimeMs || 0
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            domain={[0, 100]}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              borderColor: '#374151',
              color: 'white'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="availability" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#059669' }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-center text-gray-400 text-sm mt-2">
        Доступность серверов (%)
      </div>
    </div>
  );
}