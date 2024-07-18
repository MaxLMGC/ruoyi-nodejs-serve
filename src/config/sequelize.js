const { Sequelize } = require('sequelize');
const config = require('./config');

// 创建 Sequelize 实例
const sequelize = new Sequelize(
  config.database.database,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    dialect: 'mysql',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: console.log,
    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: false,
    },
  }
);

// 测试数据库连接
sequelize.authenticate()
  .then(() => {
    console.log('数据库连接成功');
  })
  .catch(err => {
    console.error('数据库连接失败:', err);
  });

module.exports = sequelize;
