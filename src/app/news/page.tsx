import { dummyNews } from '@/lib/dummy-data'
import NewsCard from '@/components/news/NewsCard'
import { Newspaper } from 'lucide-react'

const categories = [
  { key: 'all', label: 'すべて' },
  { key: 'live', label: 'ライブ' },
  { key: 'release', label: 'リリース' },
  { key: 'member', label: 'メンバー' },
  { key: 'event', label: 'イベント' },
  { key: 'media', label: 'メディア' },
  { key: 'other', label: 'その他' },
]

export default function NewsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">ニュース</h1>
        <span className="ml-auto text-xs text-muted-foreground">{dummyNews.length}件</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key}
            className={`shrink-0 text-[11px] px-3 py-1 rounded-full border font-medium transition-colors ${
              cat.key === 'all'
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {dummyNews.map((news, i) => (
          <div key={news.id} className={i === 0 ? 'sm:col-span-2' : ''}>
            <NewsCard news={news} />
          </div>
        ))}
      </div>
    </div>
  )
}
