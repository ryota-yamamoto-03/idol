'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    setLoading(true)
    // TODO: Supabase auth
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="idol-gradient rounded-2xl w-14 h-14 flex items-center justify-center mx-auto mb-3">
            <Star className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-xl font-black">新規登録</h1>
          <p className="text-xs text-muted-foreground mt-1">アカウントを作成してコミュニティに参加しよう</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs">ニックネーム</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: ひなた推し🌸"
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">パスワード（8文字以上）</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-9 text-sm"
              />
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-primary"
              />
              <span className="text-xs text-muted-foreground">
                <Link href="/terms" className="text-primary underline hover:no-underline">利用規約</Link>
                および
                <Link href="/terms#privacy" className="text-primary underline hover:no-underline">プライバシーポリシー</Link>
                に同意します
              </span>
            </label>

            <Button
              type="submit"
              className="w-full h-9 idol-gradient text-white border-0 font-bold"
              disabled={loading || !agreed}
            >
              {loading ? '登録中...' : '無料で登録する'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            すでにアカウントをお持ちの方は{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
