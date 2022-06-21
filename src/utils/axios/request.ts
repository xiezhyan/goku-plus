import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Message } from '@arco-design/web-vue';
import storage from 'store';
import { TOKEN_NAME, TOKEN_VALUE } from '@/store/modules/user/types'

//  process.env.VITE_API_BASE_URL
const baseURL = import.meta.env.VITE_API_BASE_URL

class HttpRequest {
    private readonly baseUrl: string;
    constructor() {
        this.baseUrl = baseURL;
    }
    getInsideConfig() {
        const config = {
            baseURL: this.baseUrl,
            timeout: 4000,
            headers: {}
        }
        return config
    }

    // 请求拦截
    interceptors(instance: AxiosInstance, url: string | number | undefined) {
        instance.interceptors.request.use(config => {
            const token:string = storage.get(TOKEN_VALUE);
            const tokenName:string = storage.get(TOKEN_NAME) || "token";
            if(token) {
                if(config && config.headers) {
                    config.headers[tokenName] = token;
                }
            }
            return config
        }, (error: any) => {
            console.error("request interceptors is error, error msg = ", error)
            return Promise.reject(error)
        })
        //响应拦截
        instance.interceptors.response.use(res => {
            //返回数据
            const { data, status, statusText } = res
            if (status != 200) {
                Message.error({
                    content: `出现异常信息, 异常代码:${status}, 异常说明:${statusText}`,
                    duration: 2
                });
                return null;
            }
            const { R } = data.data
            if (R.meta.code === 200) {
                return R.data;
            }

            switch (R.meta.code) {
                default:
                    Message.error({
                        content: `出现异常信息, 异常代码:${R.meta.code}, 异常说明:【${R.meta.message}】`,
                        duration: 2
                    })
                    break
            }

            return R.data;
        }, (error: any) => {
            console.error("request response is error, error msg = ", error)
            return Promise.reject(error)
        })
    }

    request(options: AxiosRequestConfig) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}

const http = new HttpRequest()
export default http