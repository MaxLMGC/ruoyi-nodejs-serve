// 更新的errorCodes配置
const errorCodes = {
  // 成功
  SUCCESS: { code: 200, msg: '成功' },
  
  // 客户端错误
  BAD_REQUEST: { code: 4000, msg: '请求错误' },
  UNAUTHORIZED: { code: 4001, msg: '未授权' },
  FORBIDDEN: { code: 4003, msg: '禁止访问' },
  NOT_FOUND: { code: 4004, msg: '未找到' },
  METHOD_NOT_ALLOWED: { code: 4005, msg: '方法不允许' },
  
  // 服务器错误
  INTERNAL_SERVER_ERROR: { code: 5000, msg: '服务器内部错误' },
  NOT_IMPLEMENTED: { code: 5001, msg: '未实现' },
  BAD_GATEWAY: { code: 5002, msg: '错误网关' },
  SERVICE_UNAVAILABLE: { code: 5003, msg: '服务不可用' },
  GATEWAY_TIMEOUT: { code: 5004, msg: '网关超时' },
  
  // 自定义错误
  INVALID_CREDENTIALS: { code: 40001, msg: '无效的凭证' },
  USER_NOT_FOUND: { code: 40002, msg: '用户未找到' },
  USER_ALREADY_EXISTS: { code: 40003, msg: '用户已存在' },
  INVALID_PARAMETERS: { code: 40004, msg: '无效的参数' },
  OPERATION_FAILED: { code: 40005, msg: '操作失败' },
};

module.exports = errorCodes;