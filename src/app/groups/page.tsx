import { dummyGroups } from '@/lib/dummy-data'
import GroupCard from '@/components/groups/GroupCard'
import { Star, SlidersHorizontal } from 'lucide-react'

const areas = ['すべて', '東京', '大阪', '名古屋', '福岡', '札幌']
const genres = ['すべて', '王道アイドル', 'パフォーマンス系', 'ロック系', 'ゆめかわ系', '電波系', 'アングラ系']

export default function GroupsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">グループ一覧</h1>
        <span className="ml-auto text-xs text-muted-foreground">{dummyGroups.length}グループ</span>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          絞り込み
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">エリア</p>
          <div className="flex flex-wrap gap-1">
            {areas.map((area) => (
              <button
                key={area}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                  area === 'すべて'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground mb-1">ジャンル</p>
          <div className="flex flex-wrap gap-1">
            {genres.map((genre) => (
              <button
                key={genre}
                className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                  genre === 'すべて'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {dummyGroups.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>
    </div>
  )
}
