export interface Article {
  _id: string
  title: string
  content: string
  author: string
  authorName?: string
  publishedDate: string
  status: 'published' | 'draft'
  views: number
  likes: number
  comments: number
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateArticleRequest {
  title: string
  content: string
  status?: 'published' | 'draft'
  tags?: string[]
}

export interface UpdateArticleRequest {
  title?: string
  content?: string
  status?: 'published' | 'draft'
  tags?: string[]
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

export interface DashboardStats {
  totalArticles: number
  publishedArticles: number
  draftArticles: number
  totalViews: number
  totalLikes: number
  totalComments: number
  recentArticles: Article[]
  topPerformingArticles: Article[]
}

export interface PerformanceData {
  date: string
  views: number
  likes: number
  comments: number
}

export interface ArticleFiltersQuy {
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
