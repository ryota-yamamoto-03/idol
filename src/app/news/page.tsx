'use client'

import { useState } from 'react'
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
  const [activeCategory, setActiveCategory] = useState('all')

  const filteredNews = activeCategory === 'all'
    ? dummyNews
    : dummyNews.filter((n) => n.category === activeCategory)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Newspaper className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">ニュース</h1>
        <span className="ml-auto text-xs text-muted-foreground">{filteredNews.length}件</span>
      </div>

      {/* Category Filter */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 text-[11px] px-3 py-1 rounded-full border font-medium transition-colors ${
              activeCategory === cat.key
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredNews.map((news, i) => (
            <div key={news.id} className={i === 0 ? 'sm:col-span-2' : ''}>
              <NewsCard news={news} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <Newspaper className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p className="text-sm">該当するニュースがありません</p>
        </div>
      )}
    </div>
  )
}
