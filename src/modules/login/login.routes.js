// modules/login/login.routes.js
const express = require('express');
const router = express.Router();
const loginController = require('./login.controller');
// 权限校验
const { Permissions } = require('@/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Login
 *   description: 登录管理
 */

/**
 * @swagger
 * /captchaImage:
 *   get:
 *     summary: 获取验证码
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 img:
 *                   type: string
 *                   description: Base64编码的验证码图片
 *                 uuid:
 *                   type: string
 *                   description: 验证码的UUID
 */
router.get('/captchaImage', loginController.getCaptchaImage);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: 用户登录
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               code:
 *                 type: string
 *               uuid:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "操作成功"
 *                 code:
 *                   type: number
 *                   example: 200
 *                 token:
 *                   type: string
 *                   description: JWT令牌
 */
router.post('/login', loginController.login);

/**
 * @swagger
 * /getInfo:
 *   get:
 *     summary: 获取用户详细信息
 *     tags: [Login]
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                 code:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     createBy:
 *                       type: string
 *                     createTime:
 *                       type: string
 *                       format: date-time
 *                     updateBy:
 *                       type: string
 *                       nullable: true
 *                     updateTime:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     remark:
 *                       type: string
 *                       nullable: true
 *                     params:
 *                       type: object
 *                     userId:
 *                       type: integer
 *                     deptId:
 *                       type: integer
 *                     userName:
 *                       type: string
 *                     nickName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phonenumber:
 *                       type: string
 *                     sex:
 *                       type: string
 *                     avatar:
 *                       type: string
 *                       nullable: true
 *                     password:
 *                       type: string
 *                     status:
 *                       type: string
 *                     delFlag:
 *                       type: string
 *                     loginIp:
 *                       type: string
 *                       nullable: true
 *                     loginDate:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                     dept:
 *                       type: object
 *                       properties:
 *                         deptId:
 *                           type: integer
 *                         deptName:
 *                           type: string
 *                         leader:
 *                           type: string
 *                         phone:
 *                           type: string
 *                           nullable: true
 *                         email:
 *                           type: string
 *                           nullable: true
 *                         status:
 *                           type: string
 *                     roles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           roleId:
 *                             type: integer
 *                           roleName:
 *                             type: string
 *                           roleKey:
 *                             type: string
 *                           admin:
 *                             type: boolean
 */
router.get('/getInfo', Permissions(), loginController.getInfo);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: 用户退出登录
 *     description: 用户退出登录，删除 Redis 中对应的登录信息，并返回状态码 200 和消息 "退出成功"。
 *     tags: [Login]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 退出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 退出成功
 */
router.post('/logout', loginController.logout);

module.exports = router;
