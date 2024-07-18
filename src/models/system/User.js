const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class User extends Model { }

User.init({
  userId: {
    type: DataTypes.BIGINT(20),
    autoIncrement: true,
    primaryKey: true,
    comment: '用户ID',
    field: 'user_id'
  },
  deptId: {
    type: DataTypes.BIGINT(20),
    allowNull: true,
    comment: '部门ID',
    field: 'dept_id'
  },
  userName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '用户账号',
    field: 'user_name'
  },
  nickName: {
    type: DataTypes.STRING(30),
    allowNull: false,
    comment: '用户昵称',
    field: 'nick_name'
  },
  userType: {
    type: DataTypes.STRING(2),
    defaultValue: '00',
    comment: '用户类型（00系统用户）',
    field: 'user_type'
  },
  email: {
    type: DataTypes.STRING(50),
    defaultValue: '',
    comment: '用户邮箱',
    field: 'email'
  },
  phonenumber: {
    type: DataTypes.STRING(11),
    defaultValue: '',
    comment: '手机号码',
    field: 'phonenumber'
  },
  sex: {
    type: DataTypes.CHAR(1),
    defaultValue: '0',
    comment: '用户性别（0男 1女 2未知）',
    field: 'sex'
  },
  avatar: {
    type: DataTypes.STRING(100),
    defaultValue: '',
    comment: '头像地址',
    field: 'avatar'
  },
  password: {
    type: DataTypes.STRING(100),
    defaultValue: '',
    comment: '密码',
    field: 'password'
  },
  status: {
    type: DataTypes.CHAR(1),
    defaultValue: '0',
    comment: '帐号状态（0正常 1停用）',
    field: 'status'
  },
  delFlag: {
    type: DataTypes.CHAR(1),
    defaultValue: '0',
    comment: '删除标志（0代表存在 2代表删除）',
    field: 'del_flag'
  },
  loginIp: {
    type: DataTypes.STRING(128),
    defaultValue: '',
    comment: '最后登录IP',
    field: 'login_ip'
  },
  loginDate: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '最后登录时间',
    field: 'login_date'
  },
  createBy: {
    type: DataTypes.STRING(64),
    defaultValue: '',
    comment: '创建者',
    field: 'create_by'
  },
  createTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '创建时间',
    field: 'create_time'
  },
  updateBy: {
    type: DataTypes.STRING(64),
    defaultValue: '',
    comment: '更新者',
    field: 'update_by'
  },
  updateTime: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: '更新时间',
    field: 'update_time'
  },
  remark: {
    type: DataTypes.STRING(500),
    allowNull: true,
    comment: '备注',
    field: 'remark'
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'sys_user',
  timestamps: false,
  hooks: {
    beforeCreate: (user, options) => {
      console.log('创建时触发函数');
      if (options.user) {
        user.createBy = options.user;
      }
      user.createTime = formatDate(new Date());
    },
    beforeBulkUpdate: (user, options) => {
      console.log(user, options)
      console.log('修改时触发函数');
      if (user.user) {
        user.updateBy = user.user;
      }
      user.updateTime = formatDate(new Date());
    }
  }
});

module.exports = User;
