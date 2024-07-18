const NoticeService = require('./notice.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');

// 查询公告列表
exports.listNotice = async (req, res) => {
    try {
        const { pageNum, pageSize, ...filters } = req.query;
        const data = await NoticeService.listNotice(filters, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询公告列表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询公告详细
exports.getNotice = async (req, res) => {
    try {
        const { noticeId } = req.params;
        const notice = await NoticeService.getNoticeById(Number(noticeId));
        if (!notice) {
            return sendError(res, errorCodes.NOT_FOUND);
        }
        sendSuccess(res, { data: notice });
    } catch (error) {
        console.error('查询公告详细时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 新增公告
exports.addNotice = async (req, res) => {
    try {
        const data = req.body;
        await NoticeService.addNotice(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('新增公告时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改公告
exports.updateNotice = async (req, res) => {
    try {
        const data = req.body;
        await NoticeService.updateNotice(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改公告时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除公告
exports.delNotice = async (req, res) => {
    try {
        const { noticeId } = req.params;
        await NoticeService.delNotice(Number(noticeId));
        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除公告时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};
