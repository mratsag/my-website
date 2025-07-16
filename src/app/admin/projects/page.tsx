// app/admin/projects/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Project, ProjectForm } from '@/lib/types'
import { formatDate, formatErrorMessage } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Github, 
  Star,
  Calendar,
  Tag,
  Globe,
  FolderOpen
} from 'lucide-react'
import { useEffect, useState } from 'react'

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deletingProject, setDeletingProject] = useState<Project | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ProjectForm>({
    title: '',
    description: '',
    technologies: [],
    image_url: '',
    demo_url: '',
    github_url: '',
    featured: false
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      const data = await response.json()
      
      if (response.ok) {
        setProjects(data.data || [])
      } else {
        setError(data.error || 'Projeler yüklenemedi')
      }
    } catch (err) {
      setError('Projeler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects'
      const method = editingProject ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'İşlem başarılı')
        setIsModalOpen(false)
        setEditingProject(null)
        resetForm()
        fetchProjects()
      } else {
        setError(data.error || 'İşlem başarısız')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (project: Project) => {
    if (!confirm(`"${project.title}" projesini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Proje silindi')
        fetchProjects()
      } else {
        setError(data.error || 'Proje silinemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const openModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        technologies: project.technologies,
        image_url: project.image_url || '',
        demo_url: project.demo_url || '',
        github_url: project.github_url || '',
        featured: project.featured
      })
    } else {
      setEditingProject(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      technologies: [],
      image_url: '',
      demo_url: '',
      github_url: '',
      featured: false
    })
  }

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.technologies.some(tech => 
      tech.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech)
    setFormData(prev => ({ ...prev, technologies }))
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
          <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
          <p className="text-gray-600 mt-1">Portföy projelerinizi yönetin</p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Proje
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <InputWithIcon
          leftIcon={Search}
          placeholder="Projeler, teknolojiler veya açıklamalar arayın..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            {/* Project Image */}
            {project.image_url && (
              <div className="h-48 bg-gray-100 relative">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {project.featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Öne Çıkan
                  </div>
                )}
              </div>
            )}

            {/* Project Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {project.title}
                </h3>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={() => openModal(project)}
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 mb-4">
                {project.technologies.slice(0, 3).map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    +{project.technologies.length - 3} daha
                  </span>
                )}
              </div>

              {/* Action Links */}
              <div className="flex items-center space-x-3 text-sm">
                {project.demo_url && (
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Demo
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Github className="w-4 h-4 mr-1" />
                    GitHub
                  </a>
                )}
              </div>

              {/* Date */}
              <div className="flex items-center text-xs text-gray-500 mt-4">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(project.created_at)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <FolderOpen className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Proje bulunamadı' : 'Henüz proje yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
              : 'İlk projenizi ekleyerek başlayın'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Proje Ekle
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProject ? 'Proje Düzenle' : 'Yeni Proje'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Proje Başlığı"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
              placeholder="Örn: E-ticaret Sitesi"
            />
            
            <InputWithIcon
              label="Resim URL'si"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Açıklama
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
              placeholder="Proje hakkında detaylı bilgi verin..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <InputWithIcon
            label="Teknolojiler"
            value={formData.technologies.join(', ')}
            onChange={handleTechnologiesChange}
            placeholder="React, TypeScript, Node.js (virgülle ayırın)"
            helperText="Teknolojileri virgülle ayırarak yazın"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Demo URL'si"
              value={formData.demo_url}
              onChange={(e) => setFormData(prev => ({ ...prev, demo_url: e.target.value }))}
              placeholder="https://demo.example.com"
            />
            
            <InputWithIcon
              label="GitHub URL'si"
              value={formData.github_url}
              onChange={(e) => setFormData(prev => ({ ...prev, github_url: e.target.value }))}
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
              Öne çıkan proje olarak işaretle
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
            >
              {editingProject ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(ProjectsPage)