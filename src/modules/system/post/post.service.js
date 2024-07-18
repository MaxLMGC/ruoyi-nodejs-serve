// src/modules/system/post/post.service.js
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');
const { Post } = require('@/models/index');

// 获取所有岗位详细信息（包含事务）
const getAllPosts = async () => {
    const transaction = await sequelize.transaction();
    try {

        const posts = await Post.findAll({ transaction });

        await transaction.commit();

        return posts.map(post => post.toJSON());
    } catch (error) {
        if (transaction) await transaction.rollback();
        throw error;
    }
};

const listPosts = async (filters = {}, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};

        if (filters.postId) where.postId = { [Op.like]: `%${filters.postId}%` };
        if (filters.postCode) where.postCode = { [Op.like]: `%${filters.postCode}%` };;
        if (filters.postName) where.postName = { [Op.like]: `%${filters.postName}%` };;
        if (filters.status) where.status = filters.status;


        const posts = await Post.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            order: [['postSort', 'ASC']],
            transaction
        });
        await transaction.commit();
        return {
            total: posts.count,
            rows: posts.rows
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const getPostById = async (postId) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.findByPk(postId, { transaction });
        await transaction.commit();
        console.log(post)
        return {
            ...post.get()
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const addPost = async (postData, user) => {
    const transaction = await sequelize.transaction();
    try {
        const post = await Post.create(postData, { transaction, user });
        await transaction.commit();
        return post;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const updatePost = async (postId, postData, user) => {
    const transaction = await sequelize.transaction();
    try {
        await Post.update(postData, { where: { postId }, transaction, user });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

const deletePost = async (postIds) => {
    const transaction = await sequelize.transaction();
    try {
        const ids = postIds.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

        if (ids.length === 0) {
            throw new Error('无效的岗位ID');
        }

        await Post.destroy({ where: { postId: ids }, transaction });
        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};


module.exports = {
    getAllPosts,
    listPosts,
    getPostById,
    addPost,
    updatePost,
    deletePost
};
