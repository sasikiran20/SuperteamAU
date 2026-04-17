"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitGetInvolvedForm(formData: {
  name: string;
  email: string;
  location: string;
  role: string;
  skills: string[];
  experience: string;
  twitter: string;
  github: string;
  portfolio: string;
  goals: string;
}) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("get_involved_signups")
      .insert([
        {
          name: formData.name,
          email: formData.email,
          location: formData.location,
          role: formData.role,
          skills: formData.skills,
          experience: formData.experience,
          twitter: formData.twitter || null,
          github: formData.github || null,
          portfolio: formData.portfolio || null,
          goals: formData.goals || null,
        },
      ])
      .select();

    console.log("Supabase response:", { data, error });

    if (error) {
      console.error("Error inserting get involved signup:", error);
      return { success: false, error: "Failed to submit form. Please try again later." };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error submitting get involved form:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
