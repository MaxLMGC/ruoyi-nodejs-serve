const LoginInForService = require('./logininfor.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { parseUserAgent } = require('@/utils/userAgent');
const { isPrivateIP, getIPv4 } = require('@/utils/ip');
const requestIp = require('request-ip');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');


// 查询登录日志列表
exports.listLogininfor = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, ...filters } = req.query;
    const data = await LoginInForService.listLogininfor(filters, pageNum, pageSize);
    sendSuccess(res, data);
  } catch (error) {
    console.error('查询登录日志列表时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 删除登录日志
exports.deleteLogininfor = async (req, res) => {
  try {
    const { infoId } = req.params;
    await LoginInForService.deleteLogininfor(infoId);
    sendSuccess(res, { msg: '删除成功' });
  } catch (error) {
    console.error('删除登录日志时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 解锁用户登录状态
exports.unlockLogininfor = async (req, res) => {
  try {
    const { userName } = req.params;
    await LoginInForService.unlockUser(userName);
    sendSuccess(res, { msg: '操作成功' });
  } catch (error) {
    console.error('解锁用户登录状态时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 清空登录日志
exports.cleanLogininfor = async (req, res) => {
  try {
    await LoginInForService.cleanLogininfor();
    sendSuccess(res, { msg: '清空成功' });
  } catch (error) {
    console.error('清空登录日志时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 添加登录日志
exports.addLogininfor = async (req, status) => {
  const userAgentInfo = parseUserAgent(req.headers['user-agent']);
  let clientIp = requestIp.getClientIp(req);
  clientIp = getIPv4(clientIp);

  const loginData = {
    userName: req.body.username,
    ipaddr: clientIp,
    loginLocation: isPrivateIP(clientIp) ? '内网IP' : '外网IP',
    browser: userAgentInfo.browser,
    os: userAgentInfo.os,
    status: status[0],
    msg: status[1],
    loginTime: new Date()
  };

  console.log('正在插入数据')

  await LoginInForService.addLogininfor(loginData);
}

const fields = [
  { label: '访问编号', key: 'infoId', columnIndex: 1, type: 'number' },
  { label: '用户名', key: 'userName', columnIndex: 2, type: 'string' },
  { label: '登录地址', key: 'ipaddr', columnIndex: 3, type: 'string' },
  { label: '登录地点', key: 'loginLocation', columnIndex: 4, type: 'string' },
  { label: '浏览器', key: 'browser', columnIndex: 5, type: 'string' },
  { label: '操作系统', key: 'os', columnIndex: 6, type: 'string' },
  { label: '登录状态', key: 'status', columnIndex: 7, dictType: 'sys_login_status', type: 'string' },
  { label: '操作信息', key: 'msg', columnIndex: 8, type: 'string' },
  { label: '登录时间', key: 'loginTime', columnIndex: 9, type: 'date' }
];

// 导出登录日志数据到 Excel 文件的控制器
exports.exportLogininfor = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, ...filters } = req.body;
    const { rows } = await LoginInForService.listLogininfor(filters, 1, 10000000000);
    const buffer = await exportToExcel(rows, fields);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('导出数据时出错:', error);
    sendError(res, { code: 5000, msg: '导出数据时出错' });
  }
};
