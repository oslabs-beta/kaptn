const path = require('path');
const { app, BrowserWindow } = require('electron');
// const process = require('process');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  // mainWindow.loadFile(process.cwd());
  // mainWindow.loadFile('index.html');
  mainWindow.loadURL('http://localhost:4444/');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();
});
