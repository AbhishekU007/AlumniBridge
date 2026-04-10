'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { User } from '@supabase/supabase-js'
import { LogOut, Menu, UserCircle, GraduationCap, Users, Calendar, MessageSquare } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/mode-toggle'

export function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      }
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
      } else {
        fetchUser()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navLinks = [
    { name: 'Directory', href: '/network', icon: Users },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Messages', href: '/messages', icon: MessageSquare },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">AlumniBridge</span>
          </Link>
          {user && (
            <div className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname?.startsWith(link.href) ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <ModeToggle />
          <div className="flex items-center space-x-1">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger render={
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                        <AvatarFallback><UserCircle className="h-6 w-6" /></AvatarFallback>
                      </Avatar>
                    </Button>
                  } />
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        {profile?.full_name && <p className="font-medium">{profile.full_name}</p>}
                        {user.email && <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>}
                      </div>
                    </div>
                    <DropdownMenuItem render={<Link href="/profile">Profile</Link>} />
                    <DropdownMenuItem render={<Link href="/profile/edit">Settings</Link>} />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Sheet>
                  <SheetTrigger render={
                    <Button variant="outline" size="icon" className="md:hidden">
                      <Menu className="h-5 w-5" />
                    </Button>
                  } />
                  <SheetContent side="right">
                    <div className="flex flex-col space-y-4 pt-6">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center space-x-2 text-sm font-medium"
                        >
                          <link.icon className="h-5 w-5" />
                          <span>{link.name}</span>
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
