'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Search, Bell, User, Menu, X, Star, LogOut, ChevronDown, Shield } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth-context'

const XIcon = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const ADMIN_X_USERNAME = 'dorusuke_japan'

const navLinks = [
  { href: '/', label: 'トップ' },
  { href: '/groups', label: 'グループ' },
  { href: '/members', label: 'メンバー' },
  { href: '/news', label: 'ニュース' },
  { href: '/boards', label: '掲示板' },
]

function isAdmin(user: import('@supabase/supabase-js').User | null): boolean {
  if (!user) return false
  const m = user.user_metadata
  const username = (m?.user_name ?? m?.preferred_username ?? m?.screen_name ?? '') as string
  return username.toLowerCase() === ADMIN_X_USERNAME.toLowerCase()
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, loading, signInWithX, signOut, avatarUrl, displayName } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-3">
        <div className="flex items-center h-12 gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0">
            <div className="idol-gradient rounded-lg p-1">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-fuchsia-600 to-violet-600 bg-clip-text text-transparent">
              アイドルSNS
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin(user) && (
              <Link
                href="/admin"
                className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                  pathname === '/admin'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-fuchsia-600 hover:bg-fuchsia-50'
                }`}
              >
                <Shield className="w-3 h-3" />
                管理画面
              </Link>
            )}
          </nav>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <Search className="w-4 h-4" />
            </Button>

            {!loading && (
              user ? (
                /* ── ログイン済み：ユーザーメニュー ── */
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-xs font-bold">
                          {displayName[0]}
                        </div>
                      )}
                    </div>
                    <span className="hidden md:block text-xs font-medium max-w-[80px] truncate">{displayName}</span>
                    <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                        <div className="px-3 py-2 border-b border-border">
                          <p className="text-xs font-bold truncate">{displayName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          ログアウト
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                /* ── 未ログイン：X でログインボタン ── */
                <button
                  onClick={() => signInWithX()}
                  className="hidden md:flex items-center gap-1.5 text-xs font-bold px-3 h-7 rounded-full bg-black text-white hover:bg-black/80 transition-colors"
                >
                  <XIcon />
                  Xでログイン
                </button>
              )
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8 md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <nav className="flex flex-col px-3 py-2 gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`text-sm px-3 py-2 rounded-md font-medium ${
                  pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin(user) && (
              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 text-sm px-3 py-2 rounded-md font-medium ${
                  pathname === '/admin'
                    ? 'bg-fuchsia-600 text-white'
                    : 'text-fuchsia-600 hover:bg-fuchsia-50'
                }`}
              >
                <Shield className="w-4 h-4" />
                管理画面
              </Link>
            )}
            <div className="border-t border-border mt-1 pt-2">
              {user ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-border">
                      {avatarUrl ? (
                        <Image src={avatarUrl} alt={displayName} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full idol-gradient flex items-center justify-center text-white text-xs font-bold">
                          {displayName[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold">{displayName}</p>
                      <p className="text-[10px] text-muted-foreground">ログイン中</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { signOut(); setMenuOpen(false) }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive rounded-md hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    ログアウト
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { signInWithX(); setMenuOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 h-9 rounded-lg bg-black text-white text-sm font-bold hover:bg-black/80 transition-colors"
                >
                  <XIcon />
                  Xでログイン
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
