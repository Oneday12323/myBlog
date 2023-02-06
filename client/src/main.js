import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import naive from "naive-ui";

import { createDiscreteApi } from "naive-ui";
import { createPinia } from "pinia";
import { router } from "./common/router";
import axios from "axios";
import { AdminStore } from "./stores/AdminStore";

/**
 * axios
 * pinia
 * sass
 * vue-router
 * naive-ui
 * wangeditor --富文本
 */
//category/list
axios.defaults.baseURL = "http://localhost:8080"; //配置服务端地址
const { message, notification, dialog } = createDiscreteApi([
  "message",
  "dialog",
  "notification",
]);
const app = createApp(App);
app.provide("axios", axios); //provide 依赖注入 让全局都能使用axios
app.provide("server_url", axios.defaults.baseURL);

app.provide("message", message);
app.provide("dialog", dialog);
app.provide("notification", notification);

app.use(naive);
app.use(createPinia());

const adminStore = AdminStore();
axios.interceptors.request.use((config) => {
  config.headers.token = adminStore.token;
  return config;
});

app.use(router);
app.mount("#app");
