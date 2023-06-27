import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "Darkeering",
  description: "Just playing around",
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "darkeering",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/vuepress-reco/vuepress-theme-reco-next",
    docsBranch: "main",
    docsDir: "example",
    lastUpdatedText: "",
    catalogTitle: '导航',
    // autoSetSeries: true,
    displayAllHeaders: false,
    // series 为原 sidebar
    series: {
      "/": [
        {
          text: "Module Federation",
          collapsable: true,
          children: [
            {
              text: '创建基础环境',
              link: "/docs/module-federation/create-env"
            },
            {
              text: '路由问题',
              link: "/docs/module-federation/router-issue"
            },
            {
              text: '拦截器问题',
              link: "/docs/module-federation/interceptor-issue"
            },
            {
              text: '样式问题',
              link: "/docs/module-federation/style-issue"
            },
            {
              text: '字体图标问题',
              link: "/docs/module-federation/font-issue"
            },
          ]
        },
        {
          text: "JS",
          collapsable: true,
          children: [
            {
              text: '手写简易深拷贝',
              link: "/docs/js/deep-clone"
            },
            {
              text: '链式调用',
              link: "/docs/js/chained-calls"
            },
            {
              text: '手写简易Promise',
              link: "/docs/js/promise"
            },
          ]

        },
        {
          text: "React",
          collapsable: true,
          children: [
            {
              text: 'React 类似 Angular service 的状态管理',
              link: "/docs/react/hooks-context-state"
            },
          ]

        },
        {
          text: "Http",
          collapsable: true,
          children: [
            {
              text: 'https 通过nginx完成双向认证转发',
              link: "/docs/http/nginx-certificate"
            },
          ]

        },
        {
          text: "qiankun",
          collapsable: true,
          children: [
            {
              text: 'qiankun 基座应用',
              link: "/docs/qiankun/qiankun-base"
            },
            {
              text: 'qiankun angular子应用',
              link: "/docs/qiankun/qiankun-ng-child"
            },
            {
              text: 'qiankun react子应用',
              link: "/docs/qiankun/qiankun-rc-child"
            },
          ]

        },
        {
          text: "其他",
          collapsable: true,
          children: [
            {
              text: 'vscode的终端设置成gitbash',
              link: "/docs/other/vscode-gitbash"
            },
          ]

        },
      ],
    },
    navbar: [
      { text: "主页", link: "/" },
      {
        text: "文章",
        link: "/docs/module-federation/create-env",
        // children: [
        //   { text: "前端", link: "/docs/front-end/" },
        //   { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
        // ],
      },
      { icon: 'LogoGithub', link: 'https://github.com/darkeering' },
      // { text: "Tags", link: "/tags/tag1/1/" },
    ],
    // bulletin: {
    //   body: [
    //     {
    //       type: "text",
    //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "QQ 群",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li>QQ群1：1037296104</li>
    //         <li>QQ群2：1061561395</li>
    //         <li>QQ群3：962687802</li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "GitHub",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "buttongroup",
    //       children: [
    //         {
    //           text: "打赏",
    //           link: "/docs/others/donate.html",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // commentConfig: {
    //   type: 'valie',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
