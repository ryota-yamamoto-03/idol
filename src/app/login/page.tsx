'use client'

import Link from 'next/link'
import { Star } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const XIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function LoginPage() {
  const { signInWithX } = useAuth()

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="idol-gradient rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-3">
            <Star className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black">アイドルSNS</h1>
          <p className="text-xs text-muted-foreground mt-1">ログインしてコミュニティに参加しよう</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            X（Twitter）アカウントでログイン
          </p>

          <button
            onClick={signInWithX}
            className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl bg-black text-white font-bold text-sm hover:bg-black/80 transition-colors"
          >
            <XIcon />
            X（Twitter）でログイン
          </button>

          <p className="text-center text-[10px] text-muted-foreground">
            ログインすることで{' '}
            <Link href="/terms" className="underline hover:no-underline">利用規約</Link>
            {' '}に同意したものとみなします
          </p>
        </div>
      </div>
    </div>
  )
}
