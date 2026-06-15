import { IconClock, IconClockOvertime, IconUsers, IconCalendarX } from './Icons'

export default function StatsRow({ stats }) {
  const {
    regularHours = 0,
    overtimeHours = 0,
    present = 0,
    late = 0,
    absent = 0,
  } = stats || {}

  return (
    <div id="stats-row">
      <div className="card stat-card">
        <IconClock stroke="#A0652A" />
        <div className="stat-val brown">{regularHours}</div>
        <div className="stat-label">REGULAR HOURS</div>
      </div>
      <div className="card stat-card">
        <IconClockOvertime stroke="#A0652A" />
        <div className="stat-val brown">{overtimeHours}</div>
        <div className="stat-label">OVERTIME HOURS</div>
      </div>
      <div className="card stat-card">
        <IconUsers stroke="#A0652A" />
        <div className="stat-val dark">{present}</div>
        <div className="stat-label">PRESENT</div>
      </div>
      <div className="card stat-card">
        <IconClock stroke="#E67E22" />
        <div className="stat-val orange">{late}</div>
        <div className="stat-label">LATE</div>
      </div>
      <div className="card stat-card">
        <IconCalendarX stroke="#E74C3C" />
        <div className="stat-val red">{absent}</div>
        <div className="stat-label">ABSENT</div>
      </div>
    </div>
  )
}
