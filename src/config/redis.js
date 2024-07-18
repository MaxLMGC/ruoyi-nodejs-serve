const { createClient } = require('redis');
const config = require('./config');

const client = createClient({
  url: config.redis.url,
});

client.on('error', (err) => {
  console.log('redis错误:', err);
});

client.connect().then(() => {
  console.log('redis连接成功');
}).catch((err) => {
  console.error('redis连接失败', err);
});

module.exports = client;
