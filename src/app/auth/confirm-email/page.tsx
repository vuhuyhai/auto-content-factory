import Link from 'next/link'

interface ConfirmEmailPageProps {
  searchParams: Promise<{ email?: string }>
}

export default async function ConfirmEmailPage({
  searchParams,
}: ConfirmEmailPageProps) {
  const { email } = await searchParams

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Kiem tra email cua ban
        </h1>
        <p className="text-sm text-gray-600 mb-2">
          Chung toi vua gui link xac minh den:
        </p>
        {email ? (
          <p className="text-sm font-medium text-gray-900 mb-6 break-all">
            {email}
          </p>
        ) : null}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left mb-6">
          <p className="text-sm text-gray-700">
            <strong>Buoc tiep theo:</strong>
          </p>
          <ol className="text-sm text-gray-600 list-decimal list-inside mt-2 space-y-1">
            <li>Mo hop thu email</li>
            <li>Bam link xac minh trong email tu Supabase</li>
            <li>Quay lai trang dang nhap</li>
          </ol>
        </div>

        <Link
          href="/login"
          className="inline-block w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          Quay ve dang nhap
        </Link>

        <p className="text-xs text-gray-500 mt-4">
          Khong thay email? Kiem tra muc Spam hoac thu lai sau 2 phut.
        </p>
      </div>
    </main>
  )
}
