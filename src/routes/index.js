const express = require('express');
const router = express.Router();

// 导入其他模块的路由
const loginRoutes = require('@/modules/login/login.routes');
const menuRouterGetRoutes = require('@/modules/menu/menu.routes');
const userRoutes = require('@/modules/system/user/user.routes');
const dictDataRoutes = require('@/modules/system/dict/data/data.routes');
const configRoutes = require('@/modules/system/config/config.routes');
const postRoutes = require('@/modules/system/post/post.routes');
const genRoutes = require('@/modules/tool/gen/gen.routes');
const dictTypeRoutes = require('@/modules/system/dict/type/type.routes');
const menuRoutes = require('@/modules/system/menu/menu.routes');
const roleRoutes = require('@/modules/system/role/role.routes');
const deptRoutes = require('@/modules/system/dept/dept.routes');
const noticeRoutes = require('@/modules/system/notice/notice.routes');
const operlogRoutes = require('@/modules/monitor/operlog/operlog.routes');
const logininforRoutes = require('@/modules/monitor/logininfor/logininfor.routes');
const uploadRoutes = require('@/modules/common/upload/upload.routes');

const carouselRoutes = require('@/modules/main/carousel/carousel.routes');



// 登录注册路由
router.use('/', loginRoutes);
// 获取路由列表
router.use('/', menuRouterGetRoutes);
// 通用路由
router.use('/common', uploadRoutes)
// 用户路由
router.use('/system/user', userRoutes);
// 角色路由
router.use('/system/role', roleRoutes);
// 字典数据路由
router.use('/system/dict/data', dictDataRoutes);
// 系统配置路由
router.use('/system/config', configRoutes);
// 岗位路由
router.use('/system/post', postRoutes);
// 代码生成路由
router.use('/tool/gen', genRoutes);
// 字典类型路由
router.use('/system/dict/type', dictTypeRoutes);
// 菜单路由
router.use('/system/menu', menuRoutes);
// 部门路由
router.use('/system/dept', deptRoutes);
// 部门路由
router.use('/system/notice', noticeRoutes)
// 操作日志路由
router.use('/monitor/operlog', operlogRoutes)
// 操作日志路由
router.use('/monitor/logininfor', logininforRoutes)


// 轮播图路由
router.use('/main/carousel', carouselRoutes);

module.exports = router;
