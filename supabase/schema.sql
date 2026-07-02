create extension if not exists "uuid-ossp";

create table users (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null unique,
  role text not null default 'staff' check (role in ('owner', 'estimator', 'staff')),
  phone text,
  created_at timestamptz not null default now()
);

create table contacts (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text,
  email text,
  address text,
  source text check (source in ('phone', 'website', 'referral', 'social', 'other')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table jobs (
  id uuid primary key default uuid_generate_v4(),
  contact_id uuid not null references contacts(id) on delete cascade,
  title text not null,
  service_type text check (service_type in ('renovation', 'remodel', 'flooring', 'painting', 'kitchen', 'bath', 'other')),
  stage text not null default 'lead' check (stage in ('lead', 'estimate_sent', 'scheduled', 'in_progress', 'complete', 'lost')),
  assigned_to uuid references users(id),
  scope_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
