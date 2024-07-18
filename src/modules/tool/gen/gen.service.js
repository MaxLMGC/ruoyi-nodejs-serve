const template = require('art-template');
const fs = require('fs');
const path = require('path');
const sequelize = require('@/config/sequelize');
const { Op } = require('sequelize');
const { formatDate, toCamelCase, toPascalCase, getJavaScriptType, getJavaScriptTypeNum } = require('@/utils/formatter');
const config = require('@/config/config');
const { GenTable, GenTableColumn } = require('@/models/index');
// 导入模板配置文件
const templateConfig = require('@/template/config');

// template配置模板引擎 只使用原始语法
template.defaults.rules = [template.defaults.rules[0]];

// 查询生成表数据并分页
const listTable = async (filters, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const where = {};
        if (filters.tableName) where.tableName = { [Op.like]: `%${filters.tableName}%` };
        if (filters.tableComment) where.tableComment = { [Op.like]: `%${filters.tableComment}%` };

        const tables = await GenTable.findAndCountAll({
            where,
            offset: (pageNum - 1) * pageSize,
            limit: pageSize,
            transaction
        });

        await transaction.commit();
        return {
            total: tables.count,
            rows: tables.rows,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 查询数据库表数据并分页
const listDbTable = async (filters, pageNum = 1, pageSize = 10) => {
    const transaction = await sequelize.transaction();
    try {
        const schemaName = config.database.database;

        const tables = await sequelize.query(
            `SELECT 
                table_name AS "tableName", 
                table_comment AS "tableComment", 
                create_time AS "createTime", 
                update_time AS "updateTime" 
             FROM information_schema.tables 
             WHERE table_schema = :schemaName 
             AND table_name LIKE :tableName 
             AND table_comment LIKE :tableComment 
             LIMIT :offset, :limit`,
            {
                replacements: {
                    schemaName,
                    tableName: `%${filters.table_name || ''}%`,
                    tableComment: `%${filters.table_comment || ''}%`,
                    offset: (pageNum - 1) * pageSize,
                    limit: pageSize
                },
                type: sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        const totalCount = await sequelize.query(
            `SELECT COUNT(*) as total 
             FROM information_schema.tables 
             WHERE table_schema = :schemaName 
             AND table_name LIKE :tableName 
             AND table_comment LIKE :tableComment`,
            {
                replacements: {
                    schemaName,
                    tableName: `%${filters.table_name || ''}%`,
                    tableComment: `%${filters.table_comment || ''}%`,
                },
                type: sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        await transaction.commit();
        return {
            total: totalCount[0].total,
            rows: tables,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 导入表
const importTable = async ({ tableName ,userName}) => {
    const transaction = await sequelize.transaction();
    try {
        const createTime = formatDate(new Date());

        // 查询表的描述信息
        const [tableInfo] = await sequelize.query(
            'SELECT table_comment FROM information_schema.tables WHERE table_schema = ? AND table_name = ?',
            {
                replacements: [config.database.database, tableName],
                type: sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        if (!tableInfo) {
            throw new Error('表不存在');
        }

        // 插入表信息
        const table = await GenTable.create({
            tableName,
            tableComment: tableInfo.table_comment,
            className: toPascalCase(tableName),
            tplCategory: 'crud',
            tplWebType: 'element-ui',
            createTime,
            functionAuthor:userName,
            moduleName:'system',
            businessName:tableName
        }, { transaction });

        const tableId = table.tableId;

        // 查询列信息
        const columns = await sequelize.query(
            `SELECT column_name, column_comment, column_type, 
                  CASE 
                      WHEN column_key = 'PRI' THEN '1' 
                      ELSE '0' 
                  END AS is_pk,
                  CASE 
                      WHEN extra = 'auto_increment' THEN '1' 
                      ELSE '0' 
                  END AS is_increment
             FROM information_schema.columns 
             WHERE table_schema = ? AND table_name = ?`,
            {
                replacements: [config.database.database, tableName],
                type: sequelize.QueryTypes.SELECT,
                transaction
            }
        );

        // 插入列信息
        for (const column of columns) {
            const {
                column_name,
                column_comment,
                column_type,
                is_pk,
                is_increment,
            } = column;

            const javaScriptType = getJavaScriptType(column_type);
            const javaScriptField = toCamelCase(column_name);

            await GenTableColumn.create({
                tableId,
                columnName: column_name,
                columnComment: column_comment,
                columnType: column_type,
                javaScriptType,
                javaScriptField,
                isPk: is_pk,
                isIncrement: is_increment,
                isRequired: '1',
                isInsert: '1',
                isEdit: '1',
                isList: '1',
                isQuery: '1',
                queryType: 'EQ',
                htmlType: 'input',
                dictType: '',
                sort: 0,
                createTime
            }, { transaction });
        }

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 删除表和列
const deleteTable = async (tableId) => {
    const transaction = await sequelize.transaction();
    try {
        // 删除表的列
        await GenTableColumn.destroy({
            where: { tableId },
            transaction
        });

        // 删除表
        await GenTable.destroy({
            where: { tableId },
            transaction
        });

        await transaction.commit();
        return true;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};




const getGenTable = async (tableId) => {
    const transaction = await sequelize.transaction();
    try {
        // 查询表信息
        const tableInfo = await GenTable.findByPk(tableId, { transaction });
        if (!tableInfo) {
            throw new Error('表未找到');
        }

        // 查询列信息
        const columns = await GenTableColumn.findAll({
            where: { tableId },
            order: [['sort', 'ASC']],
            transaction,
        });

        const tableData = tableInfo.toJSON();
        tableData.columns = columns.map(col => col.toJSON());

        await transaction.commit();

        return {
            tables: [tableData],
            rows: tableData.columns,
            info: tableData,
        };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 修改代码生成信息
const updateGenTable = async (data) => {
    const transaction = await sequelize.transaction();
    try {
        const { tableId, columns, ...tableData } = data;

        // 更新 gen_table 表
        await GenTable.update(tableData, { where: { tableId }, transaction });

        // 更新 gen_table_column 表
        for (const column of columns) {
            await GenTableColumn.update(column, { where: { columnId: column.columnId }, transaction });
        }

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 预览表
const previewTable = async (tableId) => {
    const transaction = await sequelize.transaction();
    try {
        const table = await GenTable.findByPk(tableId, { transaction });
        const columns = await GenTableColumn.findAll({ where: { tableId }, transaction });

        let tableC = table ? table.toJSON() : null;

        // 模板数据
        const templateData = {
            ...tableC,
            columns: columns.map(column => column.toJSON())
        };
        // 把主键键名读出来写到table中
        const primaryKey = columns.find(column => column.isPk === '1');
        if (primaryKey) {
            templateData.primaryKey = primaryKey.javaScriptField;
        }
        // 获取JavaScript类型
        templateData.columns.forEach(column => {
            column.javaScriptType = getJavaScriptTypeNum(column.columnType);
            column.JavaScriptField = toPascalCase(column.javaScriptField);
        });
        // 将BusinessName转首字母大写
        templateData.BusinessName = toPascalCase(templateData.businessName);
        // 将className转首字母大写
        templateData.ClassName = toPascalCase(templateData.className);
        // 加入当前实时时间日期
        templateData.now = new Date().toLocaleString();

        // 确定用哪个配置
        const artConfig = templateConfig[`${templateData.tplCategory}`];

        // 要生成的模板类型数组
        const templates = ['api', 'model', 'controller', 'routes', 'service', 'router_index', 'sql', templateData.tplWebType];

        const results = generateTemplate(templateData, artConfig, templates);

        await transaction.commit();
        return results;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

// 批量生成代码
const batchGenCode = async (tableNames) => {
    const results = {};
    for (const tableName of tableNames) {
        const templateData = await getGenTableData(tableName);

        // 确定用哪个配置
        const artConfig = templateConfig[`${templateData.tplCategory}`];

        // 要生成的模板类型数组
        const templates = ['api', 'model', 'controller', 'routes', 'service', 'router_index', 'sql', templateData.tplWebType];

        const codeFiles = generatePathTemplate(templateData, artConfig, templates);

        Object.assign(results, codeFiles);
    }
    return results;
};

// 代码生成函数
const generateTemplate = (templateData, artConfig, templates) => {
    const results = {};
    templates.forEach(templateType => {
        const config = artConfig[templateType];
        const templateFilePath = path.resolve(__dirname, config.templateFilePath.replace('@', 'src'));
        const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
        const outputFileName = template.render(config.generateFileName, templateData);
        const renderedContent = template.render(templateContent, templateData);
        const cleanedTemplate = renderedContent.replace(/^\s*[\r\n]/gm, '');
        results[outputFileName] = cleanedTemplate;
    });
    return results;
};

// 代码路径生成函数
const generatePathTemplate = (templateData, artConfig, templates) => {
    const results = {};
    templates.forEach(templateType => {
        const config = artConfig[templateType];
        const templateFilePath = path.resolve(__dirname, config.templateFilePath.replace('@', 'src'));
        const templateContent = fs.readFileSync(templateFilePath, 'utf-8');
        const renderedContent = template.render(templateContent, templateData);
        const cleanedTemplate = renderedContent.replace(/^\s*[\r\n]/gm, '');

        // 根据模板类型和业务名确定文件路径
        let filePath = '';
        switch (templateType) {
            case 'api':
                filePath = `ui/api/${templateData.moduleName}/${templateData.businessName}.js`;
                break;
            case 'model':
                filePath = `server/src/models/${templateData.moduleName}/${templateData.BusinessName}.js`;
                break;
            case 'controller':
                filePath = `server/src/modules/${templateData.moduleName}/${templateData.businessName}/${templateData.businessName}.controller.js`;
                break;
            case 'routes':
                filePath = `server/src/modules/${templateData.moduleName}/${templateData.businessName}/${templateData.businessName}.routes.js`;
                break;
            case 'service':
                filePath = `server/src/modules/${templateData.moduleName}/${templateData.businessName}/${templateData.businessName}.service.js`;
                break;
            case 'router_index':
                filePath = `server/src/routes/index.js`;
                break;
            case 'sql':
                filePath = `server/src/sql.txt`;
                break;
            default:
                filePath = `ui/views/${templateData.moduleName}/${templateData.businessName}/index.vue`;
                break;
        }

        results[filePath] = cleanedTemplate;
    });
    return results;
};

const getGenTableData = async (tableName) => {
    const transaction = await sequelize.transaction();
    try {
        const table = await GenTable.findOne({ where: { tableName }, transaction });
        const columns = await GenTableColumn.findAll({ where: { tableId: table.tableId }, transaction });

        let tableC = table ? table.toJSON() : null;

        // 模板数据
        const templateData = {
            ...tableC,
            columns: columns.map(column => column.toJSON())
        };

        // 把主键键名读出来写到table中
        const primaryKey = columns.find(column => column.isPk === '1');
        if (primaryKey) {
            templateData.primaryKey = primaryKey.javaScriptField;
        }

        // 获取JavaScript类型
        templateData.columns.forEach(column => {
            column.javaScriptType = getJavaScriptTypeNum(column.columnType);
            column.JavaScriptField = toPascalCase(column.javaScriptField);
        });

        // 将BusinessName转首字母大写
        templateData.BusinessName = toPascalCase(templateData.businessName);
        // 将className转首字母大写
        templateData.ClassName = toPascalCase(templateData.className);
        // 加入当前实时时间日期
        templateData.now = new Date().toLocaleString();

        await transaction.commit();
        return templateData;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

module.exports = {
    listTable,
    listDbTable,
    importTable,
    deleteTable,
    getGenTable,
    updateGenTable,
    previewTable,
    batchGenCode
};
