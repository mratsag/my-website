// app/page.tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          Portföy Sitesi
        </h1>
        <p className="text-gray-600 mb-8">
          Modern web developer portföy sitesi
        </p>
        <div className="space-x-4">
          <Link
            href="/admin/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Admin Panel
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Blog
          </Link>
        </div>
      </div>
    </div>
  )
}