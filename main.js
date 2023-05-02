const path = require('path');
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
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
    mainWindow.webContents.openDevTools();
  } else {
    // In production, render the html build file
    mainWindow.loadURL(`file://${path.join(__dirname, '/dist/index.html#/')}`);
  }
}

/******** EVENT LISTENERS ********/

// Listen to post_command event
ipcMain.on('post_command', (event, arg) => {
  const { command, currDir } = arg;

  exec(` ${command}`, { cwd: currDir }, (err, stdout, stderr) => {
    // Handle failed command execution
    if (err) {
      console.log('err', err);
      return err;
    }
    // Handle successful command execution but returned error (stderr)
    if (stderr) {
      console.log('stderr', stderr);
      return event.sender.send('post_command', stderr);
    }
    // Handle successful command execution with no errors
    console.log(`Response: `, stdout);
    return event.sender.send('post_command', stdout);
  });
});

// Load the main window
app.whenReady().then(() => {
  createMainWindow();
});
