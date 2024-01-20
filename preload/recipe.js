"use strict";

// preload/recipe.ts
var import_electron2 = require("electron");

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

// preload/recipe.ts
var badgeHandler = new BadgeHandler();
console.log("qqqqq ddddd ccccc vvvvv ssss");
import_electron2.contextBridge.exposeInMainWorld("API", {
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
  constructor() {
    this.initialize();
  }
  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      import_electron2.ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
    setTimeout(() => {
      import_electron2.ipcRenderer.sendToHost("hello");
    }, 100);
  }
  loadRecipeModule(_event, config, recipe) {
    console.log(recipe, "reeeeee");
    try {
    } catch (error) {
      console.error("Recipe initialization failed", error);
    }
  }
};
console.log("new RecipeController();");
new RecipeController();
