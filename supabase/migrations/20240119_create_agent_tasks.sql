create table agent_tasks (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references agents(id) on delete cascade,
  type text not null check (type in ('daily', 'weekly', 'custom')),
  action text not null,
  schedule jsonb not null default '{}',
  is_active boolean not null default true,
  last_run timestamp with time zone,
  next_run timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Add indexes for performance
create index agent_tasks_agent_id_idx on agent_tasks(agent_id);
create index agent_tasks_next_run_idx on agent_tasks(next_run) where is_active = true;
