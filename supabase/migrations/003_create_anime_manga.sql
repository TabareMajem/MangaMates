-- Media table for storing anime/manga data
create table public.media (
  id bigint primary key,  -- AniList ID
  title_romaji text not null,
  title_english text,
  title_native text,
  type text not null check (type in ('ANIME', 'MANGA')),
  format text not null,
  status text not null,
  description text,
  start_date date,
  end_date date,
  season text,
  season_year integer,
  episodes integer,
  duration integer,
  chapters integer,
  volumes integer,
  genres text[],
  cover_image_large text,
  cover_image_medium text,
  banner_image text,
  average_score smallint,
  popularity integer,
  trending integer,
  favourites integer,
  is_adult boolean default false,
  updated_at timestamptz default now(),
  synced_at timestamptz default now()
);

-- User media lists (Plan to Watch, Watching, Completed, etc)
create table public.user_media_lists (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  media_id bigint references public.media(id) on delete cascade,
  status text not null check (status in ('CURRENT', 'PLANNING', 'COMPLETED', 'DROPPED', 'PAUSED', 'REPEATING')),
  score smallint check (score between 0 and 100),
  progress integer default 0,
  progress_volumes integer default 0,
  notes text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Media tags
create table public.media_tags (
  id bigint primary key,  -- AniList tag ID
  name text not null,
  description text,
  category text,
  rank integer,
  is_general_spoiler boolean default false,
  is_media_spoiler boolean default false
);

-- Junction table for media <-> tags
create table public.media_to_tags (
  media_id bigint references public.media(id) on delete cascade,
  tag_id bigint references public.media_tags(id) on delete cascade,
  primary key (media_id, tag_id)
);

-- User favorites
create table public.user_favorites (
  user_id uuid references auth.users(id) on delete cascade,
  media_id bigint references public.media(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, media_id)
);

-- Add indexes
create index media_title_search_idx on public.media using gin(to_tsvector('english', title_romaji || ' ' || coalesce(title_english, '') || ' ' || coalesce(title_native, '')));
create index media_popularity_idx on public.media(popularity desc);
create index media_trending_idx on public.media(trending desc);
create index user_media_lists_user_id_idx on public.user_media_lists(user_id);
create index user_media_lists_status_idx on public.user_media_lists(status);

-- Add RLS policies
alter table public.media enable row level security;
alter table public.user_media_lists enable row level security;
alter table public.media_tags enable row level security;
alter table public.media_to_tags enable row level security;
alter table public.user_favorites enable row level security;

-- Media policies
create policy "Media is viewable by everyone"
  on public.media for select
  using (true);

create policy "Service role can manage media"
  on public.media for all
  using (auth.role() = 'service_role');

-- User media list policies
create policy "Users can view their own lists"
  on public.user_media_lists for select
  using (auth.uid() = user_id);

create policy "Users can manage their own lists"
  on public.user_media_lists for all
  using (auth.uid() = user_id);

-- Media tags policies
create policy "Tags are viewable by everyone"
  on public.media_tags for select
  using (true);

-- Media to tags policies
create policy "Media tag relations are viewable by everyone"
  on public.media_to_tags for select
  using (true);

-- User favorites policies
create policy "Users can view their own favorites"
  on public.user_favorites for select
  using (auth.uid() = user_id);

create policy "Users can manage their own favorites"
  on public.user_favorites for all
  using (auth.uid() = user_id);
