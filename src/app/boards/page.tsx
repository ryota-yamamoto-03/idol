import Link from 'next/link'
import { MessageSquare, ChevronRight, Star, Users } from 'lucide-react'
import { dummyGroups, dummyMembers, dummyBoards } from '@/lib/dummy-data'

export default function BoardsPage() {
  const groupBoards = dummyGroups.map((group) => ({
    id: `group-${group.id}`,
    title: `${group.name} 掲示板`,
    subtitle: group.genre ?? '',
    postCount: Math.floor(Math.random() * 300) + 50,
    href: `/boards/group-${group.id}`,
    type: 'group' as const,
  }))

  const memberBoards = dummyMembers.slice(0, 4).map((member) => ({
    id: `member-${member.id}`,
    title: `${member.name} 掲示板`,
    subtitle: member.group?.name ?? '',
    postCount: Math.floor(Math.random() * 200) + 30,
    href: `/boards/member-${member.id}`,
    type: 'member' as const,
  }))

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">掲示板</h1>
      </div>

      {/* Group Boards */}
      <section>
        <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2.5">
          <Star className="w-4 h-4 text-primary" />
          グループ掲示板
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {groupBoards.map((board) => (
            <Link
              key={board.id}
              href={board.href}
              className="flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{board.title}</p>
                {board.subtitle && (
                  <p className="text-[10px] text-muted-foreground">{board.subtitle}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{board.postCount}件</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Member Boards */}
      <section>
        <h2 className="text-sm font-bold flex items-center gap-1.5 mb-2.5">
          <Users className="w-4 h-4 text-primary" />
          メンバー掲示板
        </h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {memberBoards.map((board) => (
            <Link
              key={board.id}
              href={board.href}
              className="flex items-center gap-3 px-3 py-3 hover:bg-muted/50 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-pink-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{board.title}</p>
                {board.subtitle && (
                  <p className="text-[10px] text-muted-foreground">{board.subtitle}</p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{board.postCount}件</p>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto mt-0.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
