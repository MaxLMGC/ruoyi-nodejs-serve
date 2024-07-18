const express = require('express');
const router = express.Router();
const RoleController = require('./role.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 查询角色列表
router.get('/list', Permissions(['system:role:list']), RoleController.listRoles);

// 新增角色
router.post('/', Permissions(['system:role:add']), CreateOperLog({
    title: '角色管理',
    businessType: '1',
}), RoleController.addRole);

// 修改角色
router.put('/', Permissions(['system:role:edit']), CreateOperLog({
    title: '角色管理',
    businessType: '2',
}), RoleController.updateRole);

// 删除角色
router.delete('/:roleId', Permissions(['system:role:remove']), CreateOperLog({
    title: '角色管理',
    businessType: '3',
}), RoleController.delRole);

// 角色状态修改
router.put('/changeStatus', Permissions(['system:role:changeStatus']), CreateOperLog({
    title: '角色管理',
    businessType: '2',
}), RoleController.changeRoleStatus);

// 更新角色数据权限
router.put('/dataScope', Permissions(['system:role:dataScope']), CreateOperLog({
    title: '角色管理',
    businessType: '2',
}), RoleController.dataScope);

// 查询角色已授权用户列表
router.get('/authUser/allocatedList', Permissions(), RoleController.allocatedUserList);

// 取消用户授权角色
router.put('/authUser/cancel', Permissions(), RoleController.authUserCancel);

// 批量取消用户授权角色
router.put('/authUser/cancelAll', Permissions(), RoleController.authUserCancelAll);

// 根据角色ID查询部门树结构
router.get('/deptTree/:roleId', Permissions(), RoleController.deptTreeSelect);

// 查询角色未授权用户列表
router.get('/authUser/unallocatedList', Permissions(), RoleController.unallocatedUserList);

// 批量授权用户选择
router.put('/authUser/selectAll', Permissions(), RoleController.authUserSelectAll);

// 查询角色详细
router.get('/:roleId', Permissions(['system:role:query']), RoleController.getRole);

// 导出用户数据
router.post('/export', Permissions(['system:role:export']), CreateOperLog({
    title: '角色管理',
    businessType: '5',
}), RoleController.exportUsers);

module.exports = router;
