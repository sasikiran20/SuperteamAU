"use server";

import { createClient } from "@/lib/supabase/server";

export interface FormOptions {
  roles: string[];
  skills: string[];
  experienceLevels: string[];
  locations: { label: string; value: string }[];
  heroImages: string[];
}

export async function getFormOptions(): Promise<FormOptions> {
  const fallback: FormOptions = {
    roles: [],
    skills: [],
    experienceLevels: [],
    locations: [],
    heroImages: [],
  };

  try {
    const supabase = await createClient();

    const [optionsRes, heroRes] = await Promise.all([
      supabase
        .from("form_options")
        .select("category, label, value, sort_order")
        .order("sort_order", { ascending: true }),
      supabase.from("hero_images").select("image_url"),
    ]);

    if (optionsRes.error) {
      console.error("Error fetching form options:", optionsRes.error);
      return fallback;
    }

    const options = optionsRes.data || [];

    const roles = options
      .filter((o) => o.category === "role")
      .map((o) => o.value);

    const skills = options
      .filter((o) => o.category === "skill")
      .map((o) => o.value);

    const experienceLevels = options
      .filter((o) => o.category === "experience_level")
      .map((o) => o.value);

    const locations = options
      .filter((o) => o.category === "location")
      .map((o) => ({ label: o.label, value: o.value }));

    const heroImages =
      !heroRes.error && heroRes.data
        ? heroRes.data.map((r) => r.image_url)
        : [];

    return { roles, skills, experienceLevels, locations, heroImages };
  } catch (error) {
    console.error("Error fetching form options:", error);
    return fallback;
  }
}
