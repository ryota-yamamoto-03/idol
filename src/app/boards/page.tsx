'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MessageSquare, ChevronRight, Star, Users, Plus, X, Lock, Trash2 } from 'lucide-react'
import { dummyGroups, dummyMembers } from '@/lib/dummy-data'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCustomBoards, saveCustomBoard, deleteCustomBoard, type CustomBoard } from '@/lib/custom-boards'

// ── ダミーボード ────────────────────────────────────────────
const dummyGroupBoards = dummyGroups.map((group) => ({
  id: `group-${group.id}`,
  title: `${group.name} 掲示板`,
  subtitle: group.genre ?? '',
  postCount: Math.floor(Math.random() * 300) + 50,
  href: `/boards/group-${group.id}`,
  type: 'group' as const,
  createdBy: null as string | null,
}))

const dummyMemberBoards = dummyMembers.slice(0, 4).map((member) => ({
  id: `member-${member.id}`,
  title: `${member.name} 掲示板`,
  subtitle: member.group?.name ?? '',
  postCount: Math.floor(Math.random() * 200) + 30,
  href: `/boards/member-${member.id}`,
  type: 'member' as const,
  createdBy: null as string | null,
}))

// ── 新規掲示板作成モーダル ───────────────────────────────────
function NewBoardModal({
  type,
  onClose,
  onCreate,
}: {
  type: 'group' | 'member'
  onClose: () => void
  onCreate: (board: CustomBoard) => void
}) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const { user } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !user) return
    const board: CustomBoard = {
      id: `${type}-custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      type,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
    }
    saveCustomBoard(board)
    onCreate(board)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black">
            {type === 'group' ? 'グループ' : 'メンバー'}掲示板を作成
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">掲示板名 <span className="text-destructive">*</span></Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'group' ? '例: ○○ 掲示板' : '例: △△ ファン掲示板'}
              className="h-9 text-sm"
              maxLength={50}
              autoFocus
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">説明・サブタイトル（任意）</Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={type === 'group' ? 'ジャンル・説明など' : '所属グループなど'}
              className="h-9 text-sm"
              maxLength={50}
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="outline" size="sm" className="h-8 text-xs" onClick={onClose}>
              キャンセル
            </Button>
            <Button type="submit" size="sm" className="h-8 text-xs idol-gradient text-white border-0" disabled={!title.trim()}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              作成する
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── ボードリスト行 ──────────────────────────────────────────
function BoardRow({
  id, title, subtitle, postCount, href, type, createdBy, currentUserId, onDelete,
}: {
  id: string; title: string; subtitle: string; postCount: number; href: string
  type: 'group' | 'member'; createdBy: string | null; currentUserId?: string
  onDelete?: (id: string) => void
}) {
  const isOwner = createdBy && currentUserId && createdBy === currentUserId

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (confirm(`「${title}」を削除しますか？`)) {
      deleteCustomBoard(id)
      onDelete?.(id)
    }
  }

  return (
    <div className="flex items-center hover:bg-muted/50 transition-colors group">
      <Link href={href} className="flex items-center gap-3 px-3 py-3 flex-1 min-w-0">
        <MessageSquare className={`w-4 h-4 shrink-0 ${type === 'member' ? 'text-pink-400' : 'text-primary'}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-1">{title}</p>
          {subtitle && <p className="text-[10px] text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">{postCount}件</p>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto mt-0.5" />
        </div>
      </Link>
      {isOwner && (
        <button
          onClick={handleDelete}
          className="px-3 py-3 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
          title="掲示板を削除"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  )
}

// ── メインページ ────────────────────────────────────────────
export default function BoardsPage() {
  const { user } = useAuth()
  const [customBoards, setCustomBoards] = useState<CustomBoard[]>([])
  const [modal, setModal] = useState<'group' | 'member' | null>(null)

  // localStorageから読み込み
  useEffect(() => {
    setCustomBoards(getCustomBoards())
  }, [])

  const handleCreate = (board: CustomBoard) => {
    setCustomBoards((prev) => [...prev, board])
  }

  const handleDelete = (id: string) => {
    setCustomBoards((prev) => prev.filter((b) => b.id !== id))
  }

  const customGroupBoards = customBoards.filter((b) => b.type === 'group')
  const customMemberBoards = customBoards.filter((b) => b.type === 'member')

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-primary" />
        <h1 className="text-lg font-black">掲示板</h1>
      </div>

      {/* Group Boards */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Star className="w-4 h-4 text-primary" />
            グループ掲示板
          </h2>
          {user ? (
            <button
              onClick={() => setModal('group')}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              新規作成
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              ログインで掲示板作成可能
            </span>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {dummyGroupBoards.map((b) => (
            <BoardRow key={b.id} {...b} currentUserId={user?.id} />
          ))}
          {customGroupBoards.map((b) => (
            <BoardRow
              key={b.id}
              id={b.id}
              title={b.title}
              subtitle={b.subtitle}
              postCount={0}
              href={`/boards/${b.id}`}
              type={b.type}
              createdBy={b.createdBy}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {/* Member Boards */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-bold flex items-center gap-1.5">
            <Users className="w-4 h-4 text-primary" />
            メンバー掲示板
          </h2>
          {user ? (
            <button
              onClick={() => setModal('member')}
              className="flex items-center gap-1 text-xs text-primary hover:underline font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              新規作成
            </button>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              ログインで掲示板作成可能
            </span>
          )}
        </div>
        <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
          {dummyMemberBoards.map((b) => (
            <BoardRow key={b.id} {...b} currentUserId={user?.id} />
          ))}
          {customMemberBoards.map((b) => (
            <BoardRow
              key={b.id}
              id={b.id}
              title={b.title}
              subtitle={b.subtitle}
              postCount={0}
              href={`/boards/${b.id}`}
              type={b.type}
              createdBy={b.createdBy}
              currentUserId={user?.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </section>

      {modal && (
        <NewBoardModal
          type={modal}
          onClose={() => setModal(null)}
          onCreate={handleCreate}
        />
      )}
    </div>
  )
}
