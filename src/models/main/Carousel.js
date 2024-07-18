/**
 * 文件类型: 后端-控制文件
 * 文件路径: @/models/main/carousel.js
 * 文件创建日期: 2024/7/11 15:24:47
 * 文件作者: admin
 */
const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');
class Carousel extends Model { }
Carousel.init({
    carouselId: {
        type: DataTypes.BIGINT(20),
        //自增
        autoIncrement: true,
        primaryKey: true,
        comment: '轮播图ID',
        field: 'carousel_id'
    },
    imageUrl: {
        type: DataTypes.STRING(255),
        comment: '图片地址',
        field: 'image_url'
    },
    linkUrl: {
        type: DataTypes.STRING(255),
        comment: '链接地址',
        field: 'link_url'
    },
    title: {
        type: DataTypes.STRING(100),
        comment: '标题',
        field: 'title'
    },
    description: {
        type: DataTypes.STRING(255),
        comment: '描述',
        field: 'description'
    },
    orderNum: {
        type: DataTypes.INTEGER(11),
        comment: '显示顺序',
        field: 'order_num'
    },
    status: {
        type: DataTypes.CHAR(1),
        comment: '状态（0正常 1停用）',
        field: 'status'
    },
    createBy: {
        type: DataTypes.STRING(64),
        comment: '创建者',
        field: 'create_by'
    },
    createTime: {
        type: DataTypes.DATE,
        comment: '创建时间',
        field: 'create_time'
    },
    updateBy: {
        type: DataTypes.STRING(64),
        comment: '更新者',
        field: 'update_by'
    },
    updateTime: {
        type: DataTypes.DATE,
        comment: '更新时间',
        field: 'update_time'
    },
    remark: {
        type: DataTypes.STRING(500),
        comment: '备注',
        field: 'remark'
    },
}, {
    sequelize,
    modelName: 'Carousel',
    tableName: 'carousel',
    timestamps: false,
});
module.exports = Carousel;
