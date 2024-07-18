// src/modules/system/user/user.controller.js
const bcrypt = require('bcrypt');
const { User } = require('@/models/index');
const UserService = require('./user.service');
const DeptService = require('@/modules/system/dept/dept.service');
const PostService = require('@/modules/system/post/post.service');
const RoleService = require('@/modules/system/role/role.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');
const { validateRow, parseExcel } = require('@/modules/excel/excel.service');

// 查询用户列表
exports.listUsers = async (req, res) => {
    console.log(req.query)
    try {
        const { pageNum, pageSize, ...filters } = req.query;

        const data = await UserService.listUsers(filters, pageNum ? Number(pageNum) : null, pageSize ? Number(pageSize) : null);

        sendSuccess(res, {
            ...data,
        });
    } catch (error) {
        console.error('查询用户列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询部门下拉树结构
exports.deptTreeSelect = async (req, res) => {
    try {
        const data = await DeptService.getDeptTree();
        sendSuccess(res, { data });
    } catch (error) {
        console.error('查询部门下拉树时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询用户详细信息
exports.getUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // 如果 userId 不存在
        if (!userId) {
            const posts = await PostService.getAllPosts();
            const roles = await RoleService.getAllRoles();
            return sendSuccess(res, { posts, roles });
        }

        const user = await UserService.getUserById(Number(userId));
        if (!user) {
            return sendError(res, errorCodes.NOT_FOUND);
        }

        const posts = await PostService.getAllPosts();
        const roles = await RoleService.getAllRoles();
        const roleIds = await UserService.getUserRoleIds(Number(userId));
        const postIds = await UserService.getUserPostIds(Number(userId));

        const result = {
            data: user,
            posts,
            postIds,
            roleIds,
            roles,
        };

        sendSuccess(res, result);
    } catch (error) {
        console.error('查询用户详细信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
    try {
        const user = req.user.user.userName; // 假设用户名存储在 user 对象中
        const { userId, postIds, roleIds, dept, ...userData } = req.body;
        await UserService.updateUser(userId, userData, postIds, roleIds, user);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('更新用户信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增用户信息
exports.addUser = async (req, res) => {
    try {
        const user = req.user.user.userName; // 假设用户名存储在 user 对象中
        const { postIds = [], roleIds = [], dept, ...userData } = req.body;

        userData.password = await bcrypt.hash(userData.password, 10);
        await UserService.addUser(userData, postIds, roleIds, user);

        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增用户信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除用户信息
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        await UserService.deleteUser(userId);

        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除用户信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 用户密码重置
exports.resetUserPwd = async (req, res) => {
    try {
        const { userId, password } = req.body;

        if (!userId || !password) {
            return sendError(res, errorCodes.BAD_REQUEST, '用户ID和密码不能为空');
        }

        await UserService.resetUserPwd(userId, password);
        sendSuccess(res, { msg: '密码重置成功' });
    } catch (error) {
        console.error('重置用户密码时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '重置用户密码失败');
    }
};

// 用户状态修改
exports.changeUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        await UserService.changeUserStatus(userId, status);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('Error changing user status:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '操作失败');
    }
};

// 获取用户授权角色
exports.getAuthRole = async (req, res) => {
    try {
        const { userId } = req.params;
        const data = await UserService.getAuthRoleService(userId);
        sendSuccess(res, {
            msg: '操作成功',
            code: 200,
            ...data
        });
    } catch (error) {
        console.error('Error fetching auth roles:', error);
        sendError(res, { code: 5000, msg: '操作失败' });
    }
};

// 修改授权角色
exports.updateAuthRole = async (req, res) => {
    const { userId, roleIds } = req.query;
    if (!userId || !roleIds) {
        return sendError(res, errorCodes.BAD_REQUEST, '用户ID和角色ID不能为空');
    }

    try {
        await UserService.updateAuthRole(userId, roleIds.split(','));
        sendSuccess(res, { msg: '授权角色更新成功' });
    } catch (error) {
        console.error('更新授权角色时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user.user.userId; // 从请求中获取用户ID，假设用户ID存储在req.user中
        const userProfile = await UserService.getUserProfile(userId);

        if (userProfile) {
            sendSuccess(res, userProfile);
        } else {
            sendError(res, errorCodes.INTERNAL_SERVER_ERROR, "用户信息不存在");
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '获取用户信息失败');
    }
};

// 修改用户个人信息
exports.updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.user.userId; // 假设已经通过中间件获取到了用户信息
        const { nickName, phonenumber, email, sex } = req.body;
        const updateData = { nickName, phonenumber, email, sex };

        await UserService.updateUserProfile(userId, updateData);
        sendSuccess(res, { code: 200, msg: '用户信息更新成功' });
    } catch (error) {
        console.error('更新用户信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '用户信息更新失败');
    }
};

// 修改用户密码
exports.updateUserPwd = async (req, res) => {
    try {
        const userId = req.user.user.userId; // 假设已经通过中间件获取到了用户信息
        const { oldPassword, newPassword } = req.query;

        const result = await UserService.updateUserPwd(userId, oldPassword, newPassword);
        if (result) {
            sendSuccess(res, { msg: '密码更新成功' });
        } else {
            sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '原密码不正确');
        }
    } catch (error) {
        console.error('更新密码时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR, '密码更新失败');
    }
};

const fields = [
    { label: '用户序号', key: 'userId', columnIndex: 1, type: 'number' },
    { label: '登录名称', key: 'userName', columnIndex: 2, required: true, type: 'string', primaryKey: true },
    { label: '用户名称', key: 'nickName', columnIndex: 3, type: 'string' },
    { label: '用户邮箱', key: 'email', columnIndex: 4, type: 'string' },
    { label: '手机号码', key: 'phonenumber', columnIndex: 5, type: 'string' },
    { label: '用户性别', key: 'sex', columnIndex: 6, dictType: 'sys_user_sex', type: 'string' },
    { label: '帐号状态', key: 'status', columnIndex: 7, dictType: 'sys_normal_disable', type: 'string' },
    { label: '最后登录IP', key: 'loginIp', columnIndex: 8, type: 'string' },
    { label: '最后登录时间', key: 'loginDate', columnIndex: 9, type: 'date' },
    { label: '部门名称', key: 'dept.deptName', columnIndex: 10, type: 'string' },
    { label: '部门负责人', key: 'dept.leader', columnIndex: 11, type: 'string' }
];

// 导出用户数据到 Excel 文件的控制器
exports.exportUsers = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, ...filters } = req.body;

        // 根据请求参数从数据库中获取用户数据
        const { rows: users } = await UserService.listUsers(filters, 1, 10000000000);

        const buffer = await exportToExcel(users, fields);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (error) {
        console.error('导出用户数据时出错:', error);
        sendError(res, { code: 5000, msg: '导出用户数据时出错' });
    }
};

// 导入模板生成接口
exports.importTemplate = async (req, res) => {
    try {
        const buffer = await generateTemplate(fields);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        console.error('生成模板时出错:', error);
        sendError(res, { code: 5000, msg: '生成模板时出错' });
    }
};

// 导入用户数据
exports.importData = async (req, res) => {
    const { updateSupport } = req.query;
    const fileBuffer = req.file.buffer;
    try {
        // const validateParams = {
        //     email: (value) => ({
        //         valid: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
        //         message: '邮箱格式不正确'
        //     })
        // };
        const validateParams = {};
        const { data, errors: parseErrors } = await parseExcel(fileBuffer, fields, validateRow, validateParams);
        if (parseErrors.length) {
            return sendError(res, { msg: `很抱歉，导入失败！共 ${parseErrors.length} 条数据格式不正确，错误如下：<br/>${parseErrors.join('<br/>')}<br/>数据校验出错，暂未导入，请修改后再次导入`, code: 500 });
        }

        const importErrors = [];
        for (const item of data) {
            try {
                if (updateSupport === 'true') {
                    if (item.userName == 'admin') {
                        importErrors.push(`账号 ${item.userName} 导入失败：不允许修改超级管理员`);
                    } else {
                        // 如果用户存在则更新，不存在则插入
                        await User.upsert(item);
                    }
                } else {
                    // 只插入新数据
                    const user = await User.findOne({ where: { userName: item.userName } });
                    if (user) {
                        importErrors.push(`账号 ${item.userName} 已存在`);
                    } else {
                        await User.create(item);
                    }
                }
            } catch (error) {
                importErrors.push(`账号 ${item.userName} 导入失败：${error.message}`);
            }
        }

        if (importErrors.length) {
            return sendError(res, { msg: `部分数据导入失败，错误如下：<br/>${importErrors.join('<br/>')}`, code: 500 });
        }

        sendSuccess(res, { msg: '导入成功', code: 200 });
    } catch (error) {
        console.error('导入用户数据时出错:', error);
        sendError(res, { msg: '导入失败', code: 500 });
    }
};
