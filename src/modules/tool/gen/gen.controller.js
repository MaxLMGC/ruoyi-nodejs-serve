const genService = require('./gen.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');

// 查询生成表数据
exports.listTable = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, tableName, tableComment } = req.query;
        const filters = { tableName, tableComment };

        const data = await genService.listTable(filters, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询生成表数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询数据库表数据
exports.listDbTable = async (req, res) => {
    try {
        const { pageNum = 1, pageSize = 10, tableName, tableComment } = req.query;
        const filters = { table_name: tableName, table_comment: tableComment };

        const data = await genService.listDbTable(filters, Number(pageNum), Number(pageSize));
        sendSuccess(res, data);
    } catch (error) {
        console.error('查询数据库表数据时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 导入表
exports.importTable = async (req, res) => {
    try {
        // 获取user名字
        const userName = req.user.user.userName; 
        const { tables: tableName } = req.query;
        await genService.importTable({ tableName ,userName});
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('导入表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 删除表
exports.deleteTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        await genService.deleteTable(tableId);
        sendSuccess(res, { msg: '删除成功' });
    } catch (error) {
        console.error('删除表时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 查询表详细信息
exports.getGenTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const data = await genService.getGenTable(tableId);
        sendSuccess(res, { msg: '操作成功', data });
    } catch (error) {
        console.error('查询表详细信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 修改代码生成信息
exports.updateGenTable = async (req, res) => {
    try {
        const data = req.body;
        await genService.updateGenTable(data);
        sendSuccess(res, { msg: '操作成功' });
    } catch (error) {
        console.error('修改代码生成信息时出错:', error);
        sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
    }
};

// 预览生成代码
exports.previewTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const data = await genService.previewTable(tableId);
        sendSuccess(res, { data });
    } catch (error) {
        console.error('预览生成代码时出错:', error);
        sendError(res, {msg:'参数设置错误,请重新设置',code:5000});
    }
};

// 生成压缩包文件
exports.batchGenCode = async (req, res) => {
    const { tables } = req.query; // 获取查询字符串中的表名

    if (!tables) {
        return sendError(res, '表名是必需的');
    }

    const tableNames = tables.split(',');

    try {
        // 调用生成代码服务
        const codeFiles = await genService.batchGenCode(tableNames);

        // 创建一个临时zip文件
        const zipFilePath = path.join(__dirname, 'generated_code.zip');
        const output = fs.createWriteStream(zipFilePath);
        const archive = archiver('zip', {
            zlib: { level: 9 }
        });

        output.on('close', () => {
            res.setHeader('Content-Type', 'application/zip');
            // 发送zip文件
            res.download(zipFilePath, 'skyclear_code.zip', err => {
                if (err) {
                    console.error('发送压缩文件时出错:', err);
                    return sendError(res, '发送压缩文件时出错');
                }
                // 删除临时文件
                fs.unlinkSync(zipFilePath);
            });
        });

        archive.on('error', err => {
            throw err;
        });

        archive.pipe(output);

        // 将生成的代码文件添加到zip包中
        for (const [fileName, content] of Object.entries(codeFiles)) {
            archive.append(content, { name: fileName });
        }

        archive.finalize();
    } catch (error) {
        console.error('生成代码时出错:', error);
        sendError(res, {msg:'参数设置错误,请重新设置',code:4000});
    }
};