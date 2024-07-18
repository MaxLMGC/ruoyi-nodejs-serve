const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class Notice extends Model { }

Notice.init({
    noticeId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'notice_id',
        comment: '公告ID'
    },
    noticeTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'notice_title',
        comment: '公告标题'
    },
    noticeType: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        field: 'notice_type',
        comment: '公告类型（1通知 2公告）'
    },
    noticeContent: {
        type: DataTypes.BLOB('long'),
        field: 'notice_content',
        comment: '公告内容'
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        field: 'status',
        comment: '公告状态（0正常 1关闭）'
    },
    createBy: {
        type: DataTypes.STRING(64),
        defaultValue: '',
        field: 'create_by',
        comment: '创建者'
    },
    createTime: {
        type: DataTypes.DATE,
        field: 'create_time',
        comment: '创建时间'
    },
    updateBy: {
        type: DataTypes.STRING(64),
        defaultValue: '',
        field: 'update_by',
        comment: '更新者'
    },
    updateTime: {
        type: DataTypes.DATE,
        field: 'update_time',
        comment: '更新时间'
    },
    remark: {
        type: DataTypes.STRING(255),
        field: 'remark',
        comment: '备注'
    }
}, {
    sequelize,
    modelName: 'Notice',
    tableName: 'sys_notice',
    timestamps: false,
    comment: '通知公告表',
    hooks: {
        beforeCreate: (user, options) => {
            if (options.user) {
                user.createBy = options.user;
            }
            user.createTime = formatDate(new Date());
        },
        beforeBulkUpdate: (user, options) => {
            if (user.user) {
                user.updateBy = user.user;
            }
            user.updateTime = formatDate(new Date());
        }
    }
});

module.exports = Notice;
