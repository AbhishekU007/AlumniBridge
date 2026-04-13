'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

export default function InboxPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchConversations()
  }, [])

  async function fetchConversations() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Find all messages involving the user
      const { data: messages } = await supabase
        .from('messages')
        .select(`
          created_at,
          sender:profiles!sender_id(id, full_name, avatar_url, role),
          receiver:profiles!receiver_id(id, full_name, avatar_url, role)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (messages) {
        // Map unique conversations
        const uniqueProfilesMap = new Map()
        
        messages.forEach((msg: any) => {
          const otherProfile = msg.sender.id === user.id ? msg.receiver : msg.sender
          if (!uniqueProfilesMap.has(otherProfile.id)) {
            uniqueProfilesMap.set(otherProfile.id, {
              profile: otherProfile,
              lastMessageDate: msg.created_at
            })
          }
        })
        
        setConversations(Array.from(uniqueProfilesMap.values()))
      }
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <MessageSquare className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <Card key={i} className="h-24 animate-pulse bg-muted/50" />)}
        </div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-xl">
          <h3 className="text-xl font-semibold mb-2">Your inbox is empty</h3>
          <p className="text-muted-foreground">Go to the Directory to find alumni to connect with.</p>
          <Link href="/network">
            <button className="mt-4 bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Browse Directory
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {conversations.map((conv) => (
            <Link key={conv.profile.id} href={`/messages/${conv.profile.id}`} className="block">
              <Card className="hover:bg-muted/30 transition-colors cursor-pointer shadow-sm border-muted">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conv.profile.avatar_url || ''} />
                      <AvatarFallback>{conv.profile.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{conv.profile.full_name}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{conv.profile.role}</p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(conv.lastMessageDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
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
