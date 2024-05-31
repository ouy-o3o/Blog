# 动态路由

## [folderName]

使用动态路由，你需要将文件夹的名字用中括号括住， 比如`[id]` ,这个路由的名字会作为 props 传递给 布局，模板，路由处理程序 以及 `generateMetadata` 函数。
比如，我在`app/dynamic-routes`下新建一个名为`[id]`的文件夹，文件夹内新建一个`page.js` 文件。

```js
export default function Page({ params }) {
  return <div>Hello {params.id}</div>;
}
```

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-1.png?raw=true)

## [...folderName]

文件夹命名如果在方括号内加上省略号，比如`[...id]`, 这就表示捕获所有后面的路由片段，比如在`app/dynamic-routes`下新建一个名为`[...id]`的文件夹，这个文件会捕获后面的所有路由片段。
比如`/dynamic-routes/user/config` 传递给文件的 params 是一个数组，`/dynamic-routes/user/config`传递的 params 是`['user','config']`， 可以理解为`dynamic-routes` 后的路径都会被`...`放到一个数组内保存，这个省略号我第一反应是扩展运算符...

## [[...folderName]]

文件夹命名如果在方括号内加上两个方括号，比如`[[...id]]`, 这就表示捕获所有后面的路由片段，比如在`app/dynamic-routes`下新建一个名为`[[...id]]`的文件夹，这个文件会捕获后面的所有路由片段。这里加了两个方括号，和一个方括号的区别就是 不带上参数的路由也会被匹配。也就是说 `app/dynamic-routes/[[...id]]/page.js`，会匹配`/dynamic-routes` 传递的参数为空

# 路由组

在 `app` 目录下，文件夹名称通常会被映射到 URL 中，但你可以将文件夹标记为路由组，阻止文件夹名称被映射到 URL 中。

使用路由组，你可以将路由和项目文件按照逻辑进行分组，但不会影响 URL 路径结构，路由结构可以用于比如，按照站点，意愿，团队将路由分组，在同一层级创建多个布局，甚至是创建多个根布局。

那么该如何标记呢，把文件夹用括号括住就可以了。比如`(dashboard)`,
举例：

## 按照逻辑分组

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-2.webp?raw=true)

## 创建不同布局

使用路由组，即使是同一层级的路由，也可以使用不同的布局

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-3.webp?raw=true)

在这个例子中，`/account` 、`/cart`、`/checkout` 都在同一层级。但是 `/account`和 `/cart`使用的是 `/app/(shop)/layout.js`布局和`app/layout.js`布局，`/checkout`使用的是 `app/layout.js`

## 创建不同根布局

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-4.webp?raw=true)

因为要创建多个根布局，原本在`app/layout.js` 的布局文件需要删除，而且每一个路由组里的布局文件都需要有`<html>`和`<body>` 标签

这个功能很实用，比如你将前台购买页面和后台管理页面都放在一个项目里，一个 C 端，一个 B 端，两个项目的布局肯定不一样，借助路由组，就可以轻松实现区分。

注意点

1. 路由组的命名除了用于组织之外并无特殊意义。它们不会影响 URL 路径。
2. 注意不要解析为相同的 URL 路径。举个例子，因为路由组不影响 URL 路径，所以 (marketing)/about/page.js 和 (shop)/about/page.js 都会解析为 /about，这会导致报错。
3. 创建多个根布局的时候，因为删除了顶层的 app/layout.js 文件，访问 /会报错，所以 app/page.js 需要定义在其中一个路由组中。 4.跨根布局导航会导致页面完全重新加载，就比如使用 app/(shop)/layout.js 根布局的 /cart 跳转到使用 app/(marketing)/layout.js 根布局的 /blog 会导致页面重新加载（full page load）。

注：当定义多个根布局的时候，使用 app/not-found.js 会出现问题。具体参考 [《Next.js v14 如何为多个根布局自定义不同的 404 页面？竟然还有些麻烦！欢迎探讨》](https://juejin.cn/post/7351321244125265930)
