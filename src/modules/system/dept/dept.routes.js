const express = require('express');
const router = express.Router();
const deptController = require('./dept.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 查询部门列表
router.get('/list', Permissions(['system:dept:list']), deptController.listDepts);

// 查询部门详细
router.get('/:deptId', Permissions(['system:dept:query']), CreateOperLog({
    title: '部门管理',
    businessType: '4',
}), deptController.getDept);

// 新增部门
router.post('/', Permissions(['system:dept:add']), CreateOperLog({
    title: '部门管理',
    businessType: '1',
}), deptController.addDept);

// 修改部门
router.put('/', Permissions(['system:dept:edit']), CreateOperLog({
    title: '部门管理',
    businessType: '2',
}), deptController.updateDept);

// 查询部门列表（排除节点）
router.get('/list/exclude/:deptId', Permissions(['system:dept:list']), deptController.listDeptExcludeChild);

// 删除部门
router.delete('/:deptId', Permissions(['system:dept:remove']), CreateOperLog({
    title: '部门管理',
    businessType: '3',
}), deptController.delDept);

module.exports = router;
