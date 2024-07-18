const { DataTypes, Model } = require('sequelize');
const sequelize = require('@/config/sequelize');
const { formatDate } = require('@/utils/formatter');

class Menu extends Model { }

Menu.init({
    menuId: {
        type: DataTypes.BIGINT(20),
        autoIncrement: true,
        primaryKey: true,
        comment: '菜单ID',
        field: 'menu_id'
    },
    menuName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '菜单名称',
        field: 'menu_name'
    },
    parentId: {
        type: DataTypes.BIGINT(20),
        defaultValue: 0,
        comment: '父菜单ID',
        field: 'parent_id'
    },
    orderNum: {
        type: DataTypes.INTEGER(4),
        defaultValue: 0,
        comment: '显示顺序',
        field: 'order_num'
    },
    path: {
        type: DataTypes.STRING(200),
        defaultValue: '',
        comment: '路由地址',
        field: 'path'
    },
    component: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '组件路径',
        field: 'component'
    },
    query: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: '路由参数',
        field: 'query'
    },
    isFrame: {
        type: DataTypes.INTEGER(1),
        defaultValue: 1,
        comment: '是否为外链（0是 1否）',
        field: 'is_frame'
    },
    isCache: {
        type: DataTypes.INTEGER(1),
        defaultValue: 0,
        comment: '是否缓存（0缓存 1不缓存）',
        field: 'is_cache'
    },
    menuType: {
        type: DataTypes.CHAR(1),
        defaultValue: '',
        comment: '菜单类型（M目录 C菜单 F按钮）',
        field: 'menu_type'
    },
    visible: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '菜单状态（0显示 1隐藏）',
        field: 'visible'
    },
    status: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '菜单状态（0正常 1停用）',
        field: 'status'
    },
    perms: {
        type: DataTypes.STRING(100),
        allowNull: true,
        comment: '权限标识',
        field: 'perms'
    },
    icon: {
        type: DataTypes.STRING(100),
        defaultValue: '#',
        comment: '菜单图标',
        field: 'icon'
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
        defaultValue: '',
        comment: '备注',
        field: 'remark'
    }
}, {
    sequelize,
    modelName: 'Menu',
    tableName: 'sys_menu',
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

module.exports = Menu;
