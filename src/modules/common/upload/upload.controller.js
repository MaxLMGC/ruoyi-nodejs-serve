const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');

// 上传文件
exports.uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, errorCodes.INTERNAL_SERVER_ERROR, { msg: '文件上传失败' });
        }
        const fileName = '/public/uploads/' +  req.file.filename;
        sendSuccess(res, {
            msg: '上传成功',
            code: 200,
            fileName: fileName
        });

    } catch (error) {
        console.error('文件上传时出错:', error);
        return sendError(res, errorCodes.INTERNAL_SERVER_ERROR, { msg: '文件上传失败' });
    }
};
