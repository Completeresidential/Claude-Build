"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ContactSource } from "@/lib/supabase/types";

const CONTACT_SOURCES: ContactSource[] = ["phone", "website", "referral", "social", "other"];

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
