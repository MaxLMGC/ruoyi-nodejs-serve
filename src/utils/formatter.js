const moment = require('moment');

// 将下划线转换为小驼峰的函数
const toCamel = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// 将对象的所有键从下划线转换为小驼峰
const keysToCamel = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToCamel(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamel(key)] = keysToCamel(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// 将小驼峰转换为下划线的函数
const toSnake = (str) => {
  return str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
};

// 将对象的所有键从小驼峰转换为下划线
const keysToSnake = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(v => keysToSnake(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toSnake(key)] = keysToSnake(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// 格式化日期时间
const formatDate = (datetime) => {
  return moment(datetime).format('YYYY-MM-DD HH:mm:ss');
};

const toCamelCase = (str) => {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
};

// 表名转大驼峰(首字母大写)
const toPascalCase = (str) => {
  return str
      .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase()) // 将下划线后的字母大写
      .replace(/^[a-z]/, (match) => match.toUpperCase()); // 将首字母大写
}

// 映射数据库字段类型 不带数字
const getJavaScriptType = (columnType) => {
  const typePattern = /(\w+)\((\d+)\)/;
  const match = columnType.match(typePattern);

  if (match) {
      const [_, type, length] = match;

      const typeMapping = {
          'bigint': 'BIGINT',
          'varchar': 'STRING',
          'char': 'CHAR',
          'int': 'INTEGER',
          'decimal': 'DECIMAL',
          'double': 'DOUBLE'
      };

      const sequelizeType = typeMapping[type.toLowerCase()] || 'STRING';
      // return `${sequelizeType}(${length})`;
      return `${sequelizeType}`;
  } else {
      const staticTypeMapping = {
          'datetime': 'DATE',
          'boolean': 'BOOLEAN'
          // 添加其他不带长度的类型映射
      };

      return staticTypeMapping[columnType.toLowerCase()] || 'STRING';
  }
};
// 映射数据库字段类型 带数字
const getJavaScriptTypeNum = (columnType) => {
  const typePattern = /(\w+)\((\d+)\)/;
  const match = columnType.match(typePattern);

  if (match) {
      const [_, type, length] = match;

      const typeMapping = {
          'bigint': 'BIGINT',
          'varchar': 'STRING',
          'char': 'CHAR',
          'int': 'INTEGER',
          'decimal': 'DECIMAL',
          'double': 'DOUBLE'
      };

      const sequelizeType = typeMapping[type.toLowerCase()] || 'STRING';
      return `${sequelizeType}(${length})`;
  } else {
      const staticTypeMapping = {
          'datetime': 'DATE',
          'boolean': 'BOOLEAN'
          // 添加其他不带长度的类型映射
      };

      return staticTypeMapping[columnType.toLowerCase()] || 'STRING';
  }
};


module.exports = {
  toCamel,
  keysToCamel,
  toSnake,
  keysToSnake,
  formatDate,
  toCamelCase,
  toPascalCase,
  getJavaScriptType,
  getJavaScriptTypeNum
};
