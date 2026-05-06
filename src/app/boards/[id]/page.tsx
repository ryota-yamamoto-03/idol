'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useRef, useCallback } from 'react'
import { MessageSquare, Heart, Flag, ChevronLeft, Send, Reply, ImagePlus, X as XIcon, Lock } from 'lucide-react'
import { dummyBoardPosts } from '@/lib/dummy-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth-context'
import type { BoardPost } from '@/types'

const XBrandIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

function timeAgo(dateStr: string): string {
  const now = new Date()
  const d = new Date(dateStr)
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return `${diff}秒前`
  if (diff < 3600) return `${Math.floor(diff / 60)}分前`
  if (diff < 86400) return `${Math.floor(diff / 3600)}時間前`
  return `${Math.floor(diff / 86400)}日前`
}

function ReportButton({ postId }: { postId: string }) {
  const [reported, setReported] = useState(false)
  return (
    <button
      onClick={() => setReported(true)}
      className={`flex items-center gap-0.5 text-[10px] transition-colors ${reported ? 'text-orange-400' : 'text-muted-foreground hover:text-orange-400'}`}
      title="通報"
    >
      <Flag className="w-3 h-3" />
      {reported ? '通報済' : '通報'}
    </button>
  )
}

// ── 画像プレビュー付きアップロードフォーム ──────────────────
interface ImageUploadProps {
  images: string[]        // dataURL[]
  onAdd: (dataUrl: string) => void
  onRemove: (idx: number) => void
  maxImages?: number
}

