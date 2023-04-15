const path = require('path');
const { app, BrowserWindow } = require('electron');
// const process = require('process');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 900,
    height: 600,
  });

  // mainWindow.loadFile(path.join(__dirname, '/index.html'));
  mainWindow.loadURL('http://localhost:4444/');
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createMainWindow();
});
