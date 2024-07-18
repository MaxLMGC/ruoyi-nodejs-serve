const express = require('express');
const router = express.Router();
const configController = require('./config.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 根据参数键名查询参数值
router.get('/configKey/:configKey', Permissions(), configController.getConfigKey);

// 查询参数列表
router.get('/list', Permissions(['system:config:list']), configController.listConfig);

// 查询参数详细
router.get('/:configId', Permissions(['system:config:query']), CreateOperLog({
    title: '参数管理',
    businessType: '4',
}), configController.getConfig);

// 新增参数配置
router.post('/', Permissions(['system:config:add']), CreateOperLog({
    title: '参数管理',
    businessType: '1',
}), configController.addConfig);

// 修改参数配置
router.put('/', Permissions(['system:config:edit']), CreateOperLog({
    title: '参数管理',
    businessType: '2',
}), configController.updateConfig);

// 刷新参数缓存
router.delete('/refreshCache', Permissions(), configController.refreshCache);

// 删除参数配置
router.delete('/:configId', Permissions(['system:config:remove']), CreateOperLog({
    title: '参数管理',
    businessType: '3',
}), configController.delConfig);

// 导出参数配置
router.post('/export', Permissions(['system:config:export']), CreateOperLog({
    title: '参数管理',
    businessType: '5',
}), configController.exportConfig);

module.exports = router;
