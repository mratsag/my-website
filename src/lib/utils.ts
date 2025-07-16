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

// Renk kodları
export const generateRandomColor = (): string => {
  const colors = [
    '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444',
    '#6366F1', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Teknoloji renkler
export const getTechColor = (tech: string): string => {
  const techColors: Record<string, string> = {
    'react': '#61DAFB',
    'javascript': '#F7DF1E',
    'typescript': '#3178C6',
    'nodejs': '#339933',
    'python': '#3776AB',
    'nextjs': '#000000',
    'tailwind': '#06B6D4',
    'css': '#1572B6',
    'html': '#E34F26',
    'git': '#F05032',
    'github': '#181717',
    'docker': '#2496ED',
    'aws': '#FF9900',
    'firebase': '#FFCA28',
    'mongodb': '#47A248',
    'postgresql': '#336791',
    'mysql': '#4479A1',
    'redis': '#DC382D',
    'graphql': '#E10098',
    'vuejs': '#4FC08D',
    'angular': '#DD0031',
    'svelte': '#FF3E00',
    'php': '#777BB4',
    'java': '#007396',
    'csharp': '#239120',
    'cpp': '#00599C',
    'go': '#00ADD8',
    'rust': '#000000',
    'swift': '#FA7343',
    'kotlin': '#7F52FF',
    'flutter': '#02569B',
    'reactnative': '#61DAFB',
    'unity': '#000000',
    'blender': '#F5792A',
    'figma': '#F24E1E',
    'photoshop': '#31A8FF',
    'illustrator': '#FF9A00',
    'sketch': '#F7B500',
    'xd': '#FF61F6',
    'wordpress': '#21759B',
    'shopify': '#7AB55C',
    'woocommerce': '#96588A',
    'magento': '#EE672F',
    'laravel': '#FF2D20',
    'django': '#092E20',
    'flask': '#000000',
    'express': '#000000',
    'nestjs': '#E0234E',
    'fastapi': '#009688',
    'spring': '#6DB33F',
    'rails': '#CC0000',
    'supabase': '#3ECF8E',
    'prisma': '#2D3748',
    'strapi': '#2F2E8B',
    'sanity': '#F03E2F',
    'contentful': '#2478CC',
    'vercel': '#000000',
    'netlify': '#00C7B7',
    'heroku': '#430098',
    'digitalocean': '#0080FF',
    'linode': '#00A95C',
    'azure': '#0078D4',
    'gcp': '#4285F4',
    'kubernetes': '#326CE5',
    'elasticsearch': '#005571',
    'kibana': '#005571',
    'logstash': '#005571',
    'jenkins': '#D24939',
    'gitlab': '#FCA326',
    'bitbucket': '#0052CC',
    'jira': '#0052CC',
    'confluence': '#172B4D',
    'slack': '#4A154B',
    'discord': '#5865F2',
    'telegram': '#26A5E4',
    'whatsapp': '#25D366',
    'zoom': '#2D8CFF',
    'teams': '#6264A7',
    'notion': '#000000',
    'airtable': '#18BFFF',
    'trello': '#0079BF',
    'asana': '#F06A6A',
    'linear': '#5E6AD2',
    'monday': '#FF3D57',
    'clickup': '#7B68EE',
    'stripe': '#635BFF',
    'paypal': '#00457C',
    'square': '#3E4348',
    'twilio': '#F22F46',
    'sendgrid': '#1A82E2',
    'mailchimp': '#FFE01B',
    'hubspot': '#FF7A59',
    'salesforce': '#00A1E0',
    'zendesk': '#03363D',
    'intercom': '#1F8DED',
    'crisp': '#1972F5',
    'freshchat': '#F56500',
    'livechat': '#FF5722',
    'tawk': '#84C43C',
    'olark': '#39B54A',
    'zopim': '#E91E63',
    'chatbot': '#FF6B6B',
    'watson': '#0F62FE',
    'dialogflow': '#FF9800',
    'wit': '#4267B2',
    'luis': '#0078D4',
    'alexa': '#FF9900',
    'google': '#4285F4',
    'assistant': '#4285F4',
    'siri': '#000000',
    'cortana': '#0078D4',
    'bixby': '#1428A0',
    'tensorflow': '#FF6F00',
    'pytorch': '#EE4C2C',
    'keras': '#D00000',
    'opencv': '#5C3EE8',
    'numpy': '#013243',
    'pandas': '#150458',
    'matplotlib': '#11557C',
    'seaborn': '#388E3C',
    'scikit': '#F7931E',
    'jupyter': '#F37626',
    'anaconda': '#44A833',
    'colab': '#F9AB00',
    'kaggle': '#20BEFF',
    'datacamp': '#03EF62',
    'coursera': '#0056D3',
    'udemy': '#A435F0',
    'edx': '#02262B',
    'pluralsight': '#F15B2A',
    'linkedin': '#0A66C2',
    'youtube': '#FF0000',
    'vimeo': '#1AB7EA',
    'twitch': '#9146FF',
    'tiktok': '#000000',
    'instagram': '#E4405F',
    'facebook': '#1877F2',
    'twitter': '#1DA1F2',
    'pinterest': '#E60023',
    'snapchat': '#FFFC00',
    'reddit': '#FF4500',
    'quora': '#A82400',
    'stackoverflow': '#F58025',
    'medium': '#000000',
    'devto': '#0A0A0A',
    'hashnode': '#2962FF',
    'codepen': '#000000',
    'jsfiddle': '#4679A4',
    'codesandbox': '#000000',
    'replit': '#F26207',
    'glitch': '#3333FF',
    'observable': '#FF6600',
    'blockly': '#4285F4',
    'scratch': '#FF6600',
    'makecode': '#5C2D91',
    'unity3d': '#000000',
    'unreal': '#313131',
    'godot': '#478CBF',
    'roblox': '#00A2FF',
    'minecraft': '#62B47A',
    'steam': '#1B2838',
    'epic': '#313131',
    'origin': '#FF6600',
    'uplay': '#2B5CE6',
    'battlenet': '#148EFF',
    'gog': '#86328A',
    'itch': '#FA5C5C',
    'gamejolt': '#2F7D32',
    'kongregate': '#990000',
    'armor': '#CC0000',
    'newgrounds': '#FF6600',
    'miniclip': '#FF6600',
    'poki': '#FF6600',
    'crazygames': '#FF6600',
    'y8': '#FF6600',
    'friv': '#FF6600',
    'kizi': '#FF6600',
    'silvergames': '#FF6600',
    'gameforge': '#FF6600',
    'bigfish': '#FF6600',
    'king': '#FF6600',
    'supercell': '#FF6600',
    'rovio': '#FF6600',
    'gameloft': '#FF6600',
    'zynga': '#FF6600',
    'ea': '#FF6600',
    'ubisoft': '#FF6600',
    'activision': '#FF6600',
    'blizzard': '#FF6600',
    'valve': '#FF6600',
    'rockstar': '#FF6600',
    'bethesda': '#FF6600',
    'cdprojekt': '#FF6600',
    'enix': '#FF6600',
    'capcom': '#FF6600',
    'konami': '#FF6600',
    'namco': '#FF6600',
    'bandai': '#FF6600',
    'sega': '#FF6600',
    'nintendo': '#E60012',
    'sony': '#000000',
    'microsoft': '#00BCF2',
    'apple': '#000000',
    'amazon': '#FF9900',
    'meta': '#1877F2',
    'netflix': '#E50914',
    'disney': '#113CCF',
    'hbo': '#000000',
    'hulu': '#1CE783',
    'paramount': '#0064FF',
    'peacock': '#00A6C7',
    'discovery': '#2175D9',
    'crunchyroll': '#F47521',
    'funimation': '#410099',
    'vrv': '#F78C3C',
    'hidive': '#FF6600',
    'animelab': '#FF6600',
    'wakanim': '#FF6600',
    'daisuki': '#FF6600',
    'animax': '#FF6600',
    'adultswim': '#FF6600',
    'cartoonnetwork': '#FF6600',
    'nickelodeon': '#FF6600',
    'mtv': '#FF6600',
    'comedy': '#FF6600',
    'vh1': '#FF6600',
    'bet': '#FF6600',
    'tbs': '#FF6600',
    'tnt': '#FF6600',
    'cnn': '#CC0000',
    'bbc': '#BB1919',
    'sky': '#0073E6',
    'espn': '#FF0000',
    'fox': '#1F4E79',
    'abc': '#FF6600',
    'nbc': '#FF6600',
    'cbs': '#FF6600',
    'pbs': '#FF6600',
    'history': '#FF6600',
    'natgeo': '#FF6600',
    'animal': '#FF6600',
    'travel': '#FF6600',
    'food': '#FF6600',
    'hgtv': '#FF6600',
    'tlc': '#FF6600',
    'lifetime': '#FF6600',
    'hallmark': '#FF6600',
    'oxygen': '#FF6600',
    'bravo': '#FF6600',
    'usa': '#FF6600',
    'syfy': '#FF6600',
    'fx': '#FF6600',
    'amc': '#FF6600',
    'ifc': '#FF6600',
    'sundance': '#FF6600',
    'starz': '#FF6600',
    'showtime': '#FF6600',
    'cinemax': '#FF6600',
    'epix': '#FF6600',
    'mgm': '#FF6600',
    'lionsgate': '#FF6600',
    'universal': '#FF6600',
    'columbia': '#FF6600',
    'tristar': '#FF6600',
    'castle': '#FF6600',
    'rock': '#FF6600',
    'new': '#FF6600',
    'line': '#FF6600',
    'weinstein': '#FF6600',
    'miramax': '#FF6600',
    'searchlight': '#FF6600',
    'blue': '#FF6600',
    'marvel': '#ED1D24',
    'dc': '#0078F0',
    'dark': '#FF6600',
    'horse': '#FF6600',
    'image': '#FF6600',
    'idw': '#FF6600',
    'boom': '#FF6600',
    'valiant': '#FF6600',
    'aftershock': '#FF6600',
    'black': '#FF6600',
    'mask': '#FF6600',
    'oni': '#FF6600',
    'avatar': '#FF6600',
    'tpub': '#FF6600',
    'aspen': '#FF6600',
    'danger': '#FF6600',
    'girl': '#FF6600',
    'first': '#FF6600',
    'second': '#FF6600',
    'red': '#FF6600',
    '5': '#FF6600',
    'rebellion': '#FF6600',
    'strip': '#FF6600',
    'beano': '#FF6600',
    'commando': '#FF6600',
    'judge': '#FF6600',
    'dredd': '#FF6600',
    'strontium': '#FF6600',
    'dog': '#FF6600',
    'crisis': '#FF6600',
    'infinite': '#FF6600',
    'earths': '#FF6600',
    'final': '#FF6600',
    'secret': '#FF6600',
    'wars': '#FF6600',
    'civil': '#FF6600',
    'war': '#FF6600',
    'zero': '#FF6600',
    'hour': '#FF6600',
    'age': '#FF6600',
    'apocalypse': '#FF6600',
    'house': '#FF6600',
    'm': '#FF6600',
    'maximum': '#FF6600',
    'carnage': '#FF6600',
    'knull': '#FF6600',
    'venom': '#FF6600',
    'symbiote': '#FF6600',
    'spider': '#FF6600',
    'verse': '#FF6600',
    'into': '#FF6600',
    'across': '#FF6600',
    'beyond': '#FF6600',
    'batman': '#FF6600',
    'superman': '#FF6600',
    'wonder': '#FF6600',
    'woman': '#FF6600',
    'flash': '#FF6600',
    'green': '#FF6600',
    'lantern': '#FF6600',
    'aquaman': '#FF6600',
    'cyborg': '#FF6600',
    'justice': '#FF6600',
    'league': '#FF6600',
    'teen': '#FF6600',
    'titans': '#FF6600',
    'doom': '#FF6600',
    'patrol': '#FF6600',
    'legends': '#FF6600',
    'tomorrow': '#FF6600',
    'arrow': '#FF6600',
    'supergirl': '#FF6600',
    'batwoman': '#FF6600',
    'lightning': '#FF6600',
    'stargirl': '#FF6600',
    'naomi': '#FF6600',
    'peacemaker': '#FF6600',
    'harley': '#FF6600',
    'quinn': '#FF6600',
    'birds': '#FF6600',
    'prey': '#FF6600',
    'gotham': '#FF6600',
    'pennyworth': '#FF6600',
    'krypton': '#FF6600',
    'smallville': '#FF6600',
    'lois': '#FF6600',
    'clark': '#FF6600',
    'constantine': '#FF6600',
    'lucifer': '#FF6600',
    'preacher': '#FF6600',
    'sandman': '#FF6600',
    'swamp': '#FF6600',
    'thing': '#FF6600',
    'hellblazer': '#FF6600',
    'vertigo': '#FF6600',
    'wildstorm': '#FF6600',
    'milestone': '#FF6600',
    'zuda': '#FF6600',
    'minx': '#FF6600',
    'helix': '#FF6600',
    'paradox': '#FF6600',
    'piranha': '#FF6600',
    'karen': '#FF6600',
    'berger': '#FF6600',
    'joe': '#FF6600',
    'hill': '#FF6600',
    'comics': '#FF6600',
    'locke': '#FF6600',
    'key': '#FF6600',
    'nos4a2': '#FF6600',
    'the': '#FF6600',
    'fireman': '#FF6600',
    'heart': '#FF6600',
    'shaped': '#FF6600',
    'box': '#FF6600',
    'strange': '#FF6600',
    'weather': '#FF6600',
    'horns': '#FF6600',
    '20th': '#FF6600',
    'century': '#FF6600',
    'ghosts': '#FF6600',
    'wraith': '#FF6600',
    'welcome': '#FF6600',
    'christmasland': '#FF6600',
    'basket': '#FF6600',
    'full': '#FF6600',
    'heads': '#FF6600',
    'pop': '#FF6600',
    'adjust': '#FF6600',
    'brightness': '#FF6600',
    'tales': '#FF6600',
    'from': '#FF6600',
    'loop': '#FF6600',
    'thumbprints': '#FF6600',
    'voluntary': '#FF6600',
    'committal': '#FF6600',
    'rain': '#FF6600',
    'june': '#FF6600',
    'gloom': '#FF6600',
    'precipice': '#FF6600',
    'throttle': '#FF6600',
    'in': '#FF6600',
    'tall': '#FF6600',
    'grass': '#FF6600',
    'faun': '#FF6600',
    'late': '#FF6600',
    'returns': '#FF6600',
    'tower': '#FF6600',
    'gunslinger': '#FF6600',
    'drawing': '#FF6600',
    'three': '#FF6600',
    'waste': '#FF6600',
    'lands': '#FF6600',
    'wizard': '#FF6600',
    'glass': '#FF6600',
    'wolves': '#FF6600',
    'calla': '#FF6600',
    'song': '#FF6600',
    'susannah': '#FF6600',
    'seven': '#FF6600',
    'wind': '#FF6600',
    'through': '#FF6600',
    'keyhole': '#FF6600',
    'little': '#FF6600',
    'sisters': '#FF6600',
    'eluria': '#FF6600',
    'everything': '#FF6600',
    'eventual': '#FF6600',
    'hearts': '#FF6600',
    'atlantis': '#FF6600',
    'shining': '#FF6600',
    'doctor': '#FF6600',
    'sleep': '#FF6600',
    'carrie': '#FF6600',
    'salems': '#FF6600',
    'lot': '#FF6600',
    'stand': '#FF6600',
    'dead': '#FF6600',
    'zone': '#FF6600',
    'firestarter': '#FF6600',
    'cujo': '#FF6600',
    'christine': '#FF6600',
    'pet': '#FF6600',
    'sematary': '#FF6600',
    'cycle': '#FF6600',
    'werewolf': '#FF6600',
    'it': '#FF6600',
    'eyes': '#FF6600',
    'dragon': '#FF6600',
    'misery': '#FF6600',
    'tommyknockers': '#FF6600',
    'needful': '#FF6600',
    'things': '#FF6600',
    'geralds': '#FF6600',
    'game': '#FF6600',
    'dolores': '#FF6600',
    'claiborne': '#FF6600',
    'insomnia': '#FF6600',
    'rose': '#FF6600',
    'madder': '#FF6600',
    'desperation': '#FF6600',
    'regulators': '#FF6600',
    'bag': '#FF6600',
    'bones': '#FF6600',
    'storm': '#FF6600',
    'dreamcatcher': '#FF6600',
    'just': '#FF6600',
    'after': '#FF6600',
    'sunset': '#FF6600',
    'cell': '#FF6600',
    'liseys': '#FF6600',
    'story': '#FF6600',
    'duma': '#FF6600',
    'under': '#FF6600',
    'dome': '#FF6600',
    '11': '#FF6600',
    '22': '#FF6600',
    '63': '#FF6600',
    'joyland': '#FF6600',
    'mr': '#FF6600',
    'mercedes': '#FF6600',
    'finders': '#FF6600',
    'keepers': '#FF6600',
    'end': '#FF6600',
    'watch': '#FF6600',
    'sleeping': '#FF6600',
    'beauties': '#FF6600',
    'outsider': '#FF6600',
    'elevation': '#FF6600',
    'institute': '#FF6600',
    'if': '#FF6600',
    'bleeds': '#FF6600',
    'billy': '#FF6600',
    'summers': '#FF6600',
    'fairy': '#FF6600',
    'tale': '#FF6600',
    'gwendys': '#FF6600',
    'button': '#FF6600',
    'task': '#FF6600',
    'holly': '#FF6600',
    'you': '#FF6600',
    'like': '#FF6600',
    'darker': '#FF6600',
    'fourth': '#FF6600',
    'monkey': '#FF6600',
    'talisman': '#FF6600',
    'collision': '#FF6600',
    'charlie': '#FF6600',
    'mile': '#FF6600',
    'night': '#FF6600',
    'shift': '#FF6600',
    'different': '#FF6600',
    'seasons': '#FF6600',
    'skeleton': '#FF6600',
    'crew': '#FF6600',
    'four': '#FF6600',
    'past': '#FF6600',
    'midnight': '#FF6600',
    'nightmares': '#FF6600',
    'dreamscapes': '#FF6600',
    'no': '#FF6600',
    'stars': '#FF6600',
    'bazaar': '#FF6600',
    'bad': '#FF6600',
    'dreams': '#FF6600',
    'later': '#FF6600',
  }
  
  const normalizedTech = tech.toLowerCase().replace(/[^a-z0-9]/g, '')
  return techColors[normalizedTech] || generateRandomColor()
}

// Okuma süresi hesaplama
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200 // Ortalama okuma hızı
  const words = content.trim().split(/\s+/).length
  const minutes = words / wordsPerMinute
  return Math.ceil(minutes)
}

// Deneyim süresi hesaplama
export const calculateExperienceDuration = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate)
  const end = endDate ? new Date(endDate) : new Date()
  
  const totalMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  
  if (years === 0) {
    return months === 1 ? '1 ay' : `${months} ay`
  }
  
  if (months === 0) {
    return years === 1 ? '1 yıl' : `${years} yıl`
  }
  
  return `${years} yıl ${months} ay`
}

// Tarih aralığı formatla
export const formatDateRange = (startDate: string, endDate?: string): string => {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Devam ediyor'
  return `${start} - ${end}`
}

// Süre formatla (saniye cinsinden)
export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  return `${Math.floor(seconds / 86400)}d`
}

// Sayıyı formatla (1000 -> 1K)
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Yüzde formatla
export const formatPercentage = (value: number, total: number): string => {
  const percentage = (value / total) * 100
  return `${percentage.toFixed(1)}%`
}

// Türkçe karakterleri düzelt
export const normalizeText = (text: string): string => {
  const turkishChars: Record<string, string> = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  }
  
  return text.replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => turkishChars[char] || char)
}

// Kelime sayısını say
export const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

// Karakter sayısını say (boşluklar dahil)
export const countCharacters = (text: string): number => {
  return text.length
}

// Boşluksuz karakter sayısını say
export const countCharactersWithoutSpaces = (text: string): number => {
  return text.replace(/\s/g, '').length
}

// Paragraf sayısını say
export const countParagraphs = (text: string): number => {
  return text.split('\n\n').filter(paragraph => paragraph.trim().length > 0).length
}

// Benzersiz ID üret
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Rastgele string üret
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Dizi öğelerini karıştır
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Dizi öğelerini grupla
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

// Dizi öğelerini sayfa sayfa böl
export const paginate = <T>(array: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return array.slice(start, end)
}

// Debounce fonksiyonu
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Throttle fonksiyonu
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCallTime = 0
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCallTime >= delay) {
      func(...args)
      lastCallTime = now
    }
  }
}

// Local storage wrapper
export const storage = {
  set: (key: string, value: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('LocalStorage set error:', error)
    }
  },
  
  get: (key: string) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('LocalStorage get error:', error)
      return null
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error('LocalStorage remove error:', error)
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('LocalStorage clear error:', error)
    }
  }
}

// Clipboard'a kopyala
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Clipboard copy error:', error)
    return false
  }
}

// Tarayıcı bilgilerini al
export const getBrowserInfo = () => {
  const { userAgent } = navigator
  return {
    isChrome: userAgent.includes('Chrome'),
    isFirefox: userAgent.includes('Firefox'),
    isSafari: userAgent.includes('Safari') && !userAgent.includes('Chrome'),
    isEdge: userAgent.includes('Edge'),
    isIE: userAgent.includes('MSIE') || userAgent.includes('Trident'),
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
    isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
  }
}

// Çerezler ile çalışma
export const cookies = {
  set: (name: string, value: string, days: number = 30) => {
    const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
  },
  
  get: (name: string): string | null => {
    const nameEQ = name + '='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  },
  
  remove: (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
  }
}

// Renge göre kontrast renk üret
export const getContrastColor = (hexColor: string): string => {
  const r = parseInt(hexColor.slice(1, 3), 16)
  const g = parseInt(hexColor.slice(3, 5), 16)
  const b = parseInt(hexColor.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

// Hex rengi RGB'ye çevir
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

// RGB'yi hex'e çevir
export const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Renk parlaklığını ayarla
export const adjustBrightness = (hex: string, percent: number): string => {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  
  const adjust = (value: number) => {
    return Math.max(0, Math.min(255, Math.round(value * (100 + percent) / 100)))
  }
  
  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b))
}

// Slug'dan başlığa çevir
export const slugToTitle = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Başlık formatla
export const formatTitle = (title: string): string => {
  return title
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Temizle ve formatla
export const cleanAndFormat = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s-]/g, '')
    .trim()
}

// Sadece sayıları al
export const extractNumbers = (text: string): number[] => {
  const matches = text.match(/\d+/g)
  return matches ? matches.map(Number) : []
}

// Sadece harfleri al
export const extractLetters = (text: string): string => {
  return text.replace(/[^a-zA-ZçğıöşüÇĞİÖŞÜ]/g, '')
}

// Boşlukları kaldır
export const removeSpaces = (text: string): string => {
  return text.replace(/\s/g, '')
}

// Özel karakterleri kaldır
export const removeSpecialChars = (text: string): string => {
  return text.replace(/[^a-zA-Z0-9\s]/g, '')
}

// Kelime başı harflerini büyüt
export const capitalizeWords = (text: string): string => {
  return text.replace(/\b\w/g, char => char.toUpperCase())
}

// İlk harfi büyüt
export const capitalizeFirst = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Tüm harfleri büyüt
export const toUpperCase = (text: string): string => {
  return text.toUpperCase()
}

// Tüm harfleri küçüt
export const toLowerCase = (text: string): string => {
  return text.toLowerCase()
}

// Ters çevir
export const reverseString = (text: string): string => {
  return text.split('').reverse().join('')
}

// Palindrom kontrolü
export const isPalindrome = (text: string): boolean => {
  const cleaned = text.toLowerCase().replace(/[^a-z]/g, '')
  return cleaned === cleaned.split('').reverse().join('')
}

// Anagram kontrolü
export const areAnagrams = (str1: string, str2: string): boolean => {
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('')
  return normalize(str1) === normalize(str2)
}

// Kelime sayısını saydır
export const getWordFrequency = (text: string): Record<string, number> => {
  const words = text.toLowerCase().match(/\b\w+\b/g) || []
  const frequency: Record<string, number> = {}
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1
  })
  
  return frequency
}

// En sık kullanılan kelimeler
export const getMostFrequentWords = (text: string, limit: number = 10): Array<{word: string, count: number}> => {
  const frequency = getWordFrequency(text)
  return Object.entries(frequency)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }))
}

// Metin benzerliği (basit)
export const getTextSimilarity = (text1: string, text2: string): number => {
  const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || [])
  const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || [])
  
  const intersection = new Set([...words1].filter(word => words2.has(word)))
  const union = new Set([...words1, ...words2])
  
  return intersection.size / union.size
}

// Basit şifreleme (ROT13)
export const rot13 = (text: string): string => {
  return text.replace(/[a-zA-Z]/g, char => {
    const start = char <= 'Z' ? 65 : 97
    return String.fromCharCode(((char.charCodeAt(0) - start + 13) % 26) + start)
  })
}

// Base64 encode
export const base64Encode = (text: string): string => {
  return btoa(unescape(encodeURIComponent(text)))
}

// Base64 decode
export const base64Decode = (encoded: string): string => {
  return decodeURIComponent(escape(atob(encoded)))
}

// Hash code üret (basit)
export const hashCode = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32-bit integer'a çevir
  }
  return hash
}

// Checksum üret
export const checksum = (str: string): string => {
  return Math.abs(hashCode(str)).toString(16)
}

