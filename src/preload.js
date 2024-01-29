/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    let validSendChannels = [
      "send-message",
      "download-file",
      "download-file-list",
    ];
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    let validReceiveChannels = [
      "download-file-list-progress",
      "download-file-list-success",
      "download-file-list-error",
    ];
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer
        .removeAllListeners(channel)
        .on(channel, (event, ...args) => func(...args));
    }
  },
  once: (channel, func) => {
    let validReceiveChannels = [
      "download-file-list-success",
      "download-file-list-error",
    ];
    if (validReceiveChannels.includes(channel)) {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
});
