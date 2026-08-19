const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Scanner triggers
  startScan: (scanType) => ipcRenderer.invoke('scan:start', scanType),
  cancelScan: () => ipcRenderer.invoke('scan:cancel'),
  
  // System Info
  getSystemInfo: () => ipcRenderer.invoke('system:getInfo'),
  
  // Database / History
  getScanHistory: () => ipcRenderer.invoke('history:get'),
  saveScan: (scanResult) => ipcRenderer.invoke('history:save', scanResult),
  clearScanHistory: () => ipcRenderer.invoke('history:clear'),
  
  // File Export / Report
  saveReportFile: (fileData) => ipcRenderer.invoke('report:save', fileData),
  
  // App info & privilege status
  checkAdminPrivileges: () => ipcRenderer.invoke('app:checkAdmin'),
  getAppVersion: () => ipcRenderer.invoke('app:version'),

  // Event Listeners for live scan progress
  onScanProgress: (callback) => {
    const subscription = (event, data) => callback(data);
    ipcRenderer.on('scan:progress', subscription);
    return () => ipcRenderer.removeListener('scan:progress', subscription);
  }
});
