import Head from "next/head";
import { getServerByName } from "../public/scripts/getServerByName";

export async function getServerSideProps({ params }) {
  const data = await getServerByName(params.slug);
  if (!data) return { notFound: true };
  return { props: { data } };
}

export default function ServerInfo({ data }) {
  return (
    <>
      <Head>
        <title>{data.name}</title>
        <meta
          name="description"
          content={`Server ${data.name} statistic page`}
        />
        <link rel="shortcut icon" href="/img/serverIcon.png" />
        <link rel="apple-touch-icon" href="/img/serverIcon.png" />
      </Head>
      <div className="min-h-screen bg-gray-900 p-6 text-white">
        <h1 className="text-3xl font-bold mb-6">Детали сервера: {data.name}</h1>
        <div className="bg-gray-800/50 p-6 rounded-lg">
          <p>
            <strong>IP:</strong> {data.ip}
          </p>
          <p>
            <strong>Статус:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded ${data.status === "online" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
            >
              {data.status}
            </span>
          </p>
          <p>
            <strong>Среднее время ответа:</strong>{" "}
            {data.stats.avgResponseTimeMs} мс
          </p>
          <p>
            <strong>Успешность:</strong> {data.stats.successRate}%
          </p>
          <p>
            <strong>Последняя проверка:</strong>{" "}
            {new Date(data.stats.lastCheck).toLocaleString()}
          </p>

          <h2 className="mt-6 text-xl">Логи</h2>
          <div className="mt-2 space-y-1">
            {data.logs.length > 0 ? (
              data.logs.map((log, i) => (
                <div key={i} className="text-sm bg-gray-900 p-2 rounded">
                  {log.timestamp} → {log.success ? "✅ OK" : "❌ ERR"} (
                  {log.responseTimeMs}ms)
                </div>
              ))
            ) : (
              <p className="text-gray-400">Нет логов</p>
            )}
          </div>
        </div>

        <button
          onClick={() => router.back()}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Назад к списку
        </button>
      </div>
    </>
  );
}
