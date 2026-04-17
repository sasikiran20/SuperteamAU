"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  IconSearch,
  IconBrandX,
  IconArrowLeft,
  IconX,
  IconSparkles,
} from "@tabler/icons-react";
import { type Member, type MemberRole } from "@/types";
import { roleConfig } from "@/lib/constants";
import { useStairsNavigation } from "@/components/transitions/stairs-transition";

const ALL_ROLES: MemberRole[] = ["Developer", "Designer", "Content", "BizDev", "Founder", "Operator"];

const GRADIENT_MAP: Record<string, string> = {
  Developer: "from-secondary/60 via-secondary/20 to-transparent",
  Designer: "from-primary/60 via-primary/20 to-transparent",
  Content: "from-accent/60 via-accent/20 to-transparent",
  BizDev: "from-white/10 via-white/5 to-transparent",
  Founder: "from-purple-500/60 via-purple-500/20 to-transparent",
  Operator: "from-blue-500/60 via-blue-500/20 to-transparent",
};

function MemberCard({
  member,
  index,
}: {
  member: Member;
  index: number;
}) {
  const primaryRole = member.skills?.[0] || 'Developer';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        layout: { type: "spring", damping: 30, stiffness: 300 },
        opacity: { duration: 0.25, delay: index * 0.02 },
        scale: { duration: 0.25, delay: index * 0.02 },
      }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-muted/40 backdrop-blur-sm transition-[border-color,background-color,box-shadow] duration-300 hover:border-accent/25 hover:bg-muted/60 hover:shadow-xl hover:shadow-accent/[0.04]"
    >
      <div
        className={`h-[2px] w-full bg-gradient-to-r ${GRADIENT_MAP[primaryRole] ?? "from-accent/40 to-transparent"}`}
      />

      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/[0.06] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative p-5">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <img
              src={member.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80"}
              alt={member.name}
              className="h-14 w-14 rounded-full object-cover ring-[1.5px] ring-border/50 transition-all duration-300 group-hover:ring-accent/40 group-hover:shadow-lg group-hover:shadow-accent/10"
            />
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-muted bg-emerald-500" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[15px] font-semibold text-foreground transition-colors group-hover:text-accent">
                  {member.name}
                </h3>
                <p className="truncate text-sm text-muted-foreground">
                  {member.role}
                </p>
              </div>
              <a
                href={member.twitter || `https://twitter.com/${member.handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-background/30 text-muted-foreground transition-all duration-200 hover:border-foreground/20 hover:bg-background/60 hover:text-foreground"
                aria-label={`${member.name} on X`}
              >
                <IconBrandX className="h-3.5 w-3.5" />
              </a>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground/70">
              {member.company}
            </p>
          </div>
        </div>

        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {member.skills?.map((skill) => (
            <span
              key={skill}
              className={`rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${roleConfig[skill] || 'border-border/30 text-foreground'}`}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function MembersClient({ members }: { members: Member[] }) {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<MemberRole>>(
    new Set()
  );
  const { navigateWithStairs } = useStairsNavigation();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleFilter = useCallback((role: MemberRole) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters(new Set());
    setSearch("");
  }, []);

  const filtered = useMemo(() => {
    let result = members;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.role?.toLowerCase().includes(q) ||
          m.company?.toLowerCase().includes(q) ||
          m.skills?.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (activeFilters.size > 0) {
      result = result.filter((m) =>
        m.skills?.some((s) => activeFilters.has(s))
      );
    }

    return result;
  }, [search, activeFilters, members]);

  const hasActiveFilters = activeFilters.size > 0 || search.trim().length > 0;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="/images/hero/ Uluru.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.03]"
          style={{ filter: "blur(60px) saturate(1.5)" }}
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-background/90" />
        <div
          className="absolute left-[-15%] top-[-10%] h-[600px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(181,75,51,0.12) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute right-[-10%] top-[20%] h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(225,198,153,0.08) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[25%] h-[500px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,168,150,0.06) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(245,237,230,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative overflow-hidden border-b border-border/30">
        <div className="mx-auto max-w-6xl px-4 pb-8 pt-20 sm:px-6 sm:pt-24 md:pt-28">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateWithStairs("/", "#members")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50 bg-muted/50 text-foreground/70 backdrop-blur-sm transition-all hover:border-accent/30 hover:bg-muted hover:text-foreground"
              aria-label="Go back"
            >
              <IconArrowLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-accent">
                Directory
              </span>
            </div>
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
            Our{" "}
            <span className="text-accent">
              Members
            </span>
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground sm:text-lg">
            Discover the builders, designers, and leaders powering the Solana
            ecosystem across Australia.
          </p>

          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground/80">
            <IconSparkles className="h-4 w-4 text-accent" />
            <span>
              <span className="font-semibold text-foreground">
                {members.length}
              </span>{" "}
              members across{" "}
              <span className="font-semibold text-foreground">
                {ALL_ROLES.length}
              </span>{" "}
              disciplines
            </span>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-border/30 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="group/search relative">
            <div className="pointer-events-none absolute -inset-[1px] rounded-xl bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 blur-sm transition-opacity duration-300 group-focus-within/search:opacity-100" />
            <div className="relative flex items-center gap-3 rounded-xl border border-border/50 bg-muted/50 px-4 backdrop-blur-sm transition-all duration-300 group-focus-within/search:border-accent/30 group-focus-within/search:bg-muted/70">
              <IconSearch className="h-4 w-4 shrink-0 text-muted-foreground/60" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
              />
              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
                >
                  <IconX className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden shrink-0 rounded-md border border-border/60 bg-background/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60 sm:inline-block">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ALL_ROLES.map((role) => {
              const isActive = activeFilters.has(role);
              return (
                <button
                  key={role}
                  onClick={() => toggleFilter(role)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? `${roleConfig[role]} shadow-sm`
                      : "border-border/40 bg-transparent text-muted-foreground/80 hover:border-border/70 hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              );
            })}
            <AnimatePresence>
              {hasActiveFilters && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={clearFilters}
                  className="rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  Clear all
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mx-auto max-w-6xl px-4 pt-5 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {filtered.length}
            </span>{" "}
            member{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 pb-20 sm:pb-24 pt-6 sm:px-6">
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((member, i) => (
              <MemberCard
                key={member.name}
                member={member}
                index={i}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-muted/50">
              <IconSearch className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-lg font-semibold text-foreground/80">
              No members found
            </p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </p>
            <button
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-border/50 bg-muted/50 px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:border-accent/30 hover:bg-muted"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
