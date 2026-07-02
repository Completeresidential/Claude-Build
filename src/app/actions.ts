"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContactSource, JobServiceType } from "@/lib/supabase/types";

const CONTACT_SOURCES: ContactSource[] = ["phone", "website", "referral", "social", "other"];
const JOB_SERVICE_TYPES: JobServiceType[] = [
  "renovation",
  "remodel",
  "flooring",
  "painting",
  "kitchen",
  "bath",
  "other",
];

function optionalText(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : null;
}

export async function createContact(formData: FormData) {
  const full_name = String(formData.get("full_name") ?? "").trim();
  if (!full_name) {
    redirect("/?error=" + encodeURIComponent("Name is required"));
  }

  const sourceRaw = String(formData.get("source") ?? "");
  const source = (CONTACT_SOURCES as string[]).includes(sourceRaw)
    ? (sourceRaw as ContactSource)
    : null;

  const supabase = await createClient();
  const { error } = await supabase.from("contacts").insert({
    full_name,
    phone: optionalText(formData, "phone"),
    email: optionalText(formData, "email"),
    address: optionalText(formData, "address"),
    notes: optionalText(formData, "notes"),
    source,
  });

  if (error) {
    redirect("/?error=" + encodeURIComponent(error.message));
  }

  revalidatePath("/");
  redirect("/");
}

export async function createJob(formData: FormData) {
  const contact_id = String(formData.get("contact_id") ?? "").trim();
  if (!contact_id) {
    redirect("/?error=" + encodeURIComponent("Missing contact"));
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    redirect(`/contacts/${contact_id}?error=` + encodeURIComponent("Title is required"));
  }

  const serviceTypeRaw = String(formData.get("service_type") ?? "");
  const service_type = (JOB_SERVICE_TYPES as string[]).includes(serviceTypeRaw)
    ? (serviceTypeRaw as JobServiceType)
    : null;

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").insert({
    contact_id,
    title,
    service_type,
    scope_notes: optionalText(formData, "scope_notes"),
  });

  if (error) {
    redirect(`/contacts/${contact_id}?error=` + encodeURIComponent(error.message));
  }

  revalidatePath("/jobs");
  revalidatePath(`/contacts/${contact_id}`);
  redirect("/jobs");
}
