// 使用module-alias
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { swaggerUi, specs } = require('@/config/swagger');
const errorCodes = require('@/utils/error');
const { sendError } = require('@/utils/response');
const routes = require('@/routes'); // 导入路由

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 使用全局路由
app.use('/', routes);
// 文件夹路由
app.use('/public/uploads', express.static('./src/public/uploads'));

// Swagger文档
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// 全局错误处理
app.use((err, req, res, next) => {
    sendError(res, {
        code: err.status || errorCodes.INTERNAL_SERVER_ERROR.code,
        msg: err.message || errorCodes.INTERNAL_SERVER_ERROR.message
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
