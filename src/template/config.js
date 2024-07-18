module.exports = {
    crud: {
        // api接口路径
        api: {
            // 生成文件名
            generateFileName: 'api.js',
            // 模板文件路径
            templateFilePath: '../../../template/api/api.js.art',
        },
        // 数据库模型配置
        model: {
            // 生成文件名
            generateFileName: '<%= BusinessName %>.js',
            // 模板文件路径
            templateFilePath: '../../../template/model/model.js.art',
        },
        controller: {
            // 生成文件名
            generateFileName: 'controller.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/controller.js.art',
        },
        routes: {
            // 生成文件名
            generateFileName: 'routes.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/routes.js.art',
        },
        service: {
            // 生成文件名
            generateFileName: 'service.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/service.js.art',
        },
        router_index: {
            // 生成文件名
            generateFileName: 'router/index.js',
            // 模板文件路径
            templateFilePath: '../../../template/routes/index.js.art',
        },
        sql: {
            // 生成文件名
            generateFileName: 'sql.sql',
            // 模板文件路径
            templateFilePath: '../../../template/sql/sql.art',
        },
        // vue2
        'element-ui': {
            // 生成文件名
            generateFileName: 'index.js',
            // 模板文件路径
            templateFilePath: '../../../template/vue/v2/index.vue.art',
        },
        // vue3
        'element-plus': {
            // 生成文件名
            generateFileName: 'index.js',
            // 模板文件路径
            templateFilePath: '../../../template/vue/v3/index.vue.art',
        }
    },
    tree: {
        // api接口路径
        api: {
            // 生成文件名
            generateFileName: 'api.js',
            // 模板文件路径
            templateFilePath: '../../../template/api/api.js.art',
        },
        // 数据库模型配置
        model: {
            // 生成文件名
            generateFileName: '<%= BusinessName %>.js',
            // 模板文件路径
            templateFilePath: '../../../template/model/model.js.art',
        },
        controller: {
            // 生成文件名
            generateFileName: 'controller.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/controller.js.art',
        },
        routes: {
            // 生成文件名
            generateFileName: 'routes.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/routes.js.art',
        },
        service: {
            // 生成文件名
            generateFileName: 'service.js',
            // 模板文件路径
            templateFilePath: '../../../template/module/service.js.art',
        },
        router_index: {
            // 生成文件名
            generateFileName: 'router/index.js',
            // 模板文件路径
            templateFilePath: '../../../template/routes/index.js.art',
        },
        sql: {
            // 生成文件名
            generateFileName: 'sql.sql',
            // 模板文件路径
            templateFilePath: '../../../template/sql/sql.art',
        },
        'element-ui': {
            // 生成文件名
            generateFileName: 'index.js',
            // 模板文件路径
            templateFilePath: '../../../template/vue/v2/index-tree.vue.art',
        },
        'element-plus': {
            // 生成文件名
            generateFileName: 'index.js',
            // 模板文件路径
            templateFilePath: '../../../template/vue/v3/index-tree.vue.art',
        }
    },
    sub: {
        // 可根据需要添加子表的配置
    }
};
