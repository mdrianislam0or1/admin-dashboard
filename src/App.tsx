import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Analytics from './pages/Analytics'
import Articles from './pages/Articles'
import Dashboard from './pages/Dashboard'
import { useAppSelector } from './redux/hooks'

function App() {
  const { token } = useAppSelector((state) => state.auth)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="articles" element={<Articles />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Redirect to login if not authenticated */}
          <Route
            path="*"
            element={
              token ? (
                <Navigate to="/" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
