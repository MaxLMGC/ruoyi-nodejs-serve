const { LoginInfor } = require('@/models/index');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');

// 查询登录日志列表
const listLogininfor = async (filters, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    const where = {};
    const order = [];

    if (filters.ipaddr) {
      where.ipaddr = { [Op.like]: `%${filters.ipaddr}%` };
    }
    if (filters.userName) {
      where.userName = { [Op.like]: `%${filters.userName}%` };
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.params?.beginTime && filters.params?.endTime) {
      where.loginTime = {
        [Op.between]: [filters.params.beginTime, filters.params.endTime]
      };
    }

    if (filters.orderByColumn && filters.isAsc) {
      order[0] = [filters.orderByColumn, filters.isAsc === 'descending' ? 'DESC' : 'ASC']
    }

    const { count, rows } = await LoginInfor.findAndCountAll({
      where,
      offset: (parseInt(pageNum) - 1) * parseInt(pageSize),
      // 转数字
      limit: parseInt(pageSize),
      // 排序
      order,
      transaction
    });

    await transaction.commit();
    return {
      total: count,
      rows: rows.map(row => row.get({ plain: true }))
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除登录日志
const deleteLogininfor = async (infoIds) => {
  const transaction = await sequelize.transaction();
  try {
    const ids = infoIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      throw new Error('无效的日志ID');
    }

    await LoginInfor.destroy({
      where: {
        infoId: {
          [Op.in]: ids
        }
      },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 解锁用户登录状态
const unlockUser = async (userName) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await LoginInfor.findOne({
      where: { userName },
      transaction
    });
    if (user) {
      user.status = '0'; // Assuming '0' is the status for unlocked
      await user.save({ transaction });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 清空登录日志
const cleanLogininfor = async () => {
  const transaction = await sequelize.transaction();
  try {
    await LoginInfor.destroy({
      where: {},
      transaction
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 新增登录日志
const addLogininfor = async (loginData) => {
  const transaction = await sequelize.transaction();
  try {
    const newLogininfor = await LoginInfor.create(loginData, { transaction });
    await transaction.commit();
    return newLogininfor.get({ plain: true });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  listLogininfor,
  deleteLogininfor,
  unlockUser,
  cleanLogininfor,
  addLogininfor
};
