'use client'

import { useEffect, useState, useRef, use } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Send, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'

export default function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: otherUserId } = use(params)
  const [messages, setMessages] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [otherProfile, setOtherProfile] = useState<any>(null)
  const [newMessage, setNewMessage] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [messages])

  async function fetchInitialData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setCurrentUser(user)

    // Fetch other user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', otherUserId)
      .single()
    if (profile) setOtherProfile(profile)

    // Fetch existing messages
    const { data: messagesData } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })

    if (messagesData) setMessages(messagesData)

    // Subscribe to new messages
    const channelName = `chat-${user.id}-${otherUserId}-${Date.now()}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          console.log('Realtime payload received!', payload)
          const newMsg = payload.new
          // Check if message belongs to this conversation
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === otherUserId) ||
            (newMsg.sender_id === otherUserId && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => {
              // Prevent duplication if optimistic update or previous realtime event already caught it
              if (prev.some(m => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            })
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser) return

    const messageContent = newMessage
    setNewMessage('') // Optimistic clear
    
    // 1. Optimistic Update (Immediate Feedback)
    const tempId = crypto.randomUUID()
    const optimisticMsg = {
      id: tempId,
      sender_id: currentUser.id,
      receiver_id: otherUserId,
      content: messageContent,
      created_at: new Date().toISOString(),
      isOptimistic: true // flag
    }
    
    setMessages(prev => [...prev, optimisticMsg])

    // 2. Perform DB Insert
    const { data: insertedData, error } = await supabase.from('messages').insert([
      {
        sender_id: currentUser.id,
        receiver_id: otherUserId,
        content: messageContent,
      },
    ]).select().single()

    if (error) {
      console.error('Failed to send message:', error)
      // Revert optimistic update gracefully
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } else if (insertedData) {
      // Swap out the optimistic temp string loop for the definitive Postgres generated ID
      setMessages(prev => prev.map(m => m.id === tempId ? insertedData : m))
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 h-[calc(100vh-4rem)] max-w-4xl flex flex-col">
      <div className="mb-4 flex items-center gap-4">
        <Link href="/messages">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        {otherProfile && (
          <Link href={`/profile/${otherUserId}`} className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherProfile.avatar_url || ''} />
              <AvatarFallback>{otherProfile.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{otherProfile.full_name}</h2>
              <p className="text-xs text-muted-foreground capitalize">{otherProfile.role}</p>
            </div>
          </Link>
        )}
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden bg-muted/10 border-muted">
        <CardContent ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isMe = msg.sender_id === currentUser?.id
            return (
              <div
                key={msg.id || idx}
                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-violet-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-muted border shadow-sm rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p
                    className={`text-[10px] mt-1 text-right w-full ${
                      isMe ? 'text-violet-200' : 'text-muted-foreground'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )
          })}

        </CardContent>
        <CardFooter className="p-3 bg-background border-t">
          <form
            onSubmit={sendMessage}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()} className="bg-violet-600 hover:bg-violet-700">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
