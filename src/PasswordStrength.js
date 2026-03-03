import zxcvbn from 'zxcvbn'
import './password.css'

function getScoreLabel(score) {
  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[score] || 'Unknown'
}

function getScoreColor(score) {
  const colors = ['#dc2626', '#ea580c', '#d97706', '#65a30d', '#16a34a']
  return colors[score] || '#6b7280'
}

function PasswordStrength({ password }) {
  const result = zxcvbn(password || '')
  const score = result.score
  const fillPercent = ((score + 1) / 5) * 100

  return (
    <div className="strength-wrap">
      <div className="strength-text">
        <span>
          Strength: <strong>{getScoreLabel(score)}</strong>
        </span>
        <span>{score}/4</span>
      </div>

      <div className="strength-track">
        <div
          className="strength-fill"
          style={{
            width: `${fillPercent}%`,
            backgroundColor: getScoreColor(score),
          }}
        />
      </div>

      <div className="strength-hint">
        Estimated guesses: {result.guesses.toLocaleString()}
      </div>
    </div>
  )
}

export default PasswordStrength
