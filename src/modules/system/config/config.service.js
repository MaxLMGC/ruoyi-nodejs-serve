const { Config } = require('@/models/index');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');

// 根据参数键名查询参数值
const getConfigByKey = async (configKey) => {
  const transaction = await sequelize.transaction();
  try {
    const config = await Config.findOne({
      where: { configKey },
      attributes: ['configValue'],
      transaction
    });
    await transaction.commit();
    return config ? config.get({ plain: true }) : null;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 查询参数列表并分页
const listConfig = async (filters = {}, pageNum = 1, pageSize = 10) => {
  const transaction = await sequelize.transaction();
  try {
    const where = {};

    if (filters.configName) {
      where.configName = { [Op.like]: `%${filters.configName}%` };
    }

    if (filters.configKey) {
      where.configKey = { [Op.like]: `%${filters.configKey}%` };
    }

    if (filters.configType) {
      where.configType = filters.configType;
    }

    if (filters.params?.beginTime && filters.params?.endTime) {
      where.createTime = {
        [Op.between]: [filters.params.beginTime, filters.params.endTime]
      };
    }

    const configs = await Config.findAndCountAll({
      where,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      transaction
    });

    await transaction.commit();

    return {
      total: configs.count,
      rows: configs.rows.map(config => config.get())
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 查询参数详细
const getConfig = async (configId) => {
  const transaction = await sequelize.transaction();
  try {
    const data = await Config.findByPk(configId, { transaction });
    await transaction.commit();
    return data ? data.get() : null;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 新增参数配置
const addConfig = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    await Config.create(data, { transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 修改参数配置
const updateConfig = async (data) => {
  const transaction = await sequelize.transaction();
  try {
    await Config.update(data, {
      where: { configId: data.configId },
      transaction
    });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// 删除参数配置
const delConfig = async (configIds) => {
  const transaction = await sequelize.transaction();
  try {
    const ids = configIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

    if (ids.length === 0) {
      throw new Error('无效的配置ID');
    }

    await Config.destroy({
      where: { configId: ids },
      transaction
    });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};


module.exports = {
  getConfigByKey,
  listConfig,
  getConfig,
  addConfig,
  updateConfig,
  delConfig
};
