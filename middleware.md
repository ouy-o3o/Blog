# 中间件

用于，拦截并控制应用里的所有请求和响应。

常见应用就是鉴权，打开页面渲染具体的内容前，先判断用户是否登录，则跳转到登录页面。

## 定义

规定文件名称为`middleware.js`, 定义在项目的根目录下,这里的根目录是指 和`app`或`pages`同级，如果有`src`目录就放在`src`下

```js
// middleware.js

import {} from "next/server";
```
