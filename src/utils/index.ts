import { nanoid } from 'nanoid'
import type { Service } from '../types'
import { LinkHandling } from '../types'

export function getDomain(sourceUrl: string | undefined) {
  if (!sourceUrl)
    return sourceUrl
  const url = new URL(sourceUrl)
  const domain = url.hostname.split('.').slice(-2).join('.')
  return domain
}

export function createInitialService(isCustom = true): Service {
  const initialService: Service = {
    url: '',
    preload: false,
    name: 'Custom app',
    _webview: undefined,
    lastUsed: Date.now(),
    lastHibernated: Date.now(),
    isActive: false,
    isMuted: false,
    id: nanoid(),
    serviceId: nanoid(),
    iconUrl: 'xxx',

    enable: true,
    isNotificationEnabled: true,
    isSoundsEnabled: true,
    isShowNameInTabEnabled: true,
    isHibernateEnabled: false,
    isHibernating: false,

    // load config
    isMediaPlaying: false,
    isFirstLoad: true,
    isError: false,
    isLoading: true,

    isUnreadInTabEnabled: true,
    isUnreadInGlobalEnabled: true,
    linkHandling: LinkHandling.Default,

    timer: 15,
    isCustom,
    sorted: 0,
    timestamp: Date.now(),

    recipeId: 'unknown'
  }
  return initialService
}

export const loadConfig = {
  isMediaPlaying: false,
  isFirstLoad: true,
  isError: false,
  isLoading: true,
  isActive: false,
}
