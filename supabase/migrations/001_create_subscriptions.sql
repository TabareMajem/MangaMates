create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  stripe_subscription_id text unique not null,
  status text not null check (status in ('active', 'past_due', 'canceled', 'incomplete')),
  current_period_end timestamptz not null,
  cancel_at_period_end boolean default false,
  canceled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.subscriptions enable row level security;

create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Service role can manage all subscriptions"
  on public.subscriptions for all
  using (auth.role() = 'service_role');

-- Add indexes
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_stripe_id_idx on public.subscriptions(stripe_subscription_id);
