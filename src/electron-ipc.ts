// Single access point for Electron APIs in the renderer process.
//
// We call `window.require("electron")` (Node's require, available because the
// BrowserWindow is created with `nodeIntegration: true` in main.js) instead of
// a bare `require`/`import`. A bare import would be statically resolved by
// Vite at build time to the npm "electron" package — which only exports the
// filesystem path to the Electron binary — leaving `ipcRenderer` undefined and
// white-paging the app. The `as any` cast avoids needing a global Window type
// augmentation.
//
// NOTE: if the app ever moves to `contextIsolation: true` /
// `nodeIntegration: false`, replace this module with a preload script +
// contextBridge — this is the only file that would need to change.
export const { ipcRenderer } = (window as any).require("electron");

// Node's `process` global, exposed on `window` by Electron when
// `nodeIntegration: true`. Renderer code should use this export instead of the
// bare `process` global so it never depends on @types/node being loaded.
export const nodeProcess = (window as any).process;
