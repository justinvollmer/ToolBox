/* eslint-disable */
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const axios = require("axios");
const fs = require("fs");
const { readFile, writeFile } = require("fs").promises;
const path = require("path");
const os = require("os");

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

ipcMain.handle("open-file-dialog", async (event) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    defaultPath: path.join(os.homedir(), "Desktop"),
  });
  if (filePaths.length > 0) {
    const content = await readFile(filePaths[0], "utf8");
    return content;
  }
  return "";
});

ipcMain.handle("save-file-dialog", async (event, content) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save text",
    filters: [{ name: "Text Files", extensions: ["txt"] }],
    defaultPath: path.join(os.homedir(), "Desktop", "file.txt"),
  });

  if (filePath) {
    await writeFile(filePath, content);
    return true; // Success
  } else {
    return false; // User cancelled the dialog or an error occurred
  }
});

ipcMain.handle("open-directory-dialog", async () => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openDirectory"],
    defaultPath: path.join(os.homedir(), "Desktop"),
  });

  if (filePaths.length > 0) {
    return filePaths[0];
  } else {
    return ""; // If no directory was selected
  }
});
