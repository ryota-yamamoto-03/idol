import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import { AuthProvider } from '@/lib/auth-context'

export const metadata: Metadata = {
  title: 'アイドルSNS - 地下アイドル情報コミュニティ',
  description: '地下アイドル・ライブアイドル・メンズアイドルの情報を集約したSNS型コミュニティ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <Header />
          <main className="max-w-5xl mx-auto px-3 py-4 pb-20 md:pb-6 min-h-screen">
            {children}
          </main>
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  )
}
