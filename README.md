## CRM Contacts

A Next.js (App Router) app that connects to a Supabase project and lists
contacts from the CRM schema.

### Schema

The database schema lives in [`supabase/schema.sql`](./supabase/schema.sql)
and defines three tables:

- `users` — internal staff (`owner`, `estimator`, `staff`)
- `contacts` — leads/customers, sourced from `phone`, `website`, `referral`,
  `social`, or `other`
- `jobs` — work tied to a contact, tracked through a pipeline `stage`
  (`lead` → `estimate_sent` → `scheduled` → `in_progress` → `complete`/`lost`)

Apply it to a Supabase project via the SQL editor or the CLI:

```bash
supabase db push --db-url <your-connection-string>
# or paste supabase/schema.sql into the Supabase SQL editor
```

### Setup

1. Copy the env template and fill in your Supabase project credentials
   (Project Settings → API):

   ```bash
   cp .env.local.example .env.local
   ```

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

2. Install dependencies and run the dev server:

   ```bash
   npm install
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) — it lists contacts
   from the `contacts` table, newest first.

Note: the anon key relies on Supabase Row Level Security. If RLS is enabled
on `contacts` (recommended), add a policy allowing the intended
role/audience to `select` from it.

### Structure

- `src/lib/supabase/server.ts` — Supabase client for Server Components
- `src/lib/supabase/client.ts` — Supabase client for Client Components
- `src/lib/supabase/types.ts` — TypeScript types mirroring the schema
- `src/app/page.tsx` — contacts list page
