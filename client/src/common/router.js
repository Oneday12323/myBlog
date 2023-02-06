import { createRouter, createWebHashHistory } from "vue-router";

//定义路由
let routes = [
  {
    path: "/test",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/dashboard",
    component: () => import("../views/dashboard/Dashboard.vue"),
    children: [
      {
        path: "/dashboard/category",
        component: () => import("../views/dashboard/Category.vue"),
      },
      {
        path: "/dashboard/article",
        component: () => import("../views/dashboard/Article.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

//对外暴露路由
export { router, routes };