function ImageUpload({ images, onAdd, onRemove, maxImages = 4 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return
    const remaining = maxImages - images.length
    Array.from(files).slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      if (file.size > 10 * 1024 * 1024) { alert('10MB以下の画像を選択してください'); return }
      const reader = new FileReader()
      reader.onload = (e) => { if (e.target?.result) onAdd(e.target.result as string) }
      reader.readAsDataURL(file)
    })
  }, [images.length, maxImages, onAdd])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  return (
    <div className="space-y-2">
      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border group">
              <Image src={src} alt={`添付画像${i + 1}`} fill className="object-cover" />
              <button
                onClick={() => onRemove(i)}
                className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <XIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Drop Zone / Button */}
      {images.length < maxImages && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary border border-dashed border-border hover:border-primary rounded-lg px-3 py-2 transition-colors w-full justify-center"
        >
          <ImagePlus className="w-4 h-4" />
          写真を追加（{images.length}/{maxImages}）· JPG/PNG/GIF · 最大10MB
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

// ── 投稿アイテム ─────────────────────────────────────────────
function PostItem({ post, isReply = false }: { post: BoardPost & { localImages?: string[] }; isReply?: boolean }) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replyImages, setReplyImages] = useState<string[]>([])

  const handleLike = () => {
    setLikeCount((c) => (liked ? c - 1 : c + 1))
    setLiked(!liked)
  }

  return (
    <div className={`${isReply ? 'ml-6 border-l-2 border-primary/30 pl-3' : ''}`}>
      <div className="flex gap-2.5 py-3">
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-border">
          {post.user?.avatar_url ? (
            <Image src={post.user.avatar_url} alt={post.user.name} fill className="object-cover" />
          ) : (
            <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-xs font-bold">
              {post.user?.name[0] ?? '?'}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* User & Time */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-bold">{post.user?.name ?? '名無しさん'}</span>
            <span className="text-[10px] text-muted-foreground">{timeAgo(post.created_at)}</span>
          </div>

          {/* Body */}
          <p className="text-sm leading-relaxed text-foreground">{post.body}</p>

          {/* Attached images (from dummy or local upload) */}
          {post.image_url && (
            <div className="mt-2">
              <div className="relative w-40 h-32 rounded-xl overflow-hidden border border-border">
                <Image src={post.image_url} alt="添付画像" fill className="object-cover" />
              </div>
            </div>
          )}
          {post.localImages && post.localImages.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {post.localImages.map((src, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-border">
                  <Image src={src} alt={`添付${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 mt-1.5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-pink-500' : 'text-muted-foreground hover:text-pink-500'}`}
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-pink-500' : ''}`} />
              {likeCount}
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <Reply className="w-3.5 h-3.5" />
                返信
              </button>
            )}
            <ReportButton postId={post.id} />
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-2 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="返信を入力..."
                className="text-xs min-h-[60px] resize-none"
              />
              <ImageUpload
                images={replyImages}
                onAdd={(url) => setReplyImages((p) => [...p, url])}
                onRemove={(i) => setReplyImages((p) => p.filter((_, idx) => idx !== i))}
                maxImages={2}
              />
              <div className="flex justify-end">
                <Button size="sm" className="h-8 text-xs idol-gradient text-white border-0">
                  <Send className="w-3.5 h-3.5 mr-1" />
                  返信する
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {post.replies && post.replies.length > 0 && (
        <div className="divide-y divide-border/50">
          {post.replies.map((reply) => (
            <PostItem key={reply.id} post={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )
}

export default function BoardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: boardId } = React.use(params)
  const { user, loading, signInWithX, avatarUrl: userAvatarUrl, displayName: userDisplayName } = useAuth()
  const [newPost, setNewPost] = useState('')
  const [postImages, setPostImages] = useState<string[]>([])
  const [posts, setPosts] = useState(dummyBoardPosts)
  const isGroupBoard = boardId.startsWith('group-')
  const isMemberBoard = boardId.startsWith('member-')
  const title = isGroupBoard
    ? 'STARLET☆RIOT 掲示板'
    : isMemberBoard
    ? '桜井ひなた 掲示板'
    : '掲示板'

  const handleSubmit = () => {
    if (!user) return
    if (!newPost.trim() && postImages.length === 0) return
    const newEntry: BoardPost & { localImages?: string[] } = {
      id: `local-${Date.now()}`,
      board_id: boardId,
      user_id: user.id,
      body: newPost,
      image_url: null,
      localImages: postImages,
      like_count: 0,
      parent_post_id: null,
      created_at: new Date().toISOString(),
      user: { id: user.id, name: userDisplayName, email: user.email ?? '', avatar_url: userAvatarUrl ?? null, bio: null, role: 'user', created_at: '' },
      replies: [],
    }
    setPosts((prev) => [newEntry as BoardPost, ...prev])
    setNewPost('')
    setPostImages([])
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/boards" className="text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <MessageSquare className="w-5 h-5 text-primary" />
        <h1 className="text-base font-black line-clamp-1">{title}</h1>
      </div>

      {/* Rules Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
        <p className="font-bold mb-0.5">📋 掲示板ルール</p>
        <p>誹謗中傷・個人情報の投稿は禁止です。違反投稿は通報してください。</p>
        <Link href="/terms" className="underline hover:no-underline mt-0.5 inline-block">利用規約を確認する</Link>
      </div>

      {/* Post Form — ログイン状態で切り替え */}
      {!loading && (
        user ? (
          /* ── ログイン済み：投稿フォーム ── */
          <div className="bg-card border border-border rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border shrink-0">
                {userAvatarUrl ? (
                  <Image src={userAvatarUrl} alt="avatar" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-xs font-bold">
                    {userDisplayName[0]}
                  </div>
                )}
              </div>
              <p className="text-xs font-bold">新規投稿</p>
            </div>
            <Textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="投稿内容を入力してください"
              className="text-sm min-h-[80px] resize-none"
              maxLength={500}
            />
            <ImageUpload
              images={postImages}
              onAdd={(url) => setPostImages((p) => [...p, url])}
              onRemove={(i) => setPostImages((p) => p.filter((_, idx) => idx !== i))}
              maxImages={4}
            />
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">{newPost.length} / 500文字</p>
              <Button
                onClick={handleSubmit}
                size="sm"
                className="h-8 text-xs idol-gradient text-white border-0"
                disabled={!newPost.trim() && postImages.length === 0}
              >
                <Send className="w-3.5 h-3.5 mr-1" />
                投稿する
              </Button>
            </div>
          </div>
        ) : (
          /* ── 未ログイン：X ログイン促進バナー ── */
          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-5 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-bold">書き込みには X アカウントが必要です</p>
              <p className="text-xs text-muted-foreground mt-0.5">ログインすると投稿・いいね・返信ができます</p>
            </div>
            <button
              onClick={signInWithX}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-black/80 transition-colors mx-auto"
            >
              <XBrandIcon />
              X（Twitter）でログイン
            </button>
            <p className="text-[10px] text-muted-foreground">
              ログインすることで
              <Link href="/terms" className="underline hover:no-underline mx-0.5">利用規約</Link>
              に同意したものとみなします
            </p>
          </div>
        )
      )}

      {/* Posts */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-3 py-2 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">{posts.length}件の投稿</span>
          <select className="text-xs text-muted-foreground border-0 bg-transparent outline-none">
            <option>新しい順</option>
            <option>古い順</option>
            <option>いいね順</option>
          </select>
        </div>
        <div className="divide-y divide-border px-3">
          {posts.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  )
}
