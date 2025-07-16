// app/page.tsx
import Link from 'next/link'
import { ArrowRight, Code, Globe, Mail, User, Briefcase, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Portföy</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
                Hakkımda
              </Link>
              <Link href="#projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projeler
              </Link>
              <Link href="#blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                İletişim
              </Link>
            </nav>
            <Link
              href="/admin/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Modern Web Developer
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Full-stack web geliştirici olarak modern teknolojilerle 
            kullanıcı deneyimini ön planda tutan projeler geliştiriyorum.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="#projects"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Projelerimi Gör
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="#contact"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              İletişime Geç
              <Mail className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neler Yapıyorum</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Modern web teknolojileri ile end-to-end çözümler geliştiriyor, 
              kullanıcı deneyimini optimize ediyorum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Frontend Development</h3>
              <p className="text-gray-600">
                React, Next.js, TypeScript ile modern ve responsive web uygulamaları geliştiriyorum.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Backend Development</h3>
              <p className="text-gray-600">
                Node.js, Python ve modern veritabanları ile güvenli ve ölçeklenebilir API&apos;ler geliştiriyorum.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proje Yönetimi</h3>
              <p className="text-gray-600">
                Agile metodolojiler ile proje yönetimi yapıyor, ekip çalışması ile verimli çözümler üretiyorum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Preview */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Seçili Projeler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Son dönemde geliştirdiğim bazı projeler. 
              Admin panelden tüm projelerimi yönetebilirsiniz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Card Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Code className="w-12 h-12 text-blue-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Örnek Proje</h3>
                <p className="text-gray-600 mb-4">
                  Admin panelinden projelerinizi ekledikten sonra burada görünecek.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">React</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">Node.js</span>
                </div>
              </div>
            </div>

            {/* More project cards would be loaded from the database */}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/admin/projects"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Admin Panelinden Projelerinizi Yönetin
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Blog</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Teknoloji, yazılım geliştirme ve kişisel deneyimlerim hakkında yazılar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                <Star className="w-12 h-12 text-pink-600" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Örnek Blog Yazısı</h3>
                <p className="text-gray-600 mb-4">
                  Admin panelinden blog yazılarınızı ekledikten sonra burada görünecek.
                </p>
                <div className="text-sm text-gray-500">
                  Admin Panel • Blog Yönetimi
                </div>
              </div>
            </div>

            {/* More blog posts would be loaded from the database */}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/admin/blog"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Admin Panelinden Blog Yazılarınızı Yönetin
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">İletişim</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Projeleriniz hakkında konuşmak veya işbirliği yapmak için benimle iletişime geçin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/admin/messages"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <Mail className="mr-2 w-5 h-5" />
              Mesajları Görüntüle
            </Link>
            <Link
              href="/admin/login"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Admin Paneli
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-white/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Portföy</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <Link href="/admin/login" className="text-gray-600 hover:text-gray-900 transition-colors">
                Admin Panel
              </Link>
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>&copy; 2024 Portföy. Next.js ve Supabase ile geliştirilmiştir.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}