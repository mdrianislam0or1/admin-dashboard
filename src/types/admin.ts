export interface IAdminDashboard {
  totalUsers: number
  totalLawyers: number
  totalConsultations: number
  totalPayments: number
  totalRevenue: number
  todayStats: {
    newUsers: number
    newConsultations: number
    completedConsultations: number
    revenue: number
  }
  weeklyStats: {
    consultations: number[]
    revenue: number[]
    users: number[]
  }
  pendingVerifications: number
  pendingRefunds: number
  activeOperators: number
}

export interface IUserQuery {
  role?: string
  isVerified?: string
  district?: string
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
}

export interface ILawyerVerificationQuery {
  status?: 'pending' | 'approved' | 'rejected'
  district?: string
  specialization?: string
  page?: number
  limit?: number
}

export interface IVerifyLawyerRequest {
  status: 'approved' | 'rejected'
  notes?: string
}

export interface IConsultationQuery {
  status?: string
  consultationType?: string
  lawyerId?: string
  clientId?: string
  operatorId?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

export interface IPaymentQuery {
  status?: string
  paymentMethod?: string
  startDate?: string
  endDate?: string
  minAmount?: string
  maxAmount?: string
  page?: number
  limit?: number
}

export interface IAnalyticsQuery {
  startDate: string
  endDate: string
  groupBy?: 'day' | 'week' | 'month'
  metrics?: string[]
}

export interface IAnalyticsExportRequest {
  startDate: string
  endDate: string
  format: 'csv' | 'excel' | 'pdf'
  includeMetrics: string[]
  email?: string
}

export interface IRefundRequestQuery {
  status?: 'pending' | 'approved' | 'rejected'
  startDate?: string
  endDate?: string
  minAmount?: string
  maxAmount?: string
  page?: number
  limit?: number
}

export interface IApproveRefundRequest {
  status: 'approved' | 'rejected'
  notes?: string
  refundAmount?: number
}

export interface IAnalyticsData {
  consultationStats: {
    total: number
    completed: number
    cancelled: number
    pending: number
    byType: { [key: string]: number }
    byDistrict: { [key: string]: number }
  }
  paymentStats: {
    totalRevenue: number
    totalTransactions: number
    averageAmount: number
    byMethod: { [key: string]: number }
    refundRate: number
  }
  userStats: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    byRole: { [key: string]: number }
    byDistrict: { [key: string]: number }
  }
  lawyerStats: {
    totalLawyers: number
    activeLawyers: number
    verifiedLawyers: number
    averageRating: number
    bySpecialization: { [key: string]: number }
  }
  aiStats: {
    totalSessions: number
    escalatedSessions: number
    escalationRate: number
    averageQuestionsPerSession: number
  }
}

export interface ISuspendUserRequest {
  reason: string
}

export interface ISystemLog {
  timestamp: Date
  level: string
  message: string
  userId?: string
  ip?: string
  paymentId?: string
  error?: string
}

export interface ISystemLogsQuery {
  page: number
  limit: number
  level?: string
  startDate?: string
  endDate?: string
}

export interface IPaginatedResponse<T> {
  data?: T[]
  users?: T[]
  lawyers?: T[]
  consultations?: T[]
  payments?: T[]
  refundRequests?: T[]
  logs?: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
