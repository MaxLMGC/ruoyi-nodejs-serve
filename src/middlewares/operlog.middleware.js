const url = require('url');
const requestIp = require('request-ip');
const { addOperLog } = require('@/modules/monitor/operlog/operlog.service');
const { isPrivateIP, getIPv4 } = require('@/utils/ip');
const { Buffer } = require('buffer');

const CreateOperLog = (options) => {
  return async (req, res, next) => {
    const start = Date.now();
    const originalSend = res.send;
    let responseData = null;

    // 重写 res.send 方法以捕获响应数据
    res.send = function (body) {
      responseData = body;
      return originalSend.apply(res, arguments);
    };


    res.on('finish', async () => {
      const end = Date.now();
      const costTime = end - start;

      let clientIp = requestIp.getClientIp(req);
      clientIp = getIPv4(clientIp);

      // 自动设置 operatorType
      const userAgent = req.headers['user-agent'];
      let operatorType = 0; // 默认值为 0
      if (userAgent) {
        if (/mobile/i.test(userAgent)) {
          operatorType = 2; // 手机端用户
        } else {
          operatorType = 1; // 后台用户
        }
      }

      // 解析 URL 去掉查询参数部分
      const parsedUrl = url.parse(req.originalUrl, true);
      const operUrl = parsedUrl.pathname;

      // 根据请求方法决定记录 params 还是 body
      const operParam = req.method == 'GET' ? JSON.stringify(req.query) : JSON.stringify(req.body);

      const resData = JSON.parse(responseData)

      const logData = {
        title: options.title || '默认标题', // 模块名称
        businessType: options.businessType || 0, // 业务名称
        method: req.route ? req.route.stack[0].name : 'unknown', // 获取路由处理程序的方法名称
        requestMethod: req.method,
        operatorType: operatorType, // 自动设置的操作类别
        operName: req.user ? req.user.user.userName : 'unknown',
        deptName: req.user && req.user.user.dept ? req.user.user.dept.deptName : 'unknown',
        operUrl: operUrl,
        operIp: clientIp,
        operLocation: isPrivateIP(clientIp) ? '内网IP' : '外网IP',
        operParam: operParam,
        jsonResult: Buffer.isBuffer(responseData) ? 'Buffer' : responseData,
        status: parseInt(resData.code) >= 400 ? 1 : 0,
        errorMsg: parseInt(resData.code) >= 400 ? resData.msg : '',
        operTime: new Date(),
        costTime
      };

      try {
        await addOperLog(logData);
      } catch (error) {
        console.error('记录操作日志时出错:', error);
      }
    });

    next();
  };
};

module.exports = {
  CreateOperLog
};
