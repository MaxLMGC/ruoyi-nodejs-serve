const { OperLog } = require('@/models/index');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');

// 查询操作日志列表
const listOperLogs = async (filters, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    const where = {};
    const order = [];

    if (filters.operIp) where.operIp = { [Op.like]: `%${filters.operIp}%` };
    if (filters.title) where.title = { [Op.like]: `%${filters.title}%` };
    if (filters.operName) where.operName = { [Op.like]: `%${filters.operName}%` };
    if (filters.businessType) where.businessType = filters.businessType;
    if (filters.status) where.status = filters.status;
    if (filters.params && filters.params.beginTime && filters.params.endTime) {
      where.operTime = {
        [Op.between]: [filters.params.beginTime, filters.params.endTime],
      };
    }

    if (filters.orderByColumn && filters.isAsc) {
      order[0] = [filters.orderByColumn, filters.isAsc === 'descending' ? 'DESC' : 'ASC']
    }

    const { count, rows } = await OperLog.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order,
      transaction,
    });

    await transaction.commit();

    return {
      total: count,
      rows: rows.map(row => row.get({ plain: true })),
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除操作日志
const delOperLog = async (operIds) => {
  const transaction = await sequelize.transaction();
  try {
    // 将 operIds 转换为数组，以便处理多个 ID
    const ids = operIds.split(',').map(id => id.trim()).filter(id => id);

    await OperLog.destroy({
      where: { operId: ids },
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


// 清空操作日志
const cleanOperLog = async () => {
  const transaction = await sequelize.transaction();
  try {
    await OperLog.destroy({
      where: {},
      transaction,
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

const addOperLog = async (operLogData) => {
  const transaction = await sequelize.transaction();
  try {
    await OperLog.create(operLogData, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  listOperLogs,
  delOperLog,
  cleanOperLog,
  addOperLog
};
