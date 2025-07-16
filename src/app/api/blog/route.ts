// app/api/blog/route.ts
import { supabase } from '@/lib/supabase'
import { BlogPostForm } from '@/lib/types'
import { generateSlug } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm blog yazılarını listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const published = searchParams.get('published')

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (published === 'true') {
      query = query.eq('published', true)
    } else if (published === 'false') {
      query = query.eq('published', false)
    }

    const from = (page - 1) * per_page
    const to = from + per_page - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      count,
      page,
      per_page,
      total_pages: Math.ceil((count || 0) / per_page)
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Yeni blog yazısı oluştur
export async function POST(request: NextRequest) {
  try {
    const body: BlogPostForm = await request.json()

    // Slug'ı title'dan otomatik oluştur
    if (!body.slug || body.slug.trim() === '') {
      body.slug = generateSlug(body.title)
    }

    // Slug'ın benzersiz olup olmadığını kontrol et
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existingPost) {
      body.slug = `${body.slug}-${Date.now()}`
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Blog yazısı başarıyla oluşturuldu' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}