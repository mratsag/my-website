// app/admin/blog/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { BlogPost, BlogPostForm } from '@/lib/types'
import { formatDate, formatRelativeTime, formatErrorMessage, generateSlug, truncateText } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  FileText, 
  Eye,
  EyeOff,
  Calendar,
  User,
  ExternalLink,
  Save,
  Globe,
  PenTool as Draft
} from 'lucide-react'
import { useEffect, useState } from 'react'

function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    image_url: '',
    published: false
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/blog')
      const data = await response.json()
      
      if (response.ok) {
        setPosts(data.data || [])
      } else {
        setError(data.error || 'Blog yazıları yüklenemedi')
      }
    } catch (err) {
      setError('Blog yazıları yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      // Slug'ı otomatik oluştur
      const slug = formData.slug || generateSlug(formData.title)
      const postData = { ...formData, slug }

      const url = editingPost ? `/api/blog/${editingPost.slug}` : '/api/blog'
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'İşlem başarılı')
        setIsModalOpen(false)
        setEditingPost(null)
        resetForm()
        fetchPosts()
      } else {
        setError(data.error || 'İşlem başarısız')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`"${post.title}" yazısını silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Yazı silindi')
        fetchPosts()
      } else {
        setError(data.error || 'Yazı silinemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const handleTogglePublish = async (post: BlogPost) => {
    try {
      const response = await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, published: !post.published })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Durum güncellendi')
        fetchPosts()
      } else {
        setError(data.error || 'Durum güncellenemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const openModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post)
      setFormData({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        image_url: post.image_url || '',
        published: post.published
      })
    } else {
      setEditingPost(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      image_url: '',
      published: false
    })
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'published' && post.published) ||
      (filterStatus === 'draft' && !post.published)

    return matchesSearch && matchesFilter
  })

  const getPublishedCount = () => posts.filter(p => p.published).length
  const getDraftCount = () => posts.filter(p => !p.published).length

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <Globe className="w-3 h-3 mr-1" />
        Yayında
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <FileText className="w-3 h-3 mr-1" />
        Taslak
      </span>
    )
  }

  // Title değiştiğinde slug'ı otomatik oluştur
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600 mt-1">
            {getPublishedCount()} yayında, {getDraftCount()} taslak ({posts.length} toplam)
          </p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yazı
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <InputWithIcon
            leftIcon={Search}
            placeholder="Yazı başlığı, içerik veya özet ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü ({posts.length})
          </button>
          <button
            onClick={() => setFilterStatus('published')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'published' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yayında ({getPublishedCount()})
          </button>
          <button
            onClick={() => setFilterStatus('draft')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'draft' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Taslak ({getDraftCount()})
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <Alert type="error" className="mb-4" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert type="success" className="mb-4" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Post Image */}
            {post.image_url && (
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  {getStatusBadge(post.published)}
                </div>
              </div>
            )}

            {/* Post Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {post.title}
                </h3>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => openModal(post)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className={`transition-colors ${
                      post.published 
                        ? 'text-gray-400 hover:text-orange-600' 
                        : 'text-gray-400 hover:text-green-600'
                    }`}
                    title={post.published ? 'Yayından kaldır' : 'Yayınla'}
                  >
                    {post.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!post.image_url && (
                <div className="mb-3">
                  {getStatusBadge(post.published)}
                </div>
              )}

              {post.excerpt && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
              )}

              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(post.created_at)}
                </div>
                {post.updated_at !== post.created_at && (
                  <>
                    <span>•</span>
                    <span>Güncellendi: {formatRelativeTime(post.updated_at)}</span>
                  </>
                )}
              </div>

              {/* Word Count */}
              <div className="mt-3 text-xs text-gray-500">
                {post.content.split(' ').length} kelime
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FileText className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Yazı bulunamadı' : 'Henüz blog yazısı yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
              : 'İlk blog yazınızı ekleyerek başlayın'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Yazı Ekle
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? 'Yazı Düzenle' : 'Yeni Yazı'}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Başlık"
              value={formData.title}
              onChange={handleTitleChange}
              required
              placeholder="Yazı başlığı"
              leftIcon={FileText}
            />
            
            <InputWithIcon
              label="Slug (URL)"
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
              placeholder="yazi-url-slug"
              helperText="Boş bırakırsanız başlıktan otomatik oluşturulur"
              leftIcon={ExternalLink}
            />
          </div>

          <InputWithIcon
            label="Kapak Resmi URL'si"
            value={formData.image_url}
            onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
            placeholder="https://example.com/image.jpg"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kısa Açıklama (Excerpt)
            </label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              placeholder="Yazının kısa açıklaması (isteğe bağlı)"
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İçerik *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              rows={12}
              required
              placeholder="Yazı içeriğini buraya yazın..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Markdown formatını kullanabilirsiniz
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
              Hemen yayınla
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              İptal
            </Button>
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {editingPost ? 'Güncelle' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(BlogPage)