'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, TrendingUp, Star, Newspaper, MessageSquare, Users, Zap } from 'lucide-react'
import { dummyGroups, dummyNews, dummyMembers } from '@/lib/dummy-data'
import NewsCard from '@/components/news/NewsCard'
import GroupCard from '@/components/groups/GroupCard'
import { useAuth } from '@/lib/auth-context'

export default function HomePage() {
  const { user } = useAuth()
  const latestNews = dummyNews.slice(0, 5)
  const featuredGroups = dummyGroups.slice(0, 6)
  const recentMembers = dummyMembers.slice(0, 4)

  return (
    <div className="space-y-5">
      {/* Hero Banner */}
      <div className="idol-gradient rounded-2xl p-5 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
          <div className="absolute top-2 right-4 text-6xl">⭐</div>
          <div className="absolute bottom-2 left-8 text-4xl">🎤</div>
          <div className="absolute top-8 right-16 text-3xl">✨</div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wide opacity-90">Underground Idol Community</span>
          </div>
          <h1 className="text-xl font-black leading-tight">
            地下アイドルの<br />すべてがここに。
          </h1>
          <p className="text-xs opacity-85 mt-1.5 leading-relaxed">
            グループ情報・ニュース・掲示板が一体化した<br />地下アイドル特化コミュニティ
          </p>
          <div className="flex gap-2 mt-3">
            <Link href="/groups" className="bg-white text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full hover:bg-purple-50 transition-colors">
              グループを見る
            </Link>
            {!user && (
              <Link href="/register" className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors border border-white/30">
                無料登録
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: Star, label: 'グループ', value: '150+' },
          { icon: Users, label: 'メンバー', value: '800+' },
          { icon: MessageSquare, label: '投稿数', value: '5万+' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-2.5 text-center">
              <Icon className="w-4 h-4 text-primary mx-auto mb-0.5" />
              <div className="text-base font-black text-primary">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Latest News */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Newspaper className="w-4 h-4 text-primary" />
            最新ニュース
          </h2>
          <Link href="/news" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
            もっと見る <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        {latestNews[0] && (
          <div className="mb-2">
            <NewsCard news={latestNews[0]} />
          </div>
        )}
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {latestNews.slice(1, 5).map((news) => (
            <NewsCard key={news.id} news={news} variant="compact" />
          ))}
        </div>
      </section>

      {/* Popular Groups */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Star className="w-4 h-4 text-primary" />
            グループ一覧
          </h2>
          <Link href="/groups" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
            もっと見る <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {featuredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      </section>

      {/* Members */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-primary" />
            注目メンバー
          </h2>
          <Link href="/members" className="text-xs text-primary flex items-center gap-0.5 hover:underline">
            もっと見る <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {recentMembers.map((member) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className="flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl card-hover"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-border">
                {member.image_url ? (
                  <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-sm font-bold">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold line-clamp-1">{member.name}</p>
                <p className="text-[10px] text-muted-foreground line-clamp-1">{member.group?.name}</p>
                {member.color && (
                  <div className="w-4 h-1 rounded-full mt-0.5" style={{ backgroundColor: member.color }} />
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Board Quick Links */}
      <section>
        <h2 className="text-sm font-bold mb-2.5 flex items-center gap-1.5">
          <MessageSquare className="w-4 h-4 text-primary" />
          人気掲示板
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {[
            { label: 'STARLET☆RIOT 掲示板', count: 234, href: '/boards/1' },
            { label: 'ゆめかわ☆パレード 掲示板', count: 189, href: '/boards/2' },
            { label: '桜井ひなた 掲示板', count: 156, href: '/boards/3' },
            { label: '月島りの 掲示板', count: 143, href: '/boards/4' },
          ].map((board) => (
            <Link
              key={board.href}
              href={board.href}
              className="flex items-center justify-between px-3 py-2.5 hover:bg-muted/50 transition-colors"
            >
              <span className="text-xs font-medium">{board.label}</span>
              <span className="text-[10px] text-muted-foreground">{board.count}件</span>
            </Link>
          ))}
          <Link href="/boards" className="flex items-center justify-center px-3 py-2 text-xs text-primary hover:bg-muted/50 transition-colors">
            すべての掲示板 <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-muted-foreground justify-center pt-2 pb-4">
        <Link href="/terms" className="hover:text-primary">利用規約</Link>
        <Link href="/terms#privacy" className="hover:text-primary">プライバシーポリシー</Link>
        <Link href="/admin" className="hover:text-primary">管理画面</Link>
      </div>
    </div>
  )
}
