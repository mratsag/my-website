// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tarih formatlaması
export const formatDate = (date: string, locale: string = 'tr-TR') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatRelativeTime = (date: string, locale: string = 'tr-TR') => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Az önce'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dakika önce`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} saat önce`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} gün önce`
  
  return formatDate(date, locale)
}

// Slug oluşturma
export const generateSlug = (text: string): string => {
  const turkishChars: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  }
  
  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => turkishChars[char] || char)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Metin kısaltma
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Email validasyonu
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL validasyonu
export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Proficiency seviyesi metni
export const getProficiencyText = (level: number): string => {
  const levels = ['', 'Başlangıç', 'Temel', 'Orta', 'İleri', 'Uzman']
  return levels[level] || 'Bilinmiyor'
}

// Dosya boyutu formatlaması
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Hata mesajı formatlaması
export const formatErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') return error
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
      return (error as { message: string }).message
    }
    if ('error' in error && typeof (error as { error?: unknown }).error === 'object' && (error as { error?: unknown }).error !== null) {
      const innerError = (error as { error: { message?: unknown } }).error
      if ('message' in innerError && typeof innerError.message === 'string') {
        return innerError.message
      }
    }
  }
  return 'Bilinmeyen bir hata oluştu'
}

// Başarı mesajı formatlaması
export const formatSuccessMessage = (action: string, item: string): string => {
  const actions: Record<string, string> = {
    'created': 'oluşturuldu',
    'updated': 'güncellendi',
    'deleted': 'silindi',
    'sent': 'gönderildi'
  }
  
  return `${item} başarıyla ${actions[action] || action}`
}

// Sayfa başlığı oluşturma
export const generatePageTitle = (title: string, siteName: string = 'Portföy'): string => {
  return `${title} | ${siteName}`
}

// Meta description oluşturma
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  const cleanContent = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return truncateText(cleanContent, maxLength)
}