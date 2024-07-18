// src/modules/system/data/data.controller.js
const dataService = require('./data.service');
const { sendSuccess, sendError } = require('@/utils/response');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');
const errorCodes = require('@/utils/error');

// 根据字典类型查询字典数据信息
exports.getDicts = async (req, res) => {
    try {
        const { dictType } = req.params;
        const data = await dataService.getDictsByType(dictType);
        sendSuccess(res, { data });
    } catch (error) {
        console.error('查询字典数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询字典数据列表
exports.listData = async (req, res) => {
    try {
        const { pageNum, pageSize, ...filters } = req.query;
        const data = await dataService.listDatas(filters, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询字典数据列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询字典数据详细
exports.getData = async (req, res) => {
    try {
        const { dictCode } = req.params;
        const data = await dataService.getData(dictCode);
        sendSuccess(res, { data });
    } catch (error) {
        console.error('查询字典数据详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增字典数据
exports.addData = async (req, res) => {
    try {
        const data = req.body;
        await dataService.addData(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增字典数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改字典数据
exports.updateData = async (req, res) => {
    try {
        const data = req.body;
        await dataService.updateData(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改字典数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除字典数据
exports.delData = async (req, res) => {
    try {
        const { dictCode } = req.params;
        await dataService.delData(dictCode);
        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除字典数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

const fields = [
    { label: '字典编码', key: 'dictCode', columnIndex: 1, type: 'number' },
    { label: '字典标签', key: 'dictLabel', columnIndex: 2, required: true, type: 'string', primaryKey: true },
    { label: '字典键值', key: 'dictValue', columnIndex: 3, type: 'string' },
    { label: '字典排序', key: 'dictSort', columnIndex: 4, type: 'number' },
    { label: '状态', key: 'status', columnIndex: 5, dictType: 'sys_normal_disable', type: 'string' },
    { label: '备注', key: 'remark', columnIndex: 6, type: 'string' },
    { label: '创建时间', key: 'createTime', columnIndex: 7, type: 'date' }
];

// 导出字典数据到 Excel 文件的控制器
exports.exportDictData = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, ...filters } = req.body;
        const { rows } = await dataService.listDatas(filters, 1, 10000000000);
        const buffer = await exportToExcel(rows, fields);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('导出数据时出错:', error);
        sendError(res, { code: 5000, msg: '导出数据时出错' });
    }
};
