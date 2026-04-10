import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, Calendar, MessageSquare, ArrowRight, Zap, Globe, Sparkles, CheckCircle2, TrendingUp, ShieldCheck, Quote } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full flex flex-col items-center justify-center pt-28 pb-32 px-4 text-center overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 bg-background -z-10" />
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[120px] mix-blend-screen -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] mix-blend-screen -z-10" />
        
        <div className="space-y-6 max-w-4xl relative z-10">
          <Badge className="bg-violet-100/50 text-violet-800 hover:bg-violet-100/80 dark:bg-violet-900/40 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50 px-5 py-2 rounded-full mb-8 shadow-sm backdrop-blur-md transition-all hover:scale-105 duration-300 flex items-center gap-2 mx-auto w-max">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Welcome to the new AlumniBridge
          </Badge>
          
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-sm">
            Beyond the Campus. <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-violet-600 via-indigo-500 to-blue-500 animate-gradient-x">
              Into the Future.
            </span>
          </h1>
          
          <p className="mx-auto max-w-[750px] text-lg text-muted-foreground md:text-xl leading-relaxed mt-6 font-medium">
            Bridging the gap between ambitious students and experienced alumni. Gain mentorship, unlock exclusive opportunities, and expand your professional network with AlumniBridge.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 bg-violet-600 hover:bg-violet-700 text-base rounded-full shadow-lg hover:shadow-violet-500/25 transition-all hover:-translate-y-1 group">
                Join the Network 
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full shadow-sm hover:shadow-md transition-all hover:-translate-y-1 border-muted-foreground/20 hover:bg-muted/50 backdrop-blur-sm">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Impact / Stats Section */}
      <section className="w-full py-16 bg-violet-600 dark:bg-violet-950/50 text-white border-y border-violet-500/30 shadow-inner">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-violet-400/30">
            <div className="flex flex-col items-center justify-center space-y-2">
              <h4 className="text-4xl md:text-5xl font-bold">10k+</h4>
              <p className="text-violet-200 font-medium text-sm md:text-base">Active Alumni</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h4 className="text-4xl md:text-5xl font-bold">50+</h4>
              <p className="text-violet-200 font-medium text-sm md:text-base">Countries</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h4 className="text-4xl md:text-5xl font-bold">2.5M</h4>
              <p className="text-violet-200 font-medium text-sm md:text-base">Messages Sent</p>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2">
              <h4 className="text-4xl md:text-5xl font-bold">100%</h4>
              <p className="text-violet-200 font-medium text-sm md:text-base">Verified Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="relative w-full py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-6">Built for growth. Engineered for scale.</h2>
            <p className="text-muted-foreground text-lg">
              AlumniBridge is packed with state-of-the-art tools designed to accelerate your career trajectory from day one natively and securely.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="group flex flex-col p-8 bg-background/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10 flex items-center justify-center mb-6 shadow-inner border border-blue-200/50 dark:border-blue-800/50 group-hover:scale-110 transition-transform duration-300">
                <Globe className="h-7 w-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Global Directory</h3>
              <p className="text-muted-foreground leading-relaxed">
                Connect instantly with a worldwide network of alumni. Filter by technical skills, companies, and graduation years with blazing-fast dynamic search.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group flex flex-col p-8 bg-background/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-50 dark:from-violet-900/40 dark:to-violet-900/10 flex items-center justify-center mb-6 shadow-inner border border-violet-200/50 dark:border-violet-800/50 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-7 w-7 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Instant Messaging</h3>
              <p className="text-muted-foreground leading-relaxed">
                Skip the cold emails. Reach out directly through our built-in, real-time messaging protocol. Build relationships with zero friction globally.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group flex flex-col p-8 bg-background/60 backdrop-blur-md rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 dark:border-white/5 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/10 flex items-center justify-center mb-6 shadow-inner border border-orange-200/50 dark:border-orange-800/50 group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-7 w-7 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Exclusive Events</h3>
              <p className="text-muted-foreground leading-relaxed">
                Unlock career fairs, private webinars, and local meetups posted strictly by verified alumni and campus organizers. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="w-full py-24 bg-background border-t border-muted">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-24">
            <div className="flex-1 space-y-6">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Process</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">Your golden ticket in 3 simple steps</h2>
              <p className="text-lg text-muted-foreground">We designed AlumniBridge to eliminate friction so you can focus entirely on your professional journey.</p>
              
              <div className="space-y-8 mt-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 font-bold text-xl">1</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Create your Profile</h4>
                    <p className="text-muted-foreground">Sign up as either a Student or an Alumni, tag your core skills, and list your academic graduation year.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold text-xl">2</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Search the Directory</h4>
                    <p className="text-muted-foreground">Utilize our directory mapping to filter past graduates currently working at your dream tech companies.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold text-xl">3</div>
                  <div>
                    <h4 className="text-xl font-semibold mb-1">Strike a Conversation</h4>
                    <p className="text-muted-foreground">Open a real-time chat pipeline. Ask for a resume review, a referral, or just a 15-minute coffee chat!</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 w-full lg:max-w-lg">
              <div className="relative rounded-2xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 p-8 shadow-2xl border border-muted/50 backdrop-blur-sm">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-violet-400/20 rounded-full blur-2xl" />
                <div className="bg-background rounded-xl p-6 shadow-sm border border-muted space-y-4 relative z-10">
                  <div className="flex items-center gap-4 border-b pb-4">
                    <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-muted rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-3 bg-muted rounded w-full animate-pulse" />
                    <div className="h-3 bg-muted rounded w-5/6 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-4/6 animate-pulse" />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <div className="h-8 w-24 bg-violet-600/20 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-center">Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-background rounded-2xl shadow-sm border border-muted/50 relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-muted/30" />
              <div className="flex items-center gap-1 mb-6">
                 {[1,2,3,4,5].map(i => (
                  <Sparkles key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                 ))}
              </div>
              <p className="text-lg italic text-muted-foreground mb-6">
                "I reached out to a Senior Engineer at Google using AlumniBridge. Within three weeks, he reviewed my resume, gave me behavioral mock interviews, and referred me to the University grad program. I start in August!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-200" />
                <div>
                  <h5 className="font-bold">Sarah W.</h5>
                  <p className="text-sm text-muted-foreground">Class of 2024</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-background rounded-2xl shadow-sm border border-muted/50 relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-muted/30" />
              <div className="flex items-center gap-1 mb-6">
                 {[1,2,3,4,5].map(i => (
                  <Sparkles key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                 ))}
              </div>
              <p className="text-lg italic text-muted-foreground mb-6">
                "As an alumni who wants to give back, AlumniBridge provides the perfect secure ecosystem. I don't have to deal with endless LinkedIn spam—only highly motivated students from my own Alma Mater message me here."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200" />
                <div>
                  <h5 className="font-bold">David L.</h5>
                  <p className="text-sm text-muted-foreground">Tech Lead @ Amazon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-24 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Ready to bridge the gap?</h2>
          <p className="text-violet-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 font-medium">
            Join thousands of alumni and students already pushing boundaries and achieving their dreams.
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 bg-white text-violet-600 hover:bg-gray-100 font-bold text-lg rounded-full shadow-xl hover:scale-105 transition-transform duration-300">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="w-full border-t border-muted/50 bg-background py-16 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-blue-600">AlumniBridge</span>
          </div>
          <div className="flex gap-6 mb-8 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contact Support</Link>
          </div>
          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-muted-foreground/20 to-transparent mb-8"></div>
          <p className="text-xs text-muted-foreground/60 text-center">
            © {new Date().getFullYear()} AlumniBridge Platform. All rights reserved. Let's build the future together.
          </p>
        </div>
      </footer>
    </div>
  )
}

function Badge({ className, children }: { className?: string, children: React.ReactNode }) {
  return (
    <div className={`inline-flex items-center text-sm font-medium ${className}`}>
      {children}
    </div>
  )
}
