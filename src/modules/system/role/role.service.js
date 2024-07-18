const { Op } = require('sequelize');
const { Role, RoleMenu, Menu, RoleDept, UserRole, User } = require('@/models/index');
const deptService = require('@/modules/system/dept/dept.service');
const sequelize = require('@/config/sequelize');

// 获取所有角色详细信息（包含事务）
const getAllRoles = async () => {
  const transaction = await sequelize.transaction();
  try {
    const roles = await Role.findAll({ transaction });
    await transaction.commit();
    return roles.map(role => role.dataValues);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取角色权限（包含事务）
const getRolePermissions = async (roleIds) => {
  const transaction = await sequelize.transaction();
  try {
    if (roleIds.length === 0) {
      return []; // 如果角色ID为空，直接返回空数组
    }

    const roles = await Role.findAll({
      where: { roleId: roleIds },
      transaction
    });

    const permissions = new Set();

    for (const role of roles) {
      if (role.roleKey === 'admin') {
        permissions.add('*:*:*');
      } else {
        const roleMenus = await RoleMenu.findAll({
          where: { roleId: role.roleId },
          transaction
        });

        const menuIds = roleMenus.map(rm => rm.menuId);

        if (menuIds.length > 0) {
          const menus = await Menu.findAll({
            where: { menuId: menuIds, perms: { [Op.ne]: null } },
            transaction
          });

          for (const menu of menus) {
            if (menu.perms) {
              permissions.add(menu.perms);
            }
          }
        }
      }
    }

    await transaction.commit();
    return Array.from(permissions);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 查询角色列表并分页（包含事务）
const listRoles = async (filters, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    const where = {}

    if (filters.roleName) {
      where.roleName = { [Op.like]: `%${filters.roleName}%` };
    }

    if (filters.roleKey) {
      where.roleKey = { [Op.like]: `%${filters.roleKey}%` };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.params && filters.params.beginTime && filters.params.endTime) {
      where.create_time = { [Op.between]: [filters.params.beginTime, filters.params.endTime] };
    }

    const roles = await Role.findAndCountAll({
      where: { delFlag: '0', ...where },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: [['roleSort', 'ASC']], // 根据 roleSort 升序排序
      transaction
    });    

    await transaction.commit();

    return {
      total: roles.count,
      rows: roles.rows.map(role => role.dataValues)
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 新增角色信息（包含事务）
const addRole = async (roleData, menuIds) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await Role.create(roleData, { transaction });
    const roleId = role.roleId;

    if (menuIds && menuIds.length > 0) {
      const roleMenus = menuIds.map(menuId => ({ roleId, menuId }));
      await RoleMenu.bulkCreate(roleMenus, { transaction });
    }

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 更新角色信息（包含事务）
const updateRole = async (roleData, menuIds) => {
  const transaction = await sequelize.transaction();
  try {
    roleData.updateTime = new Date();

    await Role.update(roleData, {
      where: { roleId: roleData.roleId },
      transaction
    });

    await RoleMenu.destroy({
      where: { roleId: roleData.roleId },
      transaction
    });

    if (menuIds && menuIds.length > 0) {
      const roleMenus = menuIds.map(menuId => ({ roleId: roleData.roleId, menuId }));
      await RoleMenu.bulkCreate(roleMenus, { transaction });
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 根据角色ID查询角色详细（包含事务）
const getRoleById = async (roleId) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await Role.findByPk(roleId, {
      where: { delFlag: '0' },
      transaction
    });

    await transaction.commit();
    return role ? role.dataValues : null;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除角色信息
const delRole = async (roleIds) => {
  const transaction = await sequelize.transaction();
  try {
    const roleIdsArray = roleIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    await RoleMenu.destroy({
      where: { roleId: roleIdsArray },
      transaction
    });

    await Role.destroy({
      where: { roleId: roleIdsArray },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 修改角色状态（包含事务）
const changeRoleStatus = async (roleId, status) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await Role.findByPk(roleId, { transaction });
    if (!role) {
      throw new Error('角色未找到');
    }
    role.status = status;
    await role.save({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 根据角色ID查询部门树结构
const getDeptTreeByRoleId = async (roleId) => {
  const transaction = await sequelize.transaction();
  try {
    const depts = await deptService.listDepts();
    const deptTree = deptService.buildDeptTree(depts);

    // 获取角色关联的部门ID
    const roleDepts = await RoleDept.findAll({
      where: { roleId },
      attributes: ['deptId'],
      transaction
    });

    // 获取所有部门ID
    const allDeptIds = depts.map(dept => dept.deptId);

    // 找出没有子部门的部门ID
    const noChildrenDeptIds = allDeptIds.filter(deptId => !depts.some(dept => dept.parentId === deptId));

    // 筛选 checkedKeys 中无子部门的部门ID
    const checkedKeys = roleDepts.map(rd => rd.deptId).filter(deptId => noChildrenDeptIds.includes(deptId));

    await transaction.commit();

    return { depts: deptTree, checkedKeys };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


// 更新角色数据权限
const updateDataScope = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    const { roleId, deptIds, ...roleData } = data;

    await Role.update(roleData, {
      where: { roleId },
      transaction
    });

    await RoleDept.destroy({
      where: { roleId },
      transaction
    });

    const roleDepts = deptIds.map(deptId => ({ roleId, deptId }));
    await RoleDept.bulkCreate(roleDepts, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


const allocatedUserList = async (filters, roleId, pageNum, pageSize) => {
  const transaction = await sequelize.transaction();
  try {
    const where = {};

    if (filters.userName) {
      where.userName = { [Op.like]: `%${filters.userName}%` };
    }

    if (filters.phonenumber) {
      where.phonenumber = { [Op.like]: `%${filters.phonenumber}%` };
    }

    const userRoles = await UserRole.findAll({
      where: { roleId },
      attributes: ['userId'],
      transaction
    });

    const userIds = userRoles.map(ur => ur.userId);

    const { rows, count } = await User.findAndCountAll({
      where: { userId: userIds, ...where },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      transaction
    });

    await transaction.commit();

    return {
      total: count,
      rows: rows.map(user => user.get())
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 取消用户授权角色
const authUserCancel = async (userId, roleId) => {
  const transaction = await sequelize.transaction();
  try {
    await UserRole.destroy({
      where: {
        userId,
        roleId
      },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 批量取消用户授权角色
const authUserCancelAll = async (roleId, userIds) => {
  const transaction = await sequelize.transaction();
  try {

    await UserRole.destroy({
      where: {
        roleId,
        userId: userIds
      },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 查询角色未授权用户列表
const unallocatedUserList = async (filters, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    const { roleId } = filters;

    // 查找所有未分配该角色的用户
    const users = await User.findAll({
      where: {
        userId: {
          [Op.notIn]: sequelize.literal(`(SELECT user_id FROM sys_user_role WHERE role_id = ${roleId})`)
        }
      },
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      transaction
    });

    const total = await User.count({
      where: {
        userId: {
          [Op.notIn]: sequelize.literal(`(SELECT user_id FROM sys_user_role WHERE role_id = ${roleId})`)
        }
      },
      transaction
    });

    await transaction.commit();

    return {
      total,
      rows: users.map(user => user.get())
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


// 批量授权用户选择
const authUserSelectAll = async (roleId, userIds) => {
  const transaction = await sequelize.transaction();
  try {
    const userRoles = userIds.map(userId => ({ roleId, userId }));
    await UserRole.bulkCreate(userRoles, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

module.exports = {
  getAllRoles,
  getRolePermissions,
  listRoles,
  addRole,
  updateRole,
  getRoleById,
  delRole,
  changeRoleStatus,
  getDeptTreeByRoleId,
  updateDataScope,
  allocatedUserList,
  authUserCancel,
  authUserCancelAll,
  unallocatedUserList,
  authUserSelectAll
};
