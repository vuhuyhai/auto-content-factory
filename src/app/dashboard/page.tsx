import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Chao mung quay tro lai, {user?.email}.
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500">User ID: {user?.id}</p>
          <p className="text-sm text-gray-500 mt-2">
            Day la placeholder. Week 1 Day 5-7 se thiet ke lai voi Bento Grid.
          </p>
        </div>
      </div>
    </main>
  )
}
