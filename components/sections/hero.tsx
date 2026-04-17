"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  useMotionTemplate,
  useSpring,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CreativeButton } from "@/components/ui/creative-button";
import {
  GetInvolvedOverlay,
  type LogoRect,
} from "@/components/ui/get-involved-overlay";

gsap.registerPlugin(ScrollTrigger);

function SuperteamLogo({ className }: { className?: string }) {
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

function AnimatedWord({ word, delay }: { word: string; delay: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
      className="inline-block"
    >
      {word}
    </motion.span>
  );
}

function MarqueeButton({
  children,
  href,
  marqueeText = "Explore · Build · Earn",
}: {
  children: string;
  href: string;
  marqueeText?: string;
}) {
  return (
    <a
      href={href}
      className="group relative inline-flex items-center justify-center h-[52px] rounded-full border border-accent/30 overflow-hidden cursor-pointer transition-[border-color,box-shadow] duration-300 hover:border-accent/50 hover:shadow-[0_0_25px_rgba(225,198,153,0.15)]"
    >
      <span className="invisible font-semibold text-lg px-10">
        {children}
      </span>

      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-full">
        <span className="text-accent font-semibold text-lg whitespace-nowrap">
          {marqueeText}
        </span>
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex text-accent font-semibold text-lg">
          {children.split("").map((char, i) => (
            <span key={i} className="inline-block overflow-hidden">
              <span
                className="inline-block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            </span>
          ))}
        </span>
      </div>
    </a>
  );
}

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
      <motion.div style={{ x: springX, y: springY }}>
        {children}
      </motion.div>
    </div>
  );
}

export default function Hero({ images = [], formOptions }: { images?: string[]; formOptions?: { roles: string[]; skills: string[]; experienceLevels: string[]; locations: { label: string; value: string }[]; heroImages: string[] } }) {
  const [showOverlay, setShowOverlay] = useState(false);
  const [logoRect, setLogoRect] = useState<LogoRect>({
    x: 0,
    y: 0,
    width: 80,
    height: 61,
  });
  const logoRef = useRef<HTMLDivElement>(null);
  const heroVisualRef = useRef<HTMLDivElement>(null);

  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(hover: none)').matches);
  }, []);

  const maskProgress = useMotionValue(0);
  const maskTextOpacity = useMotionValue(1);

  const p1x = useTransform(maskProgress, [0, 1], [50, 0]);
  const p1y = useTransform(maskProgress, [0, 1], [25, 0]);
  const p2x = useTransform(maskProgress, [0, 1], [50, 100]);
  const p2y = useTransform(maskProgress, [0, 1], [35, 0]);
  const p3x = useTransform(maskProgress, [0, 1], [50, 100]);
  const p3y = useTransform(maskProgress, [0, 1], [75, 100]);
  const p4x = useTransform(maskProgress, [0, 1], [50, 0]);
  const p4y = useTransform(maskProgress, [0, 1], [65, 100]);

  const clipPath = useMotionTemplate`polygon(${p1x}% ${p1y}%, ${p2x}% ${p2y}%, ${p3x}% ${p3y}%, ${p4x}% ${p4y}%)`;

  const imgRotateY = useTransform(maskProgress, [0, 1], [-30, 0]);

  const leftNum = useTransform(maskProgress, [0, 1], [0, -75]);
  const rightNum = useTransform(maskProgress, [0, 1], [0, 75]);
  const leftTextX = useMotionTemplate`${leftNum}%`;
  const rightTextX = useMotionTemplate`${rightNum}%`;

  useEffect(() => {
    const maskAnim = animate(maskProgress, 1, {
      duration: 1.4,
      ease: [0.33, 1, 0.68, 1],
      delay: 0.2,
    });

    const fadeTimer = setTimeout(() => {
      animate(maskTextOpacity, 0, { duration: 0.5, ease: "easeOut" });
    }, 1700);

    return () => {
      maskAnim.stop();
      clearTimeout(fadeTimer);
    };
  }, []);

  useEffect(() => {
    if (!heroVisualRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(heroVisualRef.current, {
        opacity: 0,
        scale: 1.06,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: heroVisualRef.current,
          start: "50% top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="relative h-[100dvh] min-h-[600px] w-full overflow-hidden bg-background">
        <div ref={heroVisualRef} className="absolute inset-0">
          <div className="absolute inset-0 z-10" style={{ perspective: "1000px" }}>
            <motion.div
              className="absolute inset-0 origin-center"
              style={{ clipPath, rotateY: imgRotateY }}
            >
              <div className="relative h-full w-full">
                <Image
                  src="/images/hero/opera_house_4_animated.png"
                  alt="Sydney Harbour at sunset"
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#100B0A] via-[#100B0A]/60 to-transparent" />
              </div>
            </motion.div>
          </div>

          <motion.div
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none"
            style={{ opacity: maskTextOpacity }}
          >
            <div className="flex items-center whitespace-nowrap">
              <motion.span
                className="text-[7vw] sm:text-[5vw] md:text-[7vw] lg:text-[9vw] font-extrabold text-white leading-none tracking-tighter"
                style={{ x: leftTextX }}
              >
                Superteam
              </motion.span>
              <motion.span
                className="text-[7vw] sm:text-[5vw] md:text-[7vw] lg:text-[9vw] font-extrabold text-white leading-none tracking-tighter ml-[3vw]"
                style={{ x: rightTextX }}
              >
                Australia
              </motion.span>
            </div>
          </motion.div>

          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 sm:px-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 1.7,
                duration: 0.8,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="relative mb-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.6, 0.2], scale: [0.5, 1.8, 1.4] }}
                transition={{
                  delay: 2.0,
                  duration: 1.6,
                  ease: "easeOut",
                }}
                className="absolute inset-0 -inset-x-8 -inset-y-6 rounded-full bg-primary/30 blur-2xl"
              />
              <div
                ref={logoRef}
                style={{ opacity: showOverlay ? 0 : 1 }}
                className="transition-none"
              >
                <SuperteamLogo className="relative w-16 h-auto md:w-20 text-white" />
              </div>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 flex flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-5">
              {["Superteam", "Australia"].map((word, i) => (
                <AnimatedWord key={word} word={word} delay={2.0 + i * 0.15} />
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.4, duration: 0.6, ease: "easeOut" }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/80 max-w-2xl mb-8 sm:mb-12 leading-relaxed px-2"
            >
              Accelerating builders, founders and creatives working towards
              Solana Ecosystem.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.7, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col sm:flex-row items-center gap-5 pointer-events-auto"
            >
              <MagneticWrap disabled={isTouchDevice}>
                <CreativeButton
                  onClick={() => {
                    if (logoRef.current) {
                      const rect = logoRef.current.getBoundingClientRect();
                      setLogoRect({
                        x: rect.left,
                        y: rect.top,
                        width: rect.width,
                        height: rect.height,
                      });
                    }
                    setShowOverlay(true);
                  }}
                  fillClass="bg-primary"
                  textClass="text-white"
                  className="h-[48px] sm:h-[52px] border-white/15 hover:shadow-[0_0_30px_rgba(181,75,51,0.4)]"
                >
                  Get Involved
                </CreativeButton>
              </MagneticWrap>

              <MagneticWrap disabled={isTouchDevice}>
                <MarqueeButton href="#mission">
                  Explore Opportunities
                </MarqueeButton>
              </MagneticWrap>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 0.6 }}
            className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {showOverlay && (
        <GetInvolvedOverlay
          logoRect={logoRect}
          onClose={() => setShowOverlay(false)}
          heroImages={formOptions?.heroImages ?? images}
          roles={formOptions?.roles ?? []}
          skillOptions={formOptions?.skills ?? []}
          experienceLevels={formOptions?.experienceLevels ?? []}
          locations={formOptions?.locations ?? []}
        />
      )}
    </>
  );
}
