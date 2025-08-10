/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '../../types/article'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Select from '../ui/Select'

interface ArticleModalProps {
  isOpen: boolean
  onClose: () => void
  article?: Article | null
  onSave: (data: CreateArticleRequest | UpdateArticleRequest) => Promise<void>
  loading?: boolean
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  article,
  onSave,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft' as 'published' | 'draft',
    tags: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        content: article.content,
        status: article.status,
        tags: article.tags?.join(', ') || '',
      })
    } else {
      setFormData({
        title: '',
        content: '',
        status: 'draft',
        tags: '',
      })
    }
    setErrors({})
  }, [article, isOpen])

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      await onSave({
        title: formData.title,
        content: formData.content,
        status: formData.status,
        tags: tags.length > 0 ? tags : undefined,
      })
      onClose()
    } catch (error: any) {
      setErrors({ submit: error?.data?.message || 'Failed to save article' })
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={article ? 'Edit Article' : 'Create New Article'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Enter article title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.content
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : ''
            }`}
            placeholder="Write your article content here..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content}</p>
          )}
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: 'draft', label: 'Draft' },
            { value: 'published', label: 'Published' },
          ]}
        />

        <Input
          label="Tags"
          name="tags"
          value={formData.tags}
          onChange={handleChange}
          placeholder="Enter tags separated by commas"
          helperText="Separate multiple tags with commas"
        />

        {errors.submit && (
          <div className="text-red-600 text-sm">{errors.submit}</div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {article ? 'Update Article' : 'Create Article'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default ArticleModal
