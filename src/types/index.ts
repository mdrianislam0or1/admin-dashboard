export interface IUser {
  _id?: string
  name: string
  email: string
  password: string
  role: 'admin' | 'editor'
  isActive?: boolean
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface IArticle {
  _id?: string
  title: string
  content: string
  author: string
  authorName?: string
  publishedDate: Date
  status: 'published' | 'draft'
  views: number
  likes: number
  comments: number
  tags?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface IAnalytics {
  _id?: string
  articleId: string
  date: Date
  views: number
  likes: number
  comments: number
  createdAt?: Date
}

export interface AuthRequest extends Request {
  user?: {
    _id: string
    name: string
    email: string
    role: string
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'admin' | 'editor'
}

export interface ArticleFilters {
  author?: string
  status?: 'published' | 'draft'
  startDate?: string
  endDate?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: 'views' | 'likes' | 'comments' | 'publishedDate' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface AnalyticsQuery {
  articleId?: string
  startDate?: string
  endDate?: string
  period?: 'daily' | 'monthly'
}

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  totalLikes: number
  totalComments: number
  recentArticles: IArticle[]
  topPerformingArticles: IArticle[]
}

export * from './article'
export * from './auth'
