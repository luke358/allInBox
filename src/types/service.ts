import type { DebouncedFunc } from 'lodash-es'

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
  isBadgeEnabled: boolean
  isSoundsEnabled: boolean
  isShowNameInTabEnabled: boolean
  isHibernateEnabled: boolean
  isHibernating: boolean

  isUnreadInTabEnabled: boolean
  isUnreadInGlobalEnabled: boolean
  unreadDirectMessageCount: number
  unreadIndirectMessageCount: number

  // startup 强制加载
  preload: boolean
  timer: NodeJS.Timeout | null
  lastUsed: number
  lastHibernated: number | null
  lastPoll: number | null
  lastPollAnswer: number | null

  isActive: boolean
  isMuted: boolean
  isFirstLoad: boolean
  isError: boolean
  isLoading: boolean
  isMediaPlaying: boolean

  linkHandling: LinkHandling
  team?: string

  isCustom?: boolean
  sorted: number
  timestamp: number

  recipeId: string
}

export type IService = Service

export interface ServiceStore {
  allServices: Service[]
  teardown: DebouncedFunc<() => void> | null
}
