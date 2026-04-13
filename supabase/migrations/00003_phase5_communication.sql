-- ============================================================
-- Mymiso Database Schema
-- Migration 00003: Phase 5 — Communication & Social
-- Review replies, helpful votes, chat improvements
-- ============================================================

-- ============================================================
-- Review Replies (seller responses to reviews)
-- ============================================================
create table public.review_replies (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews(id) on delete cascade,
  seller_id uuid references public.sellers(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(review_id, seller_id)  -- one reply per seller per review
);

-- ============================================================
-- Review Helpful Votes (track which users voted helpful)
-- ============================================================
create table public.review_helpful_votes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid references public.reviews(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  unique(review_id, user_id)  -- one vote per user per review
);

-- ============================================================
-- Additional indexes for chat performance
-- ============================================================
create index idx_messages_sender on public.messages(sender_id);
create index idx_conversations_last_message on public.conversations(last_message_at desc);
create index idx_conversations_buyer on public.conversations(buyer_id);
create index idx_conversations_seller on public.conversations(seller_id);
create index idx_messages_unread on public.messages(conversation_id, is_read) where is_read = false;
create index idx_review_replies_review on public.review_replies(review_id);
create index idx_review_helpful_votes_review on public.review_helpful_votes(review_id);

-- ============================================================
-- Row Level Security for new tables
-- ============================================================

-- Review replies: anyone can read, only the seller who owns the product can write
alter table public.review_replies enable row level security;

create policy "Read review replies" on public.review_replies
  for select using (true);

create policy "Seller creates reply" on public.review_replies
  for insert with check (
    seller_id in (select id from public.sellers where user_id = auth.uid())
  );

create policy "Seller updates own reply" on public.review_replies
  for update using (
    seller_id in (select id from public.sellers where user_id = auth.uid())
  );

create policy "Seller deletes own reply" on public.review_replies
  for delete using (
    seller_id in (select id from public.sellers where user_id = auth.uid())
  );

-- Review helpful votes: anyone can read, authenticated users can vote
alter table public.review_helpful_votes enable row level security;

create policy "Read helpful votes" on public.review_helpful_votes
  for select using (true);

create policy "Own helpful votes" on public.review_helpful_votes
  for insert with check (user_id = auth.uid());

create policy "Delete own helpful vote" on public.review_helpful_votes
  for delete using (user_id = auth.uid());

-- ============================================================
-- Auto-update updated_at for review_replies
-- ============================================================
create trigger update_review_replies_updated_at
  before update on public.review_replies
  for each row execute procedure public.update_updated_at();

-- ============================================================
-- Function to update helpful_count on reviews when votes change
-- ============================================================
create or replace function public.update_review_helpful_count()
returns trigger
language plpgsql
security definer
as $$
begin
  if (TG_OP = 'INSERT') then
    update public.reviews
    set helpful_count = helpful_count + 1
    where id = NEW.review_id;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    update public.reviews
    set helpful_count = greatest(0, helpful_count - 1)
    where id = OLD.review_id;
    return OLD;
  end if;
  return null;
end;
$$;

create trigger on_helpful_vote_change
  after insert or delete on public.review_helpful_votes
  for each row execute procedure public.update_review_helpful_count();

-- ============================================================
-- Enable Realtime for messages and notifications
-- ============================================================
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
