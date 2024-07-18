// src/models/index.js
const sequelize = require('@/config/sequelize');
const User = require('./system/User');
const Role = require('./system/Role');
const Post = require('./system/Post');
const Dept = require('./system/Dept');
const Menu = require('./system/Menu');
const Notice = require('./system/Notice');
const UserRole = require('./system/UserRole');
const UserPost = require('./system/UserPost');
const RoleDept = require('./system/RoleDept');
const RoleMenu = require('./system/RoleMenu');
const DictData = require('./system/DictData');
const DictType = require('./system/DictType');
const Config = require('./system/Config');
const GenTable = require('./system/GenTable');
const GenTableColumn = require('./system/GenTableColumn');
const OperLog = require('./monitor/OperLog');
const LoginInfor = require('./monitor/LoginInfor');

// 用户-角色 多对多关系
User.belongsToMany(Role, { through: UserRole, foreignKey: 'user_id', as: 'roles' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'role_id' });
UserRole.belongsTo(Role, { foreignKey: 'role_id' });


// 用户-岗位 多对多关系
User.belongsToMany(Post, { through: UserPost, foreignKey: 'user_id' });
Post.belongsToMany(User, { through: UserPost, foreignKey: 'post_id' });

// 角色-部门 多对多关系
Role.belongsToMany(Dept, { through: RoleDept, foreignKey: 'role_id' });
Dept.belongsToMany(Role, { through: RoleDept, foreignKey: 'dept_id' });

// 角色-菜单 多对多关系
Role.belongsToMany(Menu, { through: RoleMenu, foreignKey: 'role_id' });
Menu.belongsToMany(Role, { through: RoleMenu, foreignKey: 'menu_id' });

// 用户-部门 一对多关系
// User.belongsTo(Dept, { foreignKey: 'dept_id' });
// Dept.hasMany(User, { foreignKey: 'dept_id' });

module.exports = {
    User,
    Role,
    Post,
    Dept,
    Menu,
    Notice,
    DictType,
    DictData,
    UserRole,
    UserPost,
    RoleDept,
    RoleMenu,
    Config,
    GenTable,
    GenTableColumn,
    OperLog,
    LoginInfor
};
