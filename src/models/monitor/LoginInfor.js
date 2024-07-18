const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/config/sequelize');

class LoginInfor extends Model { }

LoginInfor.init({
    infoId: {
        type: DataTypes.BIGINT(20),
        primaryKey: true,
        autoIncrement: true,
        field: 'info_id',
        comment: '访问ID'
    },
    userName: {
        type: DataTypes.STRING(50),
        field: 'user_name',
        defaultValue: '',
        comment: '用户账号'
    },
    ipaddr: {
        type: DataTypes.STRING(128),
        defaultValue: '',
        comment: '登录IP地址'
    },
    loginLocation: {
        type: DataTypes.STRING(255),
        field: 'login_location',
        defaultValue: '',
        comment: '登录地点'
    },
    browser: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '浏览器类型'
    },
    os: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '操作系统'
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '登录状态（0成功 1失败）'
    },
    msg: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        comment: '提示消息'
    },
    loginTime: {
        type: DataTypes.DATE,
        field: 'login_time',
        comment: '访问时间'
    }
}, {
    sequelize,
    modelName: 'LoginInfor',
    tableName: 'sys_logininfor',
    timestamps: false,
    comment: '系统访问记录',
    indexes: [
        {
            name: 'idx_sys_logininfor_s',
            fields: ['status']
        },
        {
            name: 'idx_sys_logininfor_lt',
            fields: ['login_time']
        }
    ]
});

module.exports = LoginInfor;
