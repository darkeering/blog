---
title: router-issue
date: 2023-03-10 00:15:00
---

> 在 main 项目中，mfe1 项目的路由跳转，走的还是 main 项目的路由，由于没有 mfe1 的路由前缀，所以路由跳转是失败的

# 1. 创建环境

- 在之前的 mfe1 项目中已经加了 test.component 组件

```typescript
/*
* mfe1
* app-routing.component.ts
*/
const routes: Routes = [
  {
    path: 'test',
    component: TestComponent
  }
];
/*
* mfe1
* app-routing.component.html
*/
<p>mfe1 app works!</p>
<button routerLink="/test">navigate to test</button>

<router-outlet></router-outlet>
```

# 2. 试验问题

下面两图是，在 main 项目中点击 mfe1 项目的路由跳转，前后情况对比，可以很明显看出来，路由并不好用
![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-router.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-router2.png)

# 3. 解决问题

```typescript
/*
* mfe1
* app.module.ts
*/
export class AppModule {
  static _router: any;
  constructor(private router: Router) {
    AppModule._router = this.router
  }
}
/*
* main
* app.component.ts
*/
{
  path: 'mfe1',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:9001/remoteEntry.js',
      exposedModule: './AppModule',
    }).then((m) => this.loadRemoteRootModule(m, 'mfe1')),
},

loadRemoteRootModule(m: any, prefix: string) {
  // 新增
  setTimeout(() => {
    (m.AppModule._router as Router).events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((res) => {
        console.log(res);
        const url = res.url === '/' ? '' : res.url
        this.router.navigateByUrl(`/${prefix}${url}`)
      });
  });

  // 原来的代码
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

# 4. 验证答案

### 从下图可以看出，我们的代码已经生效了，点击 跳转 test，路由也变了，test 组件也显示出来了

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-router.png) ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-router2.png)
