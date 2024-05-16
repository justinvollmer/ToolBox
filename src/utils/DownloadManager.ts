/* eslint-disable @typescript-eslint/no-explicit-any */
const { ipcRenderer } = window;
let isCancelled = false;

ipcRenderer.on("cancel-download", () => {
  isCancelled = true;
});

function resetCancellation() {
  isCancelled = false;
}

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
    // Unique identifiers for success and error events
    const successEvent = `download-file-success-${fileName}`;
    const errorEvent = `download-file-error-${fileName}`;

    // Listen for the success response for this specific download
    ipcRenderer.once(successEvent, (_event: any, message: any) => {
      resolve(message);
    });

    // Listen for the error response for this specific download
    ipcRenderer.once(errorEvent, (_event: any, message: any) => {
      reject(new Error(message));
    });
  });
}

async function downloadFromList(
  urlList: { id: number; url: string; filename: string; filetype: string }[],
  outputFolder: string,
  delaySec: number
): Promise<void> {
  for (let i = 0; i < urlList.length; i++) {
    if (isCancelled) {
      break;
    }

    const file = urlList[i];
    await new Promise<void>((resolve, reject) => {
      // Listen for the success or error of the current download
      const successEvent = `download-file-success-${file.id}`;
      const errorEvent = `download-file-error-${file.id}`;

      ipcRenderer.once(successEvent, () => {
        setTimeout(() => {
          // Add delay after download before starting next
          resolve();
        }, delaySec * 1000); // Convert seconds to milliseconds
      });

      ipcRenderer.once(errorEvent, (_event: any, message: any) => {
        reject(new Error(message));
      });

      // Send the download request
      ipcRenderer.send("download-file", {
        url: file.url,
        fileName: `${file.filename} (${file.id})`,
        outputFolder,
        fileType: file.filetype,
        delaySec: delaySec,
        successEvent,
        errorEvent,
      });

      ipcRenderer.send("request-increase-progress");
    });
  }
  if (isCancelled) {
    resetCancellation();
  }
}

export { download, downloadFromList };
