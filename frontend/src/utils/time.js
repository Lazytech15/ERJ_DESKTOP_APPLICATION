export function getCurrentTimeStr(date = new Date()) {
  let h = date.getHours(), m = date.getMinutes(), s = date.getSeconds()
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${ampm}`
}

export function getCurrentTimeShort(date = new Date()) {
  let h = date.getHours(), m = date.getMinutes()
  h = h % 12 || 12
  return `${h}:${String(m).padStart(2, '0')}`
}
