/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { contextBridge } = require("electron");
const os = require("os");

contextBridge.exposeInMainWorld("electron", {
  homedir: () => os.homedir(),
});
