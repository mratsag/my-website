// app/api/skills/route.ts
import { supabase } from '@/lib/supabase'
import { SkillForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm yetenekleri listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let query = supabase
      .from('skills')
      .select('*')
      .order('proficiency', { ascending: false })
      .order('name', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Kategorilere göre grupla
    const grouped = data.reduce<Record<string, typeof data[0][]>>((acc, skill) => {
      const category = skill.category
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(skill)
      return acc
    }, {})

    return NextResponse.json({ data: grouped })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST - Yeni yetenek oluştur
export async function POST(request: NextRequest) {
  try {
    const body: SkillForm = await request.json()

    // Proficiency seviyesi kontrolü
    if (body.proficiency < 1 || body.proficiency > 5) {
      return NextResponse.json({ error: 'Proficiency seviyesi 1-5 arasında olmalıdır' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('skills')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Yetenek başarıyla oluşturuldu' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}