import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deletePassword, updatePassword } from './features/passwords/passwordsSlice'
import zxcvbn from 'zxcvbn'
import './password.css'

function getStrengthLabel(password) {
  const score = zxcvbn(password || '').score
  if (score <= 1) return 'weak'
  if (score === 2) return 'fair'
  if (score === 3) return 'good'
  return 'strong'
}

function getStrengthOrder(label) {
  const order = { weak: 1, fair: 2, good: 3, strong: 4 }
  return order[label] || 0
}

function getPasswordType(password) {
  const value = password || ''
  const hasLetter = /[a-z]/i.test(value)
  const hasNumber = /\d/.test(value)
  const hasSymbol = /[^a-z0-9]/i.test(value)

  if (hasLetter && !hasNumber && !hasSymbol) {
    return 'letters'
  }

  if (hasLetter && hasNumber && !hasSymbol) {
    return 'alphanumeric'
  }

  return 'allchars'
}

function PasswordsList() {
  const dispatch = useDispatch()
  const passwords = useSelector((state) => state.passwords.value)

  const [filterBy, setFilterBy] = useState('all')
  const [sortType, setSortType] = useState('all')
  const [visibleMap, setVisibleMap] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const [editPassword, setEditPassword] = useState('')

  const visiblePasswords = useMemo(() => {
    const filtered = passwords.filter((item) => {
      if (filterBy === 'all') {
        return true
      }
      return getStrengthLabel(item.password) === filterBy
    })

    return [...filtered].sort((a, b) => {
      if (sortType !== 'all') {
        const aMatch = getPasswordType(a.password) === sortType ? 1 : 0
        const bMatch = getPasswordType(b.password) === sortType ? 1 : 0
        if (aMatch !== bMatch) {
          return bMatch - aMatch
        }
      }

      return getStrengthOrder(getStrengthLabel(b.password)) - getStrengthOrder(getStrengthLabel(a.password))
    })
  }, [passwords, filterBy, sortType])

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditName(item.name || '')
    setEditPassword(item.password || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditPassword('')
  }

  const saveEdit = (id) => {
    dispatch(updatePassword({
      id,
      name: editName,
      password: editPassword,
    }))
    cancelEdit()
  }

  const toggleVisible = (id) => {
    setVisibleMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <ul className="passwords-list">
      <li className="passwords-list-title">Saved Passwords</li>

      <li className="passwords-controls">
        <label className="password-label passwords-control-item">
          Filter:
          <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="password-select">
            <option value="all">All</option>
            <option value="weak">Weak</option>
            <option value="fair">Fair</option>
            <option value="good">Good</option>
            <option value="strong">Strong</option>
          </select>
        </label>

        <label className="password-label passwords-control-item">
          Type Sort:
          <select value={sortType} onChange={(e) => setSortType(e.target.value)} className="password-select">
            <option value="all">Default</option>
            <option value="letters">Letters only first</option>
            <option value="alphanumeric">Letters + Numbers first</option>
            <option value="allchars">Letters + Numbers + Symbols first</option>
          </select>
        </label>
      </li>

      {visiblePasswords.map((item) => (
        <li key={item.id} className="password-list-item">
          {editingId === item.id ? (
            <div className="password-edit-grid">
              <input
                className="password-input"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
              />
              <input
                className="password-input"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                placeholder="Password"
              />

              <div className="password-item-actions">
                <button className="small-button" onClick={() => saveEdit(item.id)}>Save</button>
                <button className="small-button ghost" onClick={cancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div>
                <div className="password-list-name">{item.name || 'untitled'}</div>
                <div className="password-value-row">
                  <span className="password-list-value">
                    {visibleMap[item.id] ? item.password : '•'.repeat((item.password || '').length)}
                  </span>
                  <button
                    type="button"
                    className="password-eye-button"
                    onClick={() => toggleVisible(item.id)}
                    aria-label={visibleMap[item.id] ? 'Hide saved password' : 'Show saved password'}
                  >
                    {visibleMap[item.id] ? '🙈' : '👁️'}
                  </button>
                </div>
                <div className="password-priority">
                  Strength: {getStrengthLabel(item.password)} | Type: {getPasswordType(item.password)}
                </div>
              </div>

              <div className="password-item-actions">
                <button className="small-button" onClick={() => startEdit(item)}>Edit</button>
                <button className="small-button danger" onClick={() => dispatch(deletePassword(item.id))}>Delete</button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

export default PasswordsList
