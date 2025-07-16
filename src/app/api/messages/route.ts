// app/api/messages/route.ts
import { supabase } from '@/lib/supabase'
import { ContactForm } from '@/lib/types'
import { NextRequest, NextResponse } from 'next/server'

// GET - Tüm mesajları listele
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const per_page = parseInt(searchParams.get('per_page') || '10')
    const unread = searchParams.get('unread') === 'true'

    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (unread) {
      query = query.eq('is_read', false)
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

// POST - Yeni mesaj oluştur (contact form)
export async function POST(request: NextRequest) {
  try {
    const body: ContactForm = await request.json()

    // Basit spam koruması
    if (body.message.length < 10) {
      return NextResponse.json({ error: 'Mesaj çok kısa' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('messages')
      .insert([body])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data, message: 'Mesajınız başarıyla gönderildi' })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}