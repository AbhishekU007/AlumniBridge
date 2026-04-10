import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, GraduationCap, Edit, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export default async function ViewProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === id

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_skills(
        skills(name)
      )
    `)
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  const skills = profile.profile_skills?.map((ps: any) => ps.skills.name) || []

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="h-48 bg-gradient-to-r from-blue-600 to-violet-600"></div>
        <CardContent className="relative pt-0 sm:px-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end -mt-16 mb-6">
            <Avatar className="w-32 h-32 border-4 border-background bg-muted shadow-md">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name} />
              <AvatarFallback className="text-4xl">{profile.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-4 sm:mt-0 flex gap-3">
              {isOwnProfile ? (
                <Link href="/profile/edit">
                  <Button variant="outline" className="gap-2">
                    <Edit className="w-4 h-4" /> Edit Profile
                  </Button>
                </Link>
              ) : (
                <Link href={`/messages/${id}`}>
                  <Button className="gap-2 bg-violet-600 hover:bg-violet-700 text-white">
                    <MessageSquare className="w-4 h-4" /> Message
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{profile.full_name}</h1>
              <p className="text-xl text-muted-foreground mt-1 capitalize">{profile.role}</p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-foreground/80">
              {profile.job_title && profile.current_company && (
                <div className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-violet-500" />
                  {profile.job_title} at <span className="font-semibold">{profile.current_company}</span>
                </div>
              )}
              {profile.graduation_year && (
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-500" />
                  Class of {profile.graduation_year}
                </div>
              )}
            </div>

            {profile.bio && (
              <div className="bg-muted/30 p-4 rounded-xl">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{profile.bio}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Skills & Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1 bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
