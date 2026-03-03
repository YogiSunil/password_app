import zxcvbn from 'zxcvbn'

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
    <div style={{ marginTop: '12px' }}>
      <div style={{ fontSize: '14px', marginBottom: '6px' }}>
        Strength: <strong>{getScoreLabel(score)}</strong> (score: {score}/4)
      </div>

      <div
        style={{
          width: '100%',
          height: '10px',
          backgroundColor: '#e5e7eb',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${fillPercent}%`,
            height: '100%',
            backgroundColor: getScoreColor(score),
            transition: 'width 180ms ease',
          }}
        />
      </div>

      <div style={{ fontSize: '12px', marginTop: '6px', color: '#374151' }}>
        Estimated guesses: {result.guesses.toLocaleString()}
      </div>
    </div>
  )
}

export default PasswordStrength
