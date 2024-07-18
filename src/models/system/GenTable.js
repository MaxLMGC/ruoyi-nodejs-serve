const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class GenTable extends Model { }

GenTable.init({
    tableId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '编号',
        field: 'table_id'
    },
    tableName: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '表名称',
        field: 'table_name'
    },
    tableComment: {
        type: DataTypes.STRING(500),
        defaultValue: '',
        comment: '表描述',
        field: 'table_comment'
    },
    subTableName: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '关联子表的表名',
        field: 'sub_table_name'
    },
    subTableFkName: {
        type: DataTypes.STRING(64),
        allowNull: true,
        comment: '子表关联的外键名',
        field: 'sub_table_fk_name'
    },
    className: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '实体类名称',
        field: 'class_name'
    },
    tplCategory: {
        type: DataTypes.STRING(200),
        defaultValue: 'crud',
        comment: '使用的模板（crud单表操作 tree树表操作）',
        field: 'tpl_category'
    },
    tplWebType: {
        type: DataTypes.STRING(30),
        defaultValue: '',
        comment: '前端模板类型（element-ui模版 element-plus模版）',
        field: 'tpl_web_type'
    },
    packageName: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '生成包路径',
        field: 'package_name'
    },
    moduleName: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '生成模块名',
        field: 'module_name'
    },
    businessName: {
        type: DataTypes.STRING(30),
        allowNull: true,
        comment: '生成业务名',
        field: 'business_name'
    },
    functionName: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '生成功能名',
        field: 'function_name'
    },
    functionAuthor: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: '生成功能作者',
        field: 'function_author'
    },
    genType: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '生成代码方式（0zip压缩包 1自定义路径）',
        field: 'gen_type'
    },
    genPath: {
        type: DataTypes.STRING(200),
        defaultValue: '/',
        comment: '生成路径（不填默认项目路径）',
        field: 'gen_path'
    },
    options: {
        type: DataTypes.STRING(1000),
        allowNull: true,
        comment: '其它生成选项'
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
        comment: '备注'
    }
}, {
    sequelize,
    modelName: 'GenTable',
    tableName: 'gen_table',
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

module.exports = GenTable;
