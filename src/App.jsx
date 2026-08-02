import { AuthProvider, useAuth } from './context/AuthContext'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import './App.css'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Loading...</div>

  return user ? <Dashboard /> : <Auth />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
