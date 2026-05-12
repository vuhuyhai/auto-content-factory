import { createClient } from "@/lib/supabase/server"

import UserMenuClient from "./user-menu-client"

export default async function UserMenu() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const email = user.email ?? ""

  return <UserMenuClient email={email} />
}
