"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CountUp from "@/components/animations/count-up";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { type Stat } from "@/types";
import Particles from "@/components/ui/particles";

gsap.registerPlugin(ScrollTrigger);

export default function Stats({ stats = [] }: { stats?: Stat[] }) {
  const cardsRef = useRef<HTMLDivElement>(null);
  const [triggered, setTriggered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = cardsRef.current;
    if (!el) return;

    const cards = el.querySelectorAll<HTMLElement>(".stat-card");

    gsap.set(cards, {
      opacity: 0,
      y: 50,
      scale: 0.92,
    });

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        setTriggered(true);
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative py-16 sm:py-24 md:py-36 px-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Particles
          particleCount={isMobile ? 200 : 500}
          particleSpread={14}
          speed={0.04}
          particleColors={["#ffffff", "#F5EDE6", "#E1C699", "#ffffff", "#ffffff", "#ffffff"]}
          moveParticlesOnHover={true}
          particleHoverFactor={1.2}
          alphaParticles={false}
          particleBaseSize={60}
          sizeRandomness={2}
          cameraDistance={20}
          disableRotation={false}
          className="w-full h-full"
        />
      </div>

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(16,11,10,0.5) 100%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <ScrollReveal
          tag="h2"
          baseRotation={3}
          blurStrength={4}
          baseOpacity={0.3}
          wordAnimationEnd="top bottom-=40%"
          containerClassName="text-center mb-16"
          textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
        >
          Our Impact
        </ScrollReveal>

        <div
          ref={cardsRef}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="stat-card text-center group">
              <div className="relative inline-block">
                <div
                  className="absolute -inset-4 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(circle, var(--accent) 0%, transparent 70%)",
                  }}
                />
                <div className="relative text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-accent mb-3">
                  {triggered ? (
                    <CountUp to={stat.value} suffix={stat.suffix || ""} />
                  ) : (
                    <span>0{stat.suffix || ""}</span>
                  )}
                </div>
              </div>
              <p className="text-sm md:text-base text-muted-foreground">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
