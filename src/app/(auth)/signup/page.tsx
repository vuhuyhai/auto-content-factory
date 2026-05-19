'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { GoogleSignInButton } from '@/components/auth/google-sign-in-button'
import { signup, type SignupState } from './actions'

const initialState: SignupState = {}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Tạo tài khoản
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Bắt đầu viết content tự động cho doanh nghiệp của bạn.
        </p>

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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-acf focus:border-transparent"
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
              autoComplete="new-password"
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-acf focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Tối thiểu 8 ký tự.
            </p>
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
            className="w-full bg-accent-acf text-white font-medium py-2.5 rounded-lg hover:bg-accent-acf/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
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

        <GoogleSignInButton label="Đăng ký với Google" />

        <p className="text-sm text-gray-600 text-center mt-6">
          Đã có tài khoản?{' '}
          <Link
            href="/login"
            className="text-accent-acf font-medium hover:underline"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  )
}