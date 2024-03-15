/* eslint-disable */
const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// modify your existing createWindow() function
const createMainWindow = () => {
  const win = new BrowserWindow({
    title: "ToolBox",
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  const applicaitonMenuItems = [{ role: "fileMenu" }, { role: "viewMenu" }];
  const applicationMenu = Menu.buildFromTemplate(applicaitonMenuItems);
  Menu.setApplicationMenu(applicationMenu);

  win.loadURL("http://localhost:5173/");

  // NOTE: Always enable DevTools on startup
  //win.webContents.openDevTools();
};

app.whenReady().then(createMainWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

ipcMain.on("send-message", (event, message) => {
  console.log("Message received:", message);
});

ipcMain.on(
  "download-file",
  async (
    event,
    {
      url,
      fileName,
      outputFolder,
      fileType,
      delaySec = 0,
      successEvent = "download-file-success",
      errorEvent = "download-file-error",
    }
  ) => {
    try {
      // Wait for the specified delay before starting the download
      await new Promise((resolve) => setTimeout(resolve, delaySec * 1000));

      const response = await axios.get(url, { responseType: "stream" });

      if (response.status === 200) {
        const defaultFileType =
          fileType || response.headers["content-type"].split("/")[1];
        if (!defaultFileType) {
          throw new Error("Unable to determine file type.");
        }

        const fullFileName = `${fileName}.${defaultFileType}`;
        const outputPath = path.join(outputFolder, fullFileName);

        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on("finish", () => {
            event.reply(
              successEvent,
              `File downloaded successfully to ${outputPath}`
            );
            resolve();
          });
          writer.on("error", (error) => {
            event.reply(errorEvent, `Error downloading file: ${error.message}`);
            reject(error);
          });
        });
      } else {
        throw new Error(
          `Failed to download file. Status code: ${response.status}`
        );
      }
    } catch (error) {
      event.reply(errorEvent, `Error downloading file: ${error.message}`);
    }
  }
);
