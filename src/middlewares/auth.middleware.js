// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const redisClient = require('@/config/redis');
const { sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');

/**
 * 验证并解析JWT
 * @param {string} token - 传递给API的Bearer token
 * @returns {Promise<Object>} 解析后的用户数据
 */
async function verifyJWT(token) {
  try {
    const decoded = jwt.verify(token, 'skyclear'); // 使用实际的密钥
    const loginToken = decoded.login_token;
    const userData = await redisClient.get(`login_tokens:${loginToken}`);

    if (!userData) {
      return null;  // 登录信息无效或过期
    }

    return JSON.parse(userData);
  } catch (error) {
    console.error('JWT验证失败:', error);
    return null;  // JWT解码失败
  }
}

const Permissions = (requiredPermissions = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, errorCodes.UNAUTHORIZED, { message: '认证失败，未提供Token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await verifyJWT(token);

    if (!user) {
      return sendError(res, errorCodes.UNAUTHORIZED, { message: '认证失败，登录信息无效或过期' });
    }

    if (requiredPermissions.length == 0) {
      req.user = user;
      return next()
    }

    const userPermissions = user.permissions;
    const hasPermission = requiredPermissions.some(permission =>
      userPermissions.includes(permission) || userPermissions.includes('*:*:*')
    );

    if (hasPermission) {
      req.user = user;
      next();
    } else {
      return sendError(res, errorCodes.FORBIDDEN, { message: '权限不足' });
    }
  };
};

const Roles = (requiredRoles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendError(res, errorCodes.UNAUTHORIZED, { message: '认证失败，未提供Token' });
    }

    const token = authHeader.replace('Bearer ', '');
    const user = await verifyJWT(token);

    if (!user) {
      return sendError(res, errorCodes.UNAUTHORIZED, { message: '认证失败，登录信息无效或过期' });
    }

    // 如果requiredRoles是空数组，则认为这是一个仅检查登录状态的请求
    if (requiredRoles.length === 0) {
      req.user = user;
      next();
      return;
    }

    const userRoles = user.roles || [];

    // 检查用户是否具有所需角色之一，或用户为admin时直接放权
    const hasRequiredRole = userRoles.includes('admin') || requiredRoles.some(role => userRoles.includes(role));
    if (hasRequiredRole) {
      req.user = user;
      next();
    } else {
      return sendError(res, errorCodes.FORBIDDEN, { message: '没有足够的角色权限' });
    }
  };
};

module.exports = {
  Permissions,
  Roles
};
