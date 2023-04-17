const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
// const process = require('process');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    titleBarStyle: 'hidden',
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: './src/assets/kaptn_Logo_v2.png',
  });

  // mainWindow.loadFile(process.cwd());
  // mainWindow.loadFile('index.html');
  mainWindow.loadURL('http://localhost:4444/');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();
});

// ipcMain.on('login-success', e => {
//   console.log('Entrou no main in English');
//   mainWindow.loadURL('http://localhost:4444/')
// })
