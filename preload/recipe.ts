import { join } from 'node:path';
import { contextBridge, ipcRenderer } from 'electron';
import BadgeHandler from './badge';

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

  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
  }

  loadRecipeModule(_event, config, recipe) {
    const modulePath = join(recipe.path, 'webview.js');
    // debug('module path', modulePath);
    // Delete module from cache
    delete require.cache[require.resolve(modulePath)];
    try {
      // this.recipe = new RecipeWebview(
      //   badgeHandler,
      //   dialogTitleHandler,
      //   notificationsHandler,
      //   sessionHandler,
      // );
      // if (existsSync(modulePath)) {
      //   require(modulePath)(this.recipe, { ...config, recipe });
      //   debug('Initialize Recipe', config, recipe);
      // }

      // this.settings.service = Object.assign(config, { recipe });

      // Make sure to update the WebView, otherwise the custom darkmode handler may not be used
      // this.update();
    } catch (error) {
      console.error('Recipe initialization failed', error);
    }

    // this.loadUserFiles(recipe, config);
  }
}

new RecipeController();
