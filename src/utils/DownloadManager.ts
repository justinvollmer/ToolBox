import axios from "axios";
import fs from "fs";
import path from "path";

/**
 * Downloads a file from a given URL, determines its file type, and saves it to a specified location.
 *
 * @param {string} url - The URL of the file to download.
 * @param {string} fileName - The desired name of the downloaded file without an extension.
 * @param {string} [outputFolder] - The folder where the downloaded file should be saved.
 * @param {string} [fileType] - Optional. The file type to use, bypassing URL/content-type detection.
 * @returns {Promise<void>} A Promise that resolves when the download is complete or rejects on error.
 */
async function download(
  url: string,
  fileName: string,
  outputFolder: string,
  fileType?: string
): Promise<void> {
  try {
    // Make an HTTP GET request to the specified URL with a stream response.
    const response = await axios.get(url, { responseType: "stream" });

    if (response.status === 200) {
      // Determine the content-type of the response to infer the file type, or use the provided fileType.
      const contentType = response.headers["content-type"];
      const defaultFileType = fileType || contentType.split("/")[1]; // Extract file type from content-type header

      if (!defaultFileType) {
        throw new Error("Unable to determine file type.");
      }

      // Construct the full file name with the determined file type.
      const fullFileName = `${fileName}.${defaultFileType}`;

      // Determine the output path based on the outputFolder parameter.
      const outputPath = path.join(outputFolder, fullFileName);

      // Create a writable stream and pipe the response data to it to save the file.
      const writer = fs.createWriteStream(outputPath);
      response.data.pipe(writer);

      return new Promise<void>((resolve, reject) => {
        writer.on("finish", () => resolve());
        writer.on("error", (err: Error) => reject(err));
      });
    } else {
      throw new Error(
        `Failed to download file. Status code: ${response.status}`
      );
    }
  } catch (error) {
    throw new Error(
      `Error downloading file: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

async function downloadFromList(
  urlList: { url: string; filename: string }[],
  outputFolder: string
): Promise<void> {
  try {
    // Create the output folder if it doesn't exist
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

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
