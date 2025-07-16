// app/api/skills/[id]/route.ts
import { supabase } from '@/lib/supabase'
import { SkillForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Belirli yeteneği getir
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Yetenek bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT - Yeteneği güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: SkillForm = await request.json()

    // Proficiency seviyesi kontrolü
    if (body.proficiency < 1 || body.proficiency > 5) {
      return NextResponse.json({ error: 'Proficiency seviyesi 1-5 arasında olmalıdır' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('skills')
      .update(body)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Yetenek bulunamadı' }, { status: 404 })
      }
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Yetenek başarıyla güncellendi' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE - Yeteneği sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('skills')
      .delete()
      .eq('id', params.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Yetenek başarıyla silindi' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}