/* eslint-disable */
const { app, BrowserWindow, Menu } = require("electron");

// modify your existing createWindow() function
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const applicaitonMenuItems = [{ role: "fileMenu" }, { role: "viewMenu" }];
  const applicationMenu = Menu.buildFromTemplate(applicaitonMenuItems);
  Menu.setApplicationMenu(applicationMenu);

  win.loadURL("http://localhost:5173/");

  // NOTE: Always enable DevTools on startup
  //win.webContents.openDevTools();
};

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
