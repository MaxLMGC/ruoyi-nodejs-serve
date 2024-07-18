const dictTypeService = require('./type.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');

// 获取字典选择框列表
exports.optionSelect = async (req, res) => {
    try {
        const data = await dictTypeService.getOptionSelect();
        sendSuccess(res, { data });
    } catch (error) {
        console.error('获取字典选择框列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询字典类型列表
exports.listType = async (req, res) => {
    try {
        const { pageNum, pageSize, ...filters } = req.query;
        const data = await dictTypeService.listTypes(filters, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询字典类型列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询字典类型详细
exports.getType = async (req, res) => {
    try {
        const { dictId } = req.params;
        const data = await dictTypeService.getType(dictId);
        sendSuccess(res, { data });
    } catch (error) {
        console.error('查询字典类型详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增字典类型
exports.addType = async (req, res) => {
    try {
        const data = req.body;
        await dictTypeService.addType(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增字典类型时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改字典类型
exports.updateType = async (req, res) => {
    try {
        const data = req.body;
        await dictTypeService.updateType(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改字典类型时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除字典类型
exports.delType = async (req, res) => {
    try {
        const { dictId } = req.params;
        await dictTypeService.delType(dictId);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('删除字典类型时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 刷新字典缓存
exports.refreshCache = (req, res) => {
    sendSuccess(res, { msg: '操作成功' });
};

const fields = [
    { label: '字典编号', key: 'dictId', columnIndex: 1, type: 'number' },
    { label: '字典名称', key: 'dictName', columnIndex: 2, required: true, type: 'string', primaryKey: true },
    { label: '字典类型', key: 'dictType', columnIndex: 3, type: 'string' },
    { label: '状态', key: 'status', columnIndex: 4, dictType: 'sys_normal_disable', type: 'string' },
    { label: '备注', key: 'remark', columnIndex: 5, type: 'string' },
    { label: '创建时间', key: 'createTime', columnIndex: 6, type: 'date' }
];

// 导出字典数据到 Excel 文件的控制器
exports.exportDictTypes = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, ...filters } = req.body;
        const { rows } = await dictTypeService.listTypes(filters, 1, 10000000000);
        const buffer = await exportToExcel(rows, fields);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('导出数据时出错:', error);
        sendError(res, { code: 5000, msg: '导出数据时出错' });
    }
};
