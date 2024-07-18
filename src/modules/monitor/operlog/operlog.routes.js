const express = require('express');
const router = express.Router();
const OperLogController = require('./operlog.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 查询操作日志列表
router.get('/list', Permissions(['monitor:operlog:list']), OperLogController.listOperLogs);

// 清空操作日志
router.delete('/clean', Permissions(['monitor:operlog:remove']), CreateOperLog({
    title: '操作日志',
    businessType: '9',
}), OperLogController.cleanOperLog);

// 导出操作日志
router.post('/export', Permissions(['monitor:operlog:export]']), CreateOperLog({
    title: '操作日志',
    businessType: '5',
}), OperLogController.exportOperLogs);

// 删除操作日志
router.delete('/:operId', Permissions(['monitor:operlog:remove']), CreateOperLog({
    title: '操作日志',
    businessType: '3',
}), OperLogController.delOperLog);



module.exports = router;
