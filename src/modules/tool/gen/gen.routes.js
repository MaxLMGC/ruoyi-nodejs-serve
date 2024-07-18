const express = require('express');
const router = express.Router();
const genController = require('./gen.controller');
const { Permissions } = require('@/middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Gen
 *   description: 代码生成管理
 */

/**
 * @swagger
 * /tool/gen/list:
 *   get:
 *     summary: 查询生成表数据
 *     tags: [Gen]
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
 *         description: 每页显示条数
 *       - in: query
 *         name: tableName
 *         schema:
 *           type: string
 *         description: 表名称
 *       - in: query
 *         name: tableComment
 *         schema:
 *           type: string
 *         description: 表描述
 *     responses:
 *       200:
 *         description: 生成表数据列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           table_id:
 *                             type: integer
 *                           table_name:
 *                             type: string
 *                           table_comment:
 *                             type: string
 *                           sub_table_name:
 *                             type: string
 *                           sub_table_fk_name:
 *                             type: string
 *                           class_name:
 *                             type: string
 *                           tpl_category:
 *                             type: string
 *                           tpl_web_type:
 *                             type: string
 *                           package_name:
 *                             type: string
 *                           module_name:
 *                             type: string
 *                           business_name:
 *                             type: string
 *                           function_name:
 *                             type: string
 *                           function_author:
 *                             type: string
 *                           gen_type:
 *                             type: string
 *                           gen_path:
 *                             type: string
 *                           options:
 *                             type: string
 *                           create_by:
 *                             type: string
 *                           create_time:
 *                             type: string
 *                           update_by:
 *                             type: string
 *                           update_time:
 *                             type: string
 *                           remark:
 *                             type: string
 */
router.get('/list', Permissions(), genController.listTable);

/**
 * @swagger
 * /tool/gen/db/list:
 *   get:
 *     summary: 查询数据库表数据
 *     tags: [Gen]
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
 *         description: 每页显示条数
 *       - in: query
 *         name: tableName
 *         schema:
 *           type: string
 *         description: 表名称
 *       - in: query
 *         name: tableComment
 *         schema:
 *           type: string
 *         description: 表描述
 *     responses:
 *       200:
 *         description: 数据库表数据列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           table_name:
 *                             type: string
 *                           table_comment:
 *                             type: string
 *                           create_time:
 *                             type: string
 *                           update_time:
 *                             type: string
 */
router.get('/db/list', Permissions(), genController.listDbTable);

/**
 * @swagger
 * /tool/gen:
 *   put:
 *     summary: 更新代码生成信息
 *     tags: [Gen]
 *     requestBody:
 *       description: 代码生成信息
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tableId:
 *                 type: integer
 *               tableName:
 *                 type: string
 *               tableComment:
 *                 type: string
 *               subTableName:
 *                 type: string
 *               subTableFkName:
 *                 type: string
 *               className:
 *                 type: string
 *               tplCategory:
 *                 type: string
 *               tplWebType:
 *                 type: string
 *               packageName:
 *                 type: string
 *               moduleName:
 *                 type: string
 *               businessName:
 *                 type: string
 *               functionName:
 *                 type: string
 *               functionAuthor:
 *                 type: string
 *               genType:
 *                 type: string
 *               genPath:
 *                 type: string
 *               options:
 *                 type: string
 *               createBy:
 *                 type: string
 *               createTime:
 *                 type: string
 *               updateBy:
 *                 type: string
 *               updateTime:
 *                 type: string
 *               remark:
 *                 type: string
 *               columns:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     columnId:
 *                       type: integer
 *                     tableId:
 *                       type: integer
 *                     columnName:
 *                       type: string
 *                     columnComment:
 *                       type: string
 *                     columnType:
 *                       type: string
 *                     javaScriptType:
 *                       type: string
 *                     javaScriptField:
 *                       type: string
 *                     isPk:
 *                       type: string
 *                     isIncrement:
 *                       type: string
 *                     isRequired:
 *                       type: string
 *                     isInsert:
 *                       type: string
 *                     isEdit:
 *                       type: string
 *                     isList:
 *                       type: string
 *                     isQuery:
 *                       type: string
 *                     queryType:
 *                       type: string
 *                     htmlType:
 *                       type: string
 *                     dictType:
 *                       type: string
 *                     sort:
 *                       type: integer
 *                     createBy:
 *                       type: string
 *                     createTime:
 *                       type: string
 *                     updateBy:
 *                       type: string
 *                     updateTime:
 *                       type: string
 *                     remark:
 *                       type: string
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 操作成功
 */

router.put('/', Permissions(), genController.updateGenTable);

// 预览生成代码
/**
 * @swagger
 * /tool/gen/preview/{tableId}:
 *   get:
 *     summary: 预览生成代码
 *     tags: [Gen]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         schema:
 *           type: integer
 *         required: true
 *         description: 表ID
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
 *                   example: 200
 *                 msg:
 *                   type: string
 *                   example: 操作成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     table:
 *                       type: object
 *                       description: 表信息
 *                     columns:
 *                       type: array
 *                       items:
 *                         type: object
 *                         description: 列信息
 */
router.get('/preview/:tableId', Permissions(), genController.previewTable);

/**
 * @swagger
 * /tool/gen/batchGenCode:
 *   post:
 *     summary: 批量生成代码
 *     description: 根据表名批量生成代码，并返回一个包含生成代码的zip压缩包
 *     tags: [Code Generation]
 *     parameters:
 *       - in: body
 *         name: tables
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             tables:
 *               type: string
 *               description: 以逗号分隔的表名字符串
 *               example: "table1,table2,table3"
 *     responses:
 *       200:
 *         description: 成功生成并返回zip压缩包
 *         content:
 *           application/zip:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: 缺少表名
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Table names are required
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error generating code
 */
// router.get('/batchGenCode', Permissions(), genController.batchGenCode);
router.get('/batchGenCode', genController.batchGenCode);

/**
 * @swagger
 * /tool/gen/{tableId}:
 *   get:
 *     summary: 查询表详细信息
 *     description: 根据表ID查询表详细信息及其列
 *     tags: [Gen]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 表ID
 *     responses:
 *       200:
 *         description: 操作成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 操作成功
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     tables:
 *                       type: array
 *                       items:
 *                         type: object
 *                     rows:
 *                       type: array
 *                       items:
 *                         type: object
 *                     info:
 *                       type: object
 *       404:
 *         description: 表未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 msg:
 *                   type: string
 *                   example: 表未找到
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: 服务器内部错误
 */
router.get('/:tableId', Permissions(), genController.getGenTable);


/**
 * @swagger
 * tags:
 *   name: Code Generation
 *   description: Code generation operations
 */

// 导入表
router.post('/importTable', Permissions(), genController.importTable);

/**
 * @swagger
 * /tool/gen/{tableId}:
 *   delete:
 *     summary: 删除表数据
 *     description: 删除表数据及其列
 *     tags: [Gen]
 *     parameters:
 *       - in: path
 *         name: tableId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 表ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: 删除成功
 *       404:
 *         description: 表未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 msg:
 *                   type: string
 *                   example: 表未找到
 *       500:
 *         description: 服务器内部错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 msg:
 *                   type: string
 *                   example: 服务器内部错误
 */
router.delete('/:tableId', Permissions(), genController.deleteTable);

module.exports = router;
