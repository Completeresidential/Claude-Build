import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createContact } from "@/app/actions";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const SOURCE_LABELS: Record<string, string> = {
  phone: "Phone",
  website: "Website",
  referral: "Referral",
  social: "Social",
  other: "Other",
};

const inputClass =
  "w-full rounded border border-zinc-300 px-3 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-500 focus:outline-none";
const labelClass = "text-xs font-medium text-zinc-500";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error: formError } = await searchParams;

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
  const { data: contacts, error } = await supabase
    .from("contacts")
    .select("id, full_name, phone, email, address, source, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-start justify-center gap-3 px-6 py-24">
        <h1 className="text-2xl font-semibold text-red-700">Couldn&apos;t load contacts</h1>
        <p className="text-zinc-600">{error.message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">Contacts</h1>
        <span className="text-sm text-zinc-500">
          {contacts.length} {contacts.length === 1 ? "contact" : "contacts"}
        </span>
      </div>

      <div className="mb-8 rounded-lg border border-zinc-200 p-4">
        <h2 className="mb-3 text-sm font-semibold text-zinc-900">New contact</h2>
        {formError ? (
          <p className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {formError}
          </p>
        ) : null}
        <form action={createContact} className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="full_name" className={labelClass}>
              Name
            </label>
            <input
              id="full_name"
              name="full_name"
              required
              className={inputClass}
              placeholder="Jane Smith"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input id="phone" name="phone" type="tel" className={inputClass} placeholder="(555) 555-0100" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input id="email" name="email" type="email" className={inputClass} placeholder="jane@example.com" />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="source" className={labelClass}>
              Source
            </label>
            <select id="source" name="source" defaultValue="" className={inputClass}>
              <option value="">—</option>
              {Object.entries(SOURCE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input id="address" name="address" className={inputClass} placeholder="123 Main St" />
          </div>
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor="notes" className={labelClass}>
              Notes
            </label>
            <textarea id="notes" name="notes" rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded bg-zinc-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Add contact
            </button>
          </div>
        </form>
      </div>

      {contacts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-zinc-300 px-6 py-12 text-center text-zinc-500">
          No contacts yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
                  Added
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 bg-white">
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                    <Link href={`/contacts/${contact.id}`} className="hover:underline">
                      {contact.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{contact.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">{contact.email ?? "—"}</td>
                  <td className="px-4 py-3 text-sm text-zinc-600">
                    {contact.source ? SOURCE_LABELS[contact.source] ?? contact.source : "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600">
                    {formatDate(contact.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
