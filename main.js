const path = require('path');
const { app, BrowserWindow } = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 600,
    height: 600,
  });

  mainWindow.loadURL('http://localhost:3338/');
}

app.whenReady().then(() => {
  createMainWindow();
});
