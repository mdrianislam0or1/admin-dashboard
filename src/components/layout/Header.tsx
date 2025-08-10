'use client'

import { Bell, LogOut, Menu } from 'lucide-react'
import type React from 'react'
import { toggleSidebar } from '../../redux/features/admin/adminSlice'
import { logout } from '../../redux/features/auth/authSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Button from '../ui/Button'

const Header: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="text-gray-500 hover:text-gray-700 lg:hidden"
          >
            <Menu size={24} />
          </button>
          <h2 className="ml-4 text-lg font-semibold text-gray-900 lg:ml-0">
            Welcome back, {user?.name}
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Bell size={20} />
          </button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header
