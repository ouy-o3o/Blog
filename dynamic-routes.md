# 动态路由

## [folderName]

使用动态路由，你需要将文件夹的名字用中括号括住， 比如`[id]` ,这个路由的名字会作为 props 传递给 布局，模板，路由处理程序 以及 `generateMetadata` 函数。
比如，我在`app/dynamic-routes`下新建一个名为`[id]`的文件夹，文件夹内新建一个`page.js` 文件。

```js
export default function Page({ params }) {
  return <div>Hello {params.id}</div>;
}
```

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-1.png?raw=true)

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

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-2.png?raw=true)

## 创建不同布局

使用路由组，即使是同一层级的路由，也可以使用不同的布局

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-3.png?raw=true)

在这个例子中，`/account` 、`/cart`、`/checkout` 都在同一层级。但是 `/account`和 `/cart`使用的是 `/app/(shop)/layout.js`布局和`app/layout.js`布局，`/checkout`使用的是 `app/layout.js`

## 创建不同根布局

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/dynamic-routes-4.png?raw=true)

因为要创建多个根布局，原本在`app/layout.js` 的布局文件需要删除，而且每一个路由组里的布局文件都需要有`<html>`和`<body>` 标签

这个功能很实用，比如你将前台购买页面和后台管理页面都放在一个项目里，一个 C 端，一个 B 端，两个项目的布局肯定不一样，借助路由组，就可以轻松实现区分。

注意点

1. 路由组的命名除了用于组织之外并无特殊意义。它们不会影响 URL 路径。
2. 注意不要解析为相同的 URL 路径。举个例子，因为路由组不影响 URL 路径，所以 (marketing)/about/page.js 和 (shop)/about/page.js 都会解析为 /about，这会导致报错。
3. 创建多个根布局的时候，因为删除了顶层的 app/layout.js 文件，访问 /会报错，所以 app/page.js 需要定义在其中一个路由组中。 4.跨根布局导航会导致页面完全重新加载，就比如使用 app/(shop)/layout.js 根布局的 /cart 跳转到使用 app/(marketing)/layout.js 根布局的 /blog 会导致页面重新加载（full page load）。

注：当定义多个根布局的时候，使用 app/not-found.js 会出现问题。具体参考 [《Next.js v14 如何为多个根布局自定义不同的 404 页面？竟然还有些麻烦！欢迎探讨》](https://juejin.cn/post/7351321244125265930)

# 平行路由

可用与在同一个布局中同时或有条件的渲染一个或多个页面，类似于 Vue 的插槽

## 条件渲染

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-1.png?raw=true)

将文件夹名称以`@`开头，比如上文就定义了 `@team` ,`@analytics`两个插槽。

插槽会作为 props 传递给共享的父布局，比如 `app/layout.js`

从 props 里获取了 `@team` 和 `@analytics` 两个插槽的内容，并将其和 children 的内容一起渲染

```js
// app/layout.js
export default function Layout({ children, team, analytics }) {
  return (
    <>
      {children}
      {team}
      {analytics}
    </>
  );
}
```

这里会发现， children 也就是一个隐式插槽，`app/page.js` 相当于 `app/@children/page.js`.

具体使用场景，比如做登录的前置检查，在布局中判断用户是否登录，如果没登陆，渲染 login 页面，这样的好处是代码完全分离。且因为布局是共用的，不管你访问这个项目的任何页面， 都会走这个逻辑，路径不一，但是页面都是 login，不用让用户感知到跳转到登录页这个过程。

## 独立的路由处理

平行路由可以让你为每个路由定义独立的错误处理和 loading 页面。一张图看懂

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-2.png?raw=true)

## 子导航

注意我们描述 team 和 analytics 时依然用的是“页面”这个说法，因为它们就像书写正常的页面一样使用 page.js。除此之外，它们也能像正常的页面一样，添加子页面，比如我们在 @analytics 下添加两个子页面：`/page-views` and `/visitors：`

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-3.png?raw=true)

平行路由跟路由组一样，不会影响 URL，所以 `/@analytics/page-views/page.js` 对应的地址是 `/page-views`，`/@analytics/visitors/page.js` 对应的地址是 `/visitors`，你可以导航至这些路由：

这部分内容在应用的时候比较灵活，在上面的例子中，我们访问了`/app` 会显示 `children` 和两个插槽 `@team` ,`@analytics`的内容，当链接跳转到`/page-views` 页面上显示的内容是 `children` 和两个插槽 `@team` ,`page-views/page.js`的内容。只会在原本`@analytics`的内容区域替换新的地址内容。

