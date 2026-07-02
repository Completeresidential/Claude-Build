export type ContactSource = "phone" | "website" | "referral" | "social" | "other";
export type UserRole = "owner" | "estimator" | "staff";
export type JobServiceType =
  | "renovation"
  | "remodel"
  | "flooring"
  | "painting"
  | "kitchen"
  | "bath"
  | "other";
export type JobStage =
  | "lead"
  | "estimate_sent"
  | "scheduled"
  | "in_progress"
  | "complete"
  | "lost";

export type Contact = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  source: ContactSource | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  phone: string | null;
  created_at: string;
};

export type Job = {
  id: string;
  contact_id: string;
  title: string;
  service_type: JobServiceType | null;
  stage: JobStage;
  assigned_to: string | null;
  scope_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: Contact;
        Insert: Partial<Contact> & Pick<Contact, "full_name">;
        Update: Partial<Contact>;
        Relationships: [];
      };
      users: {
        Row: User;
        Insert: Partial<User> & Pick<User, "full_name" | "email">;
        Update: Partial<User>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: Partial<Job> & Pick<Job, "contact_id" | "title">;
        Update: Partial<Job>;
        Relationships: [
          {
            foreignKeyName: "jobs_contact_id_fkey";
            columns: ["contact_id"];
            isOneToOne: true;
            referencedRelation: "contacts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "jobs_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
