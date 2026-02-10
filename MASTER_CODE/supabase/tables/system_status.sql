-- Create the system_status table
create table public.system_status (
  id uuid default gen_random_uuid() primary key,
  status text not null check (status in ('ACTIVE', 'MAINTENANCE', 'LOCKDOWN')),
  updated_by uuid references auth.users(id),
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert default status
insert into public.system_status (status) values ('ACTIVE');

-- Enable RLS
alter table public.system_status enable row level security;

-- Policies
-- Everyone can read the system status (publicly readable to check for lockdown)
create policy "System status is public"
  on public.system_status for select
  using (true);

-- Only Admins can update the system status
create policy "Admins can update system status"
  on public.system_status for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only Admins can insert (though we only need one row usually)
create policy "Admins can insert system status"
  on public.system_status for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
