import { ElectronWebView, IService } from "@/types";
import { Recipe } from "@/types/recipe";

export default class Service {
  recipe: Recipe
  isMediaPlaying = false
  id: string
  preload: boolean = false
  lastUsed: number
  lastHibernated: number | null
  isActive: boolean = false
  name: string
  hasCrashed = false
  isLoading = true
  isError = false
  isFirstLoad = true
  errorMessage: string = ''
  isHibernationEnabled = false
  _webview: ElectronWebView | null = null

  constructor(data: IService, recipe: Recipe) {
    if (!data) {
      throw new Error('Service config not valid');
    }

    if (!recipe) {
      throw new Error('Service recipe not valid');
    }

    this.id = data.id
    this.name = data.name
    this.preload = data.preload
    this.lastUsed = Date.now()
    this.lastHibernated = null
    this.isActive = false

    /**
     url: 'https://discord.com/app',
    preload: true,
    name: 'Discord',
    _webview: undefined,
    lastUsed: Date.now(),
    lastHibernated: null,
    isActive: false,
    timer: null,
    isMuted: false,
    id: nanoid(),
    serviceId: 'discord',
    iconUrl: 'xxx',
    isFirstLoad: true,
    isError: false,
    isLoading: true,
    enable: true,
    isNotificationEnabled: true,
    isSoundsEnabled: true,
    isShowNameInTabEnabled: true,
    isHibernateEnabled: false,
    isHibernating: false,
    isMediaPlaying: false,
    sorted: 0,

    isUnreadInTabEnabled: true,
    isUnreadInGlobalEnabled: true,
    linkHandling: LinkHandling.Default,
    timestamp: Date.now(),
     */
    
    this.recipe = recipe
  }

  get canHibernate(): boolean {
    return this.isHibernationEnabled && !this.isMediaPlaying;
  }

  get webview(): ElectronWebView | null {
    return this._webview;
  }

  set webview(webview) {
    this._webview = webview;
  }

  // initializeWebViewEvents({ handleIPCMessage, openWindow, stores }): viod {
  //   this.webview?.addEventListener('ipc-message', async e => {
  //     if (e.channel === 'inject-js-unsafe') {
  //       await Promise.all(
  //         e.args.map(script =>
  //           this.webview?.executeJavaScript(
  //             `"use strict"; (() => { ${script} })();`,
  //           ),
  //         ),
  //       );
  //     } else {
  //       handleIPCMessage({
  //         serviceId: this.id,
  //         channel: e.channel,
  //         args: e.args,
  //       });
  //     }
  //   });
  // }

  _initializeServiceRecipeInWebview(serviceId: string) {
    // const service = this.one(serviceId);
    // if (service && service._webview) {
    // service._webview.send('initialize-recipe', {
    //   version: '1.1'
    // }, service.recipe)
    // }
  }

  _didStartLoading(): void {
    this.hasCrashed = false;
    this.isLoading = true;
    this.isError = false;
  }

  _didStopLoading(): void {
    this.isLoading = false;
  }

  _didFailLoad(event: { errorDescription: string }): void {
    this.isError = false;
    this.errorMessage = event.errorDescription;
    this.isLoading = false;
  }

  _hasCrashed(): void {
    this.hasCrashed = true;
  }

  _didLoad(): void {
    this.isLoading = false;

    if (!this.isError) {
      this.isFirstLoad = false;
    }
  }


  _didMediaPlaying(): void {
    this.isMediaPlaying = true;
  }

  _didMediaPaused(): void {
    this.isMediaPlaying = false;
  }
}
