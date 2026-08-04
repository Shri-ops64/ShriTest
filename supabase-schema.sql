-- Odin Project Module · Test Plan persistence
-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
--
-- ALREADY HAVE THE TABLE FROM BEFORE? Don't re-run the CREATE TABLE block below
-- (it's harmless either way since it says "if not exists", but your existing
-- data stays untouched). Instead, just run this migration to add the four new
-- columns needed for the "add your own test case" feature:
--
--   alter table test_results add column if not exists category text;
--   alter table test_results add column if not exists test_case text;
--   alter table test_results add column if not exists expected_result text;
--   alter table test_results add column if not exists is_custom boolean default false;
--
-- Then skip down to the CREATE TABLE statement below only if you're setting
-- this up completely fresh.

create table if not exists test_results (
  row_key       text primary key,       -- stable id: "<screen-file>::<slugified-test-name>"
  screen_name   text,
  screen_file   text,
  status        text default 'notrun',  -- 'notrun' | 'pass' | 'fail' | 'blocked'
  qa_notes      text default '',
  dev_response  text default '',
  screenshot_url text,
  updated_by    text,
  updated_at    timestamptz default now(),
  -- Added to support test cases the team adds themselves, on top of the
  -- built-in set that ships in the page's own code:
  category        text,     -- only set for custom rows (built-in rows keep their category in code)
  test_case       text,     -- only set for custom rows
  expected_result text,     -- only set for custom rows
  is_custom       boolean default false
);

-- Lock the table down completely at the database level.
-- The Vercel API route talks to Supabase using the SERVICE ROLE key,
-- which bypasses RLS. The browser never talks to Supabase directly,
-- so no public policies are needed here at all.
alter table test_results enable row level security;

-- Optional: index for faster "recently updated" queries if you build a
-- dashboard/activity view later.
create index if not exists test_results_updated_at_idx on test_results (updated_at desc);
