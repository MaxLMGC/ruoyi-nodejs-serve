const configService = require('./config.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');

// 根据参数键名查询参数值
exports.getConfigKey = async (req, res) => {
  try {
    const { configKey } = req.params;
    const config = await configService.getConfigByKey(configKey);

    if (!config) {
      return sendError(res, errorCodes.NOT_FOUND, '配置项未找到');
    }

    sendSuccess(res, { msg: config.configValue });
  } catch (error) {
    console.error('查询参数值时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};


// 查询参数列表
exports.listConfig = async (req, res) => {
  try {
    const { pageNum, pageSize, ...filters } = req.query;
    const data = await configService.listConfig(filters, Number(pageNum), Number(pageSize));
    sendSuccess(res, data);
  } catch (error) {
    console.error('查询参数列表时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 查询参数详细
exports.getConfig = async (req, res) => {
  try {
    const { configId } = req.params;
    const data = await configService.getConfig(configId);
    sendSuccess(res, { data });
  } catch (error) {
    console.error('查询参数详细时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 新增参数配置
exports.addConfig = async (req, res) => {
  try {
    const data = req.body;
    await configService.addConfig(data);
    sendSuccess(res, { msg: '操作成功' });
  } catch (error) {
    console.error('新增参数配置时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 修改参数配置
exports.updateConfig = async (req, res) => {
  try {
    const data = req.body;
    await configService.updateConfig(data);
    sendSuccess(res, { msg: '操作成功' });
  } catch (error) {
    console.error('修改参数配置时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 删除参数配置
exports.delConfig = async (req, res) => {
  try {
    const { configId } = req.params;
    await configService.delConfig(configId);
    sendSuccess(res, { msg: '删除成功' });
  } catch (error) {
    console.error('删除参数配置时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 刷新参数缓存
exports.refreshCache = async (req, res) => {
  try {
    sendSuccess(res, { msg: '操作成功' });
  } catch (error) {
    console.error('刷新参数缓存时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

const fields = [
  { label: '参数主键', key: 'configId', columnIndex: 1, type: 'number' },
  { label: '参数名称', key: 'configName', columnIndex: 2, required: true, type: 'string', primaryKey: true },
  { label: '参数键名', key: 'configKey', columnIndex: 3, type: 'string' },
  { label: '参数键值', key: 'configValue', columnIndex: 4, type: 'string' },
  { label: '系统内置', key: 'configType', columnIndex: 5, dictType: 'sys_yes_no', type: 'string' },
  { label: '备注', key: 'remark', columnIndex: 6, type: 'string' },
  { label: '创建时间', key: 'createTime', columnIndex: 7, type: 'date' }
];

// 导出参数数据到 Excel 文件的控制器
exports.exportConfig = async (req, res) => {
  try {
    const { pageNum = 1, pageSize = 10, ...filters } = req.body;
    const { rows } = await configService.listConfig(filters, 1, 10000000000);
    const buffer = await exportToExcel(rows, fields);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('导出数据时出错:', error);
    sendError(res, { code: 5000, msg: '导出数据时出错' });
  }
};
