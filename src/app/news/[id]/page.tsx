import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink, ChevronLeft, Tag, Calendar } from 'lucide-react'
import { dummyNews } from '@/lib/dummy-data'

const categoryLabels: Record<string, { label: string; color: string }> = {
  live:    { label: 'ライブ',  color: 'bg-pink-100 text-pink-700' },
  release: { label: 'リリース', color: 'bg-purple-100 text-purple-700' },
  member:  { label: 'メンバー', color: 'bg-violet-100 text-violet-700' },
  event:   { label: 'イベント', color: 'bg-fuchsia-100 text-fuchsia-700' },
  media:   { label: 'メディア', color: 'bg-indigo-100 text-indigo-700' },
  other:   { label: 'その他',  color: 'bg-gray-100 text-gray-600' },
}

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const news = dummyNews.find((n) => n.id === id)
  if (!news) notFound()

  const cat = categoryLabels[news.category] ?? categoryLabels.other
  const related = dummyNews.filter((n) => n.id !== news.id && (n.group_id === news.group_id || n.category === news.category)).slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Back */}
      <Link href="/news" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> ニュース一覧に戻る
      </Link>

      {/* Article */}
      <article className="bg-card border border-border rounded-2xl overflow-hidden">
        {news.thumbnail_url && (
          <div className="relative w-full aspect-[16/9]">
            <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className={`px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
              {cat.label}
            </span>
            {news.group && (
              <Link href={`/groups/${news.group_id}`} className="hover:text-primary transition-colors">
                {news.group.name}
              </Link>
            )}
            <span className="flex items-center gap-0.5 ml-auto">
              <Calendar className="w-3 h-3" />
              {new Date(news.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <h1 className="text-lg font-black leading-tight">{news.title}</h1>

          <div className="prose prose-sm max-w-none">
            {news.body.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground mb-3 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>

          {news.source_url && (
            <a
              href={news.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors border border-border rounded-lg px-3 py-2 w-fit"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              出典・詳細はこちら
            </a>
          )}
        </div>
      </article>

      {/* Related News */}
      {related.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-2.5">関連ニュース</h2>
          <div className="space-y-2">
            {related.map((n) => (
              <Link
                key={n.id}
                href={`/news/${n.id}`}
                className="flex gap-2.5 p-2.5 bg-card border border-border rounded-xl card-hover"
              >
                {n.thumbnail_url && (
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0">
                    <Image src={n.thumbnail_url} alt={n.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold line-clamp-2">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(n.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
