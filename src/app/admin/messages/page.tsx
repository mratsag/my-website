// app/admin/messages/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/Button'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { Modal } from '@/components/ui/Modal'
import { Alert } from '@/components/ui/Alert'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Message } from '@/lib/types'
import { formatDate, formatRelativeTime, formatErrorMessage } from '@/lib/utils'
import { 
  Search, 
  Mail, 
  MailOpen, 
  Trash2, 
  User, 
  Calendar,
  MessageSquare,
  Filter,
  Eye,
  Archive
} from 'lucide-react'
import { useEffect, useState } from 'react'

function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingMessages, setDeletingMessages] = useState<string[]>([])

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/messages')
      const data = await response.json()
      
      if (response.ok) {
        setMessages(data.data || [])
      } else {
        setError(data.error || 'Mesajlar yüklenemedi')
      }
    } catch (err) {
      setError('Mesajlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (messageId: string, isRead: boolean) => {
    try {
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: isRead })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'İşlem başarılı')
        fetchMessages()
      } else {
        setError(data.error || 'İşlem başarısız')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    }
  }

  const handleDelete = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId)
    if (!message) return

    if (!confirm(`${message.name} tarafından gönderilen mesajı silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      setDeletingMessages(prev => [...prev, messageId])
      
      const response = await fetch(`/api/messages/${messageId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(data.message || 'Mesaj silindi')
        fetchMessages()
      } else {
        setError(data.error || 'Mesaj silinemedi')
      }
    } catch (err) {
      setError(formatErrorMessage(err))
    } finally {
      setDeletingMessages(prev => prev.filter(id => id !== messageId))
    }
  }

  const handleBulkDelete = async () => {
    const selectedMessages = messages.filter(m => 
      filterStatus === 'all' || 
      (filterStatus === 'read' && m.is_read) || 
      (filterStatus === 'unread' && !m.is_read)
    )

    if (selectedMessages.length === 0) return

    if (!confirm(`${selectedMessages.length} mesajı silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const deletePromises = selectedMessages.map(message => 
        fetch(`/api/messages/${message.id}`, { method: 'DELETE' })
      )

      await Promise.all(deletePromises)
      setSuccess(`${selectedMessages.length} mesaj silindi`)
      fetchMessages()
    } catch (err) {
      setError('Mesajlar silinirken hata oluştu')
    }
  }

  const openMessageModal = async (message: Message) => {
    setSelectedMessage(message)
    setIsModalOpen(true)
    
    // Mesaj okunmadıysa okundu olarak işaretle
    if (!message.is_read) {
      await handleMarkAsRead(message.id, true)
    }
  }

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'read' && message.is_read) ||
      (filterStatus === 'unread' && !message.is_read)

    return matchesSearch && matchesFilter
  })

  const getUnreadCount = () => messages.filter(m => !m.is_read).length

  const getStatusColor = (isRead: boolean) => {
    return isRead ? 'text-gray-500' : 'text-blue-600'
  }

  const getStatusBadge = (isRead: boolean) => {
    return isRead ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <MailOpen className="w-3 h-3 mr-1" />
        Okundu
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        <Mail className="w-3 h-3 mr-1" />
        Okunmadı
      </span>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Mesajlar</h1>
          <p className="text-gray-600 mt-1">
            {getUnreadCount()} okunmamış mesaj ({messages.length} toplam)
          </p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button 
            variant="secondary"
            onClick={handleBulkDelete}
            disabled={filteredMessages.length === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Toplu Sil
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <InputWithIcon
            leftIcon={Search}
            placeholder="Gönderen, konu veya mesaj içeriği ara..."
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
            Tümü ({messages.length})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'unread' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Okunmamış ({getUnreadCount()})
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'read' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Okundu ({messages.length - getUnreadCount()})
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

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <MessageSquare className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'Mesaj bulunamadı' : 'Henüz mesaj yok'}
            </h3>
            <p className="text-gray-600">
              {searchTerm 
                ? 'Arama kriterlerinizi değiştirip tekrar deneyin' 
                : 'Portföy sitenizden gelen mesajlar burada görünecek'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  !message.is_read ? 'bg-blue-50/50' : ''
                }`}
                onClick={() => openMessageModal(message)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${getStatusColor(message.is_read)}`}>
                            {message.name}
                          </h3>
                          {getStatusBadge(message.is_read)}
                        </div>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                    </div>
                    
                    <div className="ml-13">
                      {message.subject && (
                        <h4 className="text-sm font-medium text-gray-900 mb-1">
                          {message.subject}
                        </h4>
                      )}
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {message.message}
                      </p>
                      
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatRelativeTime(message.created_at)}
                        </div>
                        <span>•</span>
                        <span>{formatDate(message.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(message.id, !message.is_read)
                      }}
                      className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-md hover:bg-blue-50"
                      title={message.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                    >
                      {message.is_read ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(message.id)
                      }}
                      disabled={deletingMessages.includes(message.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                      title="Mesajı sil"
                    >
                      {deletingMessages.includes(message.id) ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Mesaj Detayı"
          size="lg"
        >
          <div className="space-y-6">
            {/* Sender Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedMessage.name}</h3>
                  <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                  <p className="text-xs text-gray-500">
                    {formatDate(selectedMessage.created_at)} • {formatRelativeTime(selectedMessage.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Subject */}
            {selectedMessage.subject && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Konu</h4>
                <p className="text-gray-900">{selectedMessage.subject}</p>
              </div>
            )}

            {/* Message */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Mesaj</h4>
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)}
              >
                {selectedMessage.is_read ? (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Okunmadı İşaretle
                  </>
                ) : (
                  <>
                    <MailOpen className="w-4 h-4 mr-2" />
                    Okundu İşaretle
                  </>
                )}
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="danger"
                  onClick={() => {
                    handleDelete(selectedMessage.id)
                    setIsModalOpen(false)
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Sil
                </Button>
                <Button
                  onClick={() => setIsModalOpen(false)}
                >
                  Kapat
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default withAuth(MessagesPage)