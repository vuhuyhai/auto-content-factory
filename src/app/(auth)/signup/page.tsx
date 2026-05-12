'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup, type SignupState } from './actions'

const initialState: SignupState = {}

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, initialState)

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Tao tai khoan
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Bat dau viet content tu dong cho doanh nghiep cua ban.
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ban@congty.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Mat khau
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Toi thieu 8 ky tu.
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
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isPending ? 'Dang tao tai khoan...' : 'Tao tai khoan'}
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-6">
          Da co tai khoan?{' '}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Dang nhap
          </Link>
        </p>
      </div>
    </main>
  )
}
