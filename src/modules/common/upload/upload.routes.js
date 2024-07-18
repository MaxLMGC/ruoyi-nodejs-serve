const express = require('express');
const router = express.Router();
const uploadController = require('./upload.service');
const upload = require('./upload.middleware'); // 引入上传中间件

// 设置 POST /common/upload 路由
router.post('/common/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        msg: 'No file uploaded',
        code: 400
      });
    }

    const fileName = req.file.path; // 文件路径

    res.status(200).json({
      msg: 'File uploaded successfully',
      code: 200,
      fileName: fileName
    });
  } catch (error) {
    res.status(500).json({
      msg: 'Server error',
      code: 500
    });
  }
});

module.exports = router;