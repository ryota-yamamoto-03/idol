export type UserRole = 'user' | 'admin' | 'moderator'

export interface User {
  id: string
  name: string
  email: string
  avatar_url: string | null
  bio: string | null
  role: UserRole
  created_at: string
}

export interface IdolGroup {
  id: string
  name: string
  description: string | null
  image_url: string | null
  agency: string | null
  area: string | null
  genre: string | null
  formed_year: number | null
  official_x_url: string | null
  official_instagram_url: string | null
  official_tiktok_url: string | null
  official_website_url: string | null
  created_at: string
  member_count?: number
}

export interface IdolMember {
  id: string
  group_id: string
  name: string
  image_url: string | null
  color: string | null
  birthday: string | null
  birthplace: string | null
  profile: string | null
  joined_at: string | null
  graduated_at: string | null
  official_x_url: string | null
  official_instagram_url: string | null
  official_tiktok_url: string | null
  created_at: string
  group?: IdolGroup
}

export interface MemberHistory {
  id: string
  member_id: string
  group_id: string
  event_type: 'join' | 'graduate' | 'transfer' | 'hiatus' | 'return'
  event_date: string
  description: string | null
  member?: IdolMember
  group?: IdolGroup
}

export type NewsCategory = 'live' | 'release' | 'member' | 'event' | 'media' | 'other'

export interface News {
  id: string
  title: string
  body: string
  thumbnail_url: string | null
  category: NewsCategory
  source_url: string | null
  group_id: string | null
  member_id: string | null
  created_at: string
  group?: IdolGroup
  member?: IdolMember
}

export type BoardType = 'group' | 'member' | 'cheki' | 'general'

export interface Board {
  id: string
  type: BoardType
  group_id: string | null
  member_id: string | null
  title: string
  created_at: string
  post_count?: number
}

export interface BoardPost {
  id: string
  board_id: string
  user_id: string
  body: string
  image_url: string | null
  like_count: number
  parent_post_id: string | null
  created_at: string
  user?: User
  replies?: BoardPost[]
  liked?: boolean
}

export type ReportTargetType = 'board_post' | 'chat_message' | 'user'
export type ReportStatus = 'pending' | 'resolved' | 'dismissed'

export interface Report {
  id: string
  reporter_user_id: string
  target_type: ReportTargetType
  target_id: string
  reason: string
  status: ReportStatus
  created_at: string
  reporter?: User
}
