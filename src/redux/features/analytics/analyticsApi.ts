import type { ApiResponse, DashboardStats } from '../../../types'
import type { PerformanceData } from '../../../types/article'
import { baseApi } from '../../api/apiSlice'

interface AnalyticsQuery {
  articleId?: string
  startDate?: string
  endDate?: string
  period?: 'daily' | 'monthly'
}

const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => '/analytics/dashboard',
      providesTags: ['Analytics'],
    }),

    getPerformanceData: builder.query<
      ApiResponse<PerformanceData[]>,
      AnalyticsQuery
    >({
      query: (params) => {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            searchParams.append(key, value.toString())
          }
        })
        return `/analytics/performance?${searchParams.toString()}`
      },
      providesTags: ['Analytics'],
    }),

    getArticleAnalytics: builder.query<
      ApiResponse<PerformanceData[]>,
      { articleId: string; period?: 'daily' | 'monthly' }
    >({
      query: ({ articleId, period = 'daily' }) =>
        `/analytics/article/${articleId}?period=${period}`,
      providesTags: (_result, _error, { articleId }) => [
        { type: 'Analytics', id: articleId },
      ],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetPerformanceDataQuery,
  useGetArticleAnalyticsQuery,
} = analyticsApi

export { analyticsApi }
