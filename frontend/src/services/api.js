// Thin wrapper around window.electronAPI exposed by the Electron preload script.
// Falls back to safe no-op/mock behaviour when running in plain browser dev mode
// (e.g. `npm run dev` in /frontend without Electron), so the UI is still usable.

const hasElectronAPI = () => typeof window !== 'undefined' && !!window.electronAPI

export async function getAppVersion() {
  if (hasElectronAPI() && window.electronAPI.getVersion) {
    return window.electronAPI.getVersion()
  }
  return 'dev'
}

export async function fetchAttendanceState() {
  if (hasElectronAPI() && window.electronAPI.getAttendanceState) {
    return window.electronAPI.getAttendanceState()
  }
  return null
}

export async function scanEmployee(value, mode) {
  if (hasElectronAPI() && window.electronAPI.scanEmployee) {
    return window.electronAPI.scanEmployee({ value, mode })
  }
  return null
}

export async function clockAction(employeeId) {
  if (hasElectronAPI() && window.electronAPI.clockAction) {
    return window.electronAPI.clockAction({ employeeId })
  }
  return null
}

export async function refreshAttendance() {
  if (hasElectronAPI() && window.electronAPI.refreshAttendance) {
    return window.electronAPI.refreshAttendance()
  }
  return null
}

export function onAttendanceUpdate(callback) {
  if (hasElectronAPI() && window.electronAPI.onAttendanceUpdate) {
    return window.electronAPI.onAttendanceUpdate(callback)
  }
  return () => {}
}

export { hasElectronAPI }
