const express = require('express');
const router = express.Router();
const dataController = require('./data.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 根据字典类型查询字典数据信息
router.get('/type/:dictType', Permissions(), dataController.getDicts);

// 查询字典数据列表
router.get('/list', Permissions(['system:dict:list']), dataController.listData);

// 查询字典数据详细
router.get('/:dictCode', Permissions(['system:dict:query']), CreateOperLog({
    title: '字典数据管理',
    businessType: '4',
}), dataController.getData);

// 新增字典数据
router.post('/', Permissions(['system:dict:add']), CreateOperLog({
    title: '字典数据管理',
    businessType: '1',
}), dataController.addData);

// 修改字典数据
router.put('/', Permissions(['system:dict:edit']), CreateOperLog({
    title: '字典数据管理',
    businessType: '2',
}), dataController.updateData);

// 删除字典数据
router.delete('/:dictCode', Permissions(['system:dict:remove']), CreateOperLog({
    title: '字典数据管理',
    businessType: '3',
}), dataController.delData);

// 导出岗位数据
router.post('/export', Permissions(['system:dict:export']), CreateOperLog({
    title: '字典数据管理',
    businessType: '5',
}), dataController.exportDictData);

module.exports = router;
