// 在http.js中引入axios
import axios from 'axios' // 引入axios
// import QS from 'qs' // 引入qs模块，用来序列化post类型的数据，后面会提到
// vant的toast提示框组件，大家可根据自己的ui组件更改。
// import { Toast } from 'vant'

/**
 *  响应拦截
 */

axios.interceptors.response.use(
  success => {
    // console.log('返回接口数据', success)
    if (success.status !== 200) return Promise.reject(success.data)
    // if (success.data['Code'] !== '1101') return Promise.reject(success.data)
    return Promise.resolve(success.data)
  },
  error => {
    let timeoutMessage = `请求错误，请稍后重试.`
    if (error.status) timeoutMessage = `${timeoutMessage} 错误码：${error.status}`
    return Promise.reject(timeoutMessage)
  }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get (url, params) { // 暴露get出去
  // params.rand = Math.random()
  return axios.get(url, { params }).then(checkCode)
};

/**
 * get方法，下载数据流对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function getExport (url) { // 暴露get出去
  window.location.href = url
};

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
*/
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

export function post (url, data = {}) { // 暴露post出去
  // post请求头
  return axios.post(url, data).then(checkCode)
};

export function postFormData (url, formData) {
  if (!url) return
  return axios({
    method: 'post',
    url,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  }).then(checkCode)
}
function checkCode (data) {
  if (!data) {
    return Promise.reject(new Error('数据异常')).catch((e) => {
      console.error(e)
    })
  } else {
    if (data.code === -1) {
      return Promise.reject(data).catch((e) => {
        console.error(e)
        return data
      })
    }
    return data
  }
}
