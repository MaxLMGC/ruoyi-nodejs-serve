const express = require('express');
const router = express.Router();
const dictTypeController = require('./type.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 获取字典选择框列表
router.get('/optionselect', Permissions(), dictTypeController.optionSelect);

// 查询字典类型列表
router.get('/list', Permissions(['system:dict:list']), dictTypeController.listType);

// 查询字典类型详细
router.get('/:dictId', Permissions(['system:dict:query']), CreateOperLog({
    title: '字典类型管理',
    businessType: '4',
}), dictTypeController.getType);

// 新增字典类型
router.post('/', Permissions(['system:dict:add']), CreateOperLog({
    title: '字典类型管理',
    businessType: '1',
}), dictTypeController.addType);

// 修改字典类型
router.put('/', Permissions(['system:dict:edit']), CreateOperLog({
    title: '字典类型管理',
    businessType: '2',
}), dictTypeController.updateType);

// 刷新字典缓存
router.delete('/refreshCache', Permissions(), dictTypeController.refreshCache);

// 删除字典类型
router.delete('/:dictId', Permissions(['system:dict:remove']), CreateOperLog({
    title: '字典类型管理',
    businessType: '3',
}), dictTypeController.delType);

// 导出岗位数据
router.post('/export', Permissions(['system:dict:export']), CreateOperLog({
    title: '字典类型管理',
    businessType: '5',
}), dictTypeController.exportDictTypes);

module.exports = router;
