---
title: interceptor-issue
date: 2023-03-04 18:10:03
tags: [微前端, module federation, angular]
---

> 当在 main 项目中调用 mfe1 项目的 http 请求时，没有走 main 项目的拦截器，而还是走的 mfe1 自己的拦截器

# 1. 创建环境

- 分别在两个项目中创建一个拦截器，并使用

  ```typescript
  ng g interceptor interceptor/req-res --project main
  ng g interceptor interceptor/req-res --project mfe1

  /*
  * 两个项目的 interceptor，并打上log
  */
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log('main request');

    return next.handle(request).pipe(
      map((event) => {
        if (!(event instanceof HttpResponse)) return event;
        console.log('main response');
        return event;
      })
    );
  }

  /*
  * 两个项目的 AppModule
  */
  const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: ReqResInterceptor, multi: true },
  ]
  providers: [
    httpInterceptorProviders
  ],
  ```

# 2. 试验问题

- 在两个项目中分别调用 http 请求，**这个服务端用 express 简易搭一个就行，然后在 main 项目中用 proxy.conf.json 进行代理**，从下图可以看出，在 main 项目中调用 mfe1 中的请求，并没有经过 main 项目的拦截器，而是经过自己的拦截器

  ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-interceptor.png)

- 当我们把 mfe1 自己的拦截器给注释掉，我们可以从下图中看出，mfe1 的请求就会走 main 的拦截器

  ```typescript
  providers: [
    // httpInterceptorProviders
  ],
  ```

  ![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/before-interceptor2.png)

> 以此，我们得出结论，子项目有拦截器就走子项目，没有就走主项目，一层一层往外找

# 3. 解决问题

```typescript
{
  path: 'mfe1',
  loadChildren: () =>
    loadRemoteModule({
      type: 'module',
      remoteEntry: 'http://localhost:9001/remoteEntry.js',
      exposedModule: './AppModule',
    }).then((m) => {
      const appModuleProviders = m.AppModule.ɵinj.providers
      appModuleProviders.unshift(httpInterceptorProviders)
      return this.loadRemoteRootModule(m);
    }),
},
```

# 4. 验证答案

### 从下图中可以看到，我们的代码已经生效，先走 main 的拦截器，再走 mfe1 的拦截器

![Alt text](https://cdn.jsdelivr.net/gh/darkeering/CDN@0.2/blog/module-federation/after-interceptor.png)
