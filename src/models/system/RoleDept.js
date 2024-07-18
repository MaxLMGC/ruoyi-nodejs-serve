const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');

class RoleDept extends Model { }

RoleDept.init({
  roleId: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    primaryKey: true,
    comment: '角色ID',
    field: 'role_id'
  },
  deptId: {
    type: DataTypes.BIGINT(20),
    allowNull: false,
    primaryKey: true,
    comment: '部门ID',
    field: 'dept_id'
  }
}, {
  sequelize,
  modelName: 'RoleDept',
  tableName: 'sys_role_dept',
  timestamps: false
});

module.exports = RoleDept;
