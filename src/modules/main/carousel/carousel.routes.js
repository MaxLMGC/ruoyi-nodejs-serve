/**
 * 文件类型: 后端-路由文件
 * 文件路径: @/modules/main/carousel/carousel.routes.js
 * 文件创建日期: 2024/7/11 15:24:47
 * 文件作者: admin
 */
const express = require('express');
const router = express.Router();
const CarouselController = require('./carousel.controller');
const { Permissions } = require('@/middlewares/auth.middleware');

/**
 * @swagger
 * /main/carousel/list:
 *   get:
 *     summary: 查询轮播图列表
 *     description: 获取轮播图列表并分页
 *     tags: [Carousel]
 *     parameters:
 *       - in: query
 *         name: pageNum
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页条数
 *       - in: query
 *         name: carouselId
 *         schema:
 *           type: integer
 *         description: 轮播图ID
 *       - in: query
 *         name: imageUrl
 *         schema:
 *           type: string
 *         description: 图片地址
 *       - in: query
 *         name: linkUrl
 *         schema:
 *           type: string
 *         description: 链接地址
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: 标题
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: 描述
 *       - in: query
 *         name: order
 *         schema:
 *           type: integer
 *         description: 显示顺序
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: 状态（0正常 1停用）
 *       - in: query
 *         name: createBy
 *         schema:
 *           type: string
 *         description: 创建者
 *       - in: query
 *         name: createTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 创建时间
 *       - in: query
 *         name: updateBy
 *         schema:
 *           type: string
 *         description: 更新者
 *       - in: query
 *         name: updateTime
 *         schema:
 *           type: string
 *           format: date-time
 *         description: 更新时间
 *       - in: query
 *         name: remark
 *         schema:
 *           type: string
 *         description: 备注
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       description: 总条数
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           carouselId:
 *                             type: integer
 *                             description: 轮播图ID
 *                           imageUrl:
 *                             type: string
 *                             description: 图片地址
 *                           linkUrl:
 *                             type: string
 *                             description: 链接地址
 *                           title:
 *                             type: string
 *                             description: 标题
 *                           description:
 *                             type: string
 *                             description: 描述
 *                           order:
 *                             type: integer
 *                             description: 显示顺序
 *                           status:
 *                             type: string
 *                             description: 状态（0正常 1停用）
 *                           createBy:
 *                             type: string
 *                             description: 创建者
 *                           createTime:
 *                             type: string
 *                             format: date-time
 *                             description: 创建时间
 *                           updateBy:
 *                             type: string
 *                             description: 更新者
 *                           updateTime:
 *                             type: string
 *                             format: date-time
 *                             description: 更新时间
 *                           remark:
 *                             type: string
 *                             description: 备注
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 服务器内部错误
 */
router.get('/list', Permissions(), CarouselController.listCarousels);

/**
 * @swagger
 * /main/carousel/{carouselId}:
 *   get:
 *     summary: 查询轮播图详细
 *     description: 根据ID查询轮播图详细
 *     tags: [Carousel]
 *     parameters:
 *       - in: path
 *         name: carouselId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 轮播图ID
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     carouselId:
 *                       type: integer
 *                       description: 轮播图ID
 *                     imageUrl:
 *                       type: string
 *                       description: 图片地址
 *                     linkUrl:
 *                       type: string
 *                       description: 链接地址
 *                     title:
 *                       type: string
 *                       description: 标题
 *                     description:
 *                       type: string
 *                       description: 描述
 *                     order:
 *                       type: integer
 *                       description: 显示顺序
 *                     status:
 *                       type: string
 *                       description: 状态（0正常 1停用）
 *                     createBy:
 *                       type: string
 *                       description: 创建者
 *                     createTime:
 *                       type: string
 *                       format: date-time
 *                       description: 创建时间
 *                     updateBy:
 *                       type: string
 *                       description: 更新者
 *                     updateTime:
 *                       type: string
 *                       format: date-time
 *                       description: 更新时间
 *                     remark:
 *                       type: string
 *                       description: 备注
 *       404:
 *         description: 轮播图未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 404
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 轮播图未找到
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 服务器内部错误
 */
router.get('/:carouselId', Permissions(), CarouselController.getCarousel);

/**
 * @swagger
 * /main/carousel:
 *   post:
 *     summary: 新增轮播图
 *     description: 新增轮播图信息
 *     tags: [Carousel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *                 description: 图片地址
 *               linkUrl:
 *                 type: string
 *                 description: 链接地址
 *               title:
 *                 type: string
 *                 description: 标题
 *               description:
 *                 type: string
 *                 description: 描述
 *               order:
 *                 type: integer
 *                 description: 显示顺序
 *               status:
 *                 type: string
 *                 description: 状态（0正常 1停用）
 *               createBy:
 *                 type: string
 *                 description: 创建者
 *               createTime:
 *                 type: string
 *                 format: date-time
 *                 description: 创建时间
 *               updateBy:
 *                 type: string
 *                 description: 更新者
 *               updateTime:
 *                 type: string
 *                 format: date-time
 *                 description: 更新时间
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 服务器内部错误
 */
router.post('/', Permissions(), CarouselController.addCarousel);

/**
 * @swagger
 * /main/carousel:
 *   put:
 *     summary: 修改轮播图
 *     description: 修改轮播图信息
 *     tags: [Carousel]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               carouselId:
 *                 type: integer
 *                 description: 轮播图ID
 *               imageUrl:
 *                 type: string
 *                 description: 图片地址
 *               linkUrl:
 *                 type: string
 *                 description: 链接地址
 *               title:
 *                 type: string
 *                 description: 标题
 *               description:
 *                 type: string
 *                 description: 描述
 *               order:
 *                 type: integer
 *                 description: 显示顺序
 *               status:
 *                 type: string
 *                 description: 状态（0正常 1停用）
 *               createBy:
 *                 type: string
 *                 description: 创建者
 *               createTime:
 *                 type: string
 *                 format: date-time
 *                 description: 创建时间
 *               updateBy:
 *                 type: string
 *                 description: 更新者
 *               updateTime:
 *                 type: string
 *                 format: date-time
 *                 description: 更新时间
 *               remark:
 *                 type: string
 *                 description: 备注
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 服务器内部错误
 */
router.put('/', Permissions(), CarouselController.updateCarousel);

/**
 * @swagger
 * /main/carousel/{carouselId}:
 *   delete:
 *     summary: 删除轮播图
 *     description: 根据ID删除轮播图
 *     tags: [Carousel]
 *     parameters:
 *       - in: path
 *         name: carouselId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 轮播图ID
 *     responses:
 *       200:
 *         description: 操作成功
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
 *                   example: 操作成功
 *       404:
 *         description: 轮播图未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 404
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 轮播图未找到
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   description: 状态码
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   description: 信息
 *                   example: 服务器内部错误
 */
router.delete('/:carouselId', Permissions(), CarouselController.deleteCarousel);

module.exports = router;
