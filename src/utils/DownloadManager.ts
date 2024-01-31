/* eslint-disable @typescript-eslint/no-explicit-any */
const { ipcRenderer } = window; // NOTE - Ignore this error message, it works

async function download(
  url: string,
  fileName: string,
  outputFolder: string,
  fileType?: string
): Promise<void> {
  // Send an IPC message to the main process to initiate the download
  ipcRenderer.send("download-file", { url, fileName, outputFolder, fileType });

  // Return a Promise to handle success or error responses
  return new Promise((resolve, reject) => {
    ipcRenderer.send("download-file-success", (event: any, message: any) => {
      resolve(message);
    });

    ipcRenderer.send("download-file-error", (event: any, message: any) => {
      reject(message);
    });
  });
}

async function downloadFromList(
  urlList: { url: string; filename: string; filetype: string }[],
  outputFolder: string
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    urlList.forEach((file, index) => {
      ipcRenderer.send("download-file", {
        url: file.url,
        fileName: `${file.filename} (${index + 1})`,
        outputFolder,
        fileType: file.filetype,
      });
    });

    ipcRenderer.once("download-file-list-success", () => {
      resolve();
    });

    ipcRenderer.once("download-file-list-error", (message: any) => {
      reject(new Error(message));
    });
  });
}

export { download, downloadFromList };
