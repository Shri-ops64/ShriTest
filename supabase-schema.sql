-- Odin Project Module · Test Plan persistence
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)

create table if not exists test_results (
  row_key       text primary key,       -- stable id: "<screen-file>::<slugified-test-name>"
  screen_name   text,
  screen_file   text,
  status        text default 'notrun',  -- 'notrun' | 'pass' | 'fail' | 'blocked'
  qa_notes      text default '',
  dev_response  text default '',
  screenshot_url text,
  updated_by    text,
  updated_at    timestamptz default now()
);

-- Lock the table down completely at the database level.
-- The Vercel API route talks to Supabase using the SERVICE ROLE key,
-- which bypasses RLS. The browser never talks to Supabase directly,
-- so no public policies are needed here at all.
alter table test_results enable row level security;

-- Optional: index for faster "recently updated" queries if you build a
-- dashboard/activity view later.
create index if not exists test_results_updated_at_idx on test_results (updated_at desc);
