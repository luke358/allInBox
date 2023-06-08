import type { AxiosError, AxiosResponse } from 'axios'
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

export type RespType<T = any> = Promise<{ data: T; _success: boolean }>
export const request = createBaseInstance()

// 通用的axios实例
function createBaseInstance() {
  const instance = axios.create({ baseURL: '/v1' })
  instance.interceptors.response.use(handleResponse, handleError)
  return instance
}

function handleError(e: AxiosError) {
  // confirm(e.message, '出错啦~')
  ElMessageBox.alert('This is a message', 'Title', {
    confirmButtonText: 'OK',
    callback: () => {
      ElMessage({
        type: 'error',
        message: `${e.message}`,
      })
    },
  })
  throw e
}

function handleResponse(response: AxiosResponse) {
  if (response.data.code !== 200) {
    ElMessageBox.alert('This is a message', 'Title', {
      confirmButtonText: 'OK',
      callback: () => {
        ElMessage({
          type: 'error',
          message: `${response.data.message}`,
        })
      },
    })
    return Promise.reject(response.data)
  }
  // response.data._success = true
  return response.data.data
}
