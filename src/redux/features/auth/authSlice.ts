/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState, User } from '../../../types/auth'
import type { RootState } from '../../store'

const loadState = (): AuthState => {
  try {
    const serializedUser = localStorage.getItem('user')
    const serializedToken = localStorage.getItem('token')
    const serializedRefreshToken = localStorage.getItem('refreshToken')

    return {
      user:
        serializedUser && serializedUser !== 'null'
          ? JSON.parse(serializedUser)
          : null,
      token:
        serializedToken && serializedToken !== 'null' ? serializedToken : null,
      refreshToken:
        serializedRefreshToken && serializedRefreshToken !== 'null'
          ? serializedRefreshToken
          : null,
      isLoading: false,
      verificationPending: false,
      userId: null,
    }
  } catch (e) {
    console.error('Failed to load auth state from localStorage:', e)
    return {
      user: null,
      token: null,
      refreshToken: null,
      isLoading: false,
      verificationPending: false,
      userId: null,
    }
  }
}

const initialState: AuthState = loadState()

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        accessToken: string
        refreshToken: string
      }>
    ) => {
      const { user, accessToken, refreshToken } = action.payload

      state.user = user
      state.token = accessToken
      state.refreshToken = refreshToken
      state.isLoading = false

      try {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
      } catch (e) {
        console.error('Failed to save auth state to localStorage:', e)
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setVerificationPending: (
      state,
      action: PayloadAction<{ userId: string }>
    ) => {
      state.verificationPending = true
      state.userId = action.payload.userId
    },

    verificationComplete: (state) => {
      state.verificationPending = false
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isLoading = false
      state.verificationPending = false
      state.userId = null

      try {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      } catch (e) {
        console.error('Failed to clear auth state from localStorage:', e)
      }
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      try {
        localStorage.setItem('user', JSON.stringify(action.payload))
      } catch (e) {
        console.error('Failed to update user in localStorage:', e)
      }
    },

    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      try {
        localStorage.setItem('token', action.payload)
      } catch (e) {
        console.error('Failed to update token in localStorage:', e)
      }
    },
  },
})

export const {
  setCredentials,
  setLoading,
  setVerificationPending,
  verificationComplete,
  logout,
  updateUser,
  updateToken,
} = authSlice.actions

export default authSlice.reducer

export const selectCurrentToken = (state: RootState) => state.auth.token
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token
export const selectUserId = (state: RootState) => state.auth.userId
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken
