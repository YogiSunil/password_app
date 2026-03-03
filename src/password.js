import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addPassword } from './features/passwords/passwordsSlice'
import PasswordStrength from './PasswordStrength'
import './password.css'

// integer from 0..n-1
function random(n) {
  return Math.floor(Math.random() * n)
}

// returns the character set string based on mode
function getCharSet(mode) {
  const lettersLower = 'abcdefghijklmnopqrstuvwxyz'
  const lettersUpper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()-_=+[]{};:,.<>?/|\\~`'

  if (mode === 'letters') {
    return lettersLower + lettersUpper
  }

  if (mode === 'alphanumeric') {
    return lettersLower + lettersUpper + numbers
  }

  // default: letters + numbers + symbols
  return lettersLower + lettersUpper + numbers + symbols
}

// generate a password of given length, using chosen charset,
// and optionally inserting hyphens every 3 characters.
function generatePassword(length, mode, useHyphens) {
  const chars = getCharSet(mode)

  // When hyphens are ON, we generate in groups of 3: xxx-xxx-xxx...
  // We want "length" to mean "number of characters excluding hyphens".
  let result = ''

  for (let i = 0; i < length; i++) {
    // Insert a hyphen BEFORE character 4, 7, 10, ... (i = 3, 6, 9, ...)
    if (useHyphens && i > 0 && i % 3 === 0) {
      result += '-'
    }

    result += chars[random(chars.length)]
  }

  return result
}

function Password() {
  const dispatch = useDispatch()

  // Controlled inputs (state is the source of truth)
  const [passwordName, setPasswordName] = useState('')
  const [password, setPassword] = useState('p@$$w0rd')
  const [showPassword, setShowPassword] = useState(false)

  // Stretch controls
  const [length, setLength] = useState(9) // 9 works nicely with xxx-xxx-xxx
  const [useHyphens, setUseHyphens] = useState(false)
  const [mode, setMode] = useState('all') // 'letters' | 'alphanumeric' | 'all'

  return (
    <div className="password-container">
      <h2 className="password-title">Password Generator</h2>

      {/* Challenge 2: name/description input (controlled) */}
      <div className="password-section">
        <label className="password-label">
          Name / Description:
          <input
            type="text"
            value={passwordName}
            onChange={(e) => setPasswordName(e.target.value)}
            placeholder="e.g. Gmail, Bank, Netflix..."
            className="password-input"
          />
        </label>
      </div>

      {/* Challenge 1: password displayed in input (controlled) */}
      <div className="password-section">
        <label className="password-label">
          Password:
          <div className="password-input-wrap">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="password-input password-input-with-eye"
            />
            <button
              type="button"
              className="eye-button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </label>
        <PasswordStrength password={password} />
      </div>

      {/* Stretch: length slider (controlled) */}
      <div className="password-section">
        <label className="password-label">
          Length: <strong>{length}</strong>
        </label>
        <input
          type="range"
          min="6"
          max="30"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="password-range"
        />
      </div>

      {/* Stretch: hyphen checkbox (controlled) */}
      <div className="password-section">
        <label className="password-label">
          <input
            type="checkbox"
            checked={useHyphens}
            onChange={(e) => setUseHyphens(e.target.checked)}
            className="checkbox-input"
          />
          Add hyphens every 3 characters (xxx-xxx-xxx)
        </label>
      </div>

      {/* Stretch: select menu (controlled) */}
      <div className="password-section">
        <label className="password-label">
          Character Set:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="password-select"
          >
            <option value="letters">Letters only (AbC...)</option>
            <option value="alphanumeric">Letters + Numbers (a2B...)</option>
            <option value="all">Letters + Numbers + Symbols (a2#...)</option>
          </select>
        </label>
      </div>

      <div className="button-row">
        <button
          onClick={() => {
            const newPassword = generatePassword(length, mode, useHyphens)
            setPassword(newPassword)
          }}
          className="button"
        >
          Generate
        </button>

        <button
          onClick={() => dispatch(addPassword({
            id: Date.now(),
            name: passwordName,
            password,
          }))}
          className="button"
        >
          Save
        </button>
      </div>

      {/* Optional display so you can see the name tied to password */}
      <div className="password-footer">
        <div><strong>Saved name:</strong> {passwordName || '(none)'}</div>
      </div>
    </div>
  )
}

export default Password
