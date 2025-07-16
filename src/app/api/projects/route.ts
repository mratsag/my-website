// app/api/projects/route.ts
import { supabase } from '@/lib/supabase'
import { ProjectForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm projeleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const featured = searchParams.get('featured') === 'true'

    let query = supabase
      .from('projects')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (featured) {
      query = query.eq('featured', true)
    }

    const from = (page - 1) * per_page
    const to = from + per_page - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      console.error('Projects GET error:', error)
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
    console.error('Projects GET catch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Yeni proje oluştur
export async function POST(request: NextRequest) {
  try {
    const body: ProjectForm = await request.json()

    const { data, error } = await supabase
      .from('projects')
      .insert([body])
      .select()
      .single()

    if (error) {
      console.error('Projects POST error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Proje başarıyla oluşturuldu' })
  } catch (error) {
    console.error('Projects POST catch error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}