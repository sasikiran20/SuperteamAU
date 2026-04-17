"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function StickyScroll({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
  }[];
  contentClassName?: string;
}) {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const onScroll = () => {
      const anchor = window.innerHeight * 0.45;
      let closestIndex = 0;
      let closestDistance = Infinity;

      cardRefs.current.forEach((ref, index) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distance = Math.abs(cardCenter - anchor);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      setActiveCard(closestIndex);

      if (panelRef.current && containerRef.current) {
        const cRect = containerRef.current.getBoundingClientRect();
        const vh = window.innerHeight;
        const totalTravel = cRect.height + vh;
        const progress = (vh - cRect.top) / totalTravel;

        const fadeIn = 0.18;
        const fadeOut = 0.83;
        let opacity: number;

        if (progress < fadeIn) {
          opacity = Math.max(0, progress / fadeIn);
        } else if (progress > fadeOut) {
          opacity = Math.max(0, (1 - progress) / (1 - fadeOut));
        } else {
          opacity = 1;
        }

        panelRef.current.style.opacity = String(opacity);
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [content.length]);

  return (
    <div
      ref={containerRef}
      className="relative flex justify-between gap-10 px-4 lg:px-0"
    >
      <div className="w-full lg:w-1/2">
        {content.map((item, index) => (
          <div
            key={item.title + index}
            ref={setCardRef(index)}
            className="min-h-[70vh] flex flex-col justify-center py-16 lg:py-20"
          >
            <motion.h2
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="text-2xl font-bold text-foreground"
            >
              {item.title}
            </motion.h2>
            <motion.p
              animate={{ opacity: activeCard === index ? 1 : 0.3 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="text-lg mt-6 max-w-lg text-muted-foreground leading-relaxed"
            >
              {item.description}
            </motion.p>
          </div>
        ))}
      </div>

      <div
        ref={panelRef}
        className="hidden lg:flex lg:w-1/2 items-start"
        style={{ opacity: 0 }}
      >
        <div className="sticky top-[calc(45vh-10rem)] w-full">
          <div
            className={cn(
              "relative h-80 w-full max-w-md ml-auto overflow-hidden rounded-2xl",
              contentClassName
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{
                  opacity: 0,
                  scale: 1.05,
                  filter: "blur(8px)",
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  transition: {
                    duration: 0.5,
                    ease: [0.23, 1, 0.32, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  filter: "blur(6px)",
                  transition: {
                    duration: 0.25,
                    ease: [0.77, 0, 0.175, 1],
                  },
                }}
                className="relative h-full w-full"
              >
                {content[activeCard].content ?? null}
              </motion.div>
            </AnimatePresence>
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background:
                  "linear-gradient(to bottom right, rgba(181,75,51,0.35), rgba(225,198,153,0.25))",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
