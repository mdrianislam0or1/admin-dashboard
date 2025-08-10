import { Filter, Search, X } from 'lucide-react'
import type React from 'react'
import { resetFilters, setFilters } from '../../redux/features/admin/adminSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Select from '../ui/Select'

const ArticleFilters: React.FC = () => {
  const dispatch = useAppDispatch()
  const { filters } = useAppSelector((state) => state.admin)

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== '' && value !== 'publishedDate' && value !== 'desc'
  )

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Filter className="mr-2 h-5 w-5" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="flex items-center"
          >
            <X className="mr-1 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search articles..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          options={[
            { value: '', label: 'All Status' },
            { value: 'published', label: 'Published' },
            { value: 'draft', label: 'Draft' },
          ]}
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        />

        <Input
          type="date"
          placeholder="Start Date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
        />

        <Input
          type="date"
          placeholder="End Date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
        />
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex items-center space-x-4">
          <Select
            options={[
              { value: 'publishedDate', label: 'Sort by Date' },
              { value: 'title', label: 'Sort by Title' },
              { value: 'views', label: 'Sort by Views' },
              { value: 'likes', label: 'Sort by Likes' },
              { value: 'comments', label: 'Sort by Comments' },
            ]}
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          />

          <Select
            options={[
              { value: 'desc', label: 'Descending' },
              { value: 'asc', label: 'Ascending' },
            ]}
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default ArticleFilters
