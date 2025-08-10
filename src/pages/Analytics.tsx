'use client'

import {
  Activity,
  BarChart3,
  Calendar,
  Eye,
  Heart,
  LineChart,
  MessageCircle,
  PieChart,
  TrendingUp,
} from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import EnhancedBarChart from '../components/charts/EnhancedBarChart'
import EnhancedLineChart from '../components/charts/EnhancedLineChart'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import StatCard from '../components/ui/StatCard'
import { useGetPerformanceDataQuery } from '../redux/features/analytics/analyticsApi'

const Analytics: React.FC = () => {
  const [filters, setFilters] = useState({
    period: 'daily' as 'daily' | 'monthly',
    startDate: '',
    endDate: '',
  })
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')

  const { data: performanceResponse, isLoading } =
    useGetPerformanceDataQuery(filters)
  const performanceData = performanceResponse?.data || []

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const totals = performanceData.reduce(
    (acc, item) => ({
      views: acc.views + item.views,
      likes: acc.likes + item.likes,
      comments: acc.comments + item.comments,
    }),
    { views: 0, likes: 0, comments: 0 }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Analytics Dashboard 📊</h1>
            <p className="text-purple-100 text-lg">
              Track your content performance and engagement
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Performance Filters
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartType === 'line' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setChartType('line')}
              className="flex items-center"
            >
              <LineChart className="mr-1 h-4 w-4" />
              Line
            </Button>
            <Button
              variant={chartType === 'bar' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setChartType('bar')}
              className="flex items-center"
            >
              <BarChart3 className="mr-1 h-4 w-4" />
              Bar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Period"
            options={[
              { value: 'daily', label: 'Daily View' },
              { value: 'monthly', label: 'Monthly View' },
            ]}
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
          />

          <Input
            label="Start Date"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />

          <Input
            label="End Date"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
      </Card>

      {/* Stats Cards */}
      {performanceData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Views"
            value={totals.views}
            icon={Eye}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend={{ value: 15, isPositive: true }}
            subtitle="All time views"
          />
          <StatCard
            title="Total Likes"
            value={totals.likes}
            icon={Heart}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend={{ value: 8, isPositive: true }}
            subtitle="Engagement metric"
          />
          <StatCard
            title="Total Comments"
            value={totals.comments}
            icon={MessageCircle}
            color="bg-gradient-to-r from-yellow-500 to-yellow-600"
            trend={{ value: 3, isPositive: false }}
            subtitle="User interactions"
          />
        </div>
      )}

      {/* Main Chart */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Performance Overview
            </h2>
          </div>
          <Badge variant="info" size="sm">
            {filters.period === 'daily' ? 'Daily' : 'Monthly'} View
          </Badge>
        </div>

        {performanceData.length > 0 ? (
          chartType === 'bar' ? (
            <EnhancedBarChart
              data={performanceData}
              dataKeys={[
                { key: 'views', name: 'Views', color: '#3B82F6' },
                { key: 'likes', name: 'Likes', color: '#10B981' },
                { key: 'comments', name: 'Comments', color: '#F59E0B' },
              ]}
              xAxisKey="date"
              height={400}
            />
          ) : (
            <EnhancedLineChart
              data={performanceData}
              dataKeys={[
                {
                  key: 'views',
                  name: 'Views',
                  color: '#3B82F6',
                  strokeWidth: 3,
                },
                {
                  key: 'likes',
                  name: 'Likes',
                  color: '#10B981',
                  strokeWidth: 3,
                },
                {
                  key: 'comments',
                  name: 'Comments',
                  color: '#F59E0B',
                  strokeWidth: 3,
                },
              ]}
              xAxisKey="date"
              height={400}
              type="area"
            />
          )
        ) : (
          <div className="text-center py-16">
            <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No data available
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your date range or check back later for analytics
              data.
            </p>
            <Badge variant="warning">No data in selected period</Badge>
          </div>
        )}
      </Card>

      {/* Additional Analytics Cards */}
      {performanceData.length > 0 && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Engagement Breakdown */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <PieChart className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Engagement Breakdown
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Views</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {totals.views.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(
                      (totals.views /
                        (totals.views + totals.likes + totals.comments)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Likes</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {totals.likes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(
                      (totals.likes /
                        (totals.views + totals.likes + totals.comments)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium text-gray-900">Comments</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {totals.comments.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {(
                      (totals.comments /
                        (totals.views + totals.likes + totals.comments)) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Performance Insights */}
          <Card>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Activity className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Performance Insights
              </h2>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Engagement Rate
                  </span>
                  <Badge variant="success" size="sm">
                    Good
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {totals.views > 0
                    ? (
                        ((totals.likes + totals.comments) / totals.views) *
                        100
                      ).toFixed(2)
                    : 0}
                  %
                </div>
                <p className="text-sm text-gray-600">
                  Likes and comments per view
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Average Daily Views
                  </span>
                  <Badge variant="info" size="sm">
                    Trending
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {performanceData.length > 0
                    ? Math.round(
                        totals.views / performanceData.length
                      ).toLocaleString()
                    : 0}
                </div>
                <p className="text-sm text-gray-600">
                  Views per day in selected period
                </p>
              </div>

              <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Comment Ratio
                  </span>
                  <Badge variant="warning" size="sm">
                    Monitor
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {totals.likes > 0
                    ? (totals.comments / totals.likes).toFixed(2)
                    : 0}
                </div>
                <p className="text-sm text-gray-600">Comments per like</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default Analytics
