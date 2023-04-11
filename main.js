const path = require('path');
const { app, BrowserWindow } = require('electron');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    width: 600,
    height: 600,
  });

  // mainWindow.loadFile('/index.html');
  // mainWindow.loadFile(path.join(__dirname, '/index.html'));
  mainWindow.loadURL('http://localhost:3333/');
}

app.whenReady().then(() => {
  createMainWindow();
});
