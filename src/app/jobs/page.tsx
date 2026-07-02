import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { STAGES } from "@/lib/labels";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function JobsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-3 px-6 py-24">
        <h1 className="text-2xl font-semibold text-zinc-900">Supabase isn&apos;t configured yet</h1>
        <p className="text-zinc-600">
          Set <code className="rounded bg-zinc-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5">.env.local</code> (see{" "}
          <code className="rounded bg-zinc-100 px-1.5 py-0.5">.env.local.example</code>), then restart
          the dev server.
        </p>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: jobs, error } = await supabase
    .from("jobs")
    .select("id, title, stage, contact_id, contacts(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-3 px-6 py-24">
        <h1 className="text-2xl font-semibold text-red-700">Couldn&apos;t load jobs</h1>
        <p className="text-zinc-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Jobs</h1>
        <span className="text-sm text-zinc-500">
          {jobs.length} {jobs.length === 1 ? "job" : "jobs"}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {STAGES.map((stage) => {
          const stageJobs = jobs.filter((job) => job.stage === stage.key);
          return (
            <div key={stage.key} className="rounded-lg border border-zinc-200 bg-zinc-50">
              <div className="border-b border-zinc-200 px-3 py-2 text-xs font-medium uppercase tracking-wide text-zinc-500">
                {stage.label} <span className="text-zinc-400">({stageJobs.length})</span>
              </div>
              <div className="flex flex-col gap-2 p-3">
                {stageJobs.length === 0 ? (
                  <p className="text-xs text-zinc-400">No jobs</p>
                ) : (
                  stageJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="block rounded border border-zinc-200 bg-white px-3 py-2 hover:border-zinc-400"
                    >
                      <div className="text-sm font-medium text-zinc-900">{job.title}</div>
                      <div className="text-xs text-zinc-500">
                        {job.contacts?.full_name ?? "Unknown contact"}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
