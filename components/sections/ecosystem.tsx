"use client";

import { useRef, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "@/components/animations/scroll-reveal";
import { LinkPreview } from "@/components/ui/link-preview";
import { type Partner } from "@/types";

gsap.registerPlugin(ScrollTrigger);

function PartnerFallback({ partner }: { partner: Partner }) {
  let hostname = "";
  try {
    hostname = new URL(partner.url).hostname;
  } catch {
    hostname = partner.url;
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg bg-gradient-to-b from-muted to-background"
      style={{ width: 200, height: 125 }}
    >
      <img
        src={partner.logo}
        alt={partner.name}
        className="h-10 w-auto"
      />
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground leading-none">
          {partner.name}
        </p>
        <p className="text-[11px] text-muted-foreground mt-1">{hostname}</p>
      </div>
    </div>
  );
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="mx-5 sm:mx-8 md:mx-14">
      <LinkPreview
        url={partner.url}
        className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity duration-300"
        width={200}
        height={125}
        quality={50}
        fallback={<PartnerFallback partner={partner} />}
      >
        <img
          src={partner.logo}
          alt={partner.name}
          className="h-8 md:h-9 w-auto shrink-0"
        />
        <span className="text-lg md:text-xl font-semibold text-foreground whitespace-nowrap">
          {partner.name}
        </span>
      </LinkPreview>
    </div>
  );
}

export default function Ecosystem({ partners = [] }: { partners?: Partner[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const rows = el.querySelectorAll<HTMLElement>(".marquee-row");
      gsap.set(rows, { opacity: 0, y: 30 });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          });
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const firstRow = partners.slice(0, Math.ceil(partners.length / 2));
  const secondRow = partners.slice(Math.ceil(partners.length / 2));

  return (
    <div
      ref={containerRef}
      className="relative py-16 sm:py-24 md:py-36 overflow-hidden bg-background"
    >
      <div className="max-w-6xl mx-auto px-4">
        <ScrollReveal
          tag="h2"
          baseRotation={3}
          blurStrength={4}
          baseOpacity={0.3}
          wordAnimationEnd="top bottom-=40%"
          containerClassName="text-center mb-4"
          textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
        >
          Ecosystem
        </ScrollReveal>

        <ScrollReveal
          tag="div"
          baseRotation={2}
          blurStrength={3}
          baseOpacity={0.2}
          wordAnimationEnd="top bottom-=35%"
          containerClassName="text-center mb-20"
          textClassName="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground"
          renderWord={(word) =>
            word === "Partners" ? (
              <span className="text-primary">{word}</span>
            ) : (
              word
            )
          }
        >
          Our Partners
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div className="marquee-row py-5">
          <Marquee speed={40} autoFill pauseOnHover gradient={false}>
            {firstRow.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </Marquee>
        </div>

        <div className="marquee-row py-5 mt-10">
          <Marquee
            speed={30}
            autoFill
            pauseOnHover
            direction="right"
            gradient={false}
          >
            {secondRow.map((partner) => (
              <PartnerCard key={partner.name} partner={partner} />
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  );
}
