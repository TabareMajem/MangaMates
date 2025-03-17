-- Tasks table
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  character_id uuid references public.characters(id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  priority smallint not null check (priority between 1 and 5),
  status text not null,
  schedule jsonb not null,
  dependencies uuid[] default array[]::uuid[],
  metadata jsonb default '{}'::jsonb,
  progress smallint default 0 check (progress between 0 and 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  next_run_at timestamptz,
  last_run_at timestamptz,
  error text,
  version integer default 1
);

-- Task execution history
create table public.task_executions (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade,
  status text not null,
  started_at timestamptz not null,
  completed_at timestamptz,
  duration interval,
  error text,
  metrics jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Task dependencies view
create view task_dependencies as
  with recursive dependency_chain as (
    select 
      t.id,
      t.title,
      t.priority,
      t.status,
      d.value as dependency_id,
      1 as depth
    from tasks t
    cross join lateral unnest(t.dependencies) as d(value)
    union all
    select 
      t.id,
      t.title,
      t.priority,
      t.status,
      d.value,
      dc.depth + 1
    from tasks t
    cross join lateral unnest(t.dependencies) as d(value)
    inner join dependency_chain dc on dc.dependency_id = t.id
    where dc.depth < 10 -- Prevent infinite recursion
  )
  select distinct id, title, array_agg(dependency_id) as all_dependencies
  from dependency_chain
  group by id, title;

-- Indexes
create index tasks_character_id_idx on public.tasks(character_id);
create index tasks_status_idx on public.tasks(status);
create index tasks_next_run_at_idx on public.tasks(next_run_at);
create index task_executions_task_id_idx on public.task_executions(task_id);

-- Add RLS policies
alter table public.tasks enable row level security;
alter table public.task_executions enable row level security;

create policy "Service role can manage tasks"
  on public.tasks for all
  using (auth.role() = 'service_role');

create policy "Service role can manage task executions"
  on public.task_executions for all
  using (auth.role() = 'service_role');

-- Functions
create or replace function update_task_analytics()
returns trigger as $$
begin
  update tasks
  set metadata = jsonb_set(
    metadata,
    '{analytics}',
    (
      select jsonb_build_object(
        'successRate', (
          select (count(*) filter (where status = 'completed')::float / count(*)::float) * 100
          from task_executions
          where task_id = new.task_id
        ),
        'averageDuration', (
          select extract(epoch from avg(duration))
          from task_executions
          where task_id = new.task_id
          and status = 'completed'
        ),
        'lastOutcomes', (
          select jsonb_agg(
            jsonb_build_object(
              'timestamp', created_at,
              'status', status,
              'duration', extract(epoch from duration),
              'error', error,
              'metrics', metrics
            )
          )
          from (
            select *
            from task_executions
            where task_id = new.task_id
            order by created_at desc
            limit 5
          ) recent
        )
      )
    )
  )
  where id = new.task_id;
  return new;
end;
$$ language plpgsql;

create trigger update_task_analytics_trigger
after insert or update on task_executions
for each row
execute function update_task_analytics();
