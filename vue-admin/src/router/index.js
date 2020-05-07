import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import Layout from "@/views/Layout";

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "login",
    hidden: true,
    component: () => import("../views/Login"),
    meta: {
      name: "登录"
    }
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台"
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        meta: {
          name: "首页"
        },
        component: () => import("../views/Console")
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    // redirect: "index",
    meta: {
      name: "信息管理"
    },
    component: Layout,
    children: [
      {
        path: "/infoindex",
        name: "infoIndex",
        meta: {
          name: "信息列表"
        },
        component: () => import("../views/Info")
      },
      {
        path: "/infocategory",
        name: "infoCategory",
        meta: {
          name: "信息分类"
        },
        component: () => import("../views/Info/category")
      }
    ]
  },
  {
    path: "/user",
    name: "User",
    // redirect: "index",
    meta: {
      name: "用户管理"
    },
    component: Layout,
    children: [
      {
        path: "/userindex",
        name: "UserIndex",
        meta: {
          name: "用户信息"
        },
        component: () => import("../views/User")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
