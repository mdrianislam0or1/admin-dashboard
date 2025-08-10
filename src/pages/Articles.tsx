/* eslint-disable @typescript-eslint/no-explicit-any */

import { formatDistanceToNow } from 'date-fns'
import {
  Calendar,
  Edit,
  Eye,
  FileText,
  Heart,
  MessageCircle,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import type React from 'react'
import { useEffect, useState } from 'react'
import ArticleFilters from '../components/articles/ArticleFilters'
import ArticleModal from '../components/articles/ArticleModal'
import Badge from '../components/ui/Badge'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import {
  useCreateArticleMutation,
  useDeleteArticleMutation,
  useGetArticlesQuery,
  useUpdateArticleMutation,
} from '../redux/features/articles/articlesApi'
import { useAppSelector } from '../redux/hooks'
import type { Article, ArticleFiltersQuy } from '../types/article'

const Articles: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid')

  const { user } = useAppSelector((state) => state.auth)

  const { filters, pagination } = useAppSelector((state) => state.admin)

  const validSortFields = [
    'views',
    'likes',
    'comments',
    'publishedDate',
    'title',
  ] as const

  const queryParams: Partial<ArticleFiltersQuy> = {
    ...filters,
    page: pagination.page,
    limit: pagination.limit,
    status:
      filters.status === 'published' || filters.status === 'draft'
        ? filters.status
        : undefined,
    sortBy: validSortFields.includes(filters.sortBy as any)
      ? (filters.sortBy as (typeof validSortFields)[number])
      : undefined,
    sortOrder:
      filters.sortOrder === 'asc' || filters.sortOrder === 'desc'
        ? filters.sortOrder
        : undefined,
  }

  const {
    data: articlesResponse,
    isLoading,
    refetch,
  } = useGetArticlesQuery(queryParams)

  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation()
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation()
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation()

  const articles = articlesResponse?.data || []
  const paginationData = articlesResponse?.pagination

  useEffect(() => {
    refetch()
  }, [filters, pagination, refetch])

  const handleCreateArticle = async (data: any) => {
    await createArticle(data).unwrap()
    setIsModalOpen(false)
  }

  const handleUpdateArticle = async (data: any) => {
    if (selectedArticle) {
      await updateArticle({ id: selectedArticle._id, data }).unwrap()
      setIsModalOpen(false)
      setSelectedArticle(null)
    }
  }

  const handleDeleteArticle = async (id: string) => {
    await deleteArticle(id).unwrap()
    setDeleteConfirm(null)
  }

  const openEditModal = (article: Article) => {
    setSelectedArticle(article)
    setIsModalOpen(true)
  }

  const openCreateModal = () => {
    setSelectedArticle(null)
    setIsModalOpen(true)
  }

  const canEdit = (article: Article) => {
    return user?.role === 'admin' || article.author === user?._id
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600 font-medium">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600 mt-1">Manage and organize your content</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              Table
            </button>
          </div>
          <Button
            onClick={openCreateModal}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Article
          </Button>
        </div>
      </div>

      <ArticleFilters />

      {/* Articles Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Card
              key={article._id}
              className="group hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Article Header */}
                <div className="flex items-start justify-between">
                  <Badge
                    variant={
                      article.status === 'published' ? 'success' : 'warning'
                    }
                    size="sm"
                  >
                    {article.status}
                  </Badge>
                  {canEdit(article) && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.content.substring(0, 150)}...
                  </p>
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {article.authorName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span>{article.authorName || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDistanceToNow(new Date(article.publishedDate), {
                      addSuffix: true,
                    })}
                  </div>
                </div>

                {/* Engagement Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-gray-500">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {article.views}
                      </span>
                    </span>
                    <span className="flex items-center text-gray-500">
                      <Heart className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {article.likes}
                      </span>
                    </span>
                    <span className="flex items-center text-gray-500">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">
                        {article.comments}
                      </span>
                    </span>
                  </div>

                  {canEdit(article) && (
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(article)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirm(article._id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Engagement
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article: any) => (
                  <tr
                    key={article._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="text-sm font-semibold text-gray-900 truncate mb-1">
                          {article.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {article.content.substring(0, 100)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-sm font-medium">
                            {article.authorName?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {article.authorName || 'Unknown'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={
                          article.status === 'published' ? 'success' : 'warning'
                        }
                        size="sm"
                      >
                        {article.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          <Eye className="h-3 w-3 mr-1" />
                          {article.views}
                        </span>
                        <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <Heart className="h-3 w-3 mr-1" />
                          {article.likes}
                        </span>
                        <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-lg">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {article.comments}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDistanceToNow(new Date(article.publishedDate), {
                          addSuffix: true,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canEdit(article) && (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(article)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteConfirm(article._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          {paginationData && paginationData.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">
                    {(paginationData.page - 1) * paginationData.limit + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(
                      paginationData.page * paginationData.limit,
                      paginationData.total
                    )}
                  </span>{' '}
                  of <span className="font-medium">{paginationData.total}</span>{' '}
                  results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={paginationData.page === 1}
                    className="border"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from(
                      { length: Math.min(5, paginationData.totalPages) },
                      (_, i) => {
                        const page = i + 1
                        return (
                          <button
                            key={page}
                            className={`px-3 py-1 text-sm rounded-md ${
                              page === paginationData.page
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      }
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={paginationData.page === paginationData.totalPages}
                    className="border"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Empty State */}
      {articles.length === 0 && (
        <Card className="text-center py-12">
          <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No articles found
          </h3>
          <p className="text-gray-600 mb-6">
            Get started by creating your first article
          </p>
          <Button
            onClick={openCreateModal}
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Article
          </Button>
        </Card>
      )}

      {/* Modals */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedArticle(null)
        }}
        article={selectedArticle}
        onSave={selectedArticle ? handleUpdateArticle : handleCreateArticle}
        loading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
              onClick={() => setDeleteConfirm(null)}
            />
            <Card className="relative max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Article
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Are you sure you want to delete this article? This action
                  cannot be undone.
                </p>
                <div className="flex justify-center space-x-3">
                  <Button
                    variant="secondary"
                    onClick={() => setDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    loading={isDeleting}
                    onClick={() => handleDeleteArticle(deleteConfirm)}
                  >
                    Delete Article
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

export default Articles
