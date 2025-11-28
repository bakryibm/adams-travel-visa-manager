const { contextBridge, ipcRenderer } = require('electron');

// إتاحة بعض وظائف Electron بشكل آمن لل(renderer)
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  closeWindow: () => ipcRenderer.send('close-window')
});

// إتاحة بعض الوظائف العامة
contextBridge.exposeInMainWorld('api', {
  isElectron: true
});