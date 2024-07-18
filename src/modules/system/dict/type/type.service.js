const { DictType } = require('@/models/index');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');

// 获取字典选择框列表
const getOptionSelect = async () => {
    try {
        const dictTypes = await DictType.findAll({
            attributes: ['dictId', 'dictName', 'dictType'],
        });

        return dictTypes.map(dictType => dictType.toJSON());
    } catch (error) {
        console.error('获取字典选择框列表时出错:', error);
        throw error;
    }
};

// 查询字典类型列表并分页
const listTypes = async (filters = {}, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};

        if (filters.dictName) {
            where.dictName = { [Op.like]: `%${filters.dictName}%` };
        }

        if (filters.dictType) {
            where.dictType = { [Op.like]: `%${filters.dictType}%` };
        }

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.params && filters.params.beginTime && filters.params.endTime) {
            where.createTime = {
                [Op.between]: [filters.params.beginTime, filters.params.endTime]
            };
        }

        const dictTypes = await DictType.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            transaction
        });

        await transaction.commit();

        return {
            total: dictTypes.count,
            rows: dictTypes.rows.map(dictType => dictType.get())
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 查询字典类型详细
const getType = async (dictId) => {
    const transaction = await sequelize.transaction();
    try {
        const dictType = await DictType.findByPk(dictId, { transaction });
        await transaction.commit();
        return dictType ? dictType.get() : null;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 新增字典类型
const addType = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        await DictType.create(data, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改字典类型
const updateType = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const { dictId, ...updateData } = data;
        await DictType.update(updateData, {
            where: { dictId },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 删除字典类型
const delType = async (dictIds) => {
    const transaction = await sequelize.transaction();
    try {
        const ids = dictIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        if (ids.length === 0) {
            throw new Error('无效的字典类型ID');
        }

        await DictType.destroy({
            where: { dictId: ids },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    getOptionSelect,
    listTypes,
    getType,
    addType,
    updateType,
    delType
};
