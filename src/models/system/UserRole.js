const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');

class UserRole extends Model { }

UserRole.init({
    userId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        comment: '用户ID',
        field: 'user_id'
    },
    roleId: {
        type: DataTypes.BIGINT(20),
        allowNull: false,
        primaryKey: true,
        comment: '角色ID',
        field: 'role_id'
    }
}, {
    sequelize,
    modelName: 'UserRole',
    tableName: 'sys_user_role',
    timestamps: false
});

module.exports = UserRole;
