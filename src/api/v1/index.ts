import type { Service } from '../../types'
import { request } from '../axios'

// app
export const getServiceList = (payload?: any) => request.get<Service[]>('/app/list', payload)

// user-app
export const saveUserService = (payload: any) => request.post<Service>('/user-app/add', payload)
export const getUserServiceListByUser = () => request.post<any[]>('/user-app/list-user')
