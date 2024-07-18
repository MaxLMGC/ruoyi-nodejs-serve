const { sendSuccess, sendError } = require('@/utils/response');
const OperLogService = require('./operlog.service');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');

// 查询操作日志列表
exports.listOperLogs = async (req, res) => {
  try {
    const { pageNum, pageSize, ...filters } = req.query;
    const data = await OperLogService.listOperLogs(filters, pageNum ? Number(pageNum) : null, pageSize ? Number(pageSize) : null);
    sendSuccess(res, data);
  } catch (error) {
    console.error('查询操作日志列表时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 删除操作日志
exports.delOperLog = async (req, res) => {
  try {
    const { operId } = req.params;
    await OperLogService.delOperLog(operId);
    sendSuccess(res, { msg: '删除成功' });
  } catch (error) {
    console.error('删除操作日志时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 清空操作日志
exports.cleanOperLog = async (req, res) => {
  try {
    await OperLogService.cleanOperLog();
    sendSuccess(res, { msg: '清空成功' });
  } catch (error) {
    console.error('清空操作日志时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

const fields = [
  { label: '日志编号', key: 'operId', columnIndex: 1, type: 'number' },
  { label: '系统模块', key: 'title', columnIndex: 2, type: 'string' },
  { label: '操作类型', key: 'businessType', columnIndex: 3, type: 'number' },
  { label: '操作人员', key: 'operName', columnIndex: 4, type: 'string' },
  { label: '操作地址', key: 'operIp', columnIndex: 5, type: 'string' },
  { label: '操作地点', key: 'operLocation', columnIndex: 6, type: 'string' },
  { label: '操作状态', key: 'status', columnIndex: 7, dictType: 'sys_normal_disable', type: 'string' },
  { label: '操作日期', key: 'operTime', columnIndex: 8, type: 'date' },
  { label: '消耗时间/ms', key: 'costTime', columnIndex: 9, type: 'number' }
];

// 导出操作日志数据到 Excel 文件的控制器
exports.exportOperLogs = async (req, res) => {
  try {
      const { pageNum = 1, pageSize = 10, ...filters } = req.body;
      const { rows } = await OperLogService.listOperLogs(filters, 1, 10000000000);
      const buffer = await exportToExcel(rows, fields);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
  } catch (error) {
      console.error('导出数据时出错:', error);
      sendError(res, { code: 5000, msg: '导出数据时出错' });
  }
};
