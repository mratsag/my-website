// app/api/experiences/route.ts
import { supabase } from '@/lib/supabase'
import { ExperienceForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm deneyimleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')

    const from = (page - 1) * per_page
    const to = from + per_page - 1

    const { data, error, count } = await supabase
      .from('experiences')
      .select('*', { count: 'exact' })
      .order('start_date', { ascending: false })
      .range(from, to)

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

// POST - Yeni deneyim oluştur
export async function POST(request: NextRequest) {
  try {
    const body: ExperienceForm = await request.json()

    const { data, error } = await supabase
      .from('experiences')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Deneyim başarıyla oluşturuldu' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}