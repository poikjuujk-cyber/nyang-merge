-- 냥냥 머지 랭킹 테이블 — 비로그인(익명) 사용자도 등록할 수 있게 읽기/추가만 허용한다.
-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 Run 하면 끝.

create table if not exists public.scores (
  id         bigint generated always as identity primary key,
  name       text        not null check (char_length(name) between 1 and 12),
  score      integer     not null check (score >= 0 and score <= 10000000),
  created_at timestamptz not null default now()
);

-- 랭킹 정렬용 인덱스
create index if not exists scores_score_desc_idx on public.scores (score desc);

alter table public.scores enable row level security;

-- 누구나 읽기 가능 (랭킹 조회)
drop policy if exists "nyang read" on public.scores;
create policy "nyang read" on public.scores
  for select to anon, authenticated using (true);

-- 누구나 추가만 가능. update/delete 정책이 없으므로 남의 기록은 고치거나 지울 수 없다.
drop policy if exists "nyang insert" on public.scores;
create policy "nyang insert" on public.scores
  for insert to anon, authenticated with check (true);

grant select, insert on public.scores to anon, authenticated;
grant usage, select on all sequences in schema public to anon, authenticated;
