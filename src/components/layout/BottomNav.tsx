'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Users, Newspaper, MessageSquare, Star } from 'lucide-react'

const tabs = [
  { href: '/', label: 'トップ', icon: Home },
  { href: '/groups', label: 'グループ', icon: Star },
  { href: '/news', label: 'ニュース', icon: Newspaper },
  { href: '/boards', label: '掲示板', icon: MessageSquare },
  { href: '/members', label: 'メンバー', icon: Users },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'fill-primary/20' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
