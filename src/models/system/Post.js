const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class Post extends Model { }

Post.init({
    postId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '岗位ID',
        field: 'post_id'
    },
    postCode: {
        type: DataTypes.STRING(64),
        allowNull: false,
        comment: '岗位编码',
        field: 'post_code'
    },
    postName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '岗位名称',
        field: 'post_name'
    },
    postSort: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        comment: '显示顺序',
        field: 'post_sort'
    },
    status: {
        type: DataTypes.CHAR(1),
        allowNull: false,
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
    modelName: 'Post',
    tableName: 'sys_post',
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

module.exports = Post;
