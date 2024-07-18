const menuService = require('./menu.service');
const userService = require('@/modules/system/user/user.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');

// 获取路由
exports.getRouters = async (req, res) => {
    try {
        const userId = req.user.user.userId;

        if (!userId) {
            return sendError(res, errorCodes.UNAUTHORIZED, { msg: '用户ID未定义' });
        }

        const roleKeys = await userService.getUserRoleKeys(userId);
        const roleIds = await userService.getUserRoleIds(userId);

        if (!roleKeys || !roleIds) {
            return sendError(res, errorCodes.INTERNAL_SERVER_ERROR, { msg: '无法获取用户角色信息' });
        }

        let menus;
        if (roleKeys.includes('admin')) {
            menus = await menuService.getAllMenus();
        } else {
            menus = await menuService.getMenusByRoleIds(roleIds);
        }
        const menuTree = menuService.buildMenuTree(menus);
        sendSuccess(res, { data: menuTree });
    } catch (error) {
        console.error('获取路由时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 获取菜单下拉树
exports.getMenuTreeSelect = async (req, res) => {
    try {
        const menus = await menuService.getAllMenus();
        const menuTree = menuService.buildMenuTreeSelect(menus);
        sendSuccess(res, { data: menuTree });
    } catch (error) {
        console.error('获取菜单下拉树时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 根据角色ID查询菜单下拉树结构
exports.roleMenuTreeselect = async (req, res) => {
    try {
        const { roleId } = req.params;
        const menus = await menuService.getAllMenus();
        const checkedKeys = await menuService.getCheckedKeysByRoleId(roleId);
        const menuTree = menuService.buildMenuTreeSelect(menus);
        sendSuccess(res, { menus: menuTree, checkedKeys });
    } catch (error) {
        console.error('根据角色ID查询菜单下拉树结构时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询菜单列表
exports.listMenus = async (req, res) => {
    try {
        const filters = req.query;
        const menus = await menuService.listMenus(filters);
        sendSuccess(res, { data: menus });
    } catch (error) {
        console.error('查询菜单列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询菜单详细
exports.getMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        const menu = await menuService.getMenuById(menuId);
        if (!menu) {
            return sendError(res, errorCodes.NOT_FOUND, { msg: '菜单未找到' });
        }
        sendSuccess(res, { data: menu });
    } catch (error) {
        console.error('查询菜单详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增菜单
exports.addMenu = async (req, res) => {
    try {
        const menuData = req.body;
        await menuService.addMenu(menuData);
        sendSuccess(res, { msg: '新增成功' });
    } catch (error) {
        console.error('新增菜单时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改菜单
exports.updateMenu = async (req, res) => {
    try {
        const menuData = req.body;
        await menuService.updateMenu(menuData);
        sendSuccess(res, { msg: '修改成功' });
    } catch (error) {
        console.error('修改菜单时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除菜单
exports.delMenu = async (req, res) => {
    try {
        const { menuId } = req.params;
        await menuService.delMenuAndChildren(menuId);
        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除菜单时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};
