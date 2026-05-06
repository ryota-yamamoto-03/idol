import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import type { News } from '@/types'

const categoryLabels: Record<string, { label: string; color: string }> = {
  live:    { label: 'ライブ',  color: 'bg-pink-100 text-pink-700' },
  release: { label: 'リリース', color: 'bg-purple-100 text-purple-700' },
  member:  { label: 'メンバー', color: 'bg-violet-100 text-violet-700' },
  event:   { label: 'イベント', color: 'bg-fuchsia-100 text-fuchsia-700' },
  media:   { label: 'メディア', color: 'bg-indigo-100 text-indigo-700' },
  other:   { label: 'その他',  color: 'bg-gray-100 text-gray-600' },
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

interface Props {
  news: News
  variant?: 'default' | 'compact'
}

export default function NewsCard({ news, variant = 'default' }: Props) {
  const cat = categoryLabels[news.category] ?? categoryLabels.other

  if (variant === 'compact') {
    return (
      <Link href={`/news/${news.id}`} className="flex gap-2 p-2 hover:bg-muted/50 rounded-lg transition-colors">
        {news.thumbnail_url && (
          <div className="relative w-14 h-10 rounded overflow-hidden shrink-0">
            <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${cat.color}`}>{cat.label}</span>
          <p className="text-xs font-medium line-clamp-2 mt-0.5">{news.title}</p>
          <p className="text-[10px] text-muted-foreground">{formatDate(news.created_at)}</p>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/news/${news.id}`} className="block card-hover rounded-xl overflow-hidden bg-card border border-border">
      {news.thumbnail_url && (
        <div className="relative w-full aspect-[16/9]">
          <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{cat.label}</span>
          {news.group && (
            <span className="text-[10px] text-muted-foreground">{news.group.name}</span>
          )}
          <span className="text-[10px] text-muted-foreground ml-auto">{formatDate(news.created_at)}</span>
        </div>
        <h3 className="text-sm font-bold line-clamp-2">{news.title}</h3>
      </div>
    </Link>
  )
}
