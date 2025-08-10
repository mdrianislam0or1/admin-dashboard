import type React from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../redux/hooks'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'editor'
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { token, user } = useAppSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
