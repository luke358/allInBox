import { release } from 'node:os'
import { join } from 'node:path'
import { BrowserWindow, app, ipcMain, shell } from 'electron'
import { attachTitlebarToWindow, setupTitlebar } from 'custom-electron-titlebar/main'
import * as remoteMain from '@electron/remote/main';

remoteMain.initialize();
// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1'))
  app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32')
  app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

setupTitlebar()

// 启用 Widevine DRM 插件
// app.commandLine.appendSwitch('widevine-cdm-path', '/Applications/Google Chrome.app/Contents/Frameworks/Google Chrome Framework.framework/Versions/113.0.5672.126/Libraries/WidevineCdm/_platform_specific/mac_x64')
// app.commandLine.appendSwitch('widevine-cdm-version', '113.0.5672.126')

let allowQuitting = false
async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
      webviewTag: true,
      plugins: true,
    },
  })

  win.on('close', (event) => {
    if (allowQuitting === false) {
      event.preventDefault()
      win.hide()
    }
    else {
      win = undefined
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }
  else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  remoteMain.enable(win.webContents)

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:'))
      shell.openExternal(url)
    return { action: 'deny' }
  })
  // win.webContents.on('will-navigate', (event, url) => { }) #344
  attachTitlebarToWindow(win)

  win.webContents.on('will-attach-webview', (e, webPreferences) => {
    webPreferences.preload = join(__dirname, '../../preload/recipe.js')
  })
}

app.whenReady().then(createWindow)
// app.commandLine.appendSwitch('disable-features', 'CrossOriginOpenerPolicy')

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized())
      win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  if (win === undefined)
    createWindow()
  else
    win.show()
})

app.on('before-quit', () => (allowQuitting = true))

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL)
    childWindow.loadURL(`${url}#${arg}`)
  else
    childWindow.loadFile(indexHtml, { hash: arg })
})
