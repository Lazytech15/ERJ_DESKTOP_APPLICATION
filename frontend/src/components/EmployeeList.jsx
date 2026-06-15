import { IconUsers, IconUserAvatar, IconChevronRight } from './Icons'
import '../styles/EmployeeList.css'

export default function EmployeeList({ employees, selectedId, onSelect, onViewAll }) {
  return (
    <div className="card" id="clocked-in-card">
      <div className="section-header">
        <IconUsers />
        <span className="section-title">Currently Clocked In</span>
      </div>
      <div className="employee-list" id="employee-list">
        {employees.length === 0 && (
          <div className="empty-list-msg">No one clocked in yet</div>
        )}
        {employees.map((e) => (
          <div
            key={e.id}
            className={`emp-row ${e.id === selectedId ? 'active' : ''}`}
            onClick={() => onSelect(e)}
          >
            <div className="emp-avatar">
              <IconUserAvatar />
            </div>
            <div className="emp-info">
              <div className="emp-name">{e.name}</div>
              <div className="emp-dept">{e.dept}</div>
            </div>
            <div className="emp-time-block">
              <div className="emp-shift-label">{e.shift}</div>
              <div className="emp-time">{e.clockIn}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="view-all-row" onClick={onViewAll}>
        View all
        <IconChevronRight />
      </div>
    </div>
  )
}
