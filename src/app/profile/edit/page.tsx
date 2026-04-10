'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { User } from '@supabase/supabase-js'

export default function EditProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [skills, setSkills] = useState<{id: string, name: string}[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    current_company: '',
    job_title: '',
    graduation_year: '',
  })

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)

      const [{ data: profile }, { data: allSkills }, { data: userSkills }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('skills').select('*').order('name'),
        supabase.from('profile_skills').select('skill_id').eq('profile_id', user.id)
      ])

      if (profile) {
        setFormData({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          current_company: profile.current_company || '',
          job_title: profile.job_title || '',
          graduation_year: profile.graduation_year?.toString() || '',
        })
      }
      if (allSkills) setSkills(allSkills)
      if (userSkills) setSelectedSkills(userSkills.map(s => s.skill_id))
      
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSkillChange = (skillId: string, checked: boolean) => {
    setSelectedSkills(prev => 
      checked ? [...prev, skillId] : prev.filter(id => id !== skillId)
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          bio: formData.bio,
          current_company: formData.current_company,
          job_title: formData.job_title,
          graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        })
        .eq('id', user!.id)

      if (profileError) throw profileError

      // Update skills (delete old, insert new)
      await supabase.from('profile_skills').delete().eq('profile_id', user!.id)
      
      if (selectedSkills.length > 0) {
        const skillsToInsert = selectedSkills.map(skill_id => ({
          profile_id: user!.id,
          skill_id
        }))
        const { error: skillsError } = await supabase.from('profile_skills').insert(skillsToInsert)
        if (skillsError) throw skillsError
      }

      toast.success('Profile updated successfully!')
      router.push('/profile')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-[50vh]">Loading...</div>

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Edit Profile</CardTitle>
          <CardDescription>Update your personal and professional information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name required</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us a little bit about yourself"
                className="resize-none"
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current_company">Current Company</Label>
                <Input
                  id="current_company"
                  value={formData.current_company}
                  onChange={e => setFormData({ ...formData, current_company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job_title">Job Title</Label>
                <Input
                  id="job_title"
                  value={formData.job_title}
                  onChange={e => setFormData({ ...formData, job_title: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="graduation_year">Graduation Year</Label>
              <Input
                id="graduation_year"
                type="number"
                min="1950"
                max="2100"
                value={formData.graduation_year}
                onChange={e => setFormData({ ...formData, graduation_year: e.target.value })}
              />
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label className="text-base">Skills & Expertise</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {skills.map(skill => (
                  <div key={skill.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill.id}`}
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={(checked) => handleSkillChange(skill.id, checked as boolean)}
                    />
                    <label
                      htmlFor={`skill-${skill.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {skill.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
