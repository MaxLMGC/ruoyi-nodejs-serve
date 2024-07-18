const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { Buffer } = require('buffer');
const DataService = require('@/modules/system/dict/data/data.service');

// 获取嵌套对象的值
const getNestedValue = (obj, key) => {
    return key.split('.').reduce((o, k) => (o || {})[k], obj);
};

// 导出数据到 Excel 文件并返回 Blob 数据
const exportToExcel = async (data, fields) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // 添加表头
    worksheet.columns = fields.map(field => ({ header: field.label, key: field.key, width: field.width || 15 }));

    // 获取所有字典数据
    const dicts = {};
    const dictPromises = fields
        .filter(field => field.dictType)
        .map(async field => {
            dicts[field.dictType] = await DataService.getDictsByType(field.dictType);
        });
    await Promise.all(dictPromises);

    // 将字典数据转换为键值对映射
    const dictMaps = {};
    Object.keys(dicts).forEach(dictType => {
        dictMaps[dictType] = {};
        dicts[dictType].forEach(dict => {
            dictMaps[dictType][dict.dictValue] = dict.dictLabel;
        });
    });

    // 添加数据
    data.forEach(item => {
        const row = {};
        fields.forEach(field => {
            let value = getNestedValue(item, field.key);
            // 检查字段是否需要字典映射
            if (field.dictType && dictMaps[field.dictType]) {
                value = dictMaps[field.dictType][value] || value;
            }
            row[field.key] = value;
        });
        worksheet.addRow(row);
    });

    // 将工作簿保存到 Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 返回 Blob 数据
    return buffer;
};

// 生成 Excel 模板文件并返回 Blob 数据
const generateTemplate = async (fields) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // 添加表头
    worksheet.columns = fields.map(field => ({ header: field.label, key: field.key, width: field.width || 15 }));

    // 将工作簿保存到 Buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // 返回 Blob 数据
    return buffer;
};

/**
 * 校验函数
 * @param {Object} rowData - 当前行数据
 * @param {Array} fields - 字段映射配置
 * @param {Object} dicts - 字典数据
 * @param {Object} validateParams - 校验参数
 * @returns {Object} - 返回校验结果
 */
const validateRow = (rowData, fields, dicts, validateParams) => {
    let valid = true;
    let errorMsg = '';
    fields.forEach(field => {
        const value = rowData[field.key];
        const checkValue = value && typeof value === 'object' && value.text ? value.text : value;

        // 检查必填字段
        if (field.required && !value) {
            valid = false;
            errorMsg += `${field.label} 不能为空; `;
        }

        // 其他校验逻辑
        if (validateParams && typeof validateParams[field.key] === 'function') {
            const { valid: isValid, message } = validateParams[field.key](checkValue);
            if (!isValid) {
                valid = false;
                errorMsg += `${message}; `;
            }
        }
    });

    return { valid, errorMsg };
};

/**
 * 格式化单元格数据
 * @param {any} value - 单元格值
 * @param {String} type - 字段类型
 * @returns {any} - 格式化后的值
 */
const formatCellValue = (value, type) => {
    let cellValue = value && typeof value === 'object' && value.text ? value.text : value;
    if (type === 'number') return Number(cellValue);
    if (type === 'date') return cellValue ? new Date(cellValue) : null;
    if (type === 'boolean') return Boolean(cellValue);
    return cellValue;
};

/**
 * 解析上传的 Excel 文件
 * @param {Buffer} buffer - 文件 buffer 数据
 * @param {Array} fields - 字段映射配置
 * @param {Function} validate - 校验函数
 * @param {Object} validateParams - 校验参数
 * @returns {Object} - 返回解析后的数据和错误信息
 */
const parseExcel = async (buffer, fields, validate, validateParams = {}) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet(1);

    const errors = [];
    const data = [];

    // 获取字典数据
    const dicts = {};
    for (const field of fields) {
        if (field.dictType) {
            dicts[field.dictType] = await DataService.getDictsByType(field.dictType);
        }
    }

    // 找到主键字段
    const primaryKeyField = fields.find(field => field.primaryKey);

    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // 跳过表头

        const rowData = {};
        fields.forEach(field => {
            let cellValue = row.getCell(field.columnIndex).value;
            cellValue = formatCellValue(cellValue, field.type);

            if (field.dictType) {
                const dictEntry = dicts[field.dictType].find(d => d.dictLabel === cellValue);
                rowData[field.key] = dictEntry ? dictEntry.dictValue : null;
            } else {
                rowData[field.key] = cellValue;
            }
        });

        const { valid, errorMsg } = validate(rowData, fields, dicts, validateParams);
        if (valid) {
            data.push(rowData);
        } else {
            errors.push(`${primaryKeyField.label} ${rowData[primaryKeyField.key]} 导入失败：${errorMsg}`);
        }
    });

    return {
        data,
        errors
    };
};


module.exports = {
    exportToExcel,
    generateTemplate,
    parseExcel,
    validateRow
};
