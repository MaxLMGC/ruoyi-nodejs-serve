const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter'); // 假设你有一个日期格式化工具

class Config extends Model { }

Config.init({
    configId: {
        type: DataTypes.INTEGER(5),
        autoIncrement: true,
        primaryKey: true,
        comment: '参数主键',
        field: 'config_id'
    },
    configName: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '参数名称',
        field: 'config_name'
    },
    configKey: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '参数键名',
        field: 'config_key'
    },
    configValue: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        comment: '参数键值',
        field: 'config_value'
    },
    configType: {
        type: DataTypes.CHAR(1),
        defaultValue: 'N',
        comment: '系统内置（Y是 N否）',
        field: 'config_type'
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
    modelName: 'Config',
    tableName: 'sys_config',
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

module.exports = Config;
