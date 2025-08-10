/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface EnhancedLineChartProps {
  data: any[]
  dataKeys: {
    key: string
    name: string
    color: string
    strokeWidth?: number
  }[]
  xAxisKey: string
  title?: string
  height?: number
  type?: 'line' | 'area'
  smooth?: boolean
}

const EnhancedLineChart: React.FC<EnhancedLineChartProps> = ({
  data,
  dataKeys,
  xAxisKey,
  title,
  height = 400,
  type = 'line',
  smooth = true,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div
              key={index}
              className="flex items-center justify-between min-w-32"
            >
              <span className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600">{entry.name}:</span>
              </span>
              <span className="font-semibold text-gray-900 ml-2">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  const ChartComponent = type === 'area' ? AreaChart : LineChart

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            {type === 'area' &&
              dataKeys.map((dataKey, index) => (
                <linearGradient
                  key={index}
                  id={`gradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={dataKey.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={dataKey.color}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey={xAxisKey}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          {type === 'area'
            ? dataKeys.map((dataKey, index) => (
                <Area
                  key={dataKey.key}
                  type={smooth ? 'monotone' : 'linear'}
                  dataKey={dataKey.key}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  strokeWidth={dataKey.strokeWidth || 3}
                  fill={`url(#gradient-${index})`}
                />
              ))
            : dataKeys.map((dataKey) => (
                <Line
                  key={dataKey.key}
                  type={smooth ? 'monotone' : 'linear'}
                  dataKey={dataKey.key}
                  name={dataKey.name}
                  stroke={dataKey.color}
                  strokeWidth={dataKey.strokeWidth || 3}
                  dot={{ fill: dataKey.color, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: dataKey.color, strokeWidth: 2 }}
                />
              ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  )
}

export default EnhancedLineChart
