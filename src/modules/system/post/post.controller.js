const postService = require('./post.service');
const { sendSuccess, sendError } = require('@/utils/response');
const errorCodes = require('@/utils/error');
const { exportToExcel, generateTemplate } = require('@/modules/excel/excel.service');

// 根据参数键名查询参数值
exports.getConfigKey = async (req, res) => {
  try {
    const { configKey } = req.params;
    const config = await configService.getConfigByKey(configKey);

    if (!config) {
      return sendError(res, errorCodes.NOT_FOUND, '配置项未找到');
    }

    sendSuccess(res, { msg: config.configValue });
  } catch (error) {
    console.error('查询参数值时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 查询岗位列表
exports.listPosts = async (req, res) => {
  try {
    const { pageNum, pageSize, ...filters } = req.query;
    const data = await postService.listPosts(filters, Number(pageNum), Number(pageSize));
    sendSuccess(res, data);
  } catch (error) {
    console.error('查询岗位列表时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 查询岗位详细
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postService.getPostById(postId);
    if (!post) {
      return sendError(res, errorCodes.NOT_FOUND);
    }
    sendSuccess(res, {
      data: post
    });
  } catch (error) {
    console.error('查询岗位详细时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 新增岗位
exports.addPost = async (req, res) => {
  try {
    const user = req.user.userName; // 假设用户信息在 req.user 中
    const post = await postService.addPost(req.body, user);
    sendSuccess(res, post);
  } catch (error) {
    console.error('新增岗位时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 修改岗位
exports.updatePost = async (req, res) => {
  try {
    const user = req.user.userName; // 假设用户信息在 req.user 中
    const { postId } = req.body;
    await postService.updatePost(postId, req.body, user);
    sendSuccess(res, { msg: '更新成功' });
  } catch (error) {
    console.error('修改岗位时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

// 删除岗位
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    await postService.deletePost(postId);
    sendSuccess(res, { msg: '删除成功' });
  } catch (error) {
    console.error('删除岗位时出错:', error);
    sendError(res, errorCodes.INTERNAL_SERVER_ERROR);
  }
};

const fields = [
  { label: '岗位编号', key: 'postId', columnIndex: 1, type: 'number' },
  { label: '岗位编码', key: 'postCode', columnIndex: 2, required: true, type: 'string', primaryKey: true },
  { label: '岗位名称', key: 'postName', columnIndex: 3, type: 'string' },
  { label: '岗位排序', key: 'postSort', columnIndex: 4, type: 'number' },
  { label: '状态', key: 'status', columnIndex: 5, dictType: 'sys_normal_disable', type: 'string' },
  { label: '创建时间', key: 'createTime', columnIndex: 6, type: 'date' }
];

// 导出岗位数据到 Excel 文件的控制器
exports.exportPosts = async (req, res) => {
  try {
      const { pageNum = 1, pageSize = 10, ...filters } = req.body;
      const { rows } = await postService.listPosts(filters, 1, 10000000000);
      const buffer = await exportToExcel(rows, fields);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
  } catch (error) {
      console.error('导出数据时出错:', error);
      sendError(res, { code: 5000, msg: '导出数据时出错' });
  }
};
