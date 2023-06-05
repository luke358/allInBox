export type ElectronWebView = Electron.WebviewTag

export enum LinkHandling {
  'Default' = 0,
  'Block all pop-ups' = 1,
  'Open all in pop-ups' = 2,
  'Open all in default browser' = 3,
  'Open all in tabs' = 4,
}
export interface Service {
  id: string
  name: string
  url: string
  iconUrl: string
  _webview: ElectronWebView | undefined

  enable: boolean
  isNotificationEnabled: boolean
  isSoundsEnabled: boolean
  isShowNameInTabEnabled: boolean
  isHibernateEnabled: boolean

  isUnreadInTabEnabled: boolean
  isUnreadInGlobalEnabled: boolean
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

  linkHandling: LinkHandling
  team?: string
}

export interface ServiceStore {
  allServices: Service[]
}
