// app/api/blog/[slug]/route.ts
import { supabase } from '@/lib/supabase'
import { BlogPostForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Belirli blog yazısını getir
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Blog yazısını güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body: BlogPostForm = await request.json()

    const { data, error } = await supabase
      .from('blog_posts')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('slug', params.slug)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Blog yazısı başarıyla güncellendi' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Blog yazısını sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('slug', params.slug)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Blog yazısı başarıyla silindi' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}