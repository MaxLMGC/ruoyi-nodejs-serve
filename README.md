
```
skyclear-serve
├─ app.js
├─ package-lock.json
├─ package.json
├─ README.md
└─ src
   ├─ config
   │  ├─ config.js
   │  ├─ redis.js
   │  ├─ sequelize.js
   │  └─ swagger.js
   ├─ middlewares
   │  ├─ auth.middleware.js
   │  ├─ operlog.middleware.js
   │  └─ upload.middleware.js
   ├─ models
   │  ├─ index.js
   │  ├─ main
   │  │  └─ Carousel.js
   │  ├─ monitor
   │  │  ├─ LoginInfor.js
   │  │  └─ OperLog.js
   │  └─ system
   │     ├─ Config.js
   │     ├─ Dept.js
   │     ├─ DictData.js
   │     ├─ DictType.js
   │     ├─ GenTable.js
   │     ├─ GenTableColumn.js
   │     ├─ Menu.js
   │     ├─ Notice.js
   │     ├─ Post.js
   │     ├─ Role.js
   │     ├─ RoleDept.js
   │     ├─ RoleMenu.js
   │     ├─ User.js
   │     ├─ UserPost.js
   │     └─ UserRole.js
   ├─ modules
   │  ├─ excel
   │  │  └─ excel.service.js
   │  ├─ login
   │  │  ├─ login.controller.js
   │  │  └─ login.routes.js
   │  ├─ main
   │  │  └─ carousel
   │  │     ├─ carousel.controller.js
   │  │     ├─ carousel.routes.js
   │  │     └─ carousel.service.js
   │  ├─ menu
   │  │  └─ menu.routes.js
   │  ├─ monitor
   │  │  ├─ logininfor
   │  │  │  ├─ logininfor.controller.js
   │  │  │  ├─ logininfor.routes.js
   │  │  │  └─ logininfor.service.js
   │  │  └─ operlog
   │  │     ├─ operlog.controller.js
   │  │     ├─ operlog.routes.js
   │  │     └─ operlog.service.js
   │  ├─ system
   │  │  ├─ config
   │  │  │  ├─ config.controller.js
   │  │  │  ├─ config.routes.js
   │  │  │  └─ config.service.js
   │  │  ├─ dept
   │  │  │  ├─ dept.controller.js
   │  │  │  ├─ dept.routes.js
   │  │  │  └─ dept.service.js
   │  │  ├─ dict
   │  │  │  ├─ data
   │  │  │  │  ├─ data.controller.js
   │  │  │  │  ├─ data.routes.js
   │  │  │  │  └─ data.service.js
   │  │  │  └─ type
   │  │  │     ├─ type.controller.js
   │  │  │     ├─ type.routes.js
   │  │  │     └─ type.service.js
   │  │  ├─ menu
   │  │  │  ├─ menu.controller.js
   │  │  │  ├─ menu.routes.js
   │  │  │  └─ menu.service.js
   │  │  ├─ notice
   │  │  │  ├─ notice.controller.js
   │  │  │  ├─ notice.routes.js
   │  │  │  └─ notice.service.js
   │  │  ├─ post
   │  │  │  ├─ post.controller.js
   │  │  │  ├─ post.routes.js
   │  │  │  └─ post.service.js
   │  │  ├─ role
   │  │  │  ├─ role.controller.js
   │  │  │  ├─ role.routes.js
   │  │  │  └─ role.service.js
   │  │  └─ user
   │  │     ├─ user.controller.js
   │  │     ├─ user.routes.js
   │  │     └─ user.service.js
   │  └─ tool
   │     └─ gen
   │        ├─ gen.controller.js
   │        ├─ gen.routes.js
   │        └─ gen.service.js
   ├─ public
   │  └─ uploads
   ├─ routes
   │  └─ index.js
   ├─ template
   │  ├─ api
   │  │  └─ api.js.art
   │  ├─ config.js
   │  ├─ iii.json
   │  ├─ model
   │  │  └─ model.js.art
   │  ├─ module
   │  │  ├─ controller.js.art
   │  │  ├─ routes.js.art
   │  │  └─ service.js.art
   │  ├─ routes
   │  │  └─ index.js.art
   │  ├─ sql
   │  │  └─ sql.art
   │  └─ vue
   │     ├─ v2
   │     │  ├─ index-tree.vue.art
   │     │  └─ index.vue.art
   │     └─ v3
   │        ├─ index-tree.vue.art
   │        └─ index.vue.art
   └─ utils
      ├─ captcha.js
      ├─ error.js
      ├─ formatter.js
      ├─ ip.js
      ├─ response.js
      └─ userAgent.js

```