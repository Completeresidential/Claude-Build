import type { ContactSource, JobServiceType, JobStage } from "@/lib/supabase/types";

export const SOURCE_LABELS: Record<ContactSource, string> = {
  phone: "Phone",
  website: "Website",
  referral: "Referral",
  social: "Social",
  other: "Other",
};

export const SERVICE_TYPE_LABELS: Record<JobServiceType, string> = {
  renovation: "Renovation",
  remodel: "Remodel",
  flooring: "Flooring",
  painting: "Painting",
  kitchen: "Kitchen",
  bath: "Bath",
  other: "Other",
};

export const STAGE_LABELS: Record<JobStage, string> = {
  lead: "Lead",
  estimate_sent: "Estimate Sent",
  scheduled: "Scheduled",
  in_progress: "In Progress",
  complete: "Complete",
  lost: "Lost",
};

export const STAGES: { key: JobStage; label: string }[] = (
  Object.keys(STAGE_LABELS) as JobStage[]
).map((key) => ({ key, label: STAGE_LABELS[key] }));
