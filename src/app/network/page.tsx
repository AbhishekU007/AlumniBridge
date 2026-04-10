'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Search, Briefcase, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { useDebounce } from '@/hooks/use-debounce'

export default function NetworkPage() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)
  
  const supabase = createClient()

  useEffect(() => {
    fetchProfiles()
  }, [debouncedSearch])

  async function fetchProfiles() {
    setLoading(true)
    let query = supabase
      .from('profiles')
      .select(`
        *,
        profile_skills(
          skills(name)
        )
      `)
      .order('created_at', { ascending: false })

    if (debouncedSearch) {
      // Searching by full_name, current_company, or job_title
      query = query.or(`full_name.ilike.%${debouncedSearch}%,current_company.ilike.%${debouncedSearch}%,job_title.ilike.%${debouncedSearch}%`)
    }

    const { data: profilesData, error } = await query

    if (profilesData) {
      setProfiles(profilesData)
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
          <p className="text-muted-foreground mt-1">Connect with professionals and students.</p>
        </div>
        
        <div className="w-full md:w-96 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, company, or title..."
            className="pl-9 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="h-64 animate-pulse bg-muted/50" />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No profiles found</h3>
          <p className="text-muted-foreground">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <Link key={profile.id} href={`/profile/${profile.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer hover:border-violet-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url || ''} />
                      <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg line-clamp-1">{profile.full_name}</h3>
                      <p className="text-sm text-violet-600 font-medium capitalize">{profile.role}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                    {profile.job_title && (
                      <div className="flex items-center gap-2 line-clamp-1">
                        <Briefcase className="h-4 w-4 shrink-0" />
                        <span>{profile.job_title} {profile.current_company && `at ${profile.current_company}`}</span>
                      </div>
                    )}
                    {profile.graduation_year && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 shrink-0" />
                        <span>Class of {profile.graduation_year}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {profile.profile_skills?.slice(0, 3).map((ps: any) => (
                      <Badge key={ps.skills.name} variant="secondary" className="text-xs font-normal">
                        {ps.skills.name}
                      </Badge>
                    ))}
                    {profile.profile_skills?.length > 3 && (
                      <Badge variant="outline" className="text-xs font-normal">
                        +{profile.profile_skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
