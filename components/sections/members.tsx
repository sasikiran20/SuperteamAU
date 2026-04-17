"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { ScalingSlidingCards } from "@/components/ui/scaling-sliding-cards";
import { ProfileCard } from "@/components/ui/profile-card";
import { badgeConfig, roleConfig } from "@/lib/constants";
import { type Member } from "@/types";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useStairsNavigation } from "@/components/transitions/stairs-transition";
import CircularText from "@/components/ui/circular-text";
import { IconBrandX, IconX, IconArrowRight } from "@tabler/icons-react";

const cardEnter = {
  hidden: { opacity: 0, scale: 0.88, y: 40, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring" as const,
      damping: 22,
      stiffness: 200,
      mass: 0.9,
      staggerChildren: 0.07,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.92,
    y: 30,
    filter: "blur(4px)",
    transition: {
      type: "spring" as const,
      damping: 26,
      stiffness: 280,
      staggerChildren: 0.03,
      staggerDirection: -1 as const,
    },
  },
};

const childFade = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 24, stiffness: 260 },
  },
  exit: { opacity: 0, y: 8, transition: { duration: 0.15 } },
};

function ExpandedMemberCard({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, onClose);

  return (
    <div className="fixed inset-0 grid place-items-center z-[100]">
      <motion.div
        ref={ref}
        variants={cardEnter}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-[520px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-muted border border-border/60 sm:rounded-3xl overflow-hidden"
      >
        <motion.button
          variants={childFade}
          className="absolute top-4 right-4 flex items-center justify-center bg-background/70 backdrop-blur-sm border border-border rounded-full h-8 w-8 z-10 hover:bg-background transition-colors"
          onClick={onClose}
        >
          <IconX className="h-4 w-4 text-foreground" />
        </motion.button>

        <motion.img
          variants={childFade}
          width={520}
          height={320}
          src={member.avatar}
          alt={member.name}
          className="w-full h-56 sm:h-72 lg:h-80 sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top"
        />

        <div>
          <motion.div variants={childFade} className="flex justify-between items-start p-5">
            <div>
              <h3 className="font-bold text-foreground text-lg">
                {member.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                {member.role} &middot; {member.company}
              </p>
            </div>

            <a
              href={member.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm rounded-full font-semibold bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <IconBrandX className="w-3.5 h-3.5" />
              Follow
            </a>
          </motion.div>

          <motion.div variants={childFade} className="px-5 pb-3 flex flex-wrap gap-2">
            {member.badges.map((badge) => {
              const cfg = badgeConfig[badge];
              return (
                <span
                  key={badge}
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${cfg?.color || ''}`}
                >
                  {cfg?.emoji} {badge}
                </span>
              );
            })}
          </motion.div>

          <motion.div variants={childFade} className="px-5 pb-3 flex flex-wrap gap-2">
            {member.skills.map((skill) => (
              <span
                key={skill}
                className={`text-xs px-2.5 py-1 rounded-full border font-medium ${roleConfig[skill] || ''}`}
              >
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div variants={childFade} className="pt-2 relative px-5">
            <div className="text-muted-foreground text-sm leading-relaxed h-40 md:h-fit pb-8 overflow-auto [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
              <p>{member.bio}</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function ExploreCircle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex h-[200px] w-[200px] shrink-0 cursor-pointer items-center justify-center"
      aria-label="Explore all members"
    >
      <CircularText
        text="· EXPLORE ALL MEMBERS · EXPLORE ALL MEMBERS "
        spinDuration={15}
        onHover="speedUp"
        fontSize={14}
        className="h-[200px] w-[200px] text-accent/90 tracking-wider uppercase"
      />
      <div className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-accent transition-transform duration-300 group-hover:scale-110">
        <IconArrowRight className="h-6 w-6 text-background" />
      </div>
    </button>
  );
}

export default function Members({ members }: { members: Member[] }) {
  const [active, setActive] = useState<Member | null>(null);
  const { navigateWithStairs } = useStairsNavigation();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <section className="relative bg-background pb-24 md:pb-36">
      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 bg-background/60 h-full w-full z-[90]"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active && (
          <ExpandedMemberCard
            key={active.name}
            member={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>

      <div className="hidden md:block">
        <ScalingSlidingCards
          gap={36}
          minScale={0.7}
          maxScale={1}
          minOpacity={0.35}
          scrubSpeed={1}
          header={
            <div className="max-w-7xl mx-auto px-4 pt-10 md:pt-14 pb-2">
              <ScrollReveal
                tag="h2"
                baseRotation={3}
                blurStrength={4}
                baseOpacity={0.3}
                wordAnimationEnd="top bottom-=40%"
                containerClassName="mb-4"
                textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold text-center"
              >
                Members
              </ScrollReveal>
              <ScrollReveal
                tag="div"
                baseRotation={3}
                blurStrength={6}
                baseOpacity={0.3}
                wordAnimationEnd="top center"
                containerClassName="max-w-3xl mx-auto"
                textClassName="text-3xl md:text-5xl font-bold text-foreground leading-tight text-center"
              >
                Ecosystem Talent
              </ScrollReveal>
            </div>
          }
        >
          {members.slice(0, 6).map((member) => (
            <ProfileCard
              key={member.name}
              avatarUrl={member.avatar}
              name={member.name}
              title={member.role}
              handle={member.handle}
              status="Active"
              behindGlowColor="rgba(225, 198, 153, 0.38)"
              enableTilt={true}
              showUserInfo={true}
              contactText="View"
              onClick={() => setActive(member)}
            />
          ))}
          <ExploreCircle onClick={() => navigateWithStairs("/members")} />
        </ScalingSlidingCards>
      </div>

      <div className="md:hidden px-4 pt-16 sm:pt-24 pb-4">
        <ScrollReveal
          tag="h2"
          baseRotation={0}
          blurStrength={4}
          baseOpacity={0.3}
          wordAnimationEnd="top bottom-=40%"
          containerClassName="mb-4"
          textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold text-center"
        >
          Members
        </ScrollReveal>
        <ScrollReveal
          tag="div"
          baseRotation={0}
          blurStrength={6}
          baseOpacity={0.3}
          wordAnimationEnd="top center"
          containerClassName="max-w-3xl mx-auto"
          textClassName="text-3xl md:text-5xl font-bold text-foreground leading-tight text-center"
        >
          Ecosystem Talent
        </ScrollReveal>
      </div>
      <div className="md:hidden px-4 space-y-6 sm:space-y-8">
        {members.slice(0, 6).map((member) => (
          <div key={member.name} className="flex justify-center">
            <ProfileCard
              avatarUrl={member.avatar}
              name={member.name}
              title={member.role}
              handle={member.handle}
              status="Active"
              behindGlowColor="rgba(181, 75, 51, 0.28)"
              enableTilt={false}
              showUserInfo={true}
              contactText="View"
              onClick={() => setActive(member)}
            />
          </div>
        ))}
        <div className="flex justify-center pt-4">
          <ExploreCircle onClick={() => navigateWithStairs("/members")} />
        </div>
      </div>
    </section>
  );
}
