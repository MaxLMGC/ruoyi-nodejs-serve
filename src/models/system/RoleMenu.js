const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');

class RoleMenu extends Model { }

RoleMenu.init({
  roleId: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    primaryKey: true,
    comment: '角色ID',
    field: 'role_id'
  },
  menuId: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    primaryKey: true,
    comment: '菜单ID',
    field: 'menu_id'
  }
}, {
  sequelize,
  modelName: 'RoleMenu',
  tableName: 'sys_role_menu',
  timestamps: false
});

module.exports = RoleMenu;
