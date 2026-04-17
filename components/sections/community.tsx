"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  useTransform,
  useScroll,
  motion,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";
import ScrollReveal from "@/components/animations/scroll-reveal";
import {
  type TweetCard as TweetCardType,
  type TestimonialCard as TestimonialCardType,
  type SocialProofCard as SocialProofCardType,
  type CommunityCard,
} from "@/types";
import {
  IconBrandX,
  IconHeart,
  IconRepeat,
  IconQuote,
  IconTrendingUp,
  IconUsers,
  IconTrophy,
  IconCalendarEvent,
  IconRocket,
  IconHeadset,
  IconBolt,
} from "@tabler/icons-react";


function TweetCard({ card }: { card: TweetCardType }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 px-7 py-8 md:px-8 md:py-9 backdrop-blur-sm transition-colors duration-200 group-hover:border-accent/50 group-hover:bg-muted/50">
      <div className="mb-5 flex items-start justify-between">
        <div className="flex items-center gap-3.5">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border">
            <Image
              src={card.src}
              alt={card.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-foreground">
              {card.name}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              {card.handle}
            </p>
          </div>
        </div>
        <IconBrandX className="h-5 w-5 shrink-0 text-muted-foreground" />
      </div>

      <p className="mb-7 text-base leading-[1.8] text-foreground/90">
        {card.content}
      </p>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <IconHeart className="h-4 w-4" />
          {card.likes}
        </span>
        <span className="flex items-center gap-1.5">
          <IconRepeat className="h-4 w-4" />
          {card.retweets}
        </span>
        <span className="ml-auto">{card.timestamp}</span>
      </div>
    </div>
  );
}

function TestimonialCardComponent({ card }: { card: TestimonialCardType }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 px-7 py-8 md:px-8 md:py-9 backdrop-blur-sm transition-colors duration-200 group-hover:border-primary/50 group-hover:bg-muted/50">
      <IconQuote className="mb-5 h-8 w-8 text-primary/40" />
      <blockquote className="mb-7 text-base leading-[1.8] text-foreground/90 italic">
        &ldquo;{card.quote}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3.5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-accent/30">
          <Image
            src={card.src}
            alt={card.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {card.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">
            {card.designation}
          </p>
        </div>
      </div>
    </div>
  );
}

const socialIcons: Record<string, typeof IconTrendingUp> = {
  Hackathon: IconTrophy,
  Onboarding: IconUsers,
  Grants: IconRocket,
  "DeFi Night": IconCalendarEvent,
  Growth: IconTrendingUp,
  "Builder Calls": IconHeadset,
  Projects: IconBolt,
};

function SocialProofCardComponent({ card }: { card: SocialProofCardType }) {
  const Icon = socialIcons[card.name] ?? IconTrendingUp;
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/30 px-7 py-8 md:px-8 md:py-9 backdrop-blur-sm transition-colors duration-200 group-hover:border-secondary/50 group-hover:bg-muted/50">
      <div className="mb-5 flex items-center gap-3.5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary/10">
          <Icon className="h-6 w-6 text-secondary" />
        </div>
        <p className="text-base font-semibold text-foreground">{card.title}</p>
      </div>
      {card.metric && (
        <p className="mb-4 text-4xl font-bold text-accent">{card.metric}</p>
      )}
      <p className="text-[15px] leading-[1.8] text-muted-foreground">
        {card.description}
      </p>
    </div>
  );
}

function CommunityCardRenderer({ card }: { card: CommunityCard }) {
  switch (card.type) {
    case "tweet":
      return <TweetCard card={card} />;
    case "testimonial":
      return <TestimonialCardComponent card={card} />;
    case "social":
      return <SocialProofCardComponent card={card} />;
  }
}


interface ColumnProps {
  cards: CommunityCard[];
  y: MotionValue<number>;
  className?: string;
}

function Column({ cards, y, className = "" }: ColumnProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoverRect, setHoverRect] = useState({ top: 0, height: 0 });
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleMouseEnter = useCallback((i: number) => {
    setHoveredIndex(i);
    const el = cardRefs.current[i];
    if (el) {
      setHoverRect({ top: el.offsetTop, height: el.offsetHeight });
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  return (
    <motion.div
      className={`relative flex w-full flex-col gap-5 md:w-1/3 md:min-w-[280px] md:gap-6 ${className}`}
      style={{ y }}
    >
      <motion.div
        className="pointer-events-none absolute z-0 rounded-[18px]"
        style={{ left: -6, right: -6 }}
        animate={{
          opacity: hoveredIndex !== null ? 1 : 0,
          top: hoverRect.top - 6,
          height: hoverRect.height + 12,
        }}
        transition={{
          top: { type: "spring", bounce: 0.18, duration: 0.5 },
          height: { type: "spring", bounce: 0.18, duration: 0.5 },
          opacity: { duration: 0.2 },
        }}
      >
        <div className="h-full w-full rounded-[18px] bg-accent/[0.07] ring-1 ring-accent/20" />
      </motion.div>

      {cards.map((card, i) => (
        <div
          key={i}
          ref={(el) => { cardRefs.current[i] = el; }}
          className="group relative z-10"
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          <CommunityCardRenderer card={card} />
        </div>
      ))}
    </motion.div>
  );
}


export default function Community({ cards = [] }: { cards?: CommunityCard[] }) {
  const gallery = useRef<HTMLDivElement>(null);
  const [dimension, setDimension] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const { height } = dimension;

  const y1 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, height * 1.2]);
  const y2 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, height * 2.2]);
  const y3 = useTransform(scrollYProgress, [0, 1], isMobile ? [0, 0] : [0, height * 1.6]);

  useEffect(() => {
    const resize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  const col1: CommunityCard[] = cards.filter(c => c.type === 'tweet');
  const col2: CommunityCard[] = cards.filter(c => c.type === 'testimonial');
  const col3: CommunityCard[] = cards.filter(c => c.type === 'social');

  return (
    <div className="relative bg-background py-16 sm:py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-4">
        <ScrollReveal
          tag="h2"
          baseRotation={3}
          blurStrength={4}
          baseOpacity={0.3}
          wordAnimationEnd="top bottom-=40%"
          containerClassName="text-center mb-4"
          textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
        >
          Community
        </ScrollReveal>

        <ScrollReveal
          tag="div"
          baseRotation={2}
          blurStrength={3}
          baseOpacity={0.2}
          wordAnimationEnd="top bottom-=35%"
          containerClassName="text-center mb-16 md:mb-20"
          textClassName="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground"
          renderWord={(word) =>
            word === "Ecosystem" ? (
              <span className="text-primary">{word}</span>
            ) : (
              word
            )
          }
        >
          Voices from the Ecosystem
        </ScrollReveal>
      </div>

      <div
        ref={gallery}
        className="community-gallery relative overflow-hidden"
      >
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-32 bg-gradient-to-t from-background to-transparent" />

        <div className="community-gallery-wrapper mx-auto flex gap-5 px-4 md:gap-6 md:px-[2vw]">
          <Column
            cards={col1}
            y={y1}
            className="community-col-1"
          />
          <Column
            cards={col2}
            y={y2}
            className="community-col-2"
          />
          <Column
            cards={col3}
            y={y3}
            className="community-col-3"
          />
        </div>
      </div>
    </div>
  );
}
