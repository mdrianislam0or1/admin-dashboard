/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ApiResponse,
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  User,
} from '../../../types/auth'
import { baseApi } from '../../api/apiSlice'
import { setCredentials, setLoading, setVerificationPending } from './authSlice'

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<ApiResponse<LoginResponseData>, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true))
        try {
          const { data: response } = await queryFulfilled
          const { user, accessToken } = response.data
          dispatch(setCredentials({ user, accessToken, refreshToken: '' }))
        } catch (error) {
          console.error('Login error:', error)
        } finally {
          dispatch(setLoading(false))
        }
      },
      invalidatesTags: ['Auth'],
    }),

    register: builder.mutation<ApiResponse<User>, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        dispatch(setLoading(true))
        try {
          const { data: response } = await queryFulfilled
          dispatch(setVerificationPending({ userId: response.data._id }))
        } catch (error) {
          console.error('Registration error:', error)
        } finally {
          dispatch(setLoading(false))
        }
      },
      invalidatesTags: ['Auth'],
    }),

    getProfile: builder.query<ApiResponse<User>, void>({
      query: () => '/auth/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: '/auth/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi

export { authApi }
