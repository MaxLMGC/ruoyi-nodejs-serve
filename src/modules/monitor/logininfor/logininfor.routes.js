const express = require('express');
const router = express.Router();
const logininforController = require('./logininfor.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 查询登录日志列表
router.get('/list', Permissions(['monitor:logininfor:list']), logininforController.listLogininfor);

// 解锁用户登录状态
router.get('/unlock/:userName', Permissions(['monitor:logininfor:unlock']), CreateOperLog({
    title: '登录日志',
    businessType: '10',
}), logininforController.unlockLogininfor);

// 清空登录日志
router.delete('/clean', Permissions(['monitor:logininfor:remove']), CreateOperLog({
    title: '登录日志',
    businessType: '3',
}), logininforController.cleanLogininfor);

// 导出登录日志
router.post('/export', Permissions(['monitor:logininfor:export']), CreateOperLog({
    title: '登录日志',
    businessType: '5',
}), logininforController.exportLogininfor);

// 删除登录日志
router.delete('/:infoId', Permissions(['monitor:logininfor:remove']), CreateOperLog({
    title: '登录日志',
    businessType: '3',
}), logininforController.deleteLogininfor);


module.exports = router;
