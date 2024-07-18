const express = require('express');
const router = express.Router();
const menuController = require('./menu.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 获取菜单下拉树
router.get('/treeselect', Permissions(['system:menu:list']), menuController.getMenuTreeSelect);

// 根据角色ID查询菜单下拉树结构
router.get('/roleMenuTreeselect/:roleId', Permissions(['system:menu:list']), menuController.roleMenuTreeselect);

// 查询菜单列表
router.get('/list', Permissions(['system:menu:list']), menuController.listMenus);

// 查询菜单详细
router.get('/:menuId', Permissions(['system:menu:query']), CreateOperLog({
    title: '菜单管理',
    businessType: '4',
}), menuController.getMenu);

// 新增菜单
router.post('/', Permissions(['system:menu:add']), CreateOperLog({
    title: '菜单管理',
    businessType: '1',
}), menuController.addMenu);

// 修改菜单
router.put('/', Permissions(['system:menu:edit']), CreateOperLog({
    title: '菜单管理',
    businessType: '2',
}), menuController.updateMenu);

// 删除菜单
router.delete('/:menuId', Permissions(['system:menu:remove']), CreateOperLog({
    title: '菜单管理',
    businessType: '3',
}), menuController.delMenu);

module.exports = router;
