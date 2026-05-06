import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, ChevronRight, MessageSquare, Cake } from 'lucide-react'
import { dummyMembers, dummyNews } from '@/lib/dummy-data'

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

function calcAge(birthday: string): number {
  const today = new Date()
  const birth = new Date(birthday)
  let age = today.getFullYear() - birth.getFullYear()
  if (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate())) age--
  return age
}

function formatBirthday(birthday: string): string {
  const d = new Date(birthday)
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default async function MemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = dummyMembers.find((m) => m.id === id)
  if (!member) notFound()

  const memberNews = dummyNews.filter((n) => n.member_id === member.id || n.group_id === member.group_id)

  return (
    <div className="space-y-4">
      {/* Profile Card - プロフィール帳風 */}
      <div
        className="bg-card border-2 rounded-3xl overflow-hidden"
        style={{ borderColor: member.color ?? '#e9d5ff' }}
      >
        {/* Header Gradient */}
        <div
          className="relative h-24"
          style={{
            background: member.color
              ? `linear-gradient(135deg, ${member.color}40, ${member.color}20)`
              : 'linear-gradient(135deg, #fdf4ff, #f3e8ff)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-30 pointer-events-none select-none">
            <div className="absolute top-2 right-4 text-3xl">✨</div>
            <div className="absolute bottom-2 left-6 text-2xl">⭐</div>
            <div className="absolute top-4 right-16 text-xl">🌸</div>
          </div>

          {/* Avatar */}
          <div className="absolute -bottom-8 left-4">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden border-4 bg-white"
              style={{ borderColor: member.color ?? '#e9d5ff' }}
            >
              {member.image_url ? (
                <Image src={member.image_url} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-2xl font-bold">
                  {member.name[0]}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-10 pb-4 px-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-black">{member.name}</h1>
              {member.group && (
                <Link href={`/groups/${member.group_id}`} className="text-xs text-primary hover:underline">
                  {member.group.name}
                </Link>
              )}
            </div>
            {member.color && (
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: member.color }} />
                <span className="text-[10px] text-muted-foreground">イメカラ</span>
              </div>
            )}
          </div>

          {/* Profile Details - プロフィール帳スタイル */}
          <div className="mt-3 space-y-1.5">
            {member.birthday && (
              <div className="flex items-center gap-2 text-xs">
                <Cake className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0">誕生日</span>
                <span className="font-medium">
                  {formatBirthday(member.birthday)}（{calcAge(member.birthday)}歳）
                </span>
              </div>
            )}
            {member.birthplace && (
              <div className="flex items-center gap-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0">出身</span>
                <span className="font-medium">{member.birthplace}</span>
              </div>
            )}
            {member.joined_at && (
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-muted-foreground w-14 shrink-0">加入日</span>
                <span className="font-medium">{member.joined_at}</span>
              </div>
            )}
          </div>

          {member.profile && (
            <div
              className="mt-3 p-3 rounded-xl text-xs leading-relaxed"
              style={{ backgroundColor: member.color ? `${member.color}15` : '#fdf4ff' }}
            >
              <p className="font-medium text-muted-foreground mb-1">プロフィール</p>
              <p>{member.profile}</p>
            </div>
          )}

          {/* SNS */}
          <div className="flex gap-2 mt-3">
            {member.official_x_url && (
              <a href={member.official_x_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 border border-border rounded-lg">
                <XIcon /> X
              </a>
            )}
            {member.official_instagram_url && (
              <a href={member.official_instagram_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2.5 py-1.5 border border-border rounded-lg">
                <InstagramIcon /> Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Member Board Link */}
      <Link
        href={`/boards/member-${member.id}`}
        className="flex items-center justify-between p-3 bg-card border border-border rounded-xl hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary" />
          <div>
            <p className="text-sm font-bold">{member.name} 掲示板</p>
            <p className="text-xs text-muted-foreground">ファン同士で語り合おう</p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </Link>

      {/* Related News */}
      {memberNews.length > 0 && (
        <section>
          <h2 className="text-sm font-bold mb-2.5">関連ニュース</h2>
          <div className="space-y-2">
            {memberNews.slice(0, 3).map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.id}`}
                className="flex gap-2.5 p-2.5 bg-card border border-border rounded-xl card-hover"
              >
                {news.thumbnail_url && (
                  <div className="relative w-14 h-11 rounded-lg overflow-hidden shrink-0">
                    <Image src={news.thumbnail_url} alt={news.title} fill className="object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold line-clamp-2">{news.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {new Date(news.created_at).toLocaleDateString('ja-JP')}
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
