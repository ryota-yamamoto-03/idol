-- ===========================
-- 地下アイドルSNS Supabase Schema
-- ===========================

-- Users (Supabase auth.users と連携)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- アイドルグループ
CREATE TABLE public.idol_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  agency TEXT,
  area TEXT,
  genre TEXT,
  formed_year INTEGER,
  official_x_url TEXT,
  official_instagram_url TEXT,
  official_tiktok_url TEXT,
  official_website_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- アイドルメンバー
CREATE TABLE public.idol_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.idol_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT,
  color TEXT,
  birthday DATE,
  birthplace TEXT,
  profile TEXT,
  joined_at DATE,
  graduated_at DATE,
  official_x_url TEXT,
  official_instagram_url TEXT,
  official_tiktok_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- メンバー履歴（加入・卒業・移籍等）
CREATE TABLE public.member_histories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES public.idol_members(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.idol_groups(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('join', 'graduate', 'transfer', 'hiatus', 'return')),
  event_date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ニュース
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('live', 'release', 'member', 'event', 'media', 'other')),
  source_url TEXT,
  group_id UUID REFERENCES public.idol_groups(id) ON DELETE SET NULL,
  member_id UUID REFERENCES public.idol_members(id) ON DELETE SET NULL,
  author_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 掲示板
CREATE TABLE public.boards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('group', 'member', 'cheki', 'general')),
  group_id UUID REFERENCES public.idol_groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.idol_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 掲示板投稿
CREATE TABLE public.board_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id UUID NOT NULL REFERENCES public.boards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  image_url TEXT,
  like_count INTEGER NOT NULL DEFAULT 0,
  parent_post_id UUID REFERENCES public.board_posts(id) ON DELETE CASCADE,
  is_deleted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- いいね
CREATE TABLE public.post_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.board_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);

-- チャットルーム
CREATE TABLE public.chat_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('group', 'member', 'general')),
  group_id UUID REFERENCES public.idol_groups(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.idol_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- チャットメッセージ
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 通報
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('board_post', 'chat_message', 'user')),
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NGワード
CREATE TABLE public.ng_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL UNIQUE,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ===========================
-- インデックス
-- ===========================
CREATE INDEX idx_idol_members_group_id ON public.idol_members(group_id);
CREATE INDEX idx_member_histories_member_id ON public.member_histories(member_id);
CREATE INDEX idx_news_group_id ON public.news(group_id);
CREATE INDEX idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX idx_boards_group_id ON public.boards(group_id);
CREATE INDEX idx_boards_member_id ON public.boards(member_id);
CREATE INDEX idx_board_posts_board_id ON public.board_posts(board_id);
CREATE INDEX idx_board_posts_parent_post_id ON public.board_posts(parent_post_id);
CREATE INDEX idx_board_posts_created_at ON public.board_posts(created_at DESC);
CREATE INDEX idx_post_likes_post_id ON public.post_likes(post_id);
CREATE INDEX idx_chat_messages_chat_room_id ON public.chat_messages(chat_room_id);
CREATE INDEX idx_reports_status ON public.reports(status);

-- ===========================
-- RLS (Row Level Security)
-- ===========================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idol_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idol_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_histories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ng_words ENABLE ROW LEVEL SECURITY;

-- 全員閲覧可能なポリシー
CREATE POLICY "Public read" ON public.idol_groups FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.idol_members FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.member_histories FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.boards FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.board_posts FOR SELECT USING (NOT is_deleted);
CREATE POLICY "Public read" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Public read" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Public read users" ON public.users FOR SELECT USING (true);

-- 認証済みユーザーの投稿
CREATE POLICY "Auth insert posts" ON public.board_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth update own posts" ON public.board_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Auth insert likes" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth delete own likes" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Auth insert messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth insert reports" ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_user_id);

-- ユーザー自身のプロフィール更新
CREATE POLICY "Auth update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Auth insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- 管理者用ポリシー (role = admin)
CREATE POLICY "Admin all groups" ON public.idol_groups FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all members" ON public.idol_members FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all news" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all reports" ON public.reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin all ng_words" ON public.ng_words FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);

-- ===========================
-- いいね数更新トリガー
-- ===========================
CREATE OR REPLACE FUNCTION update_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.board_posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.board_posts SET like_count = like_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_like_count
AFTER INSERT OR DELETE ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION update_like_count();

-- ===========================
-- ユーザー登録時の自動プロフィール作成
-- ===========================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION handle_new_user();
