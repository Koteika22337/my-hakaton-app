export const servers = [
    {
        id: 1,
        host: "ya.ru",
        ip: "121.10.12.2",
        status: "up",
        stats: {
            avgResponseTimeMs: 124,
            successRate: 0.5
        }
    },
    {
        id: 2,
        host: "ya.ru",
        ip: "121.10.12.2",
        status: "down",
        stats: {
            avgResponseTimeMs: 124,
            successRate: 0.5
        }
    },
    {
        id: 3,
        host: "ya.ru",
        ip: "121.10.12.2",
        status: "up",
        stats: {
            avgResponseTimeMs: 124,
            successRate: 0.5
        }
    },
    {
        id: 4,
        host: "ya.ru",
        ip: "121.10.12.2",
        status: "up",
        stats: {
            avgResponseTimeMs: 124,
            successRate: 0.5
        }
    },
]

export const logs = [
    {
        id: 1,
        timestamp: "12:30",
        responseTimeMs: 124,
        success: true,
        statusCode: 200,
        protocol: "HTTP",
        errorMessage: "success"
    },
    {
        id: 2,
        timestamp: "12:30",
        responseTimeMs: 124,
        success: false,
        statusCode: 200,
        protocol: "HTTP",
        errorMessage: "success"
    },
    {
        id: 3,
        timestamp: "12:30",
        responseTimeMs: 124,
        success: true,
        statusCode: 200,
        protocol: "HTTP",
        errorMessage: "success"
    },
    {
        id: 4,
        timestamp: "12:30",
        responseTimeMs: 124,
        success: false,
        statusCode: 200,
        protocol: "HTTP",
        errorMessage: "success"
    },
]

export const serverStats = [
    {
        id: 1,
        host: "ya.ru",
        avgResponseTimeMs: 123,
    },
    {
        id: 2,
        host: "ya.ru",
        avgResponseTimeMs: 123,
    },
    {
        id: 3,
        host: "ya.ru",
        avgResponseTimeMs: 123,
    },
    {
        id: 4,
        host: "ya.ru",
        avgResponseTimeMs: 123,
    },
]

export const stats = {
    totalServers: 15,
    upServers: 11,
    downServers: 4,
    totalIncidentsToday: 4,
}