import { createClient } from "@/lib/supabase/server";
import MembersClient from "./members-client";

export default async function MembersPage() {
  const supabase = await createClient();
  const { data: dbMembers, error } = await supabase.from("members").select("*");

  if (error) {
    console.error("Failed to fetch members:", error);
  }

  return <MembersClient members={dbMembers || []} />;
}
