const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class Dept extends Model { }

Dept.init({
    deptId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '部门id',
        field: 'dept_id'
    },
    parentId: {
        type: DataTypes.BIGINT(20),
        defaultValue: 0,
        comment: '父部门id',
        field: 'parent_id'
    },
    ancestors: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '祖级列表',
        field: 'ancestors'
    },
    deptName: {
        type: DataTypes.STRING(30),
        defaultValue: '',
        comment: '部门名称',
        field: 'dept_name'
    },
    orderNum: {
        type: DataTypes.INTEGER(4),
        defaultValue: 0,
        comment: '显示顺序',
        field: 'order_num'
    },
    leader: {
        type: DataTypes.STRING(20),
        allowNull: true,
        comment: '负责人',
        field: 'leader'
    },
    phone: {
        type: DataTypes.STRING(11),
        allowNull: true,
        comment: '联系电话',
        field: 'phone'
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '邮箱',
        field: 'email'
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '部门状态（0正常 1停用）',
        field: 'status'
    },
    delFlag: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '删除标志（0代表存在 2代表删除）',
        field: 'del_flag'
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
    }
}, {
    sequelize,
    modelName: 'Dept',
    tableName: 'sys_dept',
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

module.exports = Dept;
