const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class DictType extends Model { }

DictType.init({
    dictId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '字典主键',
        field: 'dict_id'
    },
    dictName: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '字典名称',
        field: 'dict_name'
    },
    dictType: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        unique: true,
        comment: '字典类型',
        field: 'dict_type'
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '状态（0正常 1停用）',
        field: 'status'
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
    modelName: 'DictType',
    tableName: 'sys_dict_type',
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

module.exports = DictType;
