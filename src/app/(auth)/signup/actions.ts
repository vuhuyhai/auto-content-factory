'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

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
    return { error: 'Email va mat khau khong hop le.' }
  }

  if (!email || !password) {
    return { error: 'Vui long nhap day du email va mat khau.' }
  }

  if (password.length < 8) {
    return { error: 'Mat khau toi thieu 8 ky tu.' }
  }

  const headersList = await headers()
  const origin =
    headersList.get('origin') || 'https://auto-content-factory.vercel.app'

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    if (error.message.toLowerCase().includes('already')) {
      return { error: 'Email nay da duoc dang ky. Vui long dang nhap.' }
    }
    return { error: 'Khong the tao tai khoan. Vui long thu lai.' }
  }

  redirect(`/auth/confirm-email?email=${encodeURIComponent(email)}`)
}
