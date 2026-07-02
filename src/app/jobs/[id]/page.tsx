import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_TYPE_LABELS, STAGE_LABELS } from "@/lib/labels";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
  const { data: job, error } = await supabase
    .from("jobs")
    .select("id, title, stage, service_type, scope_notes, contact_id, contacts(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-3 px-6 py-24">
        <h1 className="text-2xl font-semibold text-red-700">Couldn&apos;t load job</h1>
        <p className="text-zinc-600">{error.message}</p>
      </main>
    );
  }

  if (!job) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link href="/jobs" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Back to jobs
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{job.title}</h1>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Stage</dt>
          <dd className="text-sm text-zinc-900">{STAGE_LABELS[job.stage]}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Service type</dt>
          <dd className="text-sm text-zinc-900">
            {job.service_type ? SERVICE_TYPE_LABELS[job.service_type] ?? job.service_type : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Contact</dt>
          <dd className="text-sm text-zinc-900">
            <Link href={`/contacts/${job.contact_id}`} className="hover:underline">
              {job.contacts?.full_name ?? "Unknown contact"}
            </Link>
          </dd>
        </div>
        {job.scope_notes ? (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Scope notes</dt>
            <dd className="text-sm text-zinc-900">{job.scope_notes}</dd>
          </div>
        ) : null}
      </dl>
    </main>
  );
}
