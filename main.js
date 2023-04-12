const path = require('path');
const { app, BrowserWindow } = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 600,
    height: 600,
  });

  // mainWindow.loadFile(path.join(__dirname, '/index.html'));
  mainWindow.loadURL('http://localhost:4444/');
}

app.whenReady().then(() => {
  createMainWindow();
});
