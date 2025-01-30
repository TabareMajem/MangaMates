-- Promotion codes table
create table public.promotion_codes (
  id uuid default uuid_generate_v4() primary key,
  code text unique not null,
  active boolean default true,
  coupon_id text not null,
  customer_id text,
  max_redemptions integer,
  times_redeemed integer default 0,
  expires_at timestamptz,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Customer discounts table
create table public.customer_discounts (
  id uuid default uuid_generate_v4() primary key,
  customer_id text not null,
  promotion_code text references public.promotion_codes(code),
  coupon_id text not null,
  start timestamptz not null,
  end timestamptz,
  created_at timestamptz default now()
);

-- Coupons table
create table public.coupons (
  id uuid default uuid_generate_v4() primary key,
  coupon_id text unique not null,
  name text,
  percent_off numeric,
  amount_off integer,
  duration text not null,
  duration_in_months integer,
  max_redemptions integer,
  times_redeemed integer default 0,
  valid boolean default true,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add RLS policies
alter table public.promotion_codes enable row level security;
alter table public.customer_discounts enable row level security;
alter table public.coupons enable row level security;

-- Policies for promotion_codes
create policy "Public can view active promotion codes"
  on public.promotion_codes for select
  using (active = true);

create policy "Service role can manage promotion codes"
  on public.promotion_codes for all
  using (auth.role() = 'service_role');

-- Policies for customer_discounts
create policy "Users can view their own discounts"
  on public.customer_discounts for select
  using (auth.uid()::text = customer_id);

create policy "Service role can manage customer discounts"
  on public.customer_discounts for all
  using (auth.role() = 'service_role');

-- Policies for coupons
create policy "Public can view valid coupons"
  on public.coupons for select
  using (valid = true);

create policy "Service role can manage coupons"
  on public.coupons for all
  using (auth.role() = 'service_role');

-- Add indexes
create index promotion_codes_code_idx on public.promotion_codes(code);
create index customer_discounts_customer_id_idx on public.customer_discounts(customer_id);
create index coupons_coupon_id_idx on public.coupons(coupon_id);
