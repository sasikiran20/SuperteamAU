"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStairsNavigation } from "@/components/transitions/stairs-transition";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconHome,
  IconLoader2,
} from "@tabler/icons-react";
import { submitGetInvolvedForm } from "./actions";
import { createClient } from "@/lib/supabase/client";

const steps = ["Basic Info", "Skills & Experience", "Goals & Links"];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors";

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

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              backgroundColor:
                index < currentStep
                  ? "#00A896"
                  : index === currentStep
                    ? "#B54B33"
                    : "#1E1412",
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          >
            {index < currentStep ? (
              <IconCheck className="w-5 h-5" />
            ) : (
              index + 1
            )}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className="w-12 md:w-20 h-0.5 mx-2">
              <motion.div
                className="h-full"
                animate={{
                  backgroundColor:
                    index < currentStep ? "#00A896" : "#1E1412",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function GetInvolved() {
  const { navigateWithStairs } = useStairsNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [skillOptions, setSkillOptions] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<{ label: string; value: string }[]>([]);
  const [bgImage, setBgImage] = useState<string>("");
  const [imgLoaded, setImgLoaded] = useState(false);

  const [formData, setFormData] = useState<FormData>({
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
  });

  useEffect(() => {
    async function fetchFormData() {
      try {
        const supabase = createClient();

        const [optionsRes, heroRes] = await Promise.all([
          supabase
            .from("form_options")
            .select("category, label, value, sort_order")
            .order("sort_order", { ascending: true }),
          supabase.from("hero_images").select("image_url"),
        ]);

        if (!optionsRes.error && optionsRes.data) {
          const options = optionsRes.data;
          setRoles(options.filter((o) => o.category === "role").map((o) => o.value));
          setSkillOptions(options.filter((o) => o.category === "skill").map((o) => o.value));
          setExperienceLevels(options.filter((o) => o.category === "experience_level").map((o) => o.value));
          setLocations(
            options
              .filter((o) => o.category === "location")
              .map((o) => ({ label: o.label, value: o.value }))
          );
        }

        if (!heroRes.error && heroRes.data && heroRes.data.length > 0) {
          const images = heroRes.data.map((r) => r.image_url);
          setHeroImages(images);
          setBgImage(images[Math.floor(Math.random() * images.length)]);
        } else {
          setImgLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setImgLoaded(true);
      }
    }

    fetchFormData();
  }, []);

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const canAdvance = () => {
    if (currentStep === 0) {
      return formData.name && formData.email && formData.location;
    }
    if (currentStep === 1) {
      return formData.role && formData.skills.length > 0 && formData.experience;
    }
    return true;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    const result = await submitGetInvolvedForm(formData);

    setIsSubmitting(false);

    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error || "Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="relative min-h-screen">
        <div className="fixed inset-0 -z-10 bg-background">
          {bgImage && (
            <Image
              src={bgImage}
              alt="Background"
              fill
              priority
              className={`object-cover object-center transition-opacity duration-1000 ${imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          )}
          <div className="absolute inset-0 bg-background/90" />
        </div>
        <div className="relative min-h-screen flex items-center justify-center px-4">
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
              Thanks for signing up, {formData.name}. We&apos;ll be in touch
              soon with opportunities matched to your profile.
            </p>
            <button
              onClick={() => navigateWithStairs("/", "#join")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <IconHome className="w-4 h-4" />
              Back to Home
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 bg-background">
        {bgImage && (
          <Image
            src={bgImage}
            alt="Background"
            fill
            priority
            className={`object-cover object-center transition-opacity duration-1000 ${imgLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        )}
        <div className="absolute inset-0 bg-background/70" />
      </div>

      <motion.div
        animate={{ opacity: imgLoaded ? 1 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative min-h-screen flex flex-col"
      >
        <div className="px-6 pt-4 md:pt-6 pb-4 relative z-10">
          <button
            onClick={() => navigateWithStairs("/", "#join")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <IconArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 pb-12 sm:pb-16">
          <div className="w-full max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Get Involved
              </h1>
              <p className="text-muted-foreground">
                Join the Superteam Australia ecosystem
              </p>
            </motion.div>

            <StepIndicator
              currentStep={currentStep}
              totalSteps={steps.length}
            />

            <div className="bg-muted/60 border border-border rounded-2xl p-6 md:p-8 backdrop-blur-md">
              <h3 className="text-lg font-semibold text-foreground mb-6">
                {steps[currentStep]}
              </h3>

              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div
                    key="step-0"
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
                        value={formData.name}
                        onChange={(e) => updateField("name", e.target.value)}
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
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="you@example.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Location *
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) =>
                          updateField("location", e.target.value)
                        }
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

                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
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
                        {roles.map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => updateField("role", role)}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.role === role
                              ? "bg-primary/20 border-primary text-primary"
                              : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"
                              }`}
                          >
                            {role}
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
                        {skillOptions.map((skill) => (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.skills.includes(skill)
                              ? "bg-secondary/20 border-secondary text-secondary"
                              : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"
                              }`}
                          >
                            {skill}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-6">
                      <label className="block text-sm font-medium text-foreground mb-3">
                        Experience Level *
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {experienceLevels.map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => updateField("experience", level)}
                            className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.experience === level
                              ? "bg-secondary/20 border-secondary text-secondary"
                              : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"
                              }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
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
                        value={formData.twitter}
                        onChange={(e) => updateField("twitter", e.target.value)}
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
                        value={formData.github}
                        onChange={(e) => updateField("github", e.target.value)}
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
                        value={formData.portfolio}
                        onChange={(e) =>
                          updateField("portfolio", e.target.value)
                        }
                        placeholder="https://yoursite.com"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        What are you looking for?
                      </label>
                      <textarea
                        value={formData.goals}
                        onChange={(e) => updateField("goals", e.target.value)}
                        placeholder="Tell us what you're hoping to find in the Superteam Australia ecosystem..."
                        rows={4}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {submitError && (
                <div className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                  {submitError}
                </div>
              )}

              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                <button
                  onClick={() =>
                    currentStep === 0
                      ? navigateWithStairs("/")
                      : setCurrentStep((prev) => prev - 1)
                  }
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <IconArrowLeft className="w-4 h-4" />
                  {currentStep === 0 ? "Close" : "Back"}
                </button>

                {currentStep < steps.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={!canAdvance() || isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Continue
                    <IconArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        Submitting...
                        <IconLoader2 className="w-4 h-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Submit
                        <IconCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
