const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

// 配置内存存储
const getMemoryStorage = () => multer.memoryStorage();

// 配置磁盘存储
const getDiskStorage = (uploadDir) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, uploadDir)); // 上传文件保存的路径
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // 保存的文件名
    }
});

// 文件过滤器
const getFileFilter = (fileTypes) => async (req, file, cb) => {
    try {
        const type = mime.lookup(file.originalname);
        const validTypes = fileTypes.map(ext => mime.lookup(ext));

        if (type && validTypes.includes(type)) {
            cb(null, true);
        } else {
            cb(new Error('不支持的文件类型'), false);
        }
    } catch (error) {
        cb(new Error('文件类型检测失败'), false);
    }
};

// 获取上传中间件
const getUploadMiddleware = ({ storageType = 'memory', maxFileSize = 1024 * 1024 * 100, fileTypes = [], uploadDir = '../public/uploads' }) => {
    const storage = storageType === 'disk' ? getDiskStorage(uploadDir) : getMemoryStorage();
    return multer({
        storage,
        limits: {
            fileSize: maxFileSize
        },
        fileFilter: getFileFilter(fileTypes)
    });
};

// 单文件上传中间件
const uploadSingle = (options) => getUploadMiddleware(options).single('file');

// 多文件上传中间件
const uploadMultiple = (options) => getUploadMiddleware(options).array('files', 10);

module.exports = {
    uploadSingle,
    uploadMultiple
};
