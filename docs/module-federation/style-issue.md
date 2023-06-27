---
title: style-issue
date: 2023-04-24 09:20:01
tags:
---

> mfe1 项目的公共样式，在 main 项目中用不了

# 1. 创建环境

- 在 app.component.css 设置字体颜色，在 styles.css 设置背景颜色
  ```typescript
  /*
  * mfe1
  * app.component.html
  */
  <p class="private public">mfe1 app works!</p>
  /*
  * mfe1
  * test.component.html
  */
  <p class="public">test works!</p>
  /*
  * mfe1
  * app.component.css
  */
  .private {
    color: #ddd;
  }
  /*
  * mfe1
  * styles.css
  */
  .public {
    background-color: rgb(187, 38, 73);
  }
  ```

# 2. 试验问题

下图分别是两个项目环境，可见 mfe1 的公共样式没有在 main 项目中生效

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-style.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-style2.png)

# 3. 解决问题

```typescript
/*
* mfe1
* app.component.css
*/
@import '../styles.css';
.private {
  color: #ddd;
}
/*
* mfe1
* app.component.ts
*/
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
/*
* angular.json
* 这一步可以不做，但是有可能会影响mfe1打完包之后的大小
*/
"styles": [
  // "projects/mfe1/src/styles.css"
],
```

# 4. 验证答案

### 从下图可以看出，main 项目中 mfe1 的公共样式生效了

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-style.png)
