import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function UpgradeButton() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch (err) {
      console.error('Checkout error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handleUpgrade} disabled={loading} className="upgrade-button">
      {loading ? 'Loading...' : 'Upgrade — £5/month'}
    </button>
  )
}
