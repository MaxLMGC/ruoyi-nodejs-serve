// src/modules/system/data/data.service.js
const sequelize = require('@/config/sequelize');
const { DictData } = require('@/models/index');
const { Op } = require('sequelize');

// 根据字典类型查询字典数据
const getDictsByType = async (dictType) => {
    const transaction = await sequelize.transaction();
    try {
        const dicts = await DictData.findAll({
            where: { dictType },
            transaction
        })
        await transaction.commit();
        return dicts.map(dict => dict.toJSON());
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};


// 查询字典数据列表并分页
const listDatas = async (filters = {}, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};

        if (filters.dictLabel) {
            where.dictLabel = { [Op.like]: `%${filters.dictLabel}%` };
        }

        if (filters.dictType) {
            where.dictType = filters.dictType;
        }

        if (filters.status) {
            where.status = filters.status;
        }

        const dictData = await DictData.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            order: [['dictSort', 'ASC']],
            transaction
        });

        await transaction.commit();

        return {
            total: dictData.count,
            rows: dictData.rows.map(data => data.get())
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 查询字典数据详细
const getData = async (dictCode) => {
    const transaction = await sequelize.transaction();
    try {
        const data = await DictData.findByPk(dictCode, { transaction });
        await transaction.commit();
        return data ? data.get() : null;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 新增字典数据
const addData = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        await DictData.create(data, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改字典数据
const updateData = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        await DictData.update(data, {
            where: { dictCode: data.dictCode },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 删除字典数据
const delData = async (dictCodes) => {
    const transaction = await sequelize.transaction();
    try {
        const ids = dictCodes.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        if (ids.length === 0) {
            throw new Error('无效的字典ID');
        }

        await DictData.destroy({
            where: { dictCode: ids },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getDictsByType,
    listDatas,
    getData,
    addData,
    updateData,
    delData
};
