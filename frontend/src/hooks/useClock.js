import { useState, useEffect } from 'react'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function formatDate(now) {
  const d = DAYS[now.getDay()]
  const m = MONTHS[now.getMonth()]
  return `${d}, ${m} ${now.getDate()}, ${now.getFullYear()}`
}

export function formatTime(now) {
  let h = now.getHours(), mn = now.getMinutes(), s = now.getSeconds()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  const pad = n => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(mn)}:${pad(s)} ${ampm}`
}

export function useClock() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    now,
    dateStr: formatDate(now),
    timeStr: formatTime(now),
  }
}
