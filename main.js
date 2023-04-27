const path = require('path');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const iconURL = './src/assets/kaptn.ico';
// const process = require('process');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    titleBarStyle: 'hidden',
    width: 1200,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    // icon: path.join(__dirname, '/kaptn.ico'),
    webPreferences: {
      nodeIntegration: true,
    }
  });

  // if (isDev) {
  //   mainWindow.loadURL('http://localhost:4444/');
  // } else {
  //   mainWindow.loadFile(path.join(__dirname, '/build/index.html'))
  // }
  // mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
  mainWindow.loadURL('http://localhost:4444/');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();
});

