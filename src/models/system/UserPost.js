const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');

class UserPost extends Model { }

UserPost.init({
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        comment: '用户ID',
        field: 'user_id'
    },
    postId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        comment: '岗位ID',
        field: 'post_id'
    }
}, {
    sequelize,
    modelName: 'UserPost',
    tableName: 'sys_user_post',
    timestamps: false
});

module.exports = UserPost;
