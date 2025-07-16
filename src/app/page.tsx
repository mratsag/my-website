// app/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { 
  ArrowRight, 
  Code, 
  Globe, 
  Mail, 
  User, 
  Briefcase, 
  Star, 
  ExternalLink,
  Calendar,
  MapPin,
  Github,
  Linkedin,
  Eye,
  MessageCircle,
  ChevronRight,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  image_url?: string
  demo_url?: string
  github_url?: string
  featured: boolean
  created_at: string
}

interface Experience {
  id: string
  position: string
  company: string
  description: string
  start_date: string
  end_date?: string
  location: string
  current: boolean
}

interface Skills {
  frontend: string[]
  backend: string[]
  tools: string[]
  soft_skills: string[]
}

interface BlogPost {
  id: string
  title: string
  excerpt: string
  image_url?: string
  published: boolean
  created_at: string
  read_time?: number
}

interface Stats {
  projects: number
  experiences: number
  messages: number
}

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [skills, setSkills] = useState<Skills>({
    frontend: [],
    backend: [],
    tools: [],
    soft_skills: []
  })
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState<Stats>({ projects: 0, experiences: 0, messages: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Paralel API çağrıları
      const [projectsRes, experiencesRes, skillsRes, blogRes, messagesRes] = await Promise.all([
        fetch('/api/projects?featured=true&per_page=6'),
        fetch('/api/experiences?per_page=3'),
        fetch('/api/skills'),
        fetch('/api/blog?per_page=3'),
        fetch('/api/messages?per_page=1')
      ])

      // Response'ları JSON'a çevir
      const responses = await Promise.all([
        projectsRes.ok ? projectsRes.json() : { data: [] },
        experiencesRes.ok ? experiencesRes.json() : { data: [] },
        skillsRes.ok ? skillsRes.json() : { data: { frontend: [], backend: [], tools: [], soft_skills: [] } },
        blogRes.ok ? blogRes.json() : { data: [] },
        messagesRes.ok ? messagesRes.json() : { data: [] }
      ])

      const [projectsData, experiencesData, skillsData, blogData, messagesData] = responses

      // State'leri güvenli şekilde set et
      setProjects(Array.isArray(projectsData.data) ? projectsData.data : [])
      setExperiences(Array.isArray(experiencesData.data) ? experiencesData.data : [])
      
      // Skills data'sını kontrol et ve dönüştür
      const skillsResult = skillsData.data || {}
      console.log('Skills API Response:', skillsResult) // Debug için
      
      // Skill objelerini string array'e çevir
      const convertSkillsToStringArray = (skillsArray: (string | { name?: string })[]) => {
        if (!Array.isArray(skillsArray)) return []
        return skillsArray.map(skill => {
          if (typeof skill === 'string') return skill
          if (skill && typeof skill === 'object' && 'name' in skill && skill.name) return skill.name
          return skill ? skill.toString() : ''
        }).filter(Boolean) // Boş değerleri filtrele
      }
      
      // Kategori mapping - API kategori isimlerini ana sayfa kategori isimlerine çevir
      const categoryMapping: Record<string, string> = {
        'frontend': 'frontend',
        'backend': 'backend', 
        'database': 'backend', // Database skilllerini backend'e ekle
        'devops': 'tools',     // DevOps skilllerini tools'a ekle
        'tools': 'tools',
        'other': 'tools',      // Other skilllerini tools'a ekle
        'soft_skills': 'soft_skills',
        'soft': 'soft_skills'
      }
      
      // Kategorileri dönüştür
      const processedSkills = {
        frontend: [] as string[],
        backend: [] as string[],
        tools: [] as string[],
        soft_skills: [] as string[]
      }
      
      // API'den gelen kategorileri işle
      Object.entries(skillsResult).forEach(([apiCategory, skills]) => {
        console.log(`Processing category: ${apiCategory}`, skills) // Debug için
        const targetCategory = categoryMapping[apiCategory.toLowerCase()] || 'tools'
        const skillNames = convertSkillsToStringArray(skills as (string | { name?: string })[])
        
        // Hedef kategoriye skills ekle
        if (targetCategory in processedSkills) {
          processedSkills[targetCategory as keyof typeof processedSkills].push(...skillNames)
        }
      })
      
      console.log('Processed skills:', processedSkills) // Debug için
      setSkills(processedSkills)
      
      setBlogPosts(Array.isArray(blogData.data) ? blogData.data : [])
      
      // İstatistikleri hesapla
      const allProjectsRes = await fetch('/api/projects?per_page=100')
      if (allProjectsRes.ok) {
        const allProjectsData = await allProjectsRes.json()
        setStats({
          projects: Array.isArray(allProjectsData.data) ? allProjectsData.data.length : 0,
          experiences: Array.isArray(experiencesData.data) ? experiencesData.data.length : 0,
          messages: Array.isArray(messagesData.data) ? messagesData.data.length : 0
        })
      }

    } catch (error) {
      console.error('Veri yükleme hatası:', error)
      setError('Veriler yüklenirken bir hata oluştu')
      // Hata durumunda boş değerler set et
      setProjects([])
      setExperiences([])
      setSkills({ 
        frontend: [], 
        backend: [], 
        tools: [], 
        soft_skills: [] 
      })
      setBlogPosts([])
      setStats({ projects: 0, experiences: 0, messages: 0 })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
  }

  const calculateExperience = (startDate: string, endDate?: string) => {
    const start = new Date(startDate)
    const end = endDate ? new Date(endDate) : new Date()
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
    const years = Math.floor(diffMonths / 12)
    const months = diffMonths % 12
    
    if (years > 0) {
      return `${years} yıl${months > 0 ? ` ${months} ay` : ''}`
    }
    return `${months} ay`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Portföy yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">Portföy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Hakkımda
              </Link>
              <Link href="#projects" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Projeler
              </Link>
              <Link href="#experience" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Deneyim
              </Link>
              <Link href="#blog" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                Blog
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">
                İletişim
              </Link>
            </nav>
            <Link
              href="/admin/login"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
              <User className="w-16 h-16 text-white" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern Web
            </span>
            <br />
            Developer
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Full-stack web geliştirici olarak modern teknolojilerle 
            kullanıcı deneyimini ön planda tutan projeler geliştiriyorum.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.projects}</div>
              <div className="text-gray-600">Proje</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.experiences}</div>
              <div className="text-gray-600">Deneyim</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.messages}</div>
              <div className="text-gray-600">Mesaj</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#projects"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
            >
              Projelerimi Gör
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:shadow-xl font-medium backdrop-blur-sm"
            >
              İletişime Geç
              <Mail className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Yeteneklerim</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Modern web teknolojileri ile end-to-end çözümler geliştiriyor, 
              kullanıcı deneyimini optimize ediyorum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Frontend Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Frontend</h3>
              <div className="flex flex-wrap gap-1">
                {skills?.frontend?.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {(!skills?.frontend || skills.frontend.length === 0) && (
                  <span className="text-gray-500 text-sm">Admin panelinden ekleyin</span>
                )}
              </div>
            </div>

            {/* Backend Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Backend</h3>
              <div className="flex flex-wrap gap-1">
                {skills?.backend?.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {(!skills?.backend || skills.backend.length === 0) && (
                  <span className="text-gray-500 text-sm">Admin panelinden ekleyin</span>
                )}
              </div>
            </div>

            {/* Tools */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Araçlar</h3>
              <div className="flex flex-wrap gap-1">
                {skills?.tools?.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {(!skills?.tools || skills.tools.length === 0) && (
                  <span className="text-gray-500 text-sm">Admin panelinden ekleyin</span>
                )}
              </div>
            </div>

            {/* Soft Skills */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Kişisel</h3>
              <div className="flex flex-wrap gap-1">
                {skills?.soft_skills?.map((skill, index) => (
                  <span key={index} className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                    {skill}
                  </span>
                ))}
                {(!skills?.soft_skills || skills.soft_skills.length === 0) && (
                  <span className="text-gray-500 text-sm">Admin panelinden ekleyin</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Projeler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Son dönemde geliştirdiğim en başarılı projelerden bazıları.
            </p>
          </div>

          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-white/20 group">
                  {project.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Code className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies?.slice(0, 3).map((tech, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                          {tech}
                        </span>
                      ))}
                      {project.technologies?.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                          +{project.technologies.length - 3} more
                        </span>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        {project.demo_url && (
                          <Link
                            href={project.demo_url}
                            target="_blank"
                            className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Demo
                          </Link>
                        )}
                        {project.github_url && (
                          <Link
                            href={project.github_url}
                            target="_blank"
                            className="flex items-center text-gray-600 hover:text-gray-700 transition-colors"
                          >
                            <Github className="w-4 h-4 mr-1" />
                            Code
                          </Link>
                        )}
                      </div>
                      {project.featured && (
                        <div className="flex items-center text-yellow-600">
                          <Star className="w-4 h-4 mr-1" />
                          <span className="text-sm">Öne Çıkan</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Henüz proje eklenmemiş</p>
              <Link
                href="/admin/projects"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                İlk Projeyi Ekle
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}

          {projects.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/admin/projects"
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:shadow-xl font-medium backdrop-blur-sm"
              >
                Tüm Projelerim
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Deneyimlerim</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Profesyonel kariyerim boyunca edindiğim deneyimler.
            </p>
          </div>

          {experiences.length > 0 ? (
            <div className="space-y-6">
              {experiences.map((experience) => (
                <div key={experience.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-white/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{experience.position}</h3>
                      <div className="flex items-center text-blue-600 mb-2">
                        <Briefcase className="w-4 h-4 mr-2" />
                        <span className="font-medium">{experience.company}</span>
                      </div>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{experience.location}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>
                          {formatDate(experience.start_date)} - {experience.current ? 'Devam ediyor' : formatDate(experience.end_date!)}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="text-sm font-medium">
                          {calculateExperience(experience.start_date, experience.end_date)}
                        </span>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{experience.description}</p>
                    </div>
                    {experience.current && (
                      <div className="ml-4 flex items-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                          Mevcut
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Henüz deneyim eklenmemiş</p>
              <Link
                href="/admin/experiences"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                İlk Deneyimi Ekle
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}

          {experiences.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/admin/experiences"
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:shadow-xl font-medium backdrop-blur-sm"
              >
                Tüm Deneyimlerim
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Teknoloji, yazılım geliştirme ve kişisel deneyimlerim hakkında yazılar.
            </p>
          </div>

          {blogPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-white/20 group">
                  {post.image_url ? (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={post.image_url}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <Star className="w-12 h-12 text-pink-600" />
                    </div>
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{formatDate(post.created_at)}</span>
                        {post.read_time && (
                          <>
                            <span className="mx-2">•</span>
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{post.read_time} dk</span>
                          </>
                        )}
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span>Oku</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Henüz blog yazısı eklenmemiş</p>
              <Link
                href="/admin/blog"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                İlk Yazıyı Ekle
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}

          {blogPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center px-8 py-4 border border-gray-300 text-gray-700 rounded-xl hover:bg-white/80 transition-all shadow-lg hover:shadow-xl font-medium backdrop-blur-sm"
              >
                Tüm Yazılarım
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Birlikte Çalışalım</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Yeni projeler için her zaman açığım. Haydi, beraber harika bir şeyler yapalım!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/messages"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl font-medium"
            >
              <Mail className="mr-2 w-5 h-5" />
              Mesaj Gönder
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center px-8 py-4 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm font-medium"
            >
              Admin Paneli
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold">Portföy</span>
            </div>
            
            <div className="flex items-center space-x-6 mb-6 md:mb-0">
              <Link href="/admin/login" className="text-gray-400 hover:text-white transition-colors">
                Admin Panel
              </Link>
              <Link href="/admin/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                Hakkımda
              </Link>
              <Link href="#projects" className="text-gray-400 hover:text-white transition-colors">
                Projeler
              </Link>
            </div>

            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 Portföy. Next.js ve Supabase ile geliştirilmiştir.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}