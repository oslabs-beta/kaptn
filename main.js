const path = require('path');
const { app, BrowserWindow } = require('electron');
// const process = require('process');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 600,
    height: 600,
  });

  // mainWindow.loadFile(process.cwd());
  // mainWindow.loadFile('index.html');
  mainWindow.loadURL('http://localhost:4444/');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();
});
