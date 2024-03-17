/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge, ipcRenderer } = require("electron");

function isValidDynamicChannelName(channel) {
  return /^download-file-(success|error)-\d+$/.test(channel);
}

contextBridge.exposeInMainWorld("ipcRenderer", {
  send: (channel, data) => {
    let validSendChannels = [
      "send-message",
      "download-file",
      "request-cancel-download",
    ];
    if (validSendChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  on: (channel, func) => {
    let validReceiveChannels = [
      "download-file-list-progress",
      "cancel-download",
    ];
    if (
      validReceiveChannels.includes(channel) ||
      isValidDynamicChannelName(channel)
    ) {
      ipcRenderer
        .removeAllListeners(channel)
        .on(channel, (event, ...args) => func(...args));
    }
  },
  once: (channel, func) => {
    let validReceiveChannels = [
      // NOTE - Removed fixed success and error channels to accommodate dynamic names
      // Add (static) channels that do not follow the dynamic naming convention
    ];
    if (
      validReceiveChannels.includes(channel) ||
      isValidDynamicChannelName(channel)
    ) {
      ipcRenderer.once(channel, (event, ...args) => func(...args));
    }
  },
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
});
