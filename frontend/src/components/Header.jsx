import { useClock } from '../hooks/useClock'
import { IconSettings, IconRefresh } from './Icons'
import '../styles/Header.css'
import logo from '../../public/logo.svg'

export default function Header({ online, onOpenSettings, onRefresh, refreshing }) {
  const { dateStr, timeStr } = useClock()

  return (
    <div className="card" id="header-card">
      <div className="brand-container"> {/* <-- Add this wrapper around both */}
        <div className="logo-wrap">
          <img src={logo} alt="ERJ Logo" className="logo-img" />
        </div>

        <div className="brand">
          <h1>ERJ Smart Solution</h1>
          <div className="subtitle">Attendance Management System</div>
          <div className="status-row">
            <div className={`status-dot ${online ? '' : 'offline'}`} />
            <span className="status-label">{online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="datetime-block">
          <div className="date-str">{dateStr}</div>
          <div className="time-str">{timeStr}</div>
        </div>
        <div className="header-actions">
          <button className="action-btn" onClick={onOpenSettings}>
            <IconSettings />
            Settings
          </button>
          <button className="action-btn" onClick={onRefresh}>
            <IconRefresh className={refreshing ? 'spinning' : ''} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  )
}