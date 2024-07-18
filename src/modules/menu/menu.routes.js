const express = require('express');
const router = express.Router();
const menuController = require('@/modules/system/menu/menu.controller');
const { Permissions } = require('@/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Menu
 *   description: 菜单管理
 */

/**
 * @swagger
 * /system/menu/getRouters:
 *   get:
 *     summary: 获取用户路由
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   path:
 *                     type: string
 *                     description: 路由地址
 *                   component:
 *                     type: string
 *                     description: 组件路径
 *                   name:
 *                     type: string
 *                     description: 菜单名称
 *                   meta:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: 标题
 *                       icon:
 *                         type: string
 *                         description: 图标
 *                       noCache:
 *                         type: boolean
 *                         description: 是否缓存
 *                       link:
 *                         type: string
 *                         description: 链接
 *                   hidden:
 *                     type: boolean
 *                     description: 是否隐藏
 *                   alwaysShow:
 *                     type: boolean
 *                     description: 总是显示
 *                   redirect:
 *                     type: string
 *                     description: 重定向地址
 *                   children:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Menu'
 */
router.get('/getRouters', Permissions(), menuController.getRouters);

module.exports = router;
