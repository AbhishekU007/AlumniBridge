'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar as CalendarIcon, User as UserIcon, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: ''
  })

  const supabase = createClient()

  useEffect(() => {
    fetchEvents()
    fetchUserProfile()
  }, [])

  async function fetchUserProfile() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
    }
  }

  async function fetchEvents() {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*, profiles(full_name, avatar_url)')
      .order('event_date', { ascending: true })
    
    if (data) {
      // Filter out past events
      const upcoming = data.filter(e => new Date(e.event_date) >= new Date())
      setEvents(upcoming)
    }
    setLoading(false)
  }

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      const { error } = await supabase.from('events').insert([
        {
          author_id: profile.id,
          title: formData.title,
          description: formData.description,
          event_date: new Date(formData.event_date).toISOString(),
          location: formData.location
        }
      ])

      if (error) throw error

      toast.success('Event created successfully')
      setOpen(false)
      setFormData({ title: '', description: '', event_date: '', location: '' })
      fetchEvents()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="text-muted-foreground mt-1">Discover networking events, webinars, and meetups.</p>
        </div>
        
        {profile?.role === 'alumni' && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button>Create Event</Button>} />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>
                  Post an event for students and alumni to attend.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateEvent} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date and Time</Label>
                  <Input id="date" type="datetime-local" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (or Link)</Label>
                  <Input id="location" placeholder="e.g. Zoom Link or City, State" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={4} required/>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="h-64 animate-pulse bg-muted/50" />
          <Card className="h-64 animate-pulse bg-muted/50" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">No upcoming events</h3>
          <p className="text-muted-foreground">Check back later or create one if you are an Alumni.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col h-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">Networking</Badge>
                  <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(event.event_date), 'h:mm a')}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-2">{event.title}</CardTitle>
                <CardDescription className="text-sm font-medium text-foreground flex items-center gap-2 mt-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-4">
                <p className="line-clamp-3 text-muted-foreground text-sm mb-4">
                  {event.description}
                </p>
                
                <div className="space-y-2 text-sm text-foreground/80 font-medium">
                  {event.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/20">
                <div className="flex items-center gap-2 w-full">
                  <UserIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground line-clamp-1">
                    Hosted by <span className="font-semibold text-foreground">{event.profiles.full_name}</span>
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
