/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
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

/**
 * Downloads files from a list of URLs and saves them to a specified output folder.
 *
 * @author Justin Vollmer
 * @justinvollmer
 *
 * @param {Array} urlList - An array of objects containing URL and filename information.
 * @param {string} outputFolder - The path to the output folder where the files will be saved.
 * @returns {Promise<void>} - A Promise that resolves when all downloads are complete.
 */
async function downloadFromList(
  urlList: { url: string; filename: string }[],
  outputFolder: string
): Promise<void> {
  try {
    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    // Loop through the list of URLs and filenames
    for (let i = 0; i < urlList.length; i++) {
      const { url, filename } = urlList[i];
      await download(url, `${filename} (${i + 1})`, outputFolder);
      console.log(`File ${filename} (${i + 1}) downloaded successfully.`);
    }
  } catch (error) {
    console.error(
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export { download, downloadFromList };
