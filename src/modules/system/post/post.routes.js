const express = require('express');
const router = express.Router();
const postController = require('./post.controller');
const { Permissions } = require('@/middlewares/auth.middleware');
const { CreateOperLog } = require('@/middlewares/operlog.middleware');

// 获取岗位列表
router.get('/list', Permissions(['system:post:list']), postController.listPosts);

// 根据ID查询岗位详细
router.get('/:postId', Permissions(['system:post:query']), CreateOperLog({
    title: '岗位管理',
    businessType: '4',
}), postController.getPost);

// 新增岗位
router.post('/', Permissions(['system:post:add']), CreateOperLog({
    title: '岗位管理',
    businessType: '1',
}), postController.addPost);

// 修改岗位
router.put('/', Permissions(['system:post:edit']), CreateOperLog({
    title: '岗位管理',
    businessType: '2',
}), postController.updatePost);

// 根据ID删除岗位
router.delete('/:postId', Permissions(['system:post:remove']), CreateOperLog({
    title: '岗位管理',
    businessType: '3',
}), postController.deletePost);

// 导出岗位数据
router.post('/export', Permissions(['system:post:export']), CreateOperLog({
    title: '岗位管理',
    businessType: '5',
}), postController.exportPosts);

module.exports = router;
