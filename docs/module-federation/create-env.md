---
title: 创建基础环境
date: 2018/12/15
---

> 本项目使用的 angular 是 15.2.8 版本的，npm i @angular/cli@15.2.8 -g
> 为了好演示，两个项目就放在了一个 git 仓库中，但是两个不同仓库的项目也是可以使用的，原理是一样的

# 1. 创建环境

- 创建一个没有项目的空壳子

  ```typescript
  ng new shell --create-application=false
  ```

- 进入到项目文件夹中，添加主应用和子应用 1

  ```typescript
  ng g application main
  ng g application mfe1
  ```

- 安装 `@angular-architects/module-federation`

  ```typescript
  npm i @angular-architects/module-federation@15 -D
  ```

- 初始化主项目和子项目

  ```typescript
  ng g @angular-architects/module-federation:init --project main --port 9000
  ng g @angular-architects/module-federation:init --project mfe1 --port 9001
  ```

到现在为止两个项目都创建好了，webpack 的 module federation 也都安装到两个项目中了，接下来要把 mfe1 项目的 AppModule 要暴露出来给 main 项目使用了

# 2. 把 mfe1 项目的 AppModule 暴露出来

- 配置 mf1 webpack.config.js,

  ```typescript
  /*
  * mfe1
  * webpack.config.js
  */
  name: "mfe1",
  filename: "remoteEntry.js",
  exposes: {
      './AppModule': './projects/mfe1/src/app/app.module.ts',
  },
  ```

# 3. 在 main 项目中进行配置路由

- 在 AppComponent 中使用

  ```typescript
  /*
  * main
  * app.component.html
  */
  <p>main app work!</p>
  <router-outlet></router-outlet>

  /*
  * main
  * app.component.ts
  */
  constructor(private router: Router) {
    this.router.resetConfig([
      {
        path: 'mfe1',
        loadChildren: () =>
          loadRemoteModule({
            type: 'module',
            remoteEntry: 'http://localhost:9001/remoteEntry.js',
            exposedModule: './AppModule',
          }).then((m) => this.loadRemoteRootModule(m)),
      }
    ]);
  }
  loadRemoteRootModule(m: any) {
    const appModuleImports = m.AppModule.ɵinj.imports;
    const appRoutingModule = appModuleImports.find(
      (i: any) => i.name === 'AppRoutingModule'
    );
    const appRoutingModuleImports = appRoutingModule.ɵinj.imports;
    appRoutingModuleImports[0].providers = [
      appRoutingModuleImports[0].providers[2],
    ];
    appRoutingModuleImports[0].providers[0].useValue = [
      {
        path: '',
        component: m.AppModule.ɵmod.bootstrap[0],
        children: appRoutingModuleImports[0].providers[0].useValue,
      },
    ];
    return m.AppModule;
  }
  ```

# 4. 起服务，看效果

我在 mfe1 中加了一个用来测试的路由组件，访问 http://localhost:9000/mfe1/test

```typescript
const routes: Routes = [
  {
    path: "test",
    component: TestComponent,
  },
];
```

接下来就可以看成品了，可以看出，路由生效了，并且子项目的路由很好的展现了

![原始显示](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/init-show.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/init-element.png)

# 5. 再新建一个子项目，按照同样的方式接入，看效果

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/init-show2.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/init-element2.png)