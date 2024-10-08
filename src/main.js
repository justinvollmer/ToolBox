/* eslint-disable */
const { app, BrowserWindow, Menu, ipcMain, dialog } = require("electron");
const axios = require("axios");
const fs = require("fs");
const { readFile, writeFile } = require("fs").promises;
const path = require("path");
const os = require("os");
const Store = require("electron-store");
const { exec } = require("child_process");

const store = new Store();
store.clear(); // NOTE - Remove before distribution

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

  //const applicaitonMenuItems = [{ role: "fileMenu" }]; // NOTE - For distribution
  const applicaitonMenuItems = [{ role: "fileMenu" }, { role: "viewMenu" }]; // NOTE - For development
  const applicationMenu = Menu.buildFromTemplate(applicaitonMenuItems);
  Menu.setApplicationMenu(applicationMenu);

  win.loadURL("http://localhost:5173/"); // NOTE - For development
  //win.loadFile(path.join(__dirname, "../dist/index.html")); // NOTE - For manual distribution

  // To always open DevTools on startup
  //win.webContents.openDevTools();

  let windowBounds = store.get("windowBounds", { width: 800, height: 600 });
  win.setBounds(windowBounds);

  win.on("resize", () => {
    store.set("windowBounds", win.getBounds());
  });

  let defaultListContent = store.get(
    "defaultListContent",
    "https://example.com/image.jpg\nhttps://example.com/image.jpg\nhttps://example.com/image.jpg"
  );
  store.set("defaultListContent", defaultListContent);

  let defaultBrowser = store.get("defaultBrowser", "msedge");
  store.set("defaultBrowser", defaultBrowser);
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

ipcMain.handle("get-setting", (event, key) => {
  return store.get(key);
});

ipcMain.handle("set-setting", (event, key, value) => {
  store.set(key, value);
});

ipcMain.handle("delete-setting", (event, key) => {
  return store.delete(key);
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

ipcMain.handle("open-file-dialog", async (event, filters) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: filters,
    defaultPath: path.join(os.homedir(), "Desktop"),
  });
  if (filePaths.length > 0) {
    const content = await readFile(filePaths[0], "utf8");
    return content;
  }
  return "";
});

ipcMain.handle("save-file-dialog", async (event, content, filters) => {
  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: "Save text",
    filters: filters,
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

ipcMain.handle(
  "openInBrowser",
  (event, url, browser = "msedge", incognito = false) => {
    let command;

    if (!incognito) {
      command = `start ${browser} ${url}`;
    } else {
      if (browser == "msedge") {
        command = `start ${browser} -inprivate ${url}`;
      }
      if (browser == "chrome" || browser == "brave") {
        command = `start ${browser} -incognito ${url}`;
      }
      if (browser == "firefox") {
        command = `start ${browser} -private-window ${url}`;
      }
    }

    exec(command, (error) => {
      if (error) {
        console.error(`Error opening URL: ${error.message}`);
      }
    });
  }
);

ipcMain.on("request-cancel-download", (event) => {
  event.sender.send("cancel-download");
});

ipcMain.on("request-increase-progress", (event) => {
  event.sender.send("increase-progress");
});
