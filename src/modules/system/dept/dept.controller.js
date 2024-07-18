const deptService = require('./dept.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');

// 查询部门列表
exports.listDepts = async (req, res) => {
    try {
        const depts = await deptService.listDepts(req.query);
        sendSuccess(res, { data: depts });
    } catch (error) {
        console.error('查询部门列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询部门详细
exports.getDept = async (req, res) => {
    try {
        const { deptId } = req.params;
        const dept = await deptService.getDeptById(deptId);
        if (!dept) {
            return sendError(res, errorCodes.NOT_FOUND);
        }
        sendSuccess(res, { data: dept });
    } catch (error) {
        console.error('查询部门详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增部门
exports.addDept = async (req, res) => {
    try {
        const data = req.body;
        await deptService.addDept(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增部门时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改部门
exports.updateDept = async (req, res) => {
    try {
        const data = req.body;
        await deptService.updateDept(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改部门时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除部门
exports.delDept = async (req, res) => {
    try {
        const { deptId } = req.params;
        await deptService.delDept(deptId);
        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除部门时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询部门列表（排除节点）
exports.listDeptExcludeChild = async (req, res) => {
    try {
        const { deptId } = req.params;
        const depts = await deptService.listDeptExcludeChild(deptId);
        sendSuccess(res, { data: depts });
    } catch (error) {
        console.error('查询部门列表（排除节点）时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};