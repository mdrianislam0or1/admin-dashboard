import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface AdminState {
  sidebarOpen: boolean
  currentPage: string
  filters: {
    search: string
    status: string
    author: string
    startDate: string
    endDate: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
  }
  pagination: {
    page: number
    limit: number
  }
}

const initialState: AdminState = {
  sidebarOpen: true,
  currentPage: 'dashboard',
  filters: {
    search: '',
    status: '',
    author: '',
    startDate: '',
    endDate: '',
    sortBy: 'publishedDate',
    sortOrder: 'desc',
  },
  pagination: {
    page: 1,
    limit: 10,
  },
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<Partial<AdminState['filters']>>
    ) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setPagination: (
      state,
      action: PayloadAction<Partial<AdminState['pagination']>>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.pagination = initialState.pagination
    },
  },
})

export const {
  toggleSidebar,
  setCurrentPage,
  setFilters,
  setPagination,
  resetFilters,
} = adminSlice.actions

export default adminSlice.reducer
