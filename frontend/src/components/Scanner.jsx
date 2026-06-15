import { useState, useRef } from 'react'
import { IconScan } from './Icons'
import '../styles/Scanner.css'

export default function Scanner({ onSubmit }) {
  const [value, setValue] = useState('')
  const [mode, setMode] = useState('barcode')
  const inputRef = useRef(null)

  const handleSubmit = () => {
    const val = value.trim()
    if (!val) return
    onSubmit(val, mode)
    setValue('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="card" id="scanner-card">
      <div className="scan-input-row">
        <div className="scan-icon">
          <IconScan />
        </div>
        <input
          ref={inputRef}
          type="text"
          id="scan-input"
          placeholder="Scan barcode or enter ID number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />
        <button className="submit-btn" onClick={handleSubmit}>SUBMIT</button>
      </div>
      <div className="scan-mode-row">
        <label className="radio-opt">
          <input
            type="radio"
            name="scan-mode"
            value="barcode"
            checked={mode === 'barcode'}
            onChange={() => setMode('barcode')}
          /> Barcode Scanner
        </label>
        <label className="radio-opt">
          <input
            type="radio"
            name="scan-mode"
            value="manual"
            checked={mode === 'manual'}
            onChange={() => setMode('manual')}
          /> Manual ID Entry
        </label>
      </div>
    </div>
  )
}
