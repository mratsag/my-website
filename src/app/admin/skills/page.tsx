// app/admin/skills/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Skill, SkillForm } from '@/lib/types'
import { getProficiencyText, formatErrorMessage } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Code, 
  Star,
  Tag,
  Settings,
  Layers,
  Zap
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface GroupedSkills {
  [category: string]: Skill[]
}

function SkillsPage() {
  const [skills, setSkills] = useState<GroupedSkills>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<SkillForm>({
    name: '',
    category: '',
    proficiency: 3
  })

  // Predefined categories
  const categories = [
    { id: 'frontend', name: 'Frontend', icon: Code, color: 'bg-blue-500' },
    { id: 'backend', name: 'Backend', icon: Settings, color: 'bg-green-500' },
    { id: 'database', name: 'Database', icon: Layers, color: 'bg-purple-500' },
    { id: 'devops', name: 'DevOps', icon: Zap, color: 'bg-orange-500' },
    { id: 'tools', name: 'Tools', icon: Tag, color: 'bg-gray-500' },
    { id: 'other', name: 'Other', icon: Star, color: 'bg-indigo-500' }
  ]

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/skills')
      const data = await response.json()
      
      if (response.ok) {
        setSkills(data.data || {})
      } else {
        setError(data.error || 'Yetenekler yüklenemedi')
      }
    } catch (err) {
      setError('Yetenekler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : '/api/skills'
      const method = editingSkill ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'İşlem başarılı')
        setIsModalOpen(false)
        setEditingSkill(null)
        resetForm()
        fetchSkills()
      } else {
        setError(data.error || 'İşlem başarısız')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (skill: Skill) => {
    if (!confirm(`"${skill.name}" yeteneğini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/skills/${skill.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Yetenek silindi')
        fetchSkills()
      } else {
        setError(data.error || 'Yetenek silinemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const openModal = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill)
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      })
    } else {
      setEditingSkill(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      proficiency: 3
    })
  }

  const getFilteredSkills = () => {
    let filteredSkills = { ...skills }

    // Category filter
    if (selectedCategory !== 'all') {
      filteredSkills = {
        [selectedCategory]: skills[selectedCategory] || []
      }
    }

    // Search filter
    if (searchTerm) {
      const searchResults: GroupedSkills = {}
      Object.entries(filteredSkills).forEach(([category, categorySkills]) => {
        const matchingSkills = categorySkills.filter(skill =>
          skill.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        if (matchingSkills.length > 0) {
          searchResults[category] = matchingSkills
        }
      })
      filteredSkills = searchResults
    }

    return filteredSkills
  }

  const getTotalSkillCount = () => {
    return Object.values(skills).reduce((total, categorySkills) => total + categorySkills.length, 0)
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.icon : Code
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.color : 'bg-gray-500'
  }

  const renderProficiencyStars = (proficiency: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < proficiency ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const filteredSkills = getFilteredSkills()

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
          <h1 className="text-3xl font-bold text-gray-900">Yetenekler</h1>
          <p className="text-gray-600 mt-1">Teknik yeteneklerinizi yönetin ({getTotalSkillCount()} yetenek)</p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yetenek
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <InputWithIcon
            leftIcon={Search}
            placeholder="Yetenek ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
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

      {/* Skills by Category */}
      <div className="space-y-8">
        {Object.entries(filteredSkills).map(([categoryId, categorySkills]) => {
          const CategoryIcon = getCategoryIcon(categoryId)
          const categoryName = categories.find(cat => cat.id === categoryId)?.name || categoryId
          
          return (
            <div key={categoryId} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Category Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <div className={`w-10 h-10 ${getCategoryColor(categoryId)} rounded-lg flex items-center justify-center mr-3`}>
                    <CategoryIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{categoryName}</h3>
                    <p className="text-sm text-gray-600">{categorySkills.length} yetenek</p>
                  </div>
                </div>
              </div>

              {/* Skills Grid */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorySkills.map((skill) => (
                    <div key={skill.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => openModal(skill)}
                            className="text-gray-400 hover:text-blue-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(skill)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {renderProficiencyStars(skill.proficiency)}
                        </div>
                        <span className="text-xs text-gray-500 font-medium">
                          {getProficiencyText(skill.proficiency)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {Object.keys(filteredSkills).length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Code className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Yetenek bulunamadı' : 'Henüz yetenek yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
              : 'İlk yeteneğinizi ekleyerek başlayın'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Yetenek Ekle
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? 'Yetenek Düzenle' : 'Yeni Yetenek'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputWithIcon
            label="Yetenek Adı"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
            placeholder="Örn: React, Node.js, Python"
            leftIcon={Code}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Kategori seçin</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Yeterlilik Seviyesi
            </label>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="proficiency"
                    value={level}
                    checked={formData.proficiency === level}
                    onChange={(e) => setFormData(prev => ({ ...prev, proficiency: Number(e.target.value) }))}
                    className="mr-3"
                  />
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {renderProficiencyStars(level)}
                    </div>
                    <span className="text-sm text-gray-600">
                      {getProficiencyText(level)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
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
              {editingSkill ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(SkillsPage)