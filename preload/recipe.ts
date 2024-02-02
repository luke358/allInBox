import { join } from 'node:path';
import { contextBridge, ipcRenderer } from 'electron';
import BadgeHandler from './badge';
import RecipeWebview from './RecipeWebview';
import { existsSync } from 'fs-extra';

const noop = () => { }

// window.chrome.runtime.sendMessage = noop
const badgeHandler = new BadgeHandler();

contextBridge.exposeInMainWorld('API', {
  open: window.open,
  setBadge: (direct, indirect) => badgeHandler.setBadge(direct, indirect),
  safeParseInt: text => badgeHandler.safeParseInt(text),
  // setDialogTitle: title => dialogTitleHandler.setDialogTitle(title),
  // displayNotification: (title, options) =>
  //   notificationsHandler.displayNotification(title, options),
  // getDisplayMediaSelector,
});

class RecipeController {
  ipcEvents = {
    'initialize-recipe': 'loadRecipeModule',
    'find-in-page': 'openFindInPage',
  }
  recipe: RecipeWebview | null = null;

  constructor() {
    this.initialize();
  }

  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
    setTimeout(() => {
      ipcRenderer.sendToHost('hello')
    }, 100);

  }

  loadRecipeModule(_event, config, recipe) {
    const modulePath = join(recipe.path, 'webview.js');
    // Delete module from cache
    delete require.cache[require.resolve(modulePath)];
    console.log(modulePath, 'modulePath')
    try {
      this.recipe = new RecipeWebview(
        badgeHandler,
        // dialogTitleHandler,
        // notificationsHandler,
        // sessionHandler,
      );
      if (existsSync(modulePath)) {
        require(modulePath)(this.recipe, { ...config, recipe });
      }

      // this.settings.service = Object.assign(config, { recipe });

      // Make sure to update the WebView, otherwise the custom darkmode handler may not be used
      // this.update();
    } catch (error) {
      console.error('Recipe initialization failed', error);
    }

    // this.loadUserFiles(recipe, config);
  }
}

console.log('new RecipeController();')
new RecipeController();
