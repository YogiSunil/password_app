import { useSelector } from 'react-redux'
import './password.css'

function PasswordsList() {
  const passwords = useSelector((state) => state.passwords.value)

  return (
    <ul className="passwords-list">
      <li className="passwords-list-title">Saved Passwords</li>
      {passwords.map((password, index) => (
        <li key={`${password.name}-${index}`} className="password-list-item">
          <span className="password-list-name">{password.name || 'untitled'}</span>
          <span className="password-list-value">{password.password}</span>
        </li>
      ))}
    </ul>
  )
}

export default PasswordsList
