import { ElectronWebView } from "./service"

export interface Recipe {
  id: string
  serviceId: string
  name: string
  url: string
  iconUrl: string
  _webview: ElectronWebView | undefined

  enable: boolean
  isNotificationEnabled: boolean
  isSoundsEnabled: boolean
  isShowNameInTabEnabled: boolean
  isHibernateEnabled: boolean
  isHibernating: boolean

  isUnreadInTabEnabled: boolean
  isUnreadInGlobalEnabled: boolean
  // startup 强制加载
  preload: boolean
  timer: number | null
  lastUsed: number
  lastHibernated: number | null

  isActive: boolean
  isMuted: boolean
  isFirstLoad: boolean
  isError: boolean
  isLoading: boolean
  isMediaPlaying: boolean

  team?: string

  isCustom?: boolean
  sorted: number
  timestamp: number
}

export interface RecipeStore {
  allRecipes: Recipe[]
}
