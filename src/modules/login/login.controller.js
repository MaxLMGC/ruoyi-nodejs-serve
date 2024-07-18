const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const { createCaptcha } = require('@/utils/captcha');
const redisClient = require('@/config/redis');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const UserService = require('@/modules/system/user/user.service');
const RoleService = require('@/modules/system/role/role.service');
const DeptService = require('@/modules/system/dept/dept.service');
const LogininforController = require('@/modules/monitor/logininfor/logininfor.controller');

// 获取验证码图片
exports.getCaptchaImage = async (req, res) => {
  try {
    const captcha = createCaptcha();
    const uuid = uuidv4();

    // 存储 uuid 和验证码到 Redis，设置过期时间为5分钟
    await redisClient.setEx(`captcha:${uuid}`, 300, captcha.text);

    const data = {
      img: `data:image/svg+xml;base64,${Buffer.from(captcha.data).toString('base64')}`,
      uuid: uuid
    };
    sendSuccess(res, data);
  } catch (error) {
    console.error('获取验证码图片时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, confirmPassword, code, uuid } = req.body;

    if (password !== confirmPassword) {
      return sendError(res, { code: 4000, msg: '两次密码不匹配' });
    }

    const storedCaptcha = await redisClient.get(`captcha:${uuid}`);
    if (!storedCaptcha || storedCaptcha.toLowerCase() !== code.toLowerCase()) {
      return sendError(res, { code: 4000, msg: '无效或过期的验证码' });
    }

    // 删除 Redis 中的验证码
    await redisClient.del(`captcha:${uuid}`);

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserService.createUser({ username, password: hashedPassword });

    sendSuccess(res, newUser);
  } catch (error) {
    console.error('注册过程中出错：', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 用户登录
// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password, code, uuid } = req.body;
    const storedCaptcha = await redisClient.get(`captcha:${uuid}`);

    if (!storedCaptcha || storedCaptcha.toLowerCase() !== code.toLowerCase()) {
      // 0为登录成功 1为登录失败
      await LogininforController.addLogininfor(req, ['1', '验证码过期']);
      return sendError(res, { code: 4000, msg: '无效或过期的验证码' });
    }

    // 删除 Redis 中的验证码
    await redisClient.del(`captcha:${uuid}`);

    const user = await UserService.getUserByUsername(username);

    if (!user) {
      return sendError(res, errorCodes.USER_NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // 0为登录成功 1为登录失败
      await LogininforController.addLogininfor(req, ['1', '用户名或密码错误']);
      return sendError(res, { code: 4000, msg: '无效的用户名或密码' });
    }

    // 获取用户角色和权限信息
    const roleIds = await UserService.getUserRoleIds(user.userId);
    const roleKeys = await UserService.getUserRoleKeys(user.userId);
    const permissions = await RoleService.getRolePermissions(roleIds);

    // 获取用户部门信息
    const dept = await DeptService.getDeptById(user.deptId);

    // 生成一个唯一的登录标识符
    const loginToken = uuidv4();

    // 将用户的数据和权限存储到 Redis 中，设置过期时间为72小时
    await redisClient.setEx(`login_tokens:${loginToken}`, 259200, JSON.stringify({
      user: {
        ...user,
        dept,
        roles: roleKeys
      },
      roles: roleKeys,
      permissions,
      login_token: loginToken
    }));

    // 生成 JWT 令牌并包含 loginToken
    const token = jwt.sign({ login_token: loginToken }, 'skyclear', { expiresIn: '72h' });

    // 0为登录成功 1为登录失败
    await LogininforController.addLogininfor(req, ['0', '登录成功']);

    sendSuccess(res, { token });
  } catch (error) {
    console.error('登录时出错:', error);
    // 0为登录成功 1为登录失败
    LogininforController.addLogininfor(req, ['1', '登录失败']);

    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 获取用户信息
exports.getInfo = async (req, res) => {
  try {
    const { user, permissions } = req.user;
    const roles = await UserService.getUserRoleKeys(user.userId);
    sendSuccess(res, { user, roles, permissions });
  } catch (error) {
    console.error('获取用户信息时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 用户退出登录
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization;

    if (token) {
      try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), 'skyclear');
        const loginToken = decoded.login_token;

        if (loginToken) {
          // 尝试删除 Redis 中的登录标识符
          await redisClient.del(`login_tokens:${loginToken}`);
        }
      } catch (error) {
        console.error('JWT 解析失败:', error);
      }
    }

    sendSuccess(res, { msg: '退出成功' });
  } catch (error) {
    console.error('退出登录时出错:', error);
    sendSuccess(res, { msg: '退出成功' }); // 即使出现错误也返回退出成功
  }
};

