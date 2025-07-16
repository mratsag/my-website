// app/admin/dashboard/page.tsx
'use client'

import { withAuth } from '@/contexts/AuthContext'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatRelativeTime } from '@/lib/utils'
import { 
  BarChart3, 
  Eye, 
  FolderOpen, 
  Mail, 
  MessageSquare, 
  Settings, 
  Star, 
  TrendingUp, 
  Users,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface DashboardStats {
  projects: { total: number; featured: number }
  experiences: { total: number }
  skills: { total: number }
  messages: { total: number; unread: number }
  blog: { total: number; published: number }
}

interface RecentActivity {
  id: string
  type: 'project' | 'experience' | 'skill' | 'message' | 'blog'
  title: string
  created_at: string
}

function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Paralel API çağrıları
      const [projectsRes, experiencesRes, skillsRes, messagesRes, blogRes] = await Promise.all([
        fetch('/api/projects?per_page=100'),
        fetch('/api/experiences?per_page=100'),
        fetch('/api/skills'),
        fetch('/api/messages?per_page=100'),
        fetch('/api/blog?per_page=100')
      ])

      const [projects, experiences, skills, messages, blog] = await Promise.all([
        projectsRes.json(),
        experiencesRes.json(),
        skillsRes.json(),
        messagesRes.json(),
        blogRes.json()
      ])

      // İstatistikleri hesapla
      const dashboardStats: DashboardStats = {
        projects: {
          total: projects.data?.length || 0,
          featured: projects.data?.filter((p: { featured: boolean }) => p.featured).length || 0
        },
        experiences: {
          total: experiences.data?.length || 0
        },
        skills: {
          total: Object.values(skills.data || {}).flat().length || 0
        },
        messages: {
          total: messages.data?.length || 0,
          unread: messages.data?.filter((m: { is_read: boolean }) => !m.is_read).length || 0
        },
        blog: {
          total: blog.data?.length || 0,
          published: blog.data?.filter((b: { published: boolean }) => b.published).length || 0
        }
      }

      setStats(dashboardStats)

      // Son aktiviteleri birleştir
      const activities: RecentActivity[] = [
        ...(projects.data || []).slice(0, 3).map((item: { id: string; title: string; created_at: string }) => ({
          id: item.id,
          type: 'project' as const,
          title: item.title,
          created_at: item.created_at
        })),
        ...(experiences.data || []).slice(0, 2).map((item: { id: string; position: string; company: string; created_at: string }) => ({
          id: item.id,
          type: 'experience' as const,
          title: `${item.position} - ${item.company}`,
          created_at: item.created_at
        })),
        ...(messages.data || []).slice(0, 3).map((item: { id: string; name: string; subject?: string; created_at: string }) => ({
          id: item.id,
          type: 'message' as const,
          title: `${item.name} - ${item.subject || 'Mesaj'}`,
          created_at: item.created_at
        })),
        ...(blog.data || []).slice(0, 2).map((item: { id: string; title: string; created_at: string }) => ({
          id: item.id,
          type: 'blog' as const,
          title: item.title,
          created_at: item.created_at
        }))
      ]

      // Tarihe göre sırala ve ilk 8'i al
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivity(activities.slice(0, 8))

    } catch (error) {
      console.error('Dashboard verisi yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const statCards = [
    {
      title: 'Projeler',
      value: stats?.projects.total || 0,
      subtitle: `${stats?.projects.featured || 0} öne çıkan`,
      icon: FolderOpen,
      color: 'bg-blue-500',
      href: '/admin/projects'
    },
    {
      title: 'Deneyimler',
      value: stats?.experiences.total || 0,
      subtitle: 'Toplam deneyim',
      icon: BarChart3,
      color: 'bg-green-500',
      href: '/admin/experiences'
    },
    {
      title: 'Yetenekler',
      value: stats?.skills.total || 0,
      subtitle: 'Toplam yetenek',
      icon: Settings,
      color: 'bg-purple-500',
      href: '/admin/skills'
    },
    {
      title: 'Mesajlar',
      value: stats?.messages.total || 0,
      subtitle: `${stats?.messages.unread || 0} okunmamış`,
      icon: Mail,
      color: 'bg-orange-500',
      href: '/admin/messages'
    },
    {
      title: 'Blog Yazıları',
      value: stats?.blog.total || 0,
      subtitle: `${stats?.blog.published || 0} yayında`,
      icon: FileText,
      color: 'bg-pink-500',
      href: '/admin/blog'
    }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return FolderOpen
      case 'experience': return BarChart3
      case 'skill': return Settings
      case 'message': return MessageSquare
      case 'blog': return FileText
      default: return Users
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'project': return 'text-blue-600'
      case 'experience': return 'text-green-600'
      case 'skill': return 'text-purple-600'
      case 'message': return 'text-orange-600'
      case 'blog': return 'text-pink-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Portföy yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-blue-200 group"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl ${card.color} bg-opacity-10 group-hover:bg-opacity-20 transition-colors`}>
                  <Icon className={`h-6 w-6 ${card.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                  <p className="text-xs text-gray-500">{card.subtitle}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Son Aktiviteler</h2>
        </div>
        <div className="p-6">
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">Henüz aktivite bulunmuyor</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = getActivityIcon(activity.type)
                const colorClass = getActivityColor(activity.type)
                
                return (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Icon className={`h-4 w-4 ${colorClass}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{formatRelativeTime(activity.created_at)}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/projects"
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-blue-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Yeni Proje</h3>
              <p className="text-sm text-gray-600">Portföyüne yeni proje ekle</p>
            </div>
            <FolderOpen className="h-8 w-8 text-blue-500 group-hover:text-blue-600 transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/blog"
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-pink-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">Blog Yazısı</h3>
              <p className="text-sm text-gray-600">Yeni blog yazısı oluştur</p>
            </div>
            <FileText className="h-8 w-8 text-pink-500 group-hover:text-pink-600 transition-colors" />
          </div>
        </Link>

        <Link
          href="/admin/messages"
          className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-200 hover:border-orange-200 group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">Mesajlar</h3>
              <p className="text-sm text-gray-600">Gelen mesajları kontrol et</p>
            </div>
            <div className="relative">
              <Mail className="h-8 w-8 text-orange-500 group-hover:text-orange-600 transition-colors" />
              {stats?.messages.unread && stats.messages.unread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {stats.messages.unread}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default withAuth(DashboardPage)