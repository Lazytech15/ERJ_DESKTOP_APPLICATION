export default function Titlebar() {
  const api = window.electronAPI

  return (
    <div id="titlebar">
      <button className="titlebar-btn" onClick={() => api?.minimizeWindow()} title="Minimize">—</button>
      <button className="titlebar-btn" onClick={() => api?.maximizeWindow()} title="Maximize">□</button>
      <button className="titlebar-btn close" onClick={() => api?.closeWindow()} title="Close">✕</button>
    </div>
  )
}
