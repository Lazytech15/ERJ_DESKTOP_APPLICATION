import { IconUserAvatar, IconLogIn, IconSun, IconMoon } from './Icons'
import '../styles/Detail.css'

export default function DetailCard({ employee, hours, onClockAction, busy }) {
  if (!employee) {
    return (
      <div className="card" id="detail-card">
        <div className="detail-bg-circles" />
        <div className="detail-empty">Select or scan an employee to view details</div>
      </div>
    )
  }

  const { name, dept, id, shift, clockState, clockTimeDisplay } = employee
  const isClockedIn = clockState === 'in'
  const actionLabel = `${shift} ${isClockedIn ? 'OUT' : 'IN'}`
  const ShiftIcon = shift === 'MORNING' ? IconSun : shift === 'EVENING' ? IconMoon : IconLogIn

  return (
    <div className="card" id="detail-card">
      <div className="detail-bg-circles" />

      <div className="detail-avatar-wrap">
        <div className="detail-avatar">
          <IconUserAvatar />
        </div>
      </div>

      <div className="detail-name">{name}</div>
      <div className="detail-dept">{dept}</div>
      <div className="detail-id-badge">ID: {id}</div>

      <button className="clock-action-btn" onClick={onClockAction} disabled={busy}>
        {isClockedIn ? <ShiftIcon stroke="white" fill="none" /> : <IconLogIn />}
        <span>{actionLabel}</span>
      </button>

      <div className="clock-time-display">{clockTimeDisplay || '--:--:-- --'}</div>

      <div className="hours-table">
        <div className="hours-row">
          <span className="hours-label">Regular:</span>
          <span className="hours-val">{(hours?.regular ?? 0).toFixed(1)}h</span>
        </div>
        <div className="hours-row">
          <span className="hours-label">Overtime:</span>
          <span className="hours-val">{(hours?.overtime ?? 0).toFixed(1)}h</span>
        </div>
        <div className="hours-row total">
          <span className="hours-label">Total:</span>
          <span className="hours-val">{(hours?.total ?? 0).toFixed(1)}h</span>
        </div>
      </div>
    </div>
  )
}
