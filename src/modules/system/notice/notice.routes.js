const express = require('express');
const router = express.Router();
const noticeController = require('./notice.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 查询通知列表
router.get('/list', Permissions(['system:notice:list']), noticeController.listNotice);

// 查询通知详细
router.get('/:noticeId', Permissions(['system:notice:query']), CreateOperLog({
    title: '通知管理',
    businessType: '4',
}), noticeController.getNotice);

// 新增通知
router.post('/', Permissions(['system:notice:add']), CreateOperLog({
    title: '通知管理',
    businessType: '1',
}), noticeController.addNotice);

// 修改通知
router.put('/', Permissions(['system:notice:edit']), CreateOperLog({
    title: '通知管理',
    businessType: '2',
}), noticeController.updateNotice);

// 删除通知
router.delete('/:noticeId', Permissions(['system:notice:remove']), CreateOperLog({
    title: '通知管理',
    businessType: '3',
}), noticeController.delNotice);

module.exports = router;
