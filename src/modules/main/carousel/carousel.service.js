/**
 * 文件类型: 后端-服务文件
 * 文件路径: @/modules/main/carousel/carousel.service.js
 * 文件创建日期: 2024/7/12 09:03:20
 * 文件作者: admin
 */
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');
const Carousel = require('@/models/main/Carousel');
// 获取所有轮播图详细信息（包含事务）
const getAllCarousels = async () => {
    const transaction = await sequelize.transaction();
    try {
        const carousels = await Carousel.findAll({ transaction });
        await transaction.commit();
        return carousels.map(carousel => carousel.toJSON());
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

const listCarousels = async (filters = {}, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};
        const { Op } = require('sequelize');
        if (filters.imageUrl) {
            where.imageUrl = {
                [Op.like]: `%${filters.imageUrl}%`
            };
        }
        if (filters.title) {
            where.title = {
                [Op.like]: `%${filters.title}%`
            };
        }
        if (filters.description) {
            where.description = {
                [Op.like]: `%${filters.description}%`
            };
        }
        if (filters.createTime) {
            where.createTime = {
                [Op.between]: [filters.params.beginCreateTime, filters.params.endCreateTime]
            };
        }
        if (filters.remark) {
            where.remark = {
                [Op.like]: `%${filters.remark}%`
            };
        }
        const carousels = await Carousel.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            order: [['carouselId', 'ASC']],
            transaction
        });
        await transaction.commit();
        return {
            total: carousels.count,
            rows: carousels.rows
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const getCarouselById = async (carouselId) => {
    const transaction = await sequelize.transaction();
    try {
        const carousel = await Carousel.findByPk(carouselId, { transaction });
        await transaction.commit();
        return carousel ? carousel.toJSON() : null;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const addCarousel = async (carouselData, user) => {
    const transaction = await sequelize.transaction();
    try {
        const carousel = await Carousel.create(carouselData, { transaction, user });
        await transaction.commit();
        return carousel;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const updateCarousel = async (carouselId, carouselData, user) => {
    const transaction = await sequelize.transaction();
    try {
        await Carousel.update(carouselData, { where: { carouselId }, transaction, user });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
const deleteCarousel = async (carouselId) => {
    const transaction = await sequelize.transaction();
    try {
        await Carousel.destroy({ where: { carouselId }, transaction });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
module.exports = {
    getAllCarousels,
    listCarousels,
    getCarouselById,
    addCarousel,
    updateCarousel,
    deleteCarousel
};
