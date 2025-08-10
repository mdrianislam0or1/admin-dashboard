import type { ApiResponse, ArticleFilters } from '../../../types'
import type {
  Article,
  CreateArticleRequest,
  UpdateArticleRequest,
} from '../../../types/article'
import { baseApi } from '../../api/apiSlice'

const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getArticles: builder.query<ApiResponse<Article[]>, Partial<ArticleFilters>>(
      {
        query: (filters) => {
          const params = new URLSearchParams()
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              params.append(key, value.toString())
            }
          })
          return `/articles?${params.toString()}`
        },
        providesTags: ['Article'],
      }
    ),

    getArticleById: builder.query<ApiResponse<Article>, string>({
      query: (id) => `/articles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Article', id }],
    }),

    createArticle: builder.mutation<ApiResponse<Article>, CreateArticleRequest>(
      {
        query: (articleData) => ({
          url: '/articles',
          method: 'POST',
          body: articleData,
        }),
        invalidatesTags: ['Article'],
      }
    ),

    updateArticle: builder.mutation<
      ApiResponse<Article>,
      { id: string; data: UpdateArticleRequest }
    >({
      query: ({ id, data }) => ({
        url: `/articles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Article', id },
        'Article',
      ],
    }),

    deleteArticle: builder.mutation<ApiResponse<null>, string>({
      query: (id) => ({
        url: `/articles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Article'],
    }),

    incrementViews: builder.mutation<ApiResponse<Article>, string>({
      query: (id) => ({
        url: `/articles/${id}/views`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => [{ type: 'Article', id }],
    }),
  }),
})

export const {
  useGetArticlesQuery,
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useIncrementViewsMutation,
} = articlesApi

export { articlesApi }
