import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { dummyMembers, dummyGroups } from '@/lib/dummy-data'

export default function MembersPage() {
  const groupedMembers = dummyGroups.map((group) => ({
    group,
    members: dummyMembers.filter((m) => m.group_id === group.id && !m.graduated_at),
  })).filter((g) => g.members.length > 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">メンバー一覧</h1>
        <span className="ml-auto text-xs text-muted-foreground">{dummyMembers.filter(m => !m.graduated_at).length}名</span>
      </div>

      {groupedMembers.map(({ group, members }) => (
        <section key={group.id}>
          <Link href={`/groups/${group.id}`} className="flex items-center gap-2 mb-2.5 hover:opacity-80 transition-opacity">
            <h2 className="text-sm font-bold text-primary">{group.name}</h2>
            <span className="text-[10px] text-muted-foreground">{members.length}名</span>
          </Link>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {members.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.id}`}
                className="flex flex-col items-center gap-1.5 p-2.5 bg-card border border-border rounded-xl card-hover text-center"
              >
                <div
                  className="relative w-14 h-14 rounded-full overflow-hidden border-2"
                  style={{ borderColor: member.color ?? '#e9d5ff' }}
                >
                  {member.image_url ? (
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-lg font-bold">
                      {member.name[0]}
                    </div>
                  )}
                </div>
                <p className="text-xs font-bold line-clamp-2 leading-tight">{member.name}</p>
                {member.color && (
                  <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: member.color }} />
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
