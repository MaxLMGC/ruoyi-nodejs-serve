const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');
const { uploadSingle } = require('@/middlewares/upload.middleware');

// 查询用户列表
router.get('/list', Permissions(['system:user:list']), UserController.listUsers);

// 用户状态修改
router.put('/changeStatus', Permissions(['system:user:changeStatus']), CreateOperLog({
    title: '用户管理',
    businessType: '2',
}), UserController.changeUserStatus);

// 查询授权角色
router.get('/authRole/:userId', Permissions(['system:user:authRoleList']), CreateOperLog({
    title: '用户管理',
    businessType: '4',
}), UserController.getAuthRole);

// 更新授权角色
router.put('/authRole', Permissions(['system:user:authRoleEdit']), UserController.updateAuthRole);

// 重置用户密码
router.put('/resetPwd', Permissions(['system:user:resetPwd']), UserController.resetUserPwd);

// 删除用户信息
router.delete('/:userId', Permissions(['system:user:remove']), CreateOperLog({
    title: '用户管理',
    businessType: '3',
}), UserController.deleteUser);

// 查询部门下拉树结构
router.get('/deptTree', Permissions(['system:user:deptTree']), UserController.deptTreeSelect);

// 更新用户信息
router.put('/', Permissions(['system:user:edit']), CreateOperLog({
    title: '用户管理',
    businessType: '2',
}), UserController.updateUser);

// 查询用户个人信息
router.get('/profile', Permissions(), UserController.getUserProfile);

// 修改用户个人信息
router.put('/profile', Permissions(), UserController.updateUserProfile);

// 修改用户密码
router.put('/profile/updatePwd', Permissions(), UserController.updateUserPwd);

// 导出用户数据
router.post('/export', Permissions(['system:user:export']), CreateOperLog({
    title: '用户管理',
    businessType: '5',
}), UserController.exportUsers);

// 导入模板生成接口
router.post('/importTemplate', Permissions(), UserController.importTemplate);

// 上传配置
const uploadConfig = {
    storageType: 'memory',
    maxFileSize: 1024 * 1024 * 50, // 最大文件大小 50MB
    fileTypes: ['xlsx', 'xls'], // 支持的文件类型
};

// 导入用户数据
router.post('/importData', Permissions(['system:user:import']), uploadSingle(uploadConfig), CreateOperLog({
    title: '用户管理',
    businessType: '6',
}), UserController.importData);

// 新增用户信息
router.post('/', Permissions(['system:user:add']), CreateOperLog({
    title: '用户管理',
    businessType: '1',
}), UserController.addUser);

// 查询用户详细信息
router.get('/:userId', Permissions(['system:user:query']), CreateOperLog({
    title: '用户管理',
    businessType: '4',
}), UserController.getUser);

module.exports = router;
