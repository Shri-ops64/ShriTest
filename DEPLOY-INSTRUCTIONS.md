# Adding a shared, live-saving Test Plan to your existing site

This turns `odin-test-plan.html` from a local-only tool into a real shared one:
every status change, note, dev response, and screenshot saves straight to a
database, and anyone else who opens the page sees it too.

Your site stays exactly what it is today — plain static HTML files in a repo
connected to Vercel. You are **not** converting it to Next.js or any
framework. Vercel automatically turns any file inside an `/api` folder into a
serverless function, regardless of what the rest of the site is. That's the
whole trick here.

## What's in this folder

```
api/results.js         <- the serverless function (the "backend")
odin-test-plan.html    <- replaces your current odin-test-plan.html
package.json            <- tells Vercel to install the Supabase client
supabase-schema.sql     <- run once in Supabase to create the table
DEPLOY-INSTRUCTIONS.md  <- this file
```

## Step 1 — Create the Supabase project (5 min)

1. Go to [supabase.com](https://supabase.com), sign in, click **New project**.
2. Pick any name/region, set a database password (save it somewhere), create.
3. Once it's ready, go to **SQL Editor > New query**, paste in the contents
   of `supabase-schema.sql` from this folder, and run it. This creates the
   `test_results` table.
4. Go to **Storage** (left sidebar) > **New bucket**. Name it exactly
   `screenshots`, and toggle it **Public**. This is where attached
   screenshots get stored; public just means the image URLs work directly in
   `<img>` tags without extra signing logic — nothing sensitive lives here.
5. Go to **Project Settings > API**. You'll need two values from this page
   in Step 3:
   - **Project URL** (labeled "URL")
   - **service_role** key (under "Project API keys" — NOT the "anon" key.
     The service role key has full access and must never be exposed to the
     browser, which is why it only ever gets used inside the serverless
     function, never in the HTML file.)

## Step 2 — Add these files to your repo

Copy `api/results.js` and `package.json` from this folder into the root of
your existing repo (the same one Vercel is already building from). If your
repo already has a `package.json`, merge the `dependencies` entry
(`@supabase/supabase-js`) into it rather than overwriting the file.

Replace your existing `odin-test-plan.html` with the one in this folder.

## Step 3 — Add the environment variables in Vercel

1. Go to your project on [vercel.com](https://vercel.com) > **Settings >
   Environment Variables**.
2. Add two variables (apply to Production, Preview, and Development):
   - `SUPABASE_URL` → the Project URL from Step 1.5
   - `SUPABASE_SERVICE_ROLE_KEY` → the service_role key from Step 1.5

## Step 4 — Push and deploy

```bash
git add api/results.js package.json odin-test-plan.html
git commit -m "Add Supabase-backed persistence to the test plan"
git push
```

Vercel will pick up the push, install `@supabase/supabase-js`, and deploy
`/api/results` alongside your existing static files automatically — no
extra config needed.

## Step 5 — Verify it

Open `https://odinprojectmodulespec.vercel.app/odin-test-plan.html`. Near
the top you should see a status dot turn **green** with "Connected — saving
to Supabase" within a couple seconds. If it stays **red** ("Offline"), check:

- The two environment variables are spelled exactly right in Vercel, and you
  redeployed after adding them (env var changes need a new deployment to
  take effect — push an empty commit or hit Redeploy in the Vercel
  dashboard if you added them after the last push).
- `screenshots` bucket exists in Supabase Storage and is spelled exactly
  that way (case-sensitive).
- Check **Vercel dashboard > your deployment > Functions > /api/results >
  Logs** for the actual error — the function logs anything that goes wrong
  server-side.

Type a name in the "Tester" field, click a status pill on any test case,
and refresh the page — it should still be there. Open the same URL in a
different browser (or send it to a teammate) and you should both see the
same data.

## What this does NOT give you

- **True real-time push** (seeing a teammate's change appear instantly,
  mid-session, without any delay). This implementation polls the server
  every 20 seconds and on manual Refresh, which is "near real-time" and
  fine for a QA workflow where two people rarely edit the exact same row at
  the same second. True real-time would mean adding Supabase's Realtime
  subscriptions — happy to add that next if it turns out to matter in
  practice.
- **Login / who-can-edit-what.** Anyone with the URL can edit any row. The
  "Tester" name field is just a label, not authentication. If you need to
  restrict who can change results, that's a separate step (Supabase Auth +
  updating the RLS policy from "locked down entirely" to "authenticated
  users only").
- **Version history / undo.** Each save overwrites the previous value for
  that row. If you want a full audit trail (who changed what, when, from
  what to what), that's a straightforward addition to the schema
  (an `test_results_history` table the function also writes to) but isn't
  in this first pass.
