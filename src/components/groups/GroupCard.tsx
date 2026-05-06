import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Users, MapPin } from 'lucide-react'
import type { IdolGroup } from '@/types'

interface Props {
  group: IdolGroup
}

export default function GroupCard({ group }: Props) {
  return (
    <Link href={`/groups/${group.id}`} className="block card-hover rounded-xl overflow-hidden bg-card border border-border">
      <div className="relative w-full aspect-square">
        {group.image_url ? (
          <Image src={group.image_url} alt={group.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full idol-gradient flex items-center justify-center">
            <span className="text-white text-3xl font-bold">{group.name[0]}</span>
          </div>
        )}
        {group.genre && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
              {group.genre}
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <h3 className="text-sm font-bold line-clamp-1">{group.name}</h3>
        <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
          {group.area && (
            <span className="flex items-center gap-0.5">
              <MapPin className="w-3 h-3" />
              {group.area}
            </span>
          )}
          {group.member_count && (
            <span className="flex items-center gap-0.5">
              <Users className="w-3 h-3" />
              {group.member_count}人
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
