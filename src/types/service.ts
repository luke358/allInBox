import type { ReservedProps, WebViewHTMLAttributes } from 'vue'

export type ElectronWebView = (WebViewHTMLAttributes & ReservedProps)

export interface Service {
  id: string
  name: string
  url: string
  iconUrl: string
  _webview: ElectronWebView | undefined

  // startup 强制加载
  preload: boolean
  timer: NodeJS.Timeout | null
  lastUsed: number
  lastHibernated: number

  isActive: boolean
  isMuted: boolean
  isFirstLoad: boolean
  isError: boolean
  isLoading: boolean

  team?: string
}

export interface ServiceStore {
  allServices: Service[]
}
