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

export function createInitialService() {
  const initialService: Service = {
    url: '',
    preload: false,
    name: 'Custom app',
    _webview: undefined,
    lastUsed: Date.now(),
    lastHibernated: Date.now(),
    isActive: false,
    timer: null,
    isMuted: false,
    id: nanoid(),
    iconUrl: 'xxx',
    isFirstLoad: true,
    isError: false,
    isLoading: true,
    enable: true,
    isNotificationEnabled: true,
    isSoundsEnabled: true,
    isShowNameInTabEnabled: true,
    isHibernateEnabled: false,

    isUnreadInTabEnabled: true,
    isUnreadInGlobalEnabled: true,
    linkHandling: LinkHandling.Default,

  }
  return initialService
}
