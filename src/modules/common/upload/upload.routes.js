const express = require('express');
const router = express.Router();
const uploadController = require('./upload.controller');
const { uploadSingle } = require('@/middlewares/upload.middleware'); // 引入上传中间件

// 上传配置
const uploadConfig = {
    storageType: 'disk',
};

// 设置 POST /common/upload 路由
router.post('/upload', uploadSingle(uploadConfig), uploadController.uploadFile);

module.exports = router;