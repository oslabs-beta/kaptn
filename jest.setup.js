// The renderer accesses Electron via `window.require("electron")` (see
// src/electron-ipc.ts for why). jsdom has no `window.require`, so define it
// here as a delegate to Jest's CommonJS require — this routes through Jest's
// module registry, so `jest.mock("electron", ...)` factories in test files
// still apply.
window.require = require;
