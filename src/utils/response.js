const errorCodes = require('@/utils/error');

const sendResponse = (res, statusCode, message, additionalData = {}) => {
  const response = {
    code: statusCode,
    msg: message,
    ...additionalData
  };
  res.status(200).json(response);
};

const sendSuccess = (res, data = null) => {
  sendResponse(res, errorCodes.SUCCESS.code, errorCodes.SUCCESS.msg, data);
};

const sendError = (res, errorCode, additionalData = {}) => {
  sendResponse(res, errorCode.code, errorCode.msg, additionalData);
};

module.exports = {
  sendSuccess,
  sendError,
  sendResponse
};
