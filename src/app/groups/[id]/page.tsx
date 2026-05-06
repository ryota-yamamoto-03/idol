import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, Calendar, Building, ExternalLink, Users, MessageSquare, Newspaper, ChevronRight } from 'lucide-react'
import { dummyGroups, dummyMembers, dummyNews } from '@/lib/dummy-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const XIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const TikTokIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.26 8.26 0 004.84 1.55V6.78a4.85 4.85 0 01-1.07-.09z" />
  </svg>
)

export default async function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const group = dummyGroups.find((g) => g.id === id)
  if (!group) notFound()

  const members = dummyMembers.filter((m) => m.group_id === group.id && !m.graduated_at)
  const graduatedMembers = dummyMembers.filter((m) => m.group_id === group.id && m.graduated_at)
  const groupNews = dummyNews.filter((n) => n.group_id === group.id)

  return (
    <div className="space-y-4">
      {/* Group Header */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="relative w-full aspect-[16/7]">
          {group.image_url ? (
            <Image src={group.image_url} alt={group.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full idol-gradient" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <h1 className="text-white text-xl font-black drop-shadow">{group.name}</h1>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {group.genre && (
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {group.genre}
                </span>
              )}
              {group.area && (
                <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-sm flex items-center gap-0.5">
                  <MapPin className="w-2.5 h-2.5" /> {group.area}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 space-y-3">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {group.agency && (
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" /> {group.agency}
              </span>
            )}
            {group.formed_year && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {group.formed_year}年結成
              </span>
            )}
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {members.length}名
            </span>
          </div>

          {group.description && (
            <p className="text-xs text-foreground leading-relaxed">{group.description}</p>
          )}

          {/* SNS Links */}
          <div className="flex gap-2">
            {group.official_x_url && (
              <a href={group.official_x_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded-lg">
                <XIcon /> X
              </a>
            )}
            {group.official_instagram_url && (
              <a href={group.official_instagram_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded-lg">
                <InstagramIcon /> Instagram
              </a>
            )}
            {group.official_tiktok_url && (
              <a href={group.official_tiktok_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded-lg">
                <TikTokIcon /> TikTok
              </a>
            )}
            {group.official_website_url && (
              <a href={group.official_website_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded-lg">
                <ExternalLink className="w-3 h-3" /> 公式サイト
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members">
        <TabsList className="w-full">
          <TabsTrigger value="members" className="flex-1 text-xs">
            <Users className="w-3 h-3 mr-1" />メンバー
          </TabsTrigger>
          <TabsTrigger value="news" className="flex-1 text-xs">
            <Newspaper className="w-3 h-3 mr-1" />ニュース
          </TabsTrigger>
          <TabsTrigger value="board" className="flex-1 text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />掲示板
          </TabsTrigger>
        </TabsList>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-3">
          <div className="grid grid-cols-2 gap-2">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.id}`}
                className="flex items-center gap-2.5 p-2.5 bg-card border border-border rounded-xl card-hover"
              >
                <div
                  className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border-2"
                  style={{ borderColor: member.color ?? '#e9d5ff' }}
                >
                  {member.image_url ? (
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full idol-gradient flex items-center justify-center text-white font-bold">
                      {member.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold line-clamp-1">{member.name}</p>
                  {member.color && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: member.color }} />
                      <span className="text-[10px] text-muted-foreground">イメージカラー</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {graduatedMembers.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-bold text-muted-foreground mb-2">OGメンバー</h3>
              <div className="space-y-1">
                {graduatedMembers.map((m) => (
                  <div key={m.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-muted-foreground">
                    <span className="text-xs">{m.name}</span>
                    <span className="text-[10px] ml-auto">{m.graduated_at} 卒業</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="mt-3">
          {groupNews.length > 0 ? (
            <div className="space-y-2">
              {groupNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/news/${news.id}`}
                  className="flex gap-2.5 p-2.5 bg-card border border-border rounded-xl card-hover"
                >
                  {news.thumbnail_url && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold line-clamp-2">{news.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(news.created_at).toLocaleDateString('ja-JP')}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-8">ニュースはまだありません</p>
          )}
        </TabsContent>

        {/* Board Tab */}
        <TabsContent value="board" className="mt-3">
          <Link
            href={`/boards/group-${group.id}`}
            className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
          >
            <div>
              <p className="text-sm font-bold">{group.name} 掲示板</p>
              <p className="text-xs text-muted-foreground">グループについて自由に話し合おう</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        </TabsContent>
      </Tabs>
    </div>
  )
}
