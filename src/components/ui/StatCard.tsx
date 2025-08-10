/* eslint-disable @typescript-eslint/no-explicit-any */
import { TrendingDown, TrendingUp } from 'lucide-react'
import type React from 'react'
import Card from './Card'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  color: string
  trend?: {
    value: number
    isPositive: boolean
  }
  subtitle?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  subtitle,
}) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trend.isPositive ? (
                <TrendingUp className="h-4 w-4 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-1" />
              )}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div
          className={`${color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${color} opacity-20`}
      />
    </Card>
  )
}

export default StatCard
