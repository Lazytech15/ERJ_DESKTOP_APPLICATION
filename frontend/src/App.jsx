import { useState, useEffect, useCallback } from 'react'
import Titlebar from './components/Titlebar'
import Header from './components/Header'
import Scanner from './components/Scanner'
import StatsRow from './components/StatsRow'
import EmployeeList from './components/EmployeeList'
import DetailCard from './components/DetailCard'
import ClockOutCard from './components/ClockOutCard'
import {
  fetchAttendanceState,
  scanEmployee,
  clockAction as clockActionApi,
  refreshAttendance,
  onAttendanceUpdate,
  hasElectronAPI,
} from './services/api'
import { initialEmployees, initialStats } from './data/sampleData'
import { getCurrentTimeStr, getCurrentTimeShort } from './utils/time'
import './styles/App.css'

export default function App() {
  const [employees, setEmployees] = useState(initialEmployees)
  const [selectedId, setSelectedId] = useState(initialEmployees[0]?.id ?? null)
  const [clockOuts, setClockOuts] = useState([])
  const [stats, setStats] = useState(initialStats)
  const [online, setOnline] = useState(hasElectronAPI())
  const [refreshing, setRefreshing] = useState(false)
  const [busy, setBusy] = useState(false)

  // Load initial state from Electron backend (if available)
  useEffect(() => {
    let unsubscribe = () => {}

    async function load() {
      const state = await fetchAttendanceState()
      if (state) {
        if (state.employees) setEmployees(state.employees)
        if (state.clockOuts) setClockOuts(state.clockOuts)
        if (state.stats) setStats(state.stats)
        if (state.online !== undefined) setOnline(state.online)
        if (state.employees?.length && selectedId == null) {
          setSelectedId(state.employees[0].id)
        }
      }
    }
    load()

    unsubscribe = onAttendanceUpdate((state) => {
      if (state.employees) setEmployees(state.employees)
      if (state.clockOuts) setClockOuts(state.clockOuts)
      if (state.stats) setStats(state.stats)
      if (state.online !== undefined) setOnline(state.online)
    })

    return () => unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedEmployee = employees.find((e) => e.id === selectedId) || null

  const handleSelect = useCallback((emp) => {
    setSelectedId(emp.id)
  }, [])

  const handleScanSubmit = useCallback(async (value, mode) => {
    // Try backend first
    const result = await scanEmployee(value, mode)
    if (result?.employee) {
      setSelectedId(result.employee.id)
      return
    }

    // Local fallback: match by id or name
    const emp = employees.find(
      (e) => String(e.id) === value || e.name.toLowerCase().includes(value.toLowerCase())
    )
    if (emp) setSelectedId(emp.id)
  }, [employees])

  const handleClockAction = useCallback(async () => {
    if (!selectedEmployee) return
    setBusy(true)
    try {
      const result = await clockActionApi(selectedEmployee.id)
      if (result?.employee) {
        setEmployees((prev) =>
          prev.map((e) => (e.id === result.employee.id ? result.employee : e))
        )
        if (result.clockOuts) setClockOuts(result.clockOuts)
        if (result.stats) setStats(result.stats)
        return
      }

      // Local fallback toggle (demo mode)
      const now = new Date()
      setEmployees((prev) =>
        prev.map((e) => {
          if (e.id !== selectedEmployee.id) return e
          if (e.clockState === 'in') {
            return { ...e, clockState: 'out', clockTimeDisplay: getCurrentTimeStr(now) }
          }
          return { ...e, clockState: 'in', clockTimeDisplay: getCurrentTimeStr(now) }
        })
      )

      if (selectedEmployee.clockState === 'in') {
        setClockOuts((prev) => [
          {
            id: selectedEmployee.id,
            name: selectedEmployee.name,
            dept: selectedEmployee.dept,
            shift: selectedEmployee.shift,
            clockOut: getCurrentTimeShort(now),
          },
          ...prev,
        ])
      }
    } finally {
      setBusy(false)
    }
  }, [selectedEmployee])

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      const state = await refreshAttendance()
      if (state) {
        if (state.employees) setEmployees(state.employees)
        if (state.clockOuts) setClockOuts(state.clockOuts)
        if (state.stats) setStats(state.stats)
        if (state.online !== undefined) setOnline(state.online)
      }
    } finally {
      setTimeout(() => setRefreshing(false), 600)
    }
  }, [])

  const handleOpenSettings = useCallback(() => {
    if (hasElectronAPI() && window.electronAPI.openSettings) {
      window.electronAPI.openSettings()
    } else {
      alert('Settings panel — connect to your backend config here.')
    }
  }, [])

  const handleViewAll = useCallback(() => {
    if (hasElectronAPI() && window.electronAPI.openEmployeeDirectory) {
      window.electronAPI.openEmployeeDirectory()
    } else {
      alert('View all employees — implement full employee list modal here.')
    }
  }, [])

  // Derive hours for selected employee
  const hours = selectedEmployee
    ? {
        regular: selectedEmployee.hoursRegular ?? 0,
        overtime: selectedEmployee.hoursOvertime ?? 0,
        total: (selectedEmployee.hoursRegular ?? 0) + (selectedEmployee.hoursOvertime ?? 0),
      }
    : null

  return (
    <>
      <Titlebar />
      <div id="app">
        <Header
          online={online}
          onOpenSettings={handleOpenSettings}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />

        <div id="middle-row">
          <Scanner onSubmit={handleScanSubmit} />
          <StatsRow stats={stats} />
        </div>

        <div id="bottom-row">
          <EmployeeList
            employees={employees}
            selectedId={selectedId}
            onSelect={handleSelect}
            onViewAll={handleViewAll}
          />
          <DetailCard
            employee={selectedEmployee}
            hours={hours}
            onClockAction={handleClockAction}
            busy={busy}
          />
          <ClockOutCard clockOuts={clockOuts} />
        </div>
      </div>
    </>
  )
}
