"use client";

import Image from "next/image";
import { useTransform, motion, useScroll, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";


export interface ParallaxCardItem {
  title: string;
  description: string;
  src: string;
  color: string;
}


function Card({
  i,
  title,
  description,
  src,
  color,
  progress,
  range,
  targetScale,
  total,
  isMobile,
}: ParallaxCardItem & {
  i: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  total: number;
  isMobile: boolean;
}) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], isMobile ? [1, 1] : [2, 1]);

  const scale = useTransform(progress, range, isMobile ? [1, 1] : [1, targetScale]);

  const indexLabel = String(i + 1).padStart(2, "0");

  return (
    <div
      ref={container}
      className={isMobile ? "flex items-center justify-center py-4" : "flex h-screen items-center justify-center sticky top-0"}
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: isMobile ? undefined : `calc(-5vh + ${i * 25}px)`,
        }}
        className={`relative w-[95vw] max-w-[1300px] origin-top rounded-3xl overflow-hidden shadow-[0_8px_60px_rgba(0,0,0,0.5)] border border-white/[0.06] ${
          isMobile ? 'h-auto' : 'h-auto md:h-[620px]'
        }`}
      >
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 20% 100%, rgba(181,75,51,0.06) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 0%, rgba(225,198,153,0.04) 0%, transparent 60%)",
          }}
        />

        <div className="relative z-[2] flex flex-col md:flex-row h-full">
          <div className="flex flex-col justify-center p-8 md:p-12 lg:p-14 w-full md:w-[50%]">
            <div>
              <span className="inline-block text-xs font-mono tracking-[0.2em] uppercase text-accent/60 mb-4">
                {indexLabel} / {String(total).padStart(2, "0")}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-[1.1] tracking-tight">
                {title}
              </h2>
            </div>

            <div className="mt-6">
              <p className="text-sm sm:text-base md:text-lg text-foreground/70 leading-relaxed max-w-md">
                {description}
              </p>
              <div className="mt-8 h-[2px] w-12 bg-gradient-to-r from-primary to-accent/50 rounded-full" />
            </div>
          </div>

          <div className="relative w-full md:w-[50%] h-48 sm:h-64 md:h-full">
            <div
              className="absolute inset-y-0 left-0 w-24 z-[1] hidden md:block"
              style={{
                background: `linear-gradient(to right, ${color}, transparent)`,
              }}
            />
            <div className="absolute inset-0 overflow-hidden md:rounded-none rounded-b-3xl">
              <motion.div
                className="w-full h-full"
                style={{ scale: imageScale }}
              >
                <Image
                  fill
                  src={src}
                  alt={title}
                  className="object-cover"
                  sizes="(max-width: 768px) 95vw, 650px"
                />
              </motion.div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent z-[2] md:hidden" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}


export function CardsParallax({ items }: { items: ParallaxCardItem[] }) {
  const container = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className={`relative ${isMobile ? 'space-y-4 py-6' : ''}`}>
      {items.map((item, i) => {
        const targetScale = 1 - (items.length - i) * 0.05;
        return (
          <Card
            key={`card_${i}`}
            i={i}
            {...item}
            progress={scrollYProgress}
            range={[i * (1 / items.length), 1]}
            targetScale={targetScale}
            total={items.length}
            isMobile={isMobile}
          />
        );
      })}
    </div>
  );
}
