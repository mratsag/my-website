// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Portföy | Modern Web Developer',
  description: 'Full-stack web developer portföy sitesi. Projelerim, deneyimlerim ve blog yazılarım.',
  keywords: ['web developer', 'full-stack', 'react', 'nextjs', 'typescript', 'portfolio'],
  authors: [{ name: 'Your Name' }],
  openGraph: {
    title: 'Portföy | Modern Web Developer',
    description: 'Full-stack web developer portföy sitesi',
    type: 'website',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portföy | Modern Web Developer',
    description: 'Full-stack web developer portföy sitesi',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" suppressHydrationWarning={true}>
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}