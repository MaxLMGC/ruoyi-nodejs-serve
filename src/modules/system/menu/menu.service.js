const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');
const Menu = require('@/models/system/Menu');
const RoleMenu = require('@/models/system/RoleMenu');
const { Sequelize } = require('sequelize');
const { formatDate } = require('@/utils/formatter');

// 获取所有菜单
const getAllMenus = async (transaction) => {
    return await Menu.findAll({ transaction });
};

// 根据角色ID获取菜单
const getMenusByRoleIds = async (roleIds, transaction) => {
    if (!Array.isArray(roleIds) || roleIds.length === 0) {
        return []; // 如果角色ID为空或不为数组，直接返回空数组
    }
    const menus = await Menu.findAll({
        include: [{
            model: RoleMenu,
            where: { roleId: roleIds }
        }],
        distinct: true,
        transaction
    });
    return menus;
};

// 构建树形结构
const buildMenuTree = (menus, parentId = 0) => {
    const tree = [];
    menus.forEach(menu => {
        if (menu.parentId === parentId) {
            if (menu.menuType === 'F') {
                return;
            }
            if (menu.parentId === 0 && !menu.path.startsWith('/')) {
                menu.path = '/' + menu.path;
            }
            const children = buildMenuTree(menus, menu.menuId);
            if (children.length) {
                menu.children = children;
            }
            const component = (menu.menuType === 'M' && menu.component == '') ? 'ParentView' : (menu.component || 'Layout');
            tree.push({
                path: menu.path,
                component: component,
                name: menu.menuName,
                meta: {
                    title: menu.menuName,
                    icon: menu.icon,
                    noCache: menu.isCache === '1',
                    link: menu.link || null,
                },
                hidden: menu.visible === '1',
                alwaysShow: menu.menuType === 'M' && (menu.children || []).length > 0,
                redirect: menu.redirect,
                children: menu.children || []
            });
        }
    });
    return tree;
};

// 构建树形结构
const buildMenuTreeSelect = (menus, parentId = 0) => {
    const tree = [];
    menus.forEach(menu => {
        if (menu.parentId === parentId) {
            const children = buildMenuTreeSelect(menus, menu.menuId);
            const node = {
                id: menu.menuId,
                label: menu.menuName,
                children: children.length ? children : undefined
            };
            tree.push(node);
        }
    });
    return tree;
};

// 获取角色的菜单权限
const getCheckedKeysByRoleId = async (roleId, transaction) => {
    const roleMenus = await RoleMenu.findAll({
        where: { roleId },
        attributes: ['menuId'],
        transaction
    });
    return roleMenus.map(roleMenu => roleMenu.menuId);
};

// 查询菜单列表
const listMenus = async (filters, transaction) => {
    const where = {};
    console.log(filters)

    if (filters.menuName) {
        where.menuName = { [Op.like]: `%${filters.menuName}%` };
    }
    if (filters.status) {
        where.status = filters.status;
    }

    const menus = await Menu.findAll({ where, transaction });
    return menus;
};

// 查询菜单详细
const getMenuById = async (menuId, transaction) => {
    const menu = await Menu.findByPk(menuId, { transaction });
    return menu ? menu.toJSON() : null;
};

// 新增菜单
const addMenu = async (menuData) => {
    const transaction = await sequelize.transaction();
    try {
        await Menu.create(menuData, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改菜单
const updateMenu = async (menuData) => {
    const transaction = await sequelize.transaction();
    try {
        menuData.updateTime = formatDate(new Date());
        await Menu.update(menuData, { where: { menuId: menuData.menuId }, transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 递归删除菜单及其子菜单
const delMenuAndChildren = async (menuId) => {
    const transaction = await sequelize.transaction();
    try {
        const children = await Menu.findAll({ where: { parentId: menuId }, attributes: ['menuId'], transaction });
        for (const child of children) {
            await delMenuAndChildren(child.menuId, transaction);
        }
        await Menu.destroy({ where: { menuId }, transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getAllMenus,
    getMenusByRoleIds,
    buildMenuTree,
    buildMenuTreeSelect,
    getCheckedKeysByRoleId,
    listMenus,
    getMenuById,
    addMenu,
    updateMenu,
    delMenuAndChildren
};
