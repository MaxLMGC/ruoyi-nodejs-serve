const roleService = require('./role.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');

// 查询角色列表
exports.listRoles = async (req, res) => {
    try {
        const { pageNum, pageSize, ...filters } = req.query;

        const data = await roleService.listRoles(filters, Number(pageNum), Number(pageSize));

        sendSuccess(res, data);
    } catch (error) {
        console.error('查询角色列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增角色
exports.addRole = async (req, res) => {
    try {
        const { menuIds, deptIds, ...roleData } = req.body;
        await roleService.addRole(roleData, menuIds);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改角色
exports.updateRole = async (req, res) => {
    try {
        const { menuIds, ...roleData } = req.body;

        if (roleData.roleKey === 'admin') {
            return sendError(res, errorCodes.FORBIDDEN, { msg: '无法修改管理员角色' });
        }

        await roleService.updateRole(roleData, menuIds);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};


// 查询角色详细
exports.getRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const role = await roleService.getRoleById(Number(roleId));

        if (!role) {
            return sendError(res, errorCodes.NOT_FOUND);
        }

        sendSuccess(res, { data: role });
    } catch (error) {
        console.error('查询角色详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除角色
exports.delRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        const roleIdsArray = roleId.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        // 检查是否包含角色ID为1的情况
        if (roleIdsArray.includes(1)) {
            return sendError(res, errorCodes.FORBIDDEN, { msg: '无法删除角色ID为1的角色' });
        }

        await roleService.delRole(roleId);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('删除角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 角色状态修改
exports.changeRoleStatus = async (req, res) => {
    try {
        const { roleId, status } = req.body;
        await roleService.changeRoleStatus(roleId, status);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('角色状态修改时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 根据角色ID查询部门树结构
exports.deptTreeSelect = async (req, res) => {
    try {
        const { roleId } = req.params;
        const data = await roleService.getDeptTreeByRoleId(roleId);
        sendSuccess(res, {
            msg: '操作成功',
            code: 200,
            ...data
        });
    } catch (error) {
        console.error('查询部门树结构时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 更新角色数据权限
exports.dataScope = async (req, res) => {
    try {
        const data = req.body;
        await roleService.updateDataScope(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('更新角色数据权限时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询角色已授权用户列表
exports.allocatedUserList = async (req, res) => {
    try {
        const { pageNum, pageSize, roleId, ...filters } = req.query;

        if (!roleId) {
            return sendError(res, errorCodes.BAD_REQUEST, '角色ID不能为空');
        }

        const data = await roleService.allocatedUserList(filters, roleId, pageNum ? Number(pageNum) : 1, pageSize ? Number(pageSize) : 10);
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询角色已授权用户列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 取消用户授权角色
exports.authUserCancel = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        if (!userId || !roleId) {
            return sendError(res, errorCodes.BAD_REQUEST, '用户ID和角色ID不能为空');
        }

        await roleService.authUserCancel(userId, roleId);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('取消用户授权角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 批量取消用户授权角色
exports.authUserCancelAll = async (req, res) => {
    try {
        const { roleId, userIds } = req.query;

        if (!roleId || !userIds) {
            return sendError(res, errorCodes.BAD_REQUEST, '角色ID和用户ID不能为空');
        }

        const userIdArray = userIds.split(',').map(id => parseInt(id.trim()));

        await roleService.authUserCancelAll(roleId, userIdArray);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('批量取消用户授权角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询角色未授权用户列表
exports.unallocatedUserList = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, roleId } = req.query;

        if (!roleId) {
            return sendError(res, errorCodes.BAD_REQUEST, '角色ID不能为空');
        }

        const data = await roleService.unallocatedUserList({ roleId }, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询角色未授权用户列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 批量授权用户选择
exports.authUserSelectAll = async (req, res) => {
    try {
        const { roleId, userIds } = req.query;
        if (!roleId || !userIds) {
            return sendError(res, errorCodes.BAD_REQUEST, '角色ID和用户ID不能为空');
        }
        await roleService.authUserSelectAll(roleId, userIds.split(','));
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('授权用户选择时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

const fields = [
    { label: '角色编号', key: 'roleId', columnIndex: 1, type: 'number' },
    { label: '角色名称', key: 'roleName', columnIndex: 2, required: true, type: 'string', primaryKey: true },
    { label: '权限字符', key: 'roleKey', columnIndex: 3, type: 'string' },
    { label: '显示顺序', key: 'roleSort', columnIndex: 4, type: 'number' },
    { label: '状态', key: 'status', columnIndex: 5, dictType: 'sys_normal_disable', type: 'string' },
    { label: '创建时间', key: 'createTime', columnIndex: 6, type: 'date' }
];

// 导出用户数据到 Excel 文件的控制器
exports.exportUsers = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, ...filters } = req.body;

        const { rows: users } = await roleService.listRoles(filters, 1, 10000000000);

        const buffer = await exportToExcel(users, fields);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('导出数据时出错:', error);
        sendError(res, { code: 5000, msg: '导出数据时出错' });
    }
};