import { IconLogOut, IconClock, IconClipboardX, IconUserAvatar } from './Icons'

export default function ClockOutCard({ clockOuts }) {
  const hasEntries = clockOuts && clockOuts.length > 0

  return (
    <div className="card" id="clockout-card">
      <div className="clockout-header">
        <div className="clockout-header-left">
          <IconLogOut />
          <span className="section-title">Current Clock Out</span>
        </div>
        <IconClock className="clockout-icon-right" />
      </div>

      {!hasEntries && (
        <div className="clockout-empty" id="clockout-empty">
          <div style={{ position: 'relative' }}>
            <div className="clockout-empty-icon">
              <IconClipboardX />
            </div>
            <span className="sparkle" style={{ top: '-8px', left: '-12px' }}>◇</span>
            <span className="sparkle" style={{ top: '10px', right: '-14px', fontSize: '9px' }}>◇</span>
            <span className="sparkle" style={{ bottom: '-8px', left: '40px', fontSize: '10px' }}>+</span>
            <span className="sparkle" style={{ top: '-4px', right: '0', fontSize: '10px' }}>+</span>
          </div>
          <div className="clockout-empty-title">No clock out activity today</div>
          <div className="clockout-empty-sub">Have a great day!</div>
        </div>
      )}

      {hasEntries && (
        <div className="clockout-list" id="clockout-list">
          {clockOuts.map((e, i) => (
            <div className="emp-row active" key={`${e.id}-${i}`}>
              <div className="emp-avatar">
                <IconUserAvatar />
              </div>
              <div className="emp-info">
                <div className="emp-name">{e.name}</div>
                <div className="emp-dept">{e.dept}</div>
              </div>
              <div className="emp-time-block">
                <div className="emp-shift-label">{e.shift}</div>
                <div className="emp-time late">{e.clockOut}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