// Rastgele renk üret
export const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// Gradient renk üret
export const generateGradient = (color1: string, color2: string, direction: string = 'to right'): string => {
  return `linear-gradient(${direction}, ${color1}, ${color2})`
}

// Pastel renk üret
export const generatePastelColor = (): string => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 85%)`
}

// Karanlık renk üret
export const generateDarkColor = (): string => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 25%)`
}

// Renk paletleri
export const colorPalettes = {
  primary: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6'],
  secondary: ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6', '#4C1D95'],
  success: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'],
  warning: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
  error: ['#EF4444', '#DC2626', '#B91C1C', '#991B1B', '#7F1D1D'],
  info: ['#3B82F6', '#1E40AF', '#1D4ED8', '#2563EB', '#3B82F6'],
  light: ['#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8'],
  dark: ['#1E293B', '#0F172A', '#020617', '#000000', '#111827']
}

// Rastgele paletten renk seç
export const getRandomPaletteColor = (palette: keyof typeof colorPalettes = 'primary'): string => {
  const colors = colorPalettes[palette]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Utility fonksiyonlarını export et
export default {
  cn,
  formatDate,
  formatRelativeTime,
  generateSlug,
  truncateText,
  validateEmail,
  validateUrl,
  getProficiencyText,
  formatFileSize,
  formatErrorMessage,
  formatSuccessMessage,
  generatePageTitle,
  generateMetaDescription,
  generateRandomColor,
  getTechColor,
  calculateReadingTime,
  calculateExperienceDuration,
  formatDateRange,
  formatDuration,
  formatNumber,
  formatPercentage,
  normalizeText,
  countWords,
  countCharacters,
  countCharactersWithoutSpaces,
  countParagraphs,
  generateUniqueId,
  generateRandomString,
  shuffleArray,
  groupBy,
  paginate,
  debounce,
  throttle,
  storage,
  copyToClipboard,
  getBrowserInfo,
  cookies,
  getContrastColor,
  hexToRgb,
  rgbToHex,
  adjustBrightness,
  slugToTitle,
  formatTitle,
  cleanAndFormat,
  extractNumbers,
  extractLetters,
  removeSpaces,
  removeSpecialChars,
  capitalizeWords,
  capitalizeFirst,
  toUpperCase,
  toLowerCase,
  reverseString,
  isPalindrome,
  areAnagrams,
  getWordFrequency,
  getMostFrequentWords,
  getTextSimilarity,
  rot13,
  base64Encode,
  base64Decode,
  hashCode,
  checksum,
  getRandomColor,
  generateGradient,
  generatePastelColor,
  generateDarkColor,
  colorPalettes,
  getRandomPaletteColor
}