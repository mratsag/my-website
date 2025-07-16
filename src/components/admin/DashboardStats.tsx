// components/admin/DashboardStats.tsx
'use client'

import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  FolderOpen,
  BarChart3,
  Settings,
  Mail,
  FileText,
  Eye,
  Star,
  Calendar
} from 'lucide-react'
import { useEffect, useState } from 'react'

interface StatsData {
  projects: {
    total: number
    featured: number
    change: number
  }
  experiences: {
    total: number
    change: number
  }
  skills: {
    total: number
    change: number
  }
  messages: {
    total: number
    unread: number
    change: number
  }
  blog: {
    total: number
    published: number
    change: number
  }
}

interface StatCardProps {
  title: string
  value: number
  subtitle?: string
  icon: React.ElementType
  color: string
  change?: number
  trend?: 'up' | 'down' | 'neutral'
}

const StatCard = ({ title, value, subtitle, icon: Icon, color, change, trend }: StatCardProps) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />
      case 'down': return <TrendingDown className="w-3 h-3" />
      default: return <Minus className="w-3 h-3" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500">{subtitle}</p>
            )}
          </div>
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
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

      // Define types for project, message, and blog items
      type Project = { featured: boolean }
      type Message = { is_read: boolean }
      type BlogPost = { published: boolean }

      const statsData: StatsData = {
        projects: {
          total: projects.data?.length || 0,
          featured: (projects.data as Project[])?.filter((p) => p.featured).length || 0,
          change: Math.floor(Math.random() * 10) - 5 // Simulated change
        },
        experiences: {
          total: experiences.data?.length || 0,
          change: Math.floor(Math.random() * 3) - 1
        },
        skills: {
          total: Object.values(skills.data || {}).flat().length || 0,
          change: Math.floor(Math.random() * 5) - 2
        },
        messages: {
          total: messages.data?.length || 0,
          unread: (messages.data as Message[])?.filter((m) => !m.is_read).length || 0,
          change: Math.floor(Math.random() * 8) - 4
        },
        blog: {
          total: blog.data?.length || 0,
          published: (blog.data as BlogPost[])?.filter((b) => b.published).length || 0,
          change: Math.floor(Math.random() * 4) - 2
        }
      }

      setStats(statsData)
    } catch (err) {
      setError('İstatistikler yüklenemedi')
    } finally {
      setLoading(false)
    }
  }

  const getTrend = (change: number) => {
    if (change > 0) return 'up'
    if (change < 0) return 'down'
    return 'neutral'
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="ml-4 space-y-2">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-12 h-6 bg-gray-200 rounded"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">⚠️ {error}</div>
        <button
          onClick={fetchStats}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Yeniden Dene
        </button>
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      <StatCard
        title="Projeler"
        value={stats.projects.total}
        subtitle={`${stats.projects.featured} öne çıkan`}
        icon={FolderOpen}
        color="bg-blue-500"
        change={stats.projects.change}
        trend={getTrend(stats.projects.change)}
      />
      
      <StatCard
        title="Deneyimler"
        value={stats.experiences.total}
        subtitle="Toplam deneyim"
        icon={BarChart3}
        color="bg-green-500"
        change={stats.experiences.change}
        trend={getTrend(stats.experiences.change)}
      />
      
      <StatCard
        title="Yetenekler"
        value={stats.skills.total}
        subtitle="Toplam yetenek"
        icon={Settings}
        color="bg-purple-500"
        change={stats.skills.change}
        trend={getTrend(stats.skills.change)}
      />
      
      <StatCard
        title="Mesajlar"
        value={stats.messages.total}
        subtitle={`${stats.messages.unread} okunmamış`}
        icon={Mail}
        color="bg-orange-500"
        change={stats.messages.change}
        trend={getTrend(stats.messages.change)}
      />
      
      <StatCard
        title="Blog Yazıları"
        value={stats.blog.total}
        subtitle={`${stats.blog.published} yayında`}
        icon={FileText}
        color="bg-pink-500"
        change={stats.blog.change}
        trend={getTrend(stats.blog.change)}
      />
    </div>
  )
}

// Quick Stats Component for smaller displays
export const QuickStats = () => {
  interface QuickStatsData {
    unreadMessages: number
    featuredProjects: number
  }
  const [stats, setStats] = useState<QuickStatsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuickStats = async () => {
      try {
        const [messagesRes, projectsRes] = await Promise.all([
          fetch('/api/messages?unread=true'),
          fetch('/api/projects?featured=true')
        ])

        const [messages, projects] = await Promise.all([
          messagesRes.json(),
          projectsRes.json()
        ])

        setStats({
          unreadMessages: messages.data?.length || 0,
          featuredProjects: projects.data?.length || 0
        })
      } catch (err) {
        console.error('Quick stats error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuickStats()
  }, [])

  if (loading) {
    return <LoadingSpinner size="sm" />
  }

  if (!stats) return null

  return (
    <div className="flex items-center space-x-4 text-sm text-gray-600">
      {stats.unreadMessages > 0 && (
        <div className="flex items-center space-x-1">
          <Mail className="w-4 h-4" />
          <span>{stats.unreadMessages} yeni mesaj</span>
        </div>
      )}
      <div className="flex items-center space-x-1">
        <Star className="w-4 h-4" />
        <span>{stats.featuredProjects} öne çıkan proje</span>
      </div>
    </div>
  )
}