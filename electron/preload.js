const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Window controls
  getVersion: () => ipcRenderer.invoke('app-version'),
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),

  // Attendance data
  getAttendanceState: () => ipcRenderer.invoke('get-attendance-state'),
  refreshAttendance: () => ipcRenderer.invoke('refresh-attendance'),
  scanEmployee: (payload) => ipcRenderer.invoke('scan-employee', payload),
  clockAction: (payload) => ipcRenderer.invoke('clock-action', payload),
  openSettings: () => ipcRenderer.invoke('open-settings'),
  openEmployeeDirectory: () => ipcRenderer.invoke('open-employee-directory'),

  // Live updates pushed from main process
  onAttendanceUpdate: (callback) => {
    const listener = (_event, state) => callback(state);
    ipcRenderer.on('attendance-update', listener);
    return () => ipcRenderer.removeListener('attendance-update', listener);
  },
});
