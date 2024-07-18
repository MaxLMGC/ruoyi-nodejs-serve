const { Op } = require('sequelize');
const Notice = require('@/models/system/Notice');
const sequelize = require('@/config/sequelize');

// 查询公告列表并分页
const listNotice = async (filters = {}, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};

        if (filters.noticeTitle) {
            where.noticeTitle = { [Op.like]: `%${filters.noticeTitle}%` };
        }

        if (filters.createBy) {
            where.createBy = { [Op.like]: `%${filters.createBy}%` };
        }

        if (filters.noticeType) {
            where.noticeType = { [Op.like]: `%${filters.noticeType}%` };
        }

        const notices = await Notice.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            transaction
        });

        const result = {
            total: notices.count,
            rows: notices.rows.map(notice => {
                const data = notice.get();
                data.noticeContent = data.noticeContent ? data.noticeContent.toString('utf8') : '';
                return data;
            })
        };

        await transaction.commit();
        return result;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 查询公告详细
const getNoticeById = async (noticeId) => {
    const transaction = await sequelize.transaction();
    try {
        const notice = await Notice.findByPk(noticeId, { transaction });
        if (notice) {
            const data = notice.get();
            data.noticeContent = data.noticeContent ? data.noticeContent.toString('utf8') : '';
            await transaction.commit();
            return data;
        } else {
            await transaction.commit();
            return null;
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 新增公告
const addNotice = async (noticeData) => {
    const transaction = await sequelize.transaction();
    try {
        if (noticeData.noticeContent) {
            noticeData.noticeContent = Buffer.from(noticeData.noticeContent, 'utf8');
        }
        await Notice.create(noticeData, { transaction });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改公告
const updateNotice = async (noticeData) => {
    const transaction = await sequelize.transaction();
    try {
        if (noticeData.noticeContent) {
            noticeData.noticeContent = Buffer.from(noticeData.noticeContent, 'utf8');
        }
        await Notice.update(noticeData, {
            where: { noticeId: noticeData.noticeId },
            transaction
        });
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 删除公告
const delNotice = async (noticeIds) => {
    const transaction = await sequelize.transaction();
    try {
        const ids = noticeIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        if (ids.length === 0) {
            throw new Error('无效的公告ID');
        }

        await Notice.destroy({
            where: { noticeId: ids },
            transaction
        });

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    listNotice,
    getNoticeById,
    addNotice,
    updateNotice,
    delNotice
};
