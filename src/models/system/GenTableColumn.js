const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class GenTableColumn extends Model { }

GenTableColumn.init({
    columnId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '编号',
        field: 'column_id'
    },
    tableId: {
        type: DataTypes.BIGINT(20),
        allowNull: true,
        comment: '归属表编号',
        field: 'table_id'
    },
    columnName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '列名称',
        field: 'column_name'
    },
    columnComment: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: '列描述',
        field: 'column_comment'
    },
    columnType: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '列类型',
        field: 'column_type'
    },
    javaScriptType: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'JS类型',
        field: 'java_script_type'
    },
    javaScriptField: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: 'JS字段名',
        field: 'java_script_field'
    },
    isPk: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否主键（1是）',
        field: 'is_pk'
    },
    isIncrement: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否自增（1是）',
        field: 'is_increment'
    },
    isRequired: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否必填（1是）',
        field: 'is_required'
    },
    isInsert: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否为插入字段（1是）',
        field: 'is_insert'
    },
    isEdit: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否编辑字段（1是）',
        field: 'is_edit'
    },
    isList: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否列表字段（1是）',
        field: 'is_list'
    },
    isQuery: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        comment: '是否查询字段（1是）',
        field: 'is_query'
    },
    queryType: {
        type: DataTypes.STRING(200),
        defaultValue: 'EQ',
        comment: '查询方式（等于、不等于、大于、小于、范围）',
        field: 'query_type'
    },
    htmlType: {
        type: DataTypes.STRING(200),
        allowNull: true,
        comment: '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
        field: 'html_type'
    },
    dictType: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '字典类型',
        field: 'dict_type'
    },
    sort: {
        type: DataTypes.INTEGER(11),
        allowNull: true,
        comment: '排序'
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
    modelName: 'GenTableColumn',
    tableName: 'gen_table_column',
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

module.exports = GenTableColumn;
