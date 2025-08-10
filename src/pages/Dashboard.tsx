/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatDistanceToNow } from 'date-fns'
import {
  Activity,
  BarChart3,
  Calendar,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  TrendingUp,
} from 'lucide-react'
import type React from 'react'
import EnhancedBarChart from '../components/charts/EnhancedBarChart'
import EnhancedLineChart from '../components/charts/EnhancedLineChart'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import { useGetDashboardStatsQuery } from '../redux/features/analytics/analyticsApi'

const Dashboard: React.FC = () => {
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery()
  const stats = statsResponse?.data

  const performanceData = [
    { date: 'Jan', views: 4000, likes: 240, comments: 140 },
    { date: 'Feb', views: 3000, likes: 139, comments: 221 },
    { date: 'Mar', views: 2000, likes: 980, comments: 229 },
    { date: 'Apr', views: 2780, likes: 390, comments: 200 },
    { date: 'May', views: 1890, likes: 480, comments: 218 },
    { date: 'Jun', views: 2390, likes: 380, comments: 250 },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold mb-2">
            Failed to load dashboard
          </h3>
          <p className="text-red-600 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Articles',
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600',
      trend: { value: 12, isPositive: true },
      subtitle: 'All time',
    },
    {
      title: 'Published Articles',
      value: stats?.publishedArticles || 0,
      icon: TrendingUp,
      color: 'bg-gradient-to-r from-green-500 to-green-600',
      trend: { value: 8, isPositive: true },
      subtitle: 'Live content',
    },
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600',
      trend: { value: 23, isPositive: true },
      subtitle: 'All articles',
    },
    {
      title: 'Engagement',
      value: (stats?.totalLikes || 0) + (stats?.totalComments || 0),
      icon: Heart,
      color: 'bg-gradient-to-r from-pink-500 to-pink-600',
      trend: { value: 5, isPositive: false },
      subtitle: 'Likes + Comments',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">
              Here's what's happening with your content today
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Activity className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <Card className="col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Performance Overview
              </h2>
            </div>
            <Badge variant="info" size="sm">
              Last 6 months
            </Badge>
          </div>
          <EnhancedBarChart
            data={performanceData}
            dataKeys={[
              { key: 'views', name: 'Views', color: '#3B82F6' },
              { key: 'likes', name: 'Likes', color: '#10B981' },
              { key: 'comments', name: 'Comments', color: '#F59E0B' },
            ]}
            xAxisKey="date"
            height={300}
          />
        </Card>

        {/* Engagement Trends */}
        <Card className="col-span-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Engagement Trends
              </h2>
            </div>
            <Badge variant="success" size="sm">
              Growing
            </Badge>
          </div>
          <EnhancedLineChart
            data={performanceData}
            dataKeys={[
              { key: 'views', name: 'Views', color: '#3B82F6', strokeWidth: 3 },
              { key: 'likes', name: 'Likes', color: '#10B981', strokeWidth: 3 },
            ]}
            xAxisKey="date"
            height={300}
            type="area"
          />
        </Card>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Articles */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Articles
              </h2>
            </div>
            <Badge variant="default" size="sm">
              {stats?.recentArticles?.length || 0} articles
            </Badge>
          </div>

          {stats?.recentArticles && stats.recentArticles.length > 0 ? (
            <div className="space-y-4">
              {stats.recentArticles.slice(0, 5).map((article: any) => (
                <div
                  key={article._id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {article.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(article.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <Badge
                        variant={
                          article.status === 'published' ? 'success' : 'warning'
                        }
                        size="sm"
                      >
                        {article.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 ml-4">
                    <span className="flex items-center bg-blue-50 px-2 py-1 rounded-lg">
                      <Eye className="h-3 w-3 mr-1 text-blue-600" />
                      <span className="text-blue-600 font-medium">
                        {article.views}
                      </span>
                    </span>
                    <span className="flex items-center bg-green-50 px-2 py-1 rounded-lg">
                      <Heart className="h-3 w-3 mr-1 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {article.likes}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-500">
                Start creating your first article to see it here.
              </p>
            </div>
          )}
        </Card>

        {/* Top Performers */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Top Performers
              </h2>
            </div>
          </div>

          {stats?.topPerformingArticles &&
          stats.topPerformingArticles.length > 0 ? (
            <div className="space-y-4">
              {stats.topPerformingArticles
                .slice(0, 5)
                .map((article: any, index: number) => (
                  <div
                    key={article._id}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                          index === 0
                            ? 'bg-yellow-500'
                            : index === 1
                            ? 'bg-gray-400'
                            : index === 2
                            ? 'bg-orange-500'
                            : 'bg-blue-500'
                        }`}
                      >
                        #{index + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate mb-1">
                        {article.title}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {article.likes}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {article.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">No published articles yet</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
