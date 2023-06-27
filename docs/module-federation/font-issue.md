---
title: font-issue
date: 2023-06-24 11:39:59
---

> 在 mfe1 中引用公共组件的字体图标库，在 main 中没有生效

# 1. 创建环境

- 下载 devui icon 组件库，连接之前讲到过的怎么解决样式问题来创建环境

```typescript
npm i @devui-design/icons
/*
* mfe1
* app.component.css
*/
@import '~@devui-design/icons/icomoon/devui-icon.css'
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
* mfe1
* app.component.html
*/
<p>mfe1 app works!</p>
<i class="icon icon-add-bug"></i>
<router-outlet></router-outlet>
```

# 2. 试验问题

mfe1 项目中的图标，在 main 项目中并没有生效
![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-font.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-font2.png)

# 3. 解决问题

- 创建 proxy.config.json，然后配置

  ```typescript
  /*
  * proxy.config.json
  */
  {
    "/assets/mfe1": {
      "target": "http://localhost:9001",
      "secure": false
    }
  }
  /*
  * angular.json
  * main
  */
  "options": {
    "port": 9000,
    "publicHost": "http://localhost:9000",
    "extraWebpackConfig": "projects/main/webpack.config.js",
    "proxyConfig": "proxy.conf.json"
  }
  ```

- mfe1 webpack.config.js 配置，自定义插件

  ```typescript
  const webpack = require("webpack");

  const set = new Set();
  const regexpDev = /url\('([^;\)]*)\.(ttf|woff2?|eot|otf|svg)(\?(.*))?'\)/g;
  const regexpProd = /url\(([^;\)]*)\.(ttf|woff2?|eot|otf|svg)(\?(.*))?\)/g;
  class OutputFontPlugin {
    apply(compiler) {
      compiler.hooks.compilation.tap("outputFont", (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "outputFont",
            stage: webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_INLINE,
          },
          (assets) => {
            for (let key in assets) {
              if (/\.(ttf|woff2?|eot|otf)$/.test(key) && !set.has(key)) {
                let path = "assets/mfe1/" + key;
                assets[path] = assets[key];
                set.add(path);
              }

              if (/(app.component.css)$/.test(key)) {
                let regexp =
                  compilation.options.mode === "production"
                    ? regexpProd
                    : regexpDev;

                if (assets[key]._value) {
                  let _value = assets[key]._value;
                  regexp.test(_value);
                  let temp = _value.replace(regexp, `url('assets/mfe1/$1.$2')`);
                  assets[key]._value = temp;
                } else {
                  let _value = assets[key]._valueAsBuffer.toString();
                  regexp.test(_value);
                  let temp = _value.replace(regexp, `url('assets/mfe1/$1.$2')`);
                  assets[key]._valueAsBuffer = Buffer.from(temp);
                }
              }
            }
          }
        );
      });
    }
  }

    plugins: [
      new OutputFontPlugin(),
      ... // 其余插件代码
    ],
  ```

# 4. 验证答案

### 可以看出，main 项目中，mfe1 的图标已经成功展现了，字体图标库也成功获取了

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-font.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-font2.png)
