/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { PerformanceData } from '../../types/article'

interface PerformanceChartProps {
  data: PerformanceData[]
  type?: 'line' | 'bar'
  period?: 'daily' | 'monthly'
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  type = 'line',
  period = 'daily',
}) => {
  const formatXAxisLabel = (tickItem: string) => {
    if (period === 'monthly') {
      const [year, month] = tickItem.split('-')
      return `${month}/${year.slice(2)}`
    }
    return tickItem
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`Date: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={formatXAxisLabel} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="views" fill="#3B82F6" name="Views" />
          <Bar dataKey="likes" fill="#10B981" name="Likes" />
          <Bar dataKey="comments" fill="#F59E0B" name="Comments" />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={formatXAxisLabel} />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="views"
          stroke="#3B82F6"
          strokeWidth={2}
          name="Views"
        />
        <Line
          type="monotone"
          dataKey="likes"
          stroke="#10B981"
          strokeWidth={2}
          name="Likes"
        />
        <Line
          type="monotone"
          dataKey="comments"
          stroke="#F59E0B"
          strokeWidth={2}
          name="Comments"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PerformanceChart