总的来说，每个插槽都有自己独立的导航和状态管理，就像一个小型应用一样。这个特性适合构建一些比较复杂的应用。

平行路由优势:

1. 可以将单个布局拆分为多个插槽，使代码便于管理，尤其适合团队协作
2. 每个插槽都可以定义自己的加载页面和错误状态，比如某个插槽加载速度慢，给他加上一个加载效果，加载期间，不会影响其他插槽的渲染和交互。当出现错误的时候也不会影响其他页面，只会再自己的插槽内容上展示错误信息，有效改善用户体验。
3. 每个插槽都有自己的独立导航和状态管理。同一个插槽可以根据路由显示不同内容。

# 拦截路由

拦截路由允许你在当前路由拦截其他路由地址，并在当前路由展示内容。

## 实现方式

实现拦截路由需要你在命名文件夹的时候以`(...)` 开头，其中：

1. `(.)` 表示匹配同一层级
2. `(..)`表示匹配上一层级
3. `(..)(..)`表示匹配上上层级
4. `(...)`表示匹配根目录

但是要注意，这个匹配方式是匹配的路由层级，不是文件层级，比如路由组、平行路由、这些不会影响 URL 的文件夹就不会被计算在层级内。

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-4.png?raw=true)

`/feed/(..)photo`对应的路由是`/feed/photo`，要拦截的路由是`/photo`,两者只差了一个层级，所以使用`(..)`

## 示例

我们写个 demo 来实现这个效果，目录结构如下：

```js
app
├─ layout.js
├─ page.js
├─ data.js
├─ default.js
├─ @modal
│  ├─ default.js
│  └─ (.)photo
│     └─ [id]
│        └─ page.js
└─ photo
   └─ [id]
      └─ page.js

```

虽然涉及的文件很多，但每个文件的代码都很简单。

先 Mock 一下图片的数据，`app/data.js`代码如下：

```js
export const photos = [
  { id: "1", src: "http://placekitten.com/210/210" },
  { id: "2", src: "http://placekitten.com/330/330" },
  { id: "3", src: "http://placekitten.com/220/220" },
  { id: "4", src: "http://placekitten.com/240/240" },
  { id: "5", src: "http://placekitten.com/250/250" },
  { id: "6", src: "http://placekitten.com/300/300" },
  { id: "7", src: "http://placekitten.com/500/500" },
];
```

`app/page.js`代码如下：

```js
import Link from "next/link";
import { photos } from "./data";

export default function Home() {
  return (
    <main className="flex flex-row flex-wrap">
      {photos.map(({ id, src }) => (
        <Link key={id} href={`/photo/${id}`}>
          <img width="200" src={src} className="m-1" />
        </Link>
      ))}
    </main>
  );
}
```

`app/layout.js` 代码如下：

```js
import "./globals.css";

export default function Layout({ children, modal }) {
  return (
    <html>
      <body>
        {children}
        {modal}
      </body>
    </html>
  );
}
```

此时访问 `/`，效果如下：

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-5.png?raw=true)

现在我们再来实现下单独访问图片地址时的效果，新建 `app/photo/[id]/page.js`，代码如下：

```js
import { photos } from "../../data";

export default function PhotoPage({ params: { id } }) {
  const photo = photos.find((p) => p.id === id);
  return <img className="block w-1/4 mx-auto mt-10" src={photo.src} />;
}
```

访问 `/photo/6`，效果如下：

![app-router-p3](https://github.com/ouy-o3o/Blog/blob/next/assets/parallel-routes-6.png?raw=true)

现在我们开始实现拦截路由，为了和单独访问图片地址时的样式区分，我们声明另一种样式效果。`app/@modal/(.)photo/[id]/page.js` 代码如下：

```js
import { photos } from "../../../data";

export default function PhotoModal({ params: { id } }) {
  const photo = photos.find((p) => p.id === id);
  return (
    <div className="flex h-60 justify-center items-center fixed bottom-0 bg-slate-300 w-full">
      <img className="w-52" src={photo.src} />
    </div>
  );
}
```

因为用到了平行路由，所以我们需要设置 `default.js`。`app/default.js` 和 `app/@modal/default.js`的代码都是：

```js
export default function Default() {
  return null;
}
```

最终的效果，就可以实现在/app 页面点击照片 在路由改变但是不改变当前页面的渲染，在下方插槽内渲染照片详情，刷新页面展示刚才点击的图片大图。

另一个 Demo 地址 [nextjs-app-route-interception.vercel.app/](https://link.juejin.cn/?target=https%3A%2F%2Fnextjs-app-route-interception.vercel.app%2F)
