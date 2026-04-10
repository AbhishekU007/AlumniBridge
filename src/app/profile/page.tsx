import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export default async function ProfileRedirectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Redirect to their specific profile page
  redirect(`/profile/${user.id}`)
}
