// 全局配置文件
module.exports = {
    database: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'skyclear',
    },
    redis: {
        url: 'redis://localhost:6379',
    },
    swagger: {
        title: '空明系统',
        version: '1.0.0',
        description: 'API Documentation',
        serverUrl: 'http://localhost:3000',
        serverDescription: 'Local server',
    },
};
