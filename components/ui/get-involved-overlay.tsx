"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  animate,
} from "framer-motion";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconX,
  IconLoader2,
} from "@tabler/icons-react";
import { submitGetInvolvedForm } from "@/app/get-involved/actions";

function LogoShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32.6944 4.90892H41.4468V8.28973C41.4468 12.8741 37.742 16.5795 33.1571 16.5795H32.6938L32.6944 4.90892ZM20.2372 0H32.6944V31.9071H31.2127C22.1822 31.9071 20.3765 25.6088 20.3765 20.0055L20.2372 0ZM0 7.22433C0 12.9205 4.07522 15.0043 8.61369 15.6993H0V32H8.28973C16.6252 32 17.5978 28.2952 17.5978 24.7757C17.5978 20.4688 14.6338 17.459 10.0495 16.3007H17.5978V0H9.30807C0.972554 0 0 3.70477 0 7.22433Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

const initialFormData: FormData = {
  name: "", email: "", location: "", role: "", skills: [],
  experience: "", twitter: "", github: "", portfolio: "", goals: "",
};

function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            animate={{
              scale: index === currentStep ? 1.1 : 1,
              backgroundColor: index < currentStep ? "#00A896" : index === currentStep ? "#B54B33" : "#1E1412",
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          >
            {index < currentStep ? <IconCheck className="w-5 h-5" /> : index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className="w-12 md:w-20 h-0.5 mx-2">
              <motion.div className="h-full" animate={{ backgroundColor: index < currentStep ? "#00A896" : "#1E1412" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export interface LogoRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function GetInvolvedOverlay({
  logoRect,
  onClose,
  heroImages = [],
  roles = [],
  skillOptions = [],
  experienceLevels = [],
  locations = [],
}: {
  logoRect: LogoRect;
  onClose: () => void;
  heroImages?: string[];
  roles?: string[];
  skillOptions?: string[];
  experienceLevels?: string[];
  locations?: { label: string; value: string }[];
}) {
  const logoScale = useMotionValue(1);
  const logoOpacity = useMotionValue(1);
  const overlayOpacity = useMotionValue(0);
  const bgScale = useMotionValue(1.15);
  const [contentVisible, setContentVisible] = useState(false);
  const isClosingRef = useRef(false);

  const bgImageRef = useRef(
    heroImages.length > 0
      ? heroImages[Math.floor(Math.random() * heroImages.length)]
      : "/images/hero/ Uluru.jpg"
  );

  // Form state
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateField = (field: keyof FormData, value: string | string[]) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const toggleSkill = (skill: string) =>
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));

  const canAdvance = () => {
    if (currentStep === 0) return formData.name && formData.email && formData.location;
    if (currentStep === 1) return formData.role && formData.skills.length > 0 && formData.experience;
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


  useEffect(() => {
    const s = animate(logoScale, 80, {
      duration: 1.0,
      ease: [0.76, 0, 0.24, 1],
    });
    const lo = animate(logoOpacity, 0.2, {
      duration: 0.8,
      ease: "easeOut",
    });
    const o = animate(overlayOpacity, 1, {
      duration: 0.8,
      ease: "easeOut",
    });
    const bg = animate(bgScale, 1, {
      duration: 1.6,
      ease: [0.25, 1, 0.5, 1],
    });

    const fadeTimer = setTimeout(() => {
      animate(logoOpacity, 0, {
        duration: 0.35,
        ease: "easeOut",
        onComplete: () => setContentVisible(true),
      });
    }, 750);

    return () => { s.stop(); lo.stop(); o.stop(); bg.stop(); clearTimeout(fadeTimer); };
  }, []); 


  const handleClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setContentVisible(false);

    const step1Timer = setTimeout(() => {
      animate(logoOpacity, 0.2, {
        duration: 0.25,
        ease: "easeOut",
        onComplete: () => {
          animate(logoScale, 1, {
            duration: 1.0,
            ease: [0.76, 0, 0.24, 1],
          });
          animate(logoOpacity, 1, {
            duration: 0.7,
            ease: "easeOut",
          });
          animate(bgScale, 1.15, {
            duration: 1.0,
            ease: [0.76, 0, 0.24, 1],
          });
          animate(overlayOpacity, 0, {
            duration: 0.9,
            delay: 0.1,
            ease: "easeIn",
            onComplete: onClose,
          });
        },
      });
    }, 300);

    return () => clearTimeout(step1Timer);
  }, [onClose, logoScale, logoOpacity, overlayOpacity, bgScale]);

  if (submitted) {
    return createPortal(
      <div className="fixed inset-0 z-50">
        <motion.div className="fixed inset-0 z-[51]" style={{ opacity: overlayOpacity }}>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${bgImageRef.current})` }} />
          <div className="absolute inset-0 bg-background/90" />
        </motion.div>
        <div className="relative z-[52] min-h-screen flex items-center justify-center px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
              <IconCheck className="w-10 h-10 text-secondary" />
            </motion.div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Welcome to Superteam Australia!</h2>
            <p className="text-muted-foreground mb-8">Thanks for signing up, {formData.name}. We&apos;ll be in touch soon with opportunities matched to your profile.</p>
            <button onClick={handleClose} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-colors cursor-pointer">
              <IconArrowLeft className="w-4 h-4" /> Back to Home
            </button>
          </motion.div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <motion.div className="fixed inset-0 z-[51]" style={{ opacity: overlayOpacity }}>
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImageRef.current})`, scale: bgScale }}
        />
        <div className="absolute inset-0 bg-background/70" />
      </motion.div>

      <motion.div
        className="fixed z-[53] pointer-events-none will-change-transform"
        style={{
          left: logoRect.x,
          top: logoRect.y,
          width: logoRect.width,
          height: logoRect.height,
          scale: logoScale,
          opacity: logoOpacity,
          transformOrigin: "center center",
        }}
      >
        <LogoShape className="w-full h-full text-white" />
      </motion.div>

      <AnimatePresence>
        {contentVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="fixed top-6 right-6 z-[54] w-12 h-12 rounded-full border border-white/15 bg-muted/50 backdrop-blur-sm flex items-center justify-center text-foreground/70 hover:text-foreground hover:border-white/30 transition-colors cursor-pointer pt-safe"
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
            <div className="min-h-screen flex flex-col">
              <div className="px-6 pt-16 pb-4 sm:pt-20 md:pt-6">
                <button onClick={handleClose} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <IconArrowLeft className="w-4 h-4" /> Back to home
                </button>
              </div>

              <div className="flex-1 flex items-center justify-center px-4 pb-12 sm:pb-16">
                <div className="w-full max-w-2xl">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Get Involved</h1>
                    <p className="text-muted-foreground">Join the Superteam Australia ecosystem</p>
                  </motion.div>

                  <StepIndicator currentStep={currentStep} totalSteps={steps.length} />

                  <div className="bg-muted/60 border border-border rounded-2xl p-6 md:p-8 backdrop-blur-md">
                    <h3 className="text-lg font-semibold text-foreground mb-6">{steps[currentStep]}</h3>

                    <AnimatePresence mode="wait">
                      {currentStep === 0 && (
                        <motion.div key="step-0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Name *</label>
                            <input type="text" value={formData.name} onChange={(e) => updateField("name", e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                            <input type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Location *</label>
                            <select value={formData.location} onChange={(e) => updateField("location", e.target.value)} className="w-full px-4 pr-10 py-3 rounded-xl bg-background/50 border border-border text-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors appearance-none bg-[length:16px_16px] bg-[position:right_12px_center] bg-no-repeat" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")` }}>
                              <option value="">Select your city</option>
                              {locations.map((loc) => (
                                <option key={loc.value} value={loc.value}>{loc.label}</option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 1 && (
                        <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-7">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-3">Role / Area *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {roles.map((role) => (
                                <button key={role} type="button" onClick={() => updateField("role", role)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.role === role ? "bg-primary/20 border-primary text-primary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}>
                                  {role}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-border/30 pt-6">
                            <label className="block text-sm font-medium text-foreground mb-3">Skills * <span className="text-muted-foreground font-normal">(select all that apply)</span></label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                              {skillOptions.map((skill) => (
                                <button key={skill} type="button" onClick={() => toggleSkill(skill)} className={`px-3 py-2 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.skills.includes(skill) ? "bg-secondary/20 border-secondary text-secondary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}>
                                  {skill}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="border-t border-border/30 pt-6">
                            <label className="block text-sm font-medium text-foreground mb-3">Experience Level *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                              {experienceLevels.map((level) => (
                                <button key={level} type="button" onClick={() => updateField("experience", level)} className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 cursor-pointer ${formData.experience === level ? "bg-secondary/20 border-secondary text-secondary" : "bg-background/50 border-border text-muted-foreground hover:border-foreground/30"}`}>
                                  {level}
                                </button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {currentStep === 2 && (
                        <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Twitter/X</label>
                            <input type="text" value={formData.twitter} onChange={(e) => updateField("twitter", e.target.value)} placeholder="@handle" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">GitHub</label>
                            <input type="text" value={formData.github} onChange={(e) => updateField("github", e.target.value)} placeholder="github.com/username" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Portfolio</label>
                            <input type="text" value={formData.portfolio} onChange={(e) => updateField("portfolio", e.target.value)} placeholder="https://yoursite.com" className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">What are you looking for?</label>
                            <textarea value={formData.goals} onChange={(e) => updateField("goals", e.target.value)} placeholder="Tell us what you're hoping to find in the Superteam Australia ecosystem..." rows={4} className="w-full px-4 py-3 rounded-xl bg-background/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors resize-none" />
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
                      <button onClick={() => currentStep === 0 ? handleClose() : setCurrentStep((p) => p - 1)} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        <IconArrowLeft className="w-4 h-4" /> {currentStep === 0 ? "Close" : "Back"}
                      </button>
                      {currentStep < steps.length - 1 ? (
                        <button onClick={() => setCurrentStep((p) => p + 1)} disabled={!canAdvance() || isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                          Continue <IconArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button onClick={handleSubmit} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-white text-sm font-semibold hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                          {isSubmitting ? (
                            <>Submitting... <IconLoader2 className="w-4 h-4 animate-spin" /></>
                          ) : (
                            <>Submit <IconCheck className="w-4 h-4" /></>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  );
}
