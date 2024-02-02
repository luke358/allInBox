"use strict";

// preload/recipe.ts
var import_node_path = require("node:path");
var import_electron3 = require("electron");

// preload/badge.ts
var import_electron = require("electron");
var BadgeHandler = class {
  safeParseInt(text) {
    if (text === void 0 || text === null) {
      return 0;
    }
    const parsedNumber = Number.parseInt(text.toString(), 10);
    const adjustedNumber = Number.isNaN(parsedNumber) ? 0 : parsedNumber;
    return Math.max(adjustedNumber, 0);
  }
  setBadge(direct, indirect) {
    const count = {
      direct: this.safeParseInt(direct),
      indirect: this.safeParseInt(indirect)
    };
    import_electron.ipcRenderer.sendToHost("message-counts", count);
  }
};

// preload/RecipeWebview.ts
var import_electron2 = require("electron");
var import_remote = require("@electron/remote");
var import_fs_extra = require("fs-extra");
var RecipeWebview = class {
  badgeHandler;
  dialogTitleHandler;
  notificationsHandler;
  sessionHandler;
  constructor(badgeHandler2) {
    this.badgeHandler = badgeHandler2;
    import_electron2.ipcRenderer.on("poll", () => {
      this.loopFunc();
      import_electron2.ipcRenderer.sendToHost("alive");
    });
  }
  loopFunc = () => null;
  darkModeHandler = null;
  // TODO Remove this once we implement a proper wrapper.
  get ipcRenderer() {
    return import_electron2.ipcRenderer;
  }
  // TODO Remove this once we implement a proper wrapper.
  get BrowserWindow() {
    return import_remote.BrowserWindow;
  }
  /**
   * Initialize the loop
   *
   * @param {Function}        Function that will be executed
   */
  loop(fn) {
    this.loopFunc = fn;
  }
  /**
   * Set the unread message badge
   *
   * @param {string | number | undefined | null} direct      Set the count of direct messages
   *                                                         eg. Slack direct mentions, or a
   *                                                         message to @channel
   * @param {string | number | undefined | null} indirect    Set a badge that defines there are
   *                                                         new messages but they do not involve
   *                                                         me directly to me eg. in a channel
   */
  setBadge(direct = 0, indirect = 0) {
    this.badgeHandler.setBadge(direct, indirect);
  }
  /**
   * Set the active dialog title to the app title
   *
   * @param {string | undefined | null} title                Set the active dialog title
   *                                                         to the app title
   *                                                         eg. WhatsApp contact name
   */
  setDialogTitle(title) {
    this.dialogTitleHandler.setDialogTitle(title);
  }
  /**
   * Safely parse the given text into an integer
   *
   * @param  {string | number | undefined | null} text to be parsed
   */
  safeParseInt(text) {
    return this.badgeHandler.safeParseInt(text);
  }
  /**
   * Find if link contains image
   *
   * @param  {string | number | undefined | null} text to be parsed
   */
  isImage(link) {
    if (typeof link === "undefined") {
      return false;
    }
    const { role } = link.dataset;
    if (typeof role !== "undefined") {
      const roles = ["img"];
      return roles.includes(role);
    }
    const url = link.getAttribute("href");
    const regex = /\.(jpg|jpeg|png|webp|avif|gif|svg)($|\?|:)/;
    return regex.test(url.split(/[#?]/)[0]);
  }
  /**
   * Injects the contents of a CSS file into the current webview
   *
   * @param {Array} files     CSS files that should be injected. This must
   *                          be an absolute path to the file
   */
  injectCSS(...files) {
    files.forEach((file) => {
      if ((0, import_fs_extra.pathExistsSync)(file)) {
        const styles = document.createElement("style");
        styles.innerHTML = (0, import_fs_extra.readFileSync)(file, "utf8");
        const head = document.querySelector("head");
        if (head) {
          head.append(styles);
        }
      }
    });
  }
  injectJSUnsafe(...files) {
    Promise.all(
      files.map((file) => {
        if ((0, import_fs_extra.existsSync)(file)) {
          return (0, import_fs_extra.readFileSync)(file, "utf8");
        }
        return null;
      })
    ).then((scripts) => {
      const scriptsFound = scripts.filter((script) => script !== null);
      if (scriptsFound.length > 0) {
        import_electron2.ipcRenderer.sendToHost("inject-js-unsafe", ...scriptsFound);
      }
    });
  }
  /**
   * Set a custom handler for turning on and off dark mode
   *
   * @param {function} handler
   */
  handleDarkMode(handler) {
    this.darkModeHandler = handler;
  }
  onNotify(fn) {
    if (typeof fn === "function") {
      this.notificationsHandler.onNotify = fn;
    }
  }
  initialize(fn) {
    if (typeof fn === "function") {
      fn();
    }
  }
  clearStorageData(serviceId, targetsToClear) {
    import_electron2.ipcRenderer.send("clear-storage-data", {
      serviceId,
      targetsToClear
    });
  }
  releaseServiceWorkers() {
    this.sessionHandler.releaseServiceWorkers();
  }
  setAvatarImage(avatarUrl) {
    import_electron2.ipcRenderer.sendToHost("avatar", avatarUrl);
  }
  openNewWindow(url) {
    import_electron2.ipcRenderer.sendToHost("new-window", url);
  }
};
var RecipeWebview_default = RecipeWebview;

// preload/recipe.ts
var import_fs_extra2 = require("fs-extra");
var badgeHandler = new BadgeHandler();
import_electron3.contextBridge.exposeInMainWorld("API", {
  open: window.open,
  setBadge: (direct, indirect) => badgeHandler.setBadge(direct, indirect),
  safeParseInt: (text) => badgeHandler.safeParseInt(text)
  // setDialogTitle: title => dialogTitleHandler.setDialogTitle(title),
  // displayNotification: (title, options) =>
  //   notificationsHandler.displayNotification(title, options),
  // getDisplayMediaSelector,
});
var RecipeController = class {
  ipcEvents = {
    "initialize-recipe": "loadRecipeModule",
    "find-in-page": "openFindInPage"
  };
  recipe = null;
  constructor() {
    this.initialize();
  }
  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      import_electron3.ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
    setTimeout(() => {
      import_electron3.ipcRenderer.sendToHost("hello");
    }, 100);
  }
  loadRecipeModule(_event, config, recipe) {
    const modulePath = (0, import_node_path.join)(recipe.path, "webview.js");
    delete require.cache[require.resolve(modulePath)];
    console.log(modulePath, "modulePath");
    try {
      this.recipe = new RecipeWebview_default(
        badgeHandler
        // dialogTitleHandler,
        // notificationsHandler,
        // sessionHandler,
      );
      if ((0, import_fs_extra2.existsSync)(modulePath)) {
        require(modulePath)(this.recipe, { ...config, recipe });
      }
    } catch (error) {
      console.error("Recipe initialization failed", error);
    }
  }
};
console.log("new RecipeController();");
new RecipeController();
