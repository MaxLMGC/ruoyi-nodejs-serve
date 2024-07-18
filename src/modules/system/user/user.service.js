// src/modules/system/user/user.service.js
const bcrypt = require('bcrypt');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');
const { User, UserRole, UserPost, Role, Dept, Post } = require('@/models/index');
const deptService = require('@/modules/system/dept/dept.service');

// 创建用户
const createUser = async ({ username, password }, user) => {
  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nickName: username,
      userName: username,
      password: hashedPassword
    }, { transaction, user });
    await transaction.commit();
    return { userId: newUser.userId, username };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 查询用户列表并分页
const listUsers = async (filters = {}, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    let deptIds = [];
    let where = {};
    if (filters.userName) {
      where.userName = { [Op.like]: `%${filters.userName}%` }
    }
    if (filters.phonenumber) {
      where.phonenumber = { [Op.like]: `%${filters.phonenumber}%` }
    }
    if (filters.status) {
      where.status = filters.status
    }

    if (filters.params && filters.params.beginTime && filters.params.endTime) {
      where.create_time = { [Op.between]: [filters.params.beginTime, filters.params.endTime] };
    }

    if (filters.deptId) {
      deptIds = await deptService.getAllDeptIds(filters.deptId);
      deptIds.push(filters.deptId);
      where.dept_id = deptIds;
    }

    const users = await User.findAndCountAll({
      where,
      offset: (parseInt(pageNum - 1)) * parseInt(pageSize),
      limit: parseInt(pageSize),
      include: [
        {
          model: Role,
          as: 'roles',
        }
      ],
      transaction
    });

    await transaction.commit();

    return {
      total: users.count,
      rows: await Promise.all(users.rows.map(async user => ({
        ...user.get(),
        dept: await deptService.getDeptById(user.deptId)
      })))
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 根据用户名获取用户
const getUserByUsername = async (username) => {
  const transaction = await sequelize.transaction();
  console.log('getUserByUsername', User);
  try {
    const user = await User.findOne({ where: { userName: username }, transaction });
    await transaction.commit();
    return user ? user.get() : null;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取角色详细信息
const getUserRoles = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const roles = await UserRole.findAll({ where: { userId }, transaction });
    await transaction.commit();
    return roles.map(role => role.get());
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取用户角色ID
const getUserRoleIds = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const roles = await UserRole.findAll({ where: { userId }, transaction });
    await transaction.commit();
    return roles.map(role => role.roleId);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取用户角色Key
const getUserRoleKeys = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const roles = await UserRole.findAll({
      where: { userId },
      include: [{ model: Role, attributes: ['roleKey'] }],
      transaction
    });
    await transaction.commit();
    return roles.map(role => role.Role.roleKey);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取用户详细信息
const getUserById = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.commit();
      return null;
    }

    const dept = await deptService.getDeptById(user.deptId);
    const roleIds = await getUserRoleIds(user.userId);

    await transaction.commit();

    return {
      ...user.get(),
      dept,
      roleIds
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 更新用户信息
const updateUser = async (userId, userData, postIds, roleIds, user) => {
  const transaction = await sequelize.transaction();
  try {
    await User.update(userData, { where: { userId }, transaction, user });

    await updateUserPosts(userId, postIds, transaction);
    await updateUserRoles(userId, roleIds, transaction);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 更新用户岗位
const updateUserPosts = async (userId, postIds, transaction) => {
  await UserPost.destroy({ where: { userId }, transaction });

  if (postIds && postIds.length > 0) {
    const userPosts = postIds.map(postId => ({ userId, postId }));
    await UserPost.bulkCreate(userPosts, { transaction });
  }
};

// 更新用户角色
const updateUserRoles = async (userId, roleIds, transaction) => {
  await UserRole.destroy({ where: { userId }, transaction });

  if (roleIds && roleIds.length > 0) {
    const userRoles = roleIds.map(roleId => ({ userId, roleId }));
    await UserRole.bulkCreate(userRoles, { transaction });
  }
};

// 新增用户信息
const addUser = async (userData, postIds, roleIds, user) => {
  const transaction = await sequelize.transaction();
  try {
    const newUser = await User.create(userData, { transaction, user });

    await updateUserPosts(newUser.userId, postIds, transaction);
    await updateUserRoles(newUser.userId, roleIds, transaction);

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除用户信息
const deleteUser = async (userIds) => {
  const transaction = await sequelize.transaction();
  try {
    const ids = userIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      throw new Error('无效的用户ID');
    }

    await UserPost.destroy({ where: { userId: ids }, transaction });
    await UserRole.destroy({ where: { userId: ids }, transaction });
    await User.destroy({ where: { userId: ids }, transaction });

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 重置用户密码
const resetUserPwd = async (userId, password) => {
  const transaction = await sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.update(
      { password: hashedPassword, updateTime: new Date() },
      { where: { userId }, transaction }
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取用户岗位ID列表
const getUserPostIds = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const userPosts = await UserPost.findAll({
      where: { userId },
      attributes: ['postId'],
      transaction
    });

    const postIds = userPosts.map(userPost => userPost.postId);

    await transaction.commit();
    return postIds;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 用户状态修改
const changeUserStatus = async (userId, status) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('用户未找到');
    }
    user.status = status;
    await user.save({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 获取用户授权角色
const getAuthRoleService = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('用户未找到');
    }

    // 通过 UserRole 中间表获取角色信息，过滤掉权限字符为 admin 的角色
    const roles = await Role.findAll({
      where: {
        roleKey: {
          [Op.ne]: 'admin'
        }
      },
      transaction
    });

    await transaction.commit();

    return {
      roles,
      user
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const updateAuthRole = async (userId, roleIds) => {
  const transaction = await sequelize.transaction();
  try {
    // 删除用户的旧角色
    await UserRole.destroy({
      where: { userId },
      transaction
    });

    // 为用户添加新角色
    const userRoles = roleIds.map(roleId => ({ userId, roleId }));
    await UserRole.bulkCreate(userRoles, { transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const getUserProfile = async (userId) => {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return null;
    }

    // 获取用户岗位
    const posts = await UserPost.findAll({
      where: { userId },
      attributes: ['postId']
    });

    const postIds = posts.map(post => post.postId);

    const postRecords = await Post.findAll({
      where: { postId: postIds },
      attributes: ['postName']
    });

    const postGroup = postRecords.map(post => post.postName).join(',');

    // 获取用户角色
    const roles = await UserRole.findAll({
      where: { userId },
      attributes: ['roleId']
    });

    const roleIds = roles.map(role => role.roleId);

    const roleRecords = await Role.findAll({
      where: { roleId: roleIds },
      attributes: ['roleName']
    });

    const roleGroup = roleRecords.map(role => role.roleName).join(',');

    return {
      postGroup,
      roleGroup,
      data: user
    };
  } catch (error) {
    console.error('获取用户信息时出错:', error);
    throw error;
  }
};

const updateUserProfile = async (userId, updateData) => {
  const transaction = await sequelize.transaction();
  try {
    await User.update(updateData, { where: { userId }, transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 更新用户密码
const updateUserPwd = async (userId, oldPassword, newPassword) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error('用户未找到');
    }

    // 确保原密码和新密码不为空
    if (!oldPassword || !newPassword) {
      throw new Error('密码不能为空');
    }

    // 检查原密码是否正确
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      await transaction.commit();
      return false;
    }

    // 哈希新密码
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 更新用户密码
    await User.update(
      { password: hashedPassword, updateTime: new Date() },
      { where: { userId }, transaction }
    );

    await transaction.commit();
    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  createUser,
  listUsers,
  updateUser,
  addUser,
  deleteUser,
  resetUserPwd,
  changeUserStatus,
  updateAuthRole,
  getAuthRoleService,
  getUserById,
  getUserByUsername,
  getUserRoles,
  getUserRoleIds,
  getUserRoleKeys,
  getUserPostIds,
  getUserProfile,
  updateUserProfile,
  updateUserPwd
};
