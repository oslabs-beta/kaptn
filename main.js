const path = require('path');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const iconURL = './src/assets/kaptn.ico';
const electronBrowserWindow = require('electron').BrowserWindow;
const electronIpcMain = require('electron').ipcMain;
const nodePath = require('path');
const { exec } = require('child_process');

const isDev = process.env.NODE_ENV === 'development';

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Kaptn',
    titleBarStyle: 'hidden',
    width: 1200,
    height: 700,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:4444/');
  } else {
    mainWindow.loadURL(`file://${path.join(__dirname, '/dist/index.html#/')}`)
  }
  // mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
  // mainWindow.loadURL('http://localhost:4444/');
  // mainWindow.webContents.openDevTools();
}

electronIpcMain.on('runScript', () => {
  exec(`ls`, (err, stdout, stderr) => {
    // Handle failed command execution
    if (err) {
      return err;
    }
    // Handle successful command execution but returned error (stderr)
    if (stderr) {
      return err;
    }
    // Handle successful command execution with no errors
    console.log(`Response: `, stdout);
    return stdout;
  });
});

app.whenReady().then(() => {
  createMainWindow();
});

ipcMain.on('post_command', (event, arg) => {
  const { command } = arg;
  console.log(command);
  exec(` ${command}`, (err, stdout, stderr) => {
    // Handle failed command execution
    if (err) {
      console.log('err', err);
    }
    // Handle successful command execution but returned error (stderr)
    if (stderr) {
      console.log('stderr', stderr);
    }
    // Handle successful command execution with no errors
    console.log(`Response: `, stdout);
    event.sender.send('post_command', stdout);
  });
});
