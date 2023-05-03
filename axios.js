// npm 安装 axios 命令：npm install axios -s
// yarn 安装 axios 命令：yarn add axios -s

import axios from 'axios'

// 创建axios实例
const http = axios.create({
    // 请求头配置 token
    headers: {
        'token': localStorage.getItem('token') || ''
    },
    // 基础路径
    baseURL: basePath,
    // 请求连接超时设置
    timeout: 2 * 60 * 1000,
    // 表示跨域请求时是否需要使用凭证，开启后，后端服务器要设置允许开启
    withCredentials: true,
})


// request 请求拦截器
http.interceptors.request.use(
    config => {
        // 发起请求时，重新获取最新的token，这一步有时很重要，因为创建 axios 实例的时候，
        // 获取到的 token 未必是有效的，或说未必能获取到
        const token = localStorage.getItem('token')

        // 特殊配置：设置下载获取 excel 接口的返回值为 blob。这在异步下载文件时有时会显得很有用。
        if (config.url === '/api/excel/download') {
            config.responseType = 'blob'
        }

        // 特殊配置：登录接口，将 请求的头的 token 设置为空字符串
        if (config.url === '/author/login') {
            config.headers['token'] = ''
        } else {
            config.headers['token'] = token || ''
        }

        return config
    },
    error => {
        console.warn(error)
        return Promise.reject(error)
    }
)

// response 响应拦截器
http.interceptors.response.use(
    response => {
        const res = response.data

        // 特殊配置：code为 -10086，表示资源不存在，跳转到提示页（404）
        if (res.code === -10086) {
            router.push({
                name: 'ErrorPage',
                query: { type: '404' }
            }).then()
            return res
        }

        // 特殊配置：-12306，无权限，跳转到提示页
        if (res.code === -12306) {
            router.push({
                name: 'ErrorPage',
                query: { type: 'authority' }
            }).then()
            return res
        }

        // code === -12345，token失效，跳转到登录页重新登陆
        if (res.code === -12345) {
            /* // 一个特殊功能：访问一个地址没权限，记录下该地址，登录获取后可以重定向到该地址
            let currentUrl = window.location.href
            const index = currentUrl.indexOf('#')
            const str = currentUrl.substr(index + 1, 6)
            // 如当前页不是登录页则跳转到登录页并缓存当前页地址
            if (str !== '/Login') {
              localStorage.setItem('currentUrl', window.location.href)
              router.push({ name: 'Login' }).then()
            } */

            router.push({ name: 'Login' }).then()
            return res
        }

        // 特殊配置：异步下载文件中有用，一般用不上，导出 word、excel 文件接口
        // 注意此时返回的是完整的 response，开放更多信息便于处理下载过程
        const url = response.config.url
        if (url === '/api/word/download' || url === '/api/excel/download') {
            response.headers.responseType = 'blob'
            return response
        }

        // 前后端约定 code 为100表示接口正常响应，取相反值则表示此时接口非正常响应，
        // 此时，统一开启接口返回的业务类型的错误提示，这样就不用在每个接口都处理，
        // 例如账号密错误时，自动捕获接口返回的业务类型的“错误”提示。注意这是业务类型的“错误”，不是bug。
        if (res.code !== 100) {
            Message({
                message: res.message || '服务器开小差啦，请稍后重试',
                type: 'error',
                duration: 3 * 1000
            })

            // 直接reject有时非常有用，统一拦截，这时，调用接口的回调.then()不会在执行，
            // 而是改为执行.catch()，这样做的好处是我们无需考虑在具体的每一个接口中
            // 的.then()是否是正常响应，只接受正常响应的 code 为 100 的。非100不进入.then()
            // 当然这对后端按约定编写接口有较高的要求，也有弊端，就是非100无法在.then()中接收到。
            // return Promise.reject(res.message)

            return res
        } else {
            return res
        }
    },
    error => {
        /* // 特殊处理：拦截更改提示信息
        if (error.message.indexOf('timeout') > -1) {
          error.message = '请求超时'
        }
        if (error.message.indexOf('Network') > -1) {
          error.message = '网络错误'
        } */

        /* // 特殊处理：禁止短时间内多次弹出提示，遗憾的是效果不理想，后续测验优化
        // 1000毫秒内最多只展示一次报错信息
        clearTimeout(timeout)
        timeout = setTimeout(() => {
          Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
          })
        }, 1000) */

        Message({
            message: error.message,
            type: 'error',
            duration: 3 * 1000
        })

        return Promise.reject(error)
    }
)


/**
 * get 请求
 * @param {*} url 接口路径
 * @param {*} params 接口参数
 * @returns {Promise<unknown>}
 */
const get = (url, param = {}) => {
    let params = {
        params: param,
    }
    return new Promise((resolve, reject) => {
        http
            .get(`${url}`, params)
            .then(
                (results) => {
                    resolve(results.data)
                },
                (error) => {
                    reject(error)
                }
            ).catch((error) => {
                console.error(error)
                reject(error)
            })
    })
}


/**
 * post 请求
 * @param {*} url 接口路径
 * @param {*} params 接口参数
 * @returns {Promise<unknown>}
 */
const post = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        http({
            method: 'post',
            url: url,
            data: params,
            headers: {
                Accept: 'application/josn',
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(
                (results) => {
                    resolve(results.data)
                }
            ).catch((error) => {
                reject(error)
            })
    })
}


/**
 * put 请求
 * @param {*} url 接口路径
 * @param {*} params 接口参数
 * @returns {Promise<unknown>}
 */
const put = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        http({
            method: 'put',
            url: url,
            data: params,
            headers: {
                Accept: 'application/josn',
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(
                (results) => {
                    resolve(results.data)
                },
                (error) => {
                    reject(error)
                }
            )
    })
}


/**
 * delete 请求
 * @param {*} url 接口路径
 * @param {*} params 接口参数
 * @returns {Promise<unknown>}
 */
const deleteJson = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        http({
            method: 'delete',
            url: url,
            data: params,
            headers: {
                Accept: 'application/josn',
                "Content-Type": "application/json; charset=utf-8",
            }
        })
            .then(
                (results) => {
                    resolve(results.data)
                },
                (error) => {
                    reject(error)
                }
            )
    })
}


/**
 * Multipart post 请求 常用于文件上传
 * @param {*} url 接口路径
 * @param {*} params 接口参数
 * @returns {Promise<unknown>}
 */
const postMultipart = (url, params = {}) => {
    return new Promise((resolve, reject) => {
        http({
            method: 'post',
            url: url,
            data: params,
            headers: {
                Accept: 'application/josn',
                "Content-Type": 'multipart/form-data;boundary=' + new Data().getItem(),
            }
        })
            .then(
                (results) => {
                    resolve(results.data)
                },
                (error) => {
                    reject(error)
                }
            )
    })
}