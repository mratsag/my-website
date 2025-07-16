// app/admin/experiences/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Experience, ExperienceForm } from '@/lib/types'
import { formatDate, formatErrorMessage } from '@/lib/utils'
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Building, 
  Calendar,
  MapPin,
  Briefcase,
  Clock
} from 'lucide-react'
import { useEffect, useState } from 'react'

function ExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form state
  const [formData, setFormData] = useState<ExperienceForm>({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    location: ''
  })

  useEffect(() => {
    fetchExperiences()
  }, [])

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/experiences')
      const data = await response.json()
      
      if (response.ok) {
        setExperiences(data.data || [])
      } else {
        setError(data.error || 'Deneyimler yüklenemedi')
      }
    } catch (err) {
      setError('Deneyimler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const url = editingExperience ? `/api/experiences/${editingExperience.id}` : '/api/experiences'
      const method = editingExperience ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'İşlem başarılı')
        setIsModalOpen(false)
        setEditingExperience(null)
        resetForm()
        fetchExperiences()
      } else {
        setError(data.error || 'İşlem başarısız')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (experience: Experience) => {
    if (!confirm(`"${experience.company}" deneyimini silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const response = await fetch(`/api/experiences/${experience.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Deneyim silindi')
        fetchExperiences()
      } else {
        setError(data.error || 'Deneyim silinemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const openModal = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience)
      setFormData({
        company: experience.company,
        position: experience.position,
        description: experience.description,
        start_date: experience.start_date,
        end_date: experience.end_date || '',
        location: experience.location || ''
      })
    } else {
      setEditingExperience(null)
      resetForm()
    }
    setIsModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      description: '',
      start_date: '',
      end_date: '',
      location: ''
    })
  }

  const filteredExperiences = experiences.filter(experience =>
    experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    experience.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = new Date(startDate).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
    const end = endDate 
      ? new Date(endDate).toLocaleDateString('tr-TR', {
          year: 'numeric',
          month: 'long'
        })
      : 'Devam Ediyor'
    
    return `${start} - ${end}`
  }

  const calculateDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const months = Math.floor(diffDays / 30)
    const years = Math.floor(months / 12)
    
    if (years > 0) {
      const remainingMonths = months % 12
      return `${years} yıl${remainingMonths > 0 ? ` ${remainingMonths} ay` : ''}`
    }
    return `${months} ay`
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
          <h1 className="text-3xl font-bold text-gray-900">Deneyimler</h1>
          <p className="text-gray-600 mt-1">İş deneyimlerinizi yönetin</p>
        </div>
        <Button 
          onClick={() => openModal()} 
          className="mt-4 sm:mt-0 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Yeni Deneyim
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <InputWithIcon
          leftIcon={Search}
          placeholder="Şirket, pozisyon veya açıklama arayın..."
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

      {/* Experiences Timeline */}
      <div className="space-y-6">
        {filteredExperiences.map((experience, index) => (
          <div key={experience.id} className="relative">
            {/* Timeline Line */}
            {index < filteredExperiences.length - 1 && (
              <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200 -z-10"></div>
            )}
            
            {/* Experience Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start">
                {/* Timeline Dot */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mr-4">
                  <Building className="w-6 h-6 text-white" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {experience.position}
                      </h3>
                      <div className="flex items-center text-gray-600 mb-2">
                        <Building className="w-4 h-4 mr-1" />
                        <span className="font-medium">{experience.company}</span>
                        {experience.location && (
                          <>
                            <MapPin className="w-4 h-4 ml-3 mr-1" />
                            <span>{experience.location}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span className="mr-3">{formatDateRange(experience.start_date, experience.end_date)}</span>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{calculateDuration(experience.start_date, experience.end_date)}</span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed">
                        {experience.description}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal(experience)}
                        className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(experience)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredExperiences.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            <Briefcase className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Deneyim bulunamadı' : 'Henüz deneyim yok'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
              : 'İlk deneyiminizi ekleyerek başlayın'
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => openModal()}>
              <Plus className="w-4 h-4 mr-2" />
              Deneyim Ekle
            </Button>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExperience ? 'Deneyim Düzenle' : 'Yeni Deneyim'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Şirket"
              value={formData.company}
              onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
              required
              placeholder="Örn: Google"
              leftIcon={Building}
            />
            
            <InputWithIcon
              label="Pozisyon"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              required
              placeholder="Örn: Senior Frontend Developer"
              leftIcon={Briefcase}
            />
          </div>

          <InputWithIcon
            label="Konum"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Örn: İstanbul, Türkiye"
            leftIcon={MapPin}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithIcon
              label="Başlangıç Tarihi"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
              leftIcon={Calendar}
            />
            
            <InputWithIcon
              label="Bitiş Tarihi"
              type="date"
              value={formData.end_date}
              onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
              helperText="Boş bırakırsanız 'Devam Ediyor' olarak görünür"
              leftIcon={Calendar}
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
              placeholder="Bu pozisyondaki sorumluluklarınız ve başarılarınız hakkında yazın..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
              {editingExperience ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default withAuth(ExperiencesPage)