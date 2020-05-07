import axios from "axios";
import ElementUI from "element-ui";
import router from "vue-router";
import { getToKen, getUserName } from "@/utils/app";
// { Message, MessageBox }
function errorCreate(msg) {
  ElementUI.Message({
    message: msg,
    type: "error"
  });
}

//创建axios 赋值给变量
const BASEURL = process.env.NODE_ENV === "production" ? "" : "/devApi";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 50000,
  headers: { "content-type": "application/json", Accept: "application/json" }
});
/**
 * 请求拦截器
 */
service.interceptors.request.use(
  /**
   * 发送请求前添加
   */
  config => {
    config.headers["Tokey"] = getToKen();
    config.headers["UserName"] = getUserName();
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => {
    const { status } = response;
    if (response.data.resCode !== 0) {
      ElementUI.Message.error(response.data.message);
      return false;
    }
    if (status === undefined) {
      return response;
    } else {
      switch (status) {
        case 200:
          return response;
        case 203:
          errorCreate(response.data.message);
          break;
        default:
          errorCreate(`${response.data.message}`);
          break;
      }
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          // error.message = `未授权，请登录: ${error.response.config.url}`;
          // 跳转路由
          ElementUI.MessageBox({
            title: "未授权",
            message: "未授权，请登录",
            type: "warning"
          })
            .then(() => {
              router.push({ name: "login" });
            })
            .catch(() => {
              router.push({ name: "login" });
            });
          return;
        case 403:
          error.message = "拒绝访问";
          ElementUI.MessageBox({
            title: "拒绝访问",
            message: "没有权限访问",
            type: "warning"
          })
            .then(() => {
              router.push({ name: "login" });
            })
            .catch(() => {
              router.push({ name: "login" });
            });
          return;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
    }
    console.log(error.response);
    errorCreate(error);
    return Promise.reject(error);
  }
);
export default service;
