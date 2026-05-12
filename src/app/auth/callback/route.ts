// Handler nhận callback từ Supabase sau khi Google OAuth thành công,
// đổi authorization code thành session cookie rồi redirect về `next`.

import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'
  const oauthError = searchParams.get('error')

  if (oauthError) {
    const loginUrl = new URL('/login', origin)
    loginUrl.searchParams.set('error', oauthError)
    return NextResponse.redirect(loginUrl)
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', origin)
    )
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchange failed', error)
    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', origin)
    )
  }

  return NextResponse.redirect(new URL(next, origin))
}
