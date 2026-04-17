"use client";

import {
  motion,
  useInView,
  useSpring,
  useMotionValue,
} from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import Particles from "@/components/ui/particles";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { CreativeButton } from "@/components/ui/creative-button";
import { useStairsNavigation } from "@/components/transitions/stairs-transition";
import {
  IconBrandTelegram,
  IconBrandDiscord,
  IconBrandX,
} from "@tabler/icons-react";


function MagneticWrap({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  if (disabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      className="relative"
      onMouseMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <motion.div style={{ x: springX, y: springY }}>{children}</motion.div>
    </div>
  );
}


function UnizoyLink({
  href,
  children,
  className = "",
  circleColor = "bg-white/10",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  circleColor?: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const [circleSize, setCircleSize] = useState(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const updateSize = () => {
      const w = btn.offsetWidth;
      const h = btn.offsetHeight;
      setCircleSize(Math.max(w, h) * 0.9);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [children]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const circle = circleRef.current;
    const btn = buttonRef.current;
    if (!circle || !btn) return;
    const rect = btn.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
  }, []);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    const circle = circleRef.current;
    const btn = buttonRef.current;
    if (!circle || !btn) return;
    const rect = btn.getBoundingClientRect();
    circle.style.left = `${e.clientX - rect.left}px`;
    circle.style.top = `${e.clientY - rect.top}px`;
    circle.classList.remove("hidden");
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(circle, {
      scale: 1,
      duration: 0.65,
      ease: "power3.out",
    });
  }, []);

  const handleMouseLeave = useCallback((e: React.MouseEvent) => {
    const circle = circleRef.current;
    const btn = buttonRef.current;
    if (!circle || !btn) return;
    const rect = btn.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    tweenRef.current?.kill();
    tweenRef.current = gsap.to(circle, {
      scale: 0,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => {
        circle.classList.add("hidden");
        circle.style.left = `${lx}px`;
        circle.style.top = `${ly}px`;
      },
    });
  }, []);

  return (
    <a
      ref={buttonRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative z-10 flex items-center justify-center gap-2.5 overflow-hidden rounded-full border px-7 py-3.5 font-semibold transition-colors duration-200 ${className}`}
    >
      <div
        ref={circleRef}
        className={`pointer-events-none absolute hidden rounded-full ${circleColor}`}
        style={{
          width: circleSize * 2,
          height: circleSize * 2,
          transform: "translate(-50%, -50%) scale(0)",
        }}
      />
      <span className="relative z-20 flex items-center gap-2.5">
        {children}
      </span>
    </a>
  );
}


export default function JoinCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { navigateWithStairs } = useStairsNavigation();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="relative py-20 sm:py-32 md:py-44 px-4 overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <Particles
            particleCount={isMobile ? 150 : 400}
            particleSpread={12}
            speed={0.03}
            particleColors={[
              "#ffffff",
              "#F5EDE6",
              "#E1C699",
              "#B54B33",
              "#ffffff",
              "#ffffff",
            ]}
            moveParticlesOnHover
            particleHoverFactor={1}
            alphaParticles={false}
            particleBaseSize={50}
            sizeRandomness={2}
            cameraDistance={22}
            disableRotation={false}
            className="w-full h-full"
          />
        </div>

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(16,11,10,0.6) 100%)",
          }}
        />

        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.22, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 top-1/4 w-[min(500px,90vw)] h-[min(500px,90vw)] rounded-full bg-primary/20 blur-[120px] z-[2] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.08, 0.18, 0.08],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute -right-32 bottom-1/4 w-[min(400px,80vw)] h-[min(400px,80vw)] rounded-full bg-secondary/15 blur-[100px] z-[2] pointer-events-none"
        />
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.06, 0.12, 0.06],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(600px,95vw)] h-[min(600px,95vw)] rounded-full bg-accent/10 blur-[150px] z-[2] pointer-events-none"
        />

        <div className="relative z-10 max-w-4xl mx-auto">
          <ScrollReveal
            tag="div"
            baseRotation={3}
            blurStrength={4}
            baseOpacity={0.3}
            wordAnimationEnd="top bottom-=40%"
            containerClassName="text-center mb-2"
            textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
          >
            Join Us
          </ScrollReveal>

          <ScrollReveal
            tag="div"
            baseRotation={2}
            blurStrength={6}
            baseOpacity={0.15}
            wordAnimationEnd="top bottom-=25%"
            containerClassName="text-center mb-16"
            textClassName="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
            renderWord={(word) =>
              word === "Future?" ? (
                <span className="bg-gradient-to-r from-primary via-accent to-primary/60 bg-clip-text text-transparent">
                  {word}
                </span>
              ) : (
                word
              )
            }
          >
            Ready to Build the Future?
          </ScrollReveal>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{
              duration: 0.9,
              delay: 0.2,
              ease: [0.25, 1, 0.5, 1],
            }}
          >
            <div className="cta-gradient-border rounded-3xl p-[1px]">
              <div
                className="rounded-3xl bg-background/80 backdrop-blur-xl px-5 py-8 sm:px-6 sm:py-10 md:px-14 md:py-14 text-center"
                style={{
                  boxShadow:
                    "0 0 80px rgba(181,75,51,0.08), 0 0 160px rgba(0,168,150,0.04)",
                }}
              >
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.45,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed"
                >
                  Join the Superteam Australia community and start building on
                  Solana today.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.55,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="flex justify-center"
                >
                  <MagneticWrap disabled={isTouchDevice}>
                    <CreativeButton
                      onClick={() => navigateWithStairs("/get-involved")}
                      fillClass="bg-primary"
                      textClass="text-white"
                      className="h-[56px] border-white/15 hover:shadow-[0_0_40px_rgba(181,75,51,0.5)]"
                    >
                      Get Involved
                    </CreativeButton>
                  </MagneticWrap>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.65 }}
                  className="flex items-center gap-4 my-8 md:my-10 max-w-sm mx-auto"
                >
                  <div className="flex-1 h-px bg-border/40" />
                  <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground/60 font-medium whitespace-nowrap">
                    or join the conversation
                  </span>
                  <div className="flex-1 h-px bg-border/40" />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.6,
                    delay: 0.75,
                    ease: [0.25, 1, 0.5, 1],
                  }}
                  className="flex flex-wrap justify-center gap-3 md:gap-4"
                >
                  <MagneticWrap disabled={isTouchDevice}>
                    <UnizoyLink
                      href="https://t.me/superteamau"
                      className="border-[#0088cc]/30 text-[#0088cc] hover:text-white"
                      circleColor="bg-[#0088cc]"
                    >
                      <IconBrandTelegram className="w-5 h-5" />
                      Telegram
                    </UnizoyLink>
                  </MagneticWrap>

                  <MagneticWrap disabled={isTouchDevice}>
                    <UnizoyLink
                      href="https://discord.gg/superteamau"
                      className="border-[#5865F2]/30 text-[#5865F2] hover:text-white"
                      circleColor="bg-[#5865F2]"
                    >
                      <IconBrandDiscord className="w-5 h-5" />
                      Discord
                    </UnizoyLink>
                  </MagneticWrap>

                  <MagneticWrap disabled={isTouchDevice}>
                    <UnizoyLink
                      href="https://x.com/superteamau"
                      className="border-white/20 text-foreground hover:text-black"
                      circleColor="bg-white"
                    >
                      <IconBrandX className="w-5 h-5" />
                      Twitter/X
                    </UnizoyLink>
                  </MagneticWrap>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

    </>
  );
}
