const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('./config');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: config.swagger.title,
      version: config.swagger.version,
      description: config.swagger.description,
    },
    servers: [
      {
        url: config.swagger.serverUrl,
        description: config.swagger.serverDescription,
      }
    ]
  },
  apis: [
    path.resolve(__dirname, '../modules/**/*.js'),
    path.resolve(__dirname, '../modules/**/**/*.js'),
    path.resolve(__dirname, '../modules/**/**/**/*.js'),
    path.resolve(__dirname, '../modules/**/**/**/**/*.js')
  ], // 扫描模块目录下的所有.js文件
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs
};
