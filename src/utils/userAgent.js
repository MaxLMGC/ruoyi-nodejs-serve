const useragent = require('useragent');

// 解析 User-Agent 字符串，获取浏览器和操作系统信息
const parseUserAgent = (userAgentString) => {
  const agent = useragent.parse(userAgentString);
  return {
    browser: `${agent.family} ${agent.major}`,
    os: `${agent.os.family} ${agent.os.major}`
  };
};

module.exports = {
  parseUserAgent
};
