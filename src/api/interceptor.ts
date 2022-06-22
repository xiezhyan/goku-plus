import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Message, Modal } from '@arco-design/web-vue';
import { useUserStore } from '@/store';
import { getToken, getTokenName } from '@/utils/auth';

interface Meta {
  success: boolean;
  message: string;
  code: number
}

export interface R<T = unknown> {
  meta: Meta;
  data?: T;
}

if (import.meta.env.VITE_API_BASE_URL) {
  axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL;
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    const tokenName = getTokenName() || "token";
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers[tokenName] = token;
    }
    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);
// add response interceptors
axios.interceptors.response.use(
  (response: AxiosResponse<R>) => {
    const { data, status, statusText } = response
    if (status != 200) {
      Message.error({
        content: `出现异常信息, 异常代码:${status}, 异常说明:${statusText}`,
        duration: 2000
      });
      return null;
    }

    const meta = data.meta;
    if (meta.code === 200) {
      return data.data;
    }

    switch (meta.code) {
      case 1000:  // 没有传入Token
      case 1001:  // Token过期
        // response.config.url
        Modal.error({
          title: '重新登录',
          content:
            '您已登出，您可以取消留在此页面，或重新登录',
          okText: '重新登录',
          async onOk() {
            const userStore = useUserStore();

            await userStore.logout();
            window.location.reload();
          },
        });
        break;
      default:
        Message.error({
          content: `出现异常信息, 异常代码:${meta.code}, 异常说明:【${meta.message}】`,
          duration: 2000
        })
        break
    }
    return Promise.reject(new Error(meta.message || 'Error'));
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 2000,
    });
    return Promise.reject(error);
  }
);
