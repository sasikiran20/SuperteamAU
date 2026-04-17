"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import { createClient } from "@/lib/supabase/client";

const NUM_COLS = 5;
const COL_DURATION = 0.55;
const COL_STAGGER = 0.08;

const steps = ["Basic Info", "Skills & Experience", "Goals & Links"];

interface FormData {
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
}

const blankForm: FormData = {
  name: "",
  email: "",
  location: "",
  role: "",
  skills: [],
  experience: "",
  twitter: "",
  github: "",
  portfolio: "",
  goals: "",
};

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors";

function StepIndicator({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center">
          <motion.div
            animate={{
              scale: i === current ? 1.1 : 1,
              backgroundColor:
                i < current
                  ? "#00A896"
                  : i === current
                    ? "#B54B33"
                    : "#1E1412",
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          >
            {i < current ? <IconCheck className="w-5 h-5" /> : i + 1}
          </motion.div>
          {i < total - 1 && (
            <div className="w-12 md:w-20 h-0.5 mx-2">
              <motion.div
                className="h-full"
                animate={{
                  backgroundColor: i < current ? "#00A896" : "#1E1412",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


export function StairsOverlay({ onClose }: { onClose: () => void }) {
  const colsRef = useRef<HTMLDivElement>(null);
  const [contentVisible, setContentVisible] = useState(false);
  const closingRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);

  const [bgImage, setBgImage] = useState<string>("");

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        const [optionsRes, heroRes] = await Promise.all([
          supabase.from("form_options").select("category, label, value, sort_order").order("sort_order", { ascending: true }),
          supabase.from("hero_images").select("image_url"),
        ]);
        if (!optionsRes.error && optionsRes.data) {
          const opts = optionsRes.data;
          setRoles(opts.filter((o) => o.category === "role").map((o) => o.value));
          setSkillOptions(opts.filter((o) => o.category === "skill").map((o) => o.value));
          setExperienceLevels(opts.filter((o) => o.category === "experience_level").map((o) => o.value));
          setLocations(opts.filter((o) => o.category === "location").map((o) => ({ label: o.label, value: o.value })));
        }
        if (!heroRes.error && heroRes.data && heroRes.data.length > 0) {
          const imgs = heroRes.data.map((r) => r.image_url);
          setHeroImages(imgs);
          setBgImage(imgs[Math.floor(Math.random() * imgs.length)]);
        }
      } catch (e) {
        console.error("StairsOverlay: Error fetching form data", e);
      }
    }
    fetchData();
  }, []);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormData>(blankForm);

  const set = (k: keyof FormData, v: string | string[]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleSkill = (s: string) =>
    setForm((p) => ({
      ...p,
      skills: p.skills.includes(s)
        ? p.skills.filter((x) => x !== s)
        : [...p.skills, s],
    }));

  const canNext = () => {
    if (step === 0) return form.name && form.email && form.location;
    if (step === 1)
      return form.role && form.skills.length > 0 && form.experience;
    return true;
  };

  useEffect(() => {
    const scrollY = window.scrollY;
    const lenis = window.__lenis;
    lenis?.stop();

    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, []);

  const runStairs = useCallback(
    (onMid: () => void, onDone?: () => void) => {
      const el = colsRef.current;
      if (!el) {
        onMid();
        onDone?.();
        return;
      }
      const cols = Array.from(el.children) as HTMLElement[];

      gsap.set(cols, { height: 0, top: 0, force3D: true });

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(cols, {
        height: "100vh",
        duration: COL_DURATION,
        stagger: COL_STAGGER,
        ease: "power3.inOut",
      })
        .call(() => onMid(), [], "+=0.15")
        .to(cols, {
          top: "100vh",
          duration: COL_DURATION,
          stagger: COL_STAGGER,
          ease: "power3.inOut",
        })
        .set(cols, { height: 0, top: 0 })
        .call(() => onDone?.());
    },
    []
  );

  useEffect(() => {
    runStairs(() => setContentVisible(true));
    return () => {
      tlRef.current?.kill();
    };
  }, [runStairs]);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    runStairs(
      () => setContentVisible(false),
      () => onClose()
    );
  }, [onClose, runStairs]);

  return (
    <div className="fixed inset-0 z-50">

      <div
        className="fixed inset-0 z-[51]"
        style={{ visibility: contentVisible ? "visible" : "hidden" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          className={`absolute inset-0 transition-colors duration-500 ${submitted ? "bg-background/95" : "bg-background/90"}`}
        />
      </div>

      <div
        ref={colsRef}
        className="fixed inset-0 z-[55] flex items-start pointer-events-none"
      >
        {Array.from({ length: NUM_COLS }).map((_, i) => (
          <div key={i} className="flex-1 h-0 bg-background relative will-change-transform" />
        ))}
      </div>

      <AnimatePresence>
        {contentVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed top-6 right-6 z-[54] w-12 h-12 rounded-full border border-white/15 bg-muted/50 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-white/30 transition-colors cursor-pointer"
          >
            <IconX className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {contentVisible && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.45, ease: [0.25, 1, 0.5, 1] }}
            className="fixed inset-0 z-[52] overflow-y-auto will-change-transform"
          >
            {submitted ? (
              <SuccessScreen
                name={form.name}
                onBack={handleClose}
              />
            ) : (
              <FormScreen
                step={step}
                form={form}
                set={set}
                toggleSkill={toggleSkill}
                canNext={canNext}
                setStep={setStep}
                roles={roles}
                skillOptions={skillOptions}
                experienceLevels={experienceLevels}
                locations={locations}
                onSubmit={() => {
                  console.log("Form submitted:", form);
                  setSubmitted(true);
                }}
                onClose={handleClose}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


function SuccessScreen({
  name,
  onBack,
}: {
  name: string;
  onBack: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6"
        >
          <IconCheck className="w-10 h-10 text-secondary" />
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Welcome to Superteam Australia!
        </h2>
        <p className="text-muted-foreground mb-8">
          Thanks for signing up, {name}. We&apos;ll be in touch soon with
          opportunities matched to your profile.
        </p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4" /> Back to Home
        </button>
      </motion.div>
    </div>
  );
}


function FormScreen({
  step,
  form,
  set,
  toggleSkill,
  canNext,
  setStep,
  roles,
  skillOptions,
  experienceLevels,
  locations,
  onSubmit,
  onClose,
}: {
  step: number;
  form: FormData;
  set: (k: keyof FormData, v: string | string[]) => void;
  toggleSkill: (s: string) => void;
  canNext: () => string | boolean;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  roles: string[];
  skillOptions: string[];
  experienceLevels: string[];
  locations: { label: string; value: string }[];
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 pt-20 pb-4 md:pt-6">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4" /> Back to home
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Get Involved
            </h1>
            <p className="text-muted-foreground">
              Join the Superteam Australia ecosystem
            </p>
          </motion.div>

          <StepIndicator current={step} total={steps.length} />

          <div className="bg-muted/60 border border-border rounded-2xl p-6 md:p-8 backdrop-blur-md">
            <h3 className="text-lg font-semibold text-foreground mb-6">
              {steps[step]}
            </h3>

            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="s0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="Your full name"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Location *
                    </label>
                    <select
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                      className={`${inputCls} appearance-none bg-[length:16px_16px] bg-[position:right_12px_center] bg-no-repeat pr-10`}
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      }}
                    >
                      <option value="">Select your city</option>
                      {locations.map((loc) => (
                        <option key={loc.value} value={loc.value}>
                          {loc.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-7"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Role / Area *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {roles.map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => set("role", r)}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${form.role === r ? "bg-primary/20 border-primary text-primary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Skills *{" "}
                      <span className="text-muted-foreground font-normal">
                        (select all that apply)
                      </span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {skillOptions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleSkill(s)}
                          className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${form.skills.includes(s) ? "bg-secondary/20 border-secondary text-secondary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-6">
                    <label className="block text-sm font-medium text-foreground mb-3">
                      Experience Level *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {experienceLevels.map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => set("experience", l)}
                          className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${form.experience === l ? "bg-secondary/20 border-secondary text-secondary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-5"
                >
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Twitter/X
                    </label>
                    <input
                      type="text"
                      value={form.twitter}
                      onChange={(e) => set("twitter", e.target.value)}
                      placeholder="@handle"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      GitHub
                    </label>
                    <input
                      type="text"
                      value={form.github}
                      onChange={(e) => set("github", e.target.value)}
                      placeholder="github.com/username"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Portfolio
                    </label>
                    <input
                      type="text"
                      value={form.portfolio}
                      onChange={(e) => set("portfolio", e.target.value)}
                      placeholder="https://yoursite.com"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      What are you looking for?
                    </label>
                    <textarea
                      value={form.goals}
                      onChange={(e) => set("goals", e.target.value)}
                      placeholder="Tell us what you're hoping to find in the Superteam Australia ecosystem..."
                      rows={4}
                      className={`${inputCls} resize-none`}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
              <button
                onClick={() =>
                  step === 0 ? onClose() : setStep((p) => p - 1)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <IconArrowLeft className="w-4 h-4" />{" "}
                {step === 0 ? "Close" : "Back"}
              </button>
              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep((p) => p + 1)}
                  disabled={!canNext()}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Continue <IconArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={onSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 transition-colors cursor-pointer"
                >
                  Submit <IconCheck className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
