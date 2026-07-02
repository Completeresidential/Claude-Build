import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { JobStage } from "@/lib/supabase/types";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const SOURCE_LABELS: Record<string, string> = {
  phone: "Phone",
  website: "Website",
  referral: "Referral",
  social: "Social",
  other: "Other",
};

const STAGE_LABELS: Record<JobStage, string> = {
  lead: "Lead",
  estimate_sent: "Estimate Sent",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  complete: "Complete",
  lost: "Lost",
};

export default async function ContactDetailPage({
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
  const { data: contact, error: contactError } = await supabase
    .from("contacts")
    .select("id, full_name, phone, email, address, source, notes, created_at")
    .eq("id", id)
    .maybeSingle();

  if (contactError) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-3 px-6 py-24">
        <h1 className="text-2xl font-semibold text-red-700">Couldn&apos;t load contact</h1>
        <p className="text-zinc-600">{contactError.message}</p>
      </main>
    );
  }

  if (!contact) {
    notFound();
  }

  const { data: jobs, error: jobsError } = await supabase
    .from("jobs")
    .select("id, title, stage, service_type, created_at")
    .eq("contact_id", id)
    .order("created_at", { ascending: false });

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-700">
        ← Back to contacts
      </Link>

      <h1 className="mt-2 text-2xl font-semibold text-zinc-900">{contact.full_name}</h1>

      <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 rounded-lg border border-zinc-200 p-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Phone</dt>
          <dd className="text-sm text-zinc-900">{contact.phone ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
          <dd className="text-sm text-zinc-900">{contact.email ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Address</dt>
          <dd className="text-sm text-zinc-900">{contact.address ?? "—"}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Source</dt>
          <dd className="text-sm text-zinc-900">
            {contact.source ? SOURCE_LABELS[contact.source] ?? contact.source : "—"}
          </dd>
        </div>
        {contact.notes ? (
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Notes</dt>
            <dd className="text-sm text-zinc-900">{contact.notes}</dd>
          </div>
        ) : null}
      </dl>

      <h2 className="mt-10 mb-3 text-lg font-semibold text-zinc-900">Jobs</h2>

      {jobsError ? (
        <p className="text-sm text-red-700">{jobsError.message}</p>
      ) : jobs.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-8 text-center text-zinc-500">
          No jobs yet.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200">
          {jobs.map((job) => (
            <li key={job.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-zinc-900">{job.title}</span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                {STAGE_LABELS[job.stage]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
