const ipRangeCheck = require('ip-range-check');
const isPrivateIP = (ip) => {
  const privateRanges = [
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.0.0/16'
  ];

  return ipRangeCheck(ip, privateRanges);
};

const getIPv4 = (ip) => {
    if (ip === '::1') {
      return '127.0.0.1';
    }
    // Convert IPv6 to IPv4 if necessary
    if (ip.includes('::ffff:')) {
      return ip.split('::ffff:')[1];
    }
    return ip;
  };

module.exports = {
  isPrivateIP,
  getIPv4
};
