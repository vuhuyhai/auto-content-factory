'use client'

import { Suspense, useActionState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { login, type LoginState } from './actions'

const initialState: LoginState = {}

function mapCallbackError(raw: string | null): string | null {
  if (!raw) return null
  if (raw === 'auth_callback_failed') {
    return 'Đăng nhập Google không thành công. Vui lòng thử lại.'
  }
  return 'Đăng nhập không thành công. Vui lòng thử lại.'
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, initialState)
  const searchParams = useSearchParams()
  const callbackError = mapCallbackError(searchParams.get('error'))

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Đăng nhập
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        Vào Auto-Content Factory để bắt đầu viết content.
      </p>

      {callbackError ? (
        <p
          role="alert"
          className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4"
        >
          {callbackError}
        </p>
      ) : null}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="ban@congty.com"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {state.error ? (
          <p
            role="alert"
            className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2"
          >
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">hoặc</span>
        </div>
      </div>

      <GoogleSignInButton />

      <p className="text-sm text-gray-600 text-center mt-6">
        Chưa có tài khoản?{' '}
        <Link
          href="/signup"
          className="text-blue-600 font-medium hover:underline"
        >
          Đăng ký miễn phí
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Suspense fallback={<div className="text-gray-500 text-sm">Đang tải...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  )
}