'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { translateSignupError } from '@/lib/auth/error-messages'

export interface SignupState {
  error?: string
}

export async function signup(
  _prevState: SignupState,
  formData: FormData
): Promise<SignupState> {
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email và mật khẩu không hợp lệ.' }
  }

  if (!email || !password) {
    return { error: 'Vui lòng nhập đầy đủ email và mật khẩu.' }
  }

  if (password.length < 8) {
    return { error: 'Mật khẩu tối thiểu 8 ký tự.' }
  }

  const headersList = await headers()
  const origin =
    headersList.get('origin') ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://autocontent.online'

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: translateSignupError(error) }
  }

  redirect(`/auth/confirm-email?email=${encodeURIComponent(email)}`)
}
