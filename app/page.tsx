import dynamic from "next/dynamic";
import Hero from "@/components/sections/hero";
import { createClient } from "@/lib/supabase/server";
import { getFormOptions } from "@/app/get-involved/data";

const Mission = dynamic(() => import("@/components/sections/mission"));
const Stats = dynamic(() => import("@/components/sections/stats"));
const Events = dynamic(() => import("@/components/sections/events"));
const Members = dynamic(() => import("@/components/sections/members"));
const Ecosystem = dynamic(() => import("@/components/sections/ecosystem"));
const Community = dynamic(() => import("@/components/sections/community"));
const FAQ = dynamic(() => import("@/components/sections/faq"));
const JoinCTA = dynamic(() => import("@/components/sections/join-cta"));
const Footer = dynamic(() => import("@/components/sections/footer"));

export default async function Home() {
  let supabase;
  
  let dbEvents = [];
  let dbMembers = [];
  let dbHeroImages = [];
  let dbFAQs = [];
  let dbStats = [];
  let dbCommunityCards = [];
  let dbPartners = [];
  let dbMissionItems = [];
  let formOptions = { roles: [] as string[], skills: [] as string[], experienceLevels: [] as string[], locations: [] as { label: string; value: string }[], heroImages: [] as string[] };

  try {
    supabase = await createClient();
    const [
      eventsRes,
      membersRes,
      heroRes,
      faqsRes,
      statsRes,
      communityRes,
      partnersRes,
      missionRes,
    ] = await Promise.all([
      supabase.from("events").select("*").order("date", { ascending: false }),
      supabase.from("members").select("*"),
      supabase.from("hero_images").select("image_url"),
      supabase.from("faqs").select("*"),
      supabase.from("stats").select("*").order("id"),
      supabase.from("community_cards").select("*"),
      supabase.from("partners").select("*").order("id"),
      supabase.from("mission_items").select("*").order("id"),
    ]);

    if (!eventsRes.error && eventsRes.data) dbEvents = eventsRes.data;
    if (!membersRes.error && membersRes.data) dbMembers = membersRes.data;
    if (!heroRes.error && heroRes.data) dbHeroImages = heroRes.data.map((r) => r.image_url);
    if (!faqsRes.error && faqsRes.data) dbFAQs = faqsRes.data;
    if (!statsRes.error && statsRes.data) dbStats = statsRes.data;
    if (!communityRes.error && communityRes.data) dbCommunityCards = communityRes.data;
    if (!partnersRes.error && partnersRes.data) dbPartners = partnersRes.data;
    if (!missionRes.error && missionRes.data) dbMissionItems = missionRes.data;
  } catch (error) {
    console.error("Supabase failed to initialize or fetch data:", error);
  }

  try {
    formOptions = await getFormOptions();
  } catch (error) {
    console.error("Failed to fetch form options:", error);
  }

  return (
    <main className="w-full overflow-x-clip">
      <div className="relative z-[1]">
        <section id="hero" className="sticky top-0 z-0 h-[100dvh] min-h-[600px] overflow-x-clip">
          <Hero images={dbHeroImages} formOptions={formOptions} />
        </section>

        <div
          className="relative z-[1] bg-background"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent, black 200px)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent, black 200px)",
          }}
        >
          <section id="mission">
            <Mission items={dbMissionItems} />
          </section>
          <section id="stats">
            <Stats stats={dbStats} />
          </section>
          <section id="events">
            <Events events={dbEvents} />
          </section>
          <section id="members">
            <Members members={dbMembers} />
          </section>
          <section id="ecosystem">
            <Ecosystem partners={dbPartners} />
          </section>
          <section id="community">
            <Community cards={dbCommunityCards} />
          </section>
          <section id="faq">
            <FAQ items={dbFAQs} />
          </section>
          <section id="join">
            <JoinCTA />
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
