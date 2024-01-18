"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_node_path = require("node:path");
var import_electron = require("electron");
var import_badge = __toESM(require("./badge"));
const noop = () => {
};
const badgeHandler = new import_badge.default();
import_electron.contextBridge.exposeInMainWorld("API", {
  open: window.open,
  setBadge: (direct, indirect) => badgeHandler.setBadge(direct, indirect),
  safeParseInt: (text) => badgeHandler.safeParseInt(text)
  // setDialogTitle: title => dialogTitleHandler.setDialogTitle(title),
  // displayNotification: (title, options) =>
  //   notificationsHandler.displayNotification(title, options),
  // getDisplayMediaSelector,
});
class RecipeController {
  ipcEvents = {
    "initialize-recipe": "loadRecipeModule",
    "find-in-page": "openFindInPage"
  };
  async initialize() {
    for (const channel of Object.keys(this.ipcEvents)) {
      import_electron.ipcRenderer.on(channel, (...args) => {
        this[this.ipcEvents[channel]](...args);
      });
    }
  }
  loadRecipeModule(_event, config, recipe) {
    const modulePath = (0, import_node_path.join)(recipe.path, "webview.js");
    delete require.cache[require.resolve(modulePath)];
    try {
    } catch (error) {
      console.error("Recipe initialization failed", error);
    }
  }
}
new RecipeController();
