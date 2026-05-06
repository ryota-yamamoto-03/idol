'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

export default function AuthConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') ?? '/'

  useEffect(() => {
    const supabase = createClient()

    // セッションが確立されるまで待ってからリダイレクト
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace(next)
        return
      }

      // onAuthStateChange でセッション確立を検知
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
          subscription.unsubscribe()
          router.replace(next)
        } else if (event === 'SIGNED_OUT') {
          subscription.unsubscribe()
          router.replace('/login?error=auth_failed')
        }
      })

      // 5秒待っても変化がなければログインページへ
      setTimeout(() => {
        subscription.unsubscribe()
        router.replace('/login?error=auth_failed')
      }, 5000)
    }

    checkSession()
  }, [next, router])

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="idol-gradient rounded-2xl w-14 h-14 flex items-center justify-center mx-auto animate-pulse">
          <Star className="w-7 h-7 text-white" />
        </div>
        <p className="text-sm text-muted-foreground">ログイン処理中...</p>
      </div>
    </div>
  )
}
