'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Star, Users, Newspaper, MessageSquare, Flag, Shield,
  Plus, Edit, Trash2, Eye, ChevronRight, Check, X as XIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { dummyGroups, dummyMembers, dummyNews, dummyBoardPosts } from '@/lib/dummy-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const mockReports = [
  { id: '1', target: '「〇〇ちゃんは整形してる」という投稿', reporter: 'ユーザーA', reason: '個人への誹謗中傷', status: 'pending', date: '2025-04-25' },
  { id: '2', target: '「メンバーの住所は〇〇」という投稿', reporter: 'ユーザーB', reason: '個人情報の晒し', status: 'pending', date: '2025-04-24' },
  { id: '3', target: '宣伝スパム投稿', reporter: 'ユーザーC', reason: 'スパム', status: 'resolved', date: '2025-04-23' },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [reports, setReports] = useState(mockReports)

  const stats = [
    { label: 'グループ', value: dummyGroups.length, icon: Star, color: 'text-fuchsia-600' },
    { label: 'メンバー', value: dummyMembers.length, icon: Users, color: 'text-purple-600' },
    { label: 'ニュース', value: dummyNews.length, icon: Newspaper, color: 'text-violet-600' },
    { label: '通報 (未処理)', value: reports.filter(r => r.status === 'pending').length, icon: Flag, color: 'text-red-500' },
  ]

  const resolveReport = (id: string, action: 'resolved' | 'dismissed') => {
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, status: action } : r))
  }

  return (
    <div className="space-y-4">
      {/* Admin Header */}
      <div className="idol-gradient rounded-2xl p-4 text-white flex items-center gap-3">
        <Shield className="w-8 h-8" />
        <div>
          <h1 className="text-lg font-black">管理画面</h1>
          <p className="text-xs opacity-80">アイドルSNS 管理者ダッシュボード</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <Icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-xl font-black">{stat.value}</p>
                <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="reports">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="reports" className="text-xs">通報</TabsTrigger>
          <TabsTrigger value="groups" className="text-xs">グループ</TabsTrigger>
          <TabsTrigger value="members" className="text-xs">メンバー</TabsTrigger>
          <TabsTrigger value="news" className="text-xs">ニュース</TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">通報一覧</h2>
            <span className="text-xs text-muted-foreground">
              未処理: {reports.filter(r => r.status === 'pending').length}件
            </span>
          </div>
          {reports.map((report) => (
            <div key={report.id} className={`bg-card border rounded-xl p-3 space-y-2 ${report.status === 'pending' ? 'border-red-200' : 'border-border opacity-60'}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold line-clamp-2">{report.target}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    通報理由: {report.reason} | 報告者: {report.reporter} | {report.date}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                  report.status === 'pending' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                }`}>
                  {report.status === 'pending' ? '未処理' : report.status === 'resolved' ? '対応済' : '却下'}
                </span>
              </div>
              {report.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => resolveReport(report.id, 'resolved')}
                  >
                    <Check className="w-3 h-3 mr-1" /> 投稿削除・対応済
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    onClick={() => resolveReport(report.id, 'dismissed')}
                  >
                    <XIcon className="w-3 h-3 mr-1" /> 却下
                  </Button>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">グループ管理</h2>
            <Button size="sm" className="h-7 text-xs idol-gradient text-white border-0">
              <Plus className="w-3 h-3 mr-1" /> 追加
            </Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {dummyGroups.map((group) => (
              <div key={group.id} className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{group.name}</p>
                  <p className="text-[10px] text-muted-foreground">{group.area} · {group.genre}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Members Tab */}
        <TabsContent value="members" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">メンバー管理</h2>
            <Button size="sm" className="h-7 text-xs idol-gradient text-white border-0">
              <Plus className="w-3 h-3 mr-1" /> 追加
            </Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {dummyMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2 px-3 py-2.5">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: member.color ?? '#e9d5ff' }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground">{member.group?.name}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* News Tab */}
        <TabsContent value="news" className="mt-3 space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">ニュース管理</h2>
            <Button size="sm" className="h-7 text-xs idol-gradient text-white border-0">
              <Plus className="w-3 h-3 mr-1" /> 追加
            </Button>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
            {dummyNews.map((news) => (
              <div key={news.id} className="flex items-center gap-2 px-3 py-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium line-clamp-1">{news.title}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {news.category} · {new Date(news.created_at).toLocaleDateString('ja-JP')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="w-7 h-7">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-7 h-7 text-destructive hover:text-destructive">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
