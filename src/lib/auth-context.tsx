'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithX: (next?: string) => Promise<void>
  signOut: () => Promise<void>
  avatarUrl: string | null
  displayName: string
}

export function getAvatarUrl(user: import('@supabase/supabase-js').User | null): string | null {
  if (!user) return null
  const m = user.user_metadata
  // Twitter OAuth 1.0a / OAuth 2.0 どちらにも対応
  return (m?.avatar_url ?? m?.profile_image_url ?? m?.picture ?? null) as string | null
}

export function getDisplayName(user: import('@supabase/supabase-js').User | null): string {
  if (!user) return 'ユーザー'
  const m = user.user_metadata
  return (m?.full_name ?? m?.name ?? m?.user_name ?? user.email?.split('@')[0] ?? 'ユーザー') as string
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  loading: true,
  signInWithX: async (_next?: string) => {},
  signOut: async () => {},
  avatarUrl: null,
  displayName: 'ユーザー',
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url'

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return }
    const supabase = createClient()

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [isSupabaseConfigured])

  const signInWithX = useCallback(async (next?: string) => {
    if (!isSupabaseConfigured) {
      alert('Supabase の設定が必要です。\n.env.local に NEXT_PUBLIC_SUPABASE_URL と NEXT_PUBLIC_SUPABASE_ANON_KEY を設定してください。')
      return
    }
    // OAuth後のリダイレクト先をlocalStorageに保存（クエリパラメータが失われるケースへの対策）
    if (next) {
      localStorage.setItem('auth_redirect_next', next)
    }
    const supabase = createClient()
    const callbackUrl = next
      ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      : `${window.location.origin}/auth/callback`
    await supabase.auth.signInWithOAuth({
      provider: 'twitter',
      options: { redirectTo: callbackUrl },
    })
  }, [isSupabaseConfigured])

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) return
    const supabase = createClient()
    await supabase.auth.signOut()
  }, [isSupabaseConfigured])

  const avatarUrl = getAvatarUrl(user)
  const displayName = getDisplayName(user)

  return (
    <AuthContext.Provider value={{ user, session, loading, signInWithX, signOut, avatarUrl, displayName }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
