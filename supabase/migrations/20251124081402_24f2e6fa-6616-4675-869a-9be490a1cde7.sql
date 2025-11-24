-- Create enum for account types
create type public.account_type as enum ('prive', 'zakelijk');

-- Create profiles table
create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text not null,
  account_type account_type not null default 'prive',
  created_at timestamp with time zone not null default now(),
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Function to handle new user signups
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, account_type)
  values (
    new.id,
    new.email,
    coalesce((new.raw_user_meta_data->>'account_type')::account_type, 'prive')
  );
  return new;
end;
$$;

-- Trigger to create profile on signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();