/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface User {
  _id: string
  name: string
  email: string
  role: 'admin' | 'editor'
  isActive: boolean
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  role?: 'admin' | 'editor'
}

export interface RegisterClientRequest extends RegisterRequest {}

export interface LoginResponseData {
  user: User
  accessToken: string
  refreshToken?: string
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  error?: any
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  verificationPending: boolean
  userId: string | null
}
