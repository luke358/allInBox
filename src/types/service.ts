import { Ref, ReservedProps, WebViewHTMLAttributes } from "vue";

type ElectronWebView = (WebViewHTMLAttributes & ReservedProps);

export type Service = {
  id: string
  name: string
  url: string
  iconUrl: string
  _webview: ElectronWebView | null

  timer: NodeJS.Timeout | null
  lastUsed: number
  lastHibernated: number

  isActive: boolean
  isMuted: boolean
  isFirstLoad: boolean
  isError: boolean
  isLoading: boolean

  team: string
}

export type ServiceStore = {
  allServices: Service[]
}