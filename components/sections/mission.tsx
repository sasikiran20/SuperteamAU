"use client";

import ScrollReveal from "@/components/animations/scroll-reveal";
import { Highlight } from "@/components/animations/hero-highlight";
import { CardsParallax, type ParallaxCardItem } from "@/components/animations/cards-parallax";

export interface MissionItem {
  title: string;
  description: string;
  image_url: string;
}

const CARD_COLORS = [
  "#231815",
  "#1F2420",
  "#26201A",
  "#201A22",
  "#261D1A",
  "#1A2025",
];

export default function Mission({ items = [] }: { items?: MissionItem[] }) {
  const cards: ParallaxCardItem[] = items.map((item, i) => ({
    title: item.title,
    description: item.description,
    src: item.image_url,
    color: CARD_COLORS[i % CARD_COLORS.length],
  }));

  return (
    <div
      className="relative px-4"
      style={{
        background: [
          "radial-gradient(ellipse 70% 40% at 50% 8%, rgba(181,75,51,0.12) 0%, transparent 70%)",
          "radial-gradient(ellipse 50% 30% at 50% 15%, rgba(225,198,153,0.06) 0%, transparent 60%)",
          "radial-gradient(ellipse at center, transparent 40%, rgba(16,11,10,0.4) 100%)",
        ].join(", "),
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px]"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(181,75,51,0.08) 0%, transparent 70%), radial-gradient(ellipse 60% 80% at 50% 0%, rgba(225,198,153,0.05) 0%, transparent 50%)",
        }}
      />

      <div className="relative max-w-6xl mx-auto pt-12 sm:pt-16 md:pt-24">
        <div className="flex justify-center mb-10">
          <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-accent/30 to-accent/10" />
        </div>

        <div className="text-center mb-4">
          <ScrollReveal
            tag="h2"
            baseRotation={3}
            blurStrength={4}
            baseOpacity={0.3}
            wordAnimationEnd="top bottom-=40%"
            containerClassName="mb-4"
            textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
          >
            What We Do
          </ScrollReveal>
          <ScrollReveal
            tag="div"
            baseRotation={3}
            blurStrength={6}
            baseOpacity={0.3}
            wordAnimationEnd="top center"
            containerClassName="max-w-3xl mx-auto mb-6"
            textClassName="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground leading-tight"
            renderWord={(word) => {
              if (word === "Solana.") {
                return (
                  <Highlight className="text-foreground dark:text-white">
                    Solana
                  </Highlight>
                );
              }
              return word;
            }}
          >
            We exist to accelerate builders, founders, creatives and institutions on Solana.
          </ScrollReveal>
          <ScrollReveal
            tag="div"
            baseRotation={3}
            blurStrength={4}
            baseOpacity={0.3}
            wordAnimationEnd="top center"
            containerClassName="max-w-2xl mx-auto"
            textClassName="text-muted-foreground text-lg"
          >
            We support the ecosystem end-to-end, from early builders through to institutional adoption.
          </ScrollReveal>
        </div>
      </div>

      {cards.length > 0 && <CardsParallax items={cards} />}
    </div>
  );
}
