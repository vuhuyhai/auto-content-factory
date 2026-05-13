import { createClient } from "@/lib/supabase/server"
import type { BrandVoiceGuide } from "@/lib/db/schema"

export interface Brand {
  id: string
  user_id: string
  name: string
  slogan: string | null
  industry: string | null
  audience_persona: string | null
  voice_archetype: string | null
  brand_voice_guide: BrandVoiceGuide | null
  hashtags: string[] | null
  logo_url: string | null
  status: string
  created_at: string
}

export async function getCurrentUserBrand(): Promise<Brand | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle()

  if (error) return null
  return data as Brand | null
}
