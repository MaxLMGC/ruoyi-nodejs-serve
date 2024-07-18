const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/config/sequelize');

class OperLog extends Model { }

OperLog.init({
    operId: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        field: 'oper_id',
        comment: '日志主键',
    },
    title: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        comment: '模块标题',
    },
    businessType: {
        type: DataTypes.INTEGER(2),
        defaultValue: 0,
        field: 'business_type',
        comment: '业务类型（0其它 1新增 2修改 3删除）',
    },
    method: {
        type: DataTypes.STRING(100),
        defaultValue: '',
        comment: '方法名称',
    },
    requestMethod: {
        type: DataTypes.STRING(10),
        defaultValue: '',
        field: 'request_method',
        comment: '请求方式',
    },
    operatorType: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0,
        field: 'operator_type',
        comment: '操作类别（0其它 1后台用户 2手机端用户）',
    },
    operName: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        field: 'oper_name',
        comment: '操作人员',
    },
    deptName: {
        type: DataTypes.STRING(50),
        defaultValue: '',
        field: 'dept_name',
        comment: '部门名称',
    },
    operUrl: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        field: 'oper_url',
        comment: '请求URL',
    },
    operIp: {
        type: DataTypes.STRING(128),
        defaultValue: '',
        field: 'oper_ip',
        comment: '主机地址',
    },
    operLocation: {
        type: DataTypes.STRING(255),
        defaultValue: '',
        field: 'oper_location',
        comment: '操作地点',
    },
    operParam: {
        type: DataTypes.STRING(2000),
        defaultValue: '',
        field: 'oper_param',
        comment: '请求参数',
    },
    jsonResult: {
        type: DataTypes.TEXT,
        comment: '返回参数',
    },
    status: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0,
        comment: '操作状态（0正常 1异常）',
    },
    errorMsg: {
        type: DataTypes.STRING(2000),
        defaultValue: '',
        field: 'error_msg',
        comment: '错误消息',
    },
    operTime: {
        type: DataTypes.DATE,
        field: 'oper_time',
        comment: '操作时间',
    },
    costTime: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        field: 'cost_time',
        comment: '消耗时间',
    },
}, {
    sequelize,
    modelName: 'OperLog',
    tableName: 'sys_oper_log',
    timestamps: false,
    indexes: [
        {
            name: 'idx_sys_oper_log_bt',
            fields: ['business_type'],
        },
        {
            name: 'idx_sys_oper_log_s',
            fields: ['status'],
        },
        {
            name: 'idx_sys_oper_log_ot',
            fields: ['oper_time'],
        },
    ],
});

module.exports = OperLog;
