import axios from "axios";
const baseURL = "";

function request(axiosConfig: any, customOptions?: any) {
  const service = axios.create({
    baseURL, // 设置统一的请求前缀
    timeout: 10000, // 设置统一的超时时长
  });

  // 请求拦截
  service.interceptors.request.use(
    (config: any) => {
      // token

      return config;
    },
    (error: any) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截
  service.interceptors.response.use(
    (response: any) => {
      return response.data;
    },
    (error: any) => {
      httpErrorStatusHandle(error); // 处理错误状态码
      return Promise.reject(error); // 错误继续返回给到具体页面
    }
  );

  return service(axiosConfig);
}

export default request;

/**
 * 处理异常
 * @param {*} error
 */
function httpErrorStatusHandle(error: {
  message: string | string[];
  response: { status: any };
}) {
  // 处理被取消的请求
  if (axios.isCancel(error))
    return console.error("请求的重复请求：" + error.message);
  let message = "";
  if (error && error.response) {
    switch (error.response.status) {
      case 302:
        message = "接口重定向了！";
        break;
      case 400:
        message = "参数不正确！";
        break;
      case 401:
        message = "您未登录，或者登录已经超时，请先登录！";
        break;
      case 403:
        message = "您没有权限操作！";
        break;
      case 404:
        message = "请求地址出错";
        break; // 在正确域名下
      case 408:
        message = "请求超时！";
        break;
      case 409:
        message = "系统已存在相同数据！";
        break;
      case 500:
        message = "服务器内部错误！";
        break;
      case 501:
        message = "服务未实现！";
        break;
      default:
        message = "异常问题！";
        break;
    }
  }
  if (error.message.includes("timeout")) message = "网络请求超时！";
  if (error.message.includes("Network"))
    message = window.navigator.onLine ? "服务端异常！" : "您断网了！";

  console.log(message);
}
