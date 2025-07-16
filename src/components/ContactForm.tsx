// components/ContactForm.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Alert } from '@/components/ui/Alert'
import { ContactForm } from '@/lib/types'
import { formatErrorMessage } from '@/lib/utils'
import { Mail, User, MessageSquare, Send } from 'lucide-react'

export default function ContactFormComponent() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setError(data.error || 'Mesaj gönderilirken hata oluştu')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const isFormValid = formData.name && formData.email && formData.message

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">İletişime Geçin</h2>
        <p className="text-gray-600">
          Projeleriniz hakkında konuşmak veya işbirliği yapmak için mesaj gönderin.
        </p>
      </div>

      {error && (
        <Alert type="error" className="mb-6" onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert type="success" className="mb-6" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWithIcon
            label="Ad Soyad"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Adınızı yazın"
            leftIcon={User}
            disabled={loading}
          />
          
          <InputWithIcon
            label="E-posta"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="email@example.com"
            leftIcon={Mail}
            disabled={loading}
          />
        </div>

        <InputWithIcon
          label="Konu"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Mesajınızın konusu (isteğe bağlı)"
          leftIcon={MessageSquare}
          disabled={loading}
        />

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Mesaj *
          </label>
          <div className="relative">
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              required
              disabled={loading}
              placeholder="Mesajınızı buraya yazın..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {formData.message.length}/1000
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          disabled={!isFormValid || loading}
          loading={loading}
        >
          <Send className="w-5 h-5 mr-2" />
          Mesajı Gönder
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
        <p>
          Mesajınız admin panelinden görüntülenecek ve size en kısa sürede dönüş yapılacaktır.
        </p>
      </div>
    </div>
  )
}