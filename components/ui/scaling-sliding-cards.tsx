"use client";

import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface ScalingSlidingCardsProps {
  children: React.ReactNode[];
  header?: React.ReactNode;
  scrubSpeed?: boolean | number;
  gap?: number;
  wrapperClassName?: string;
  cardClassName?: string;
  minScale?: number;
  maxScale?: number;
  minOpacity?: number;
}

export function ScalingSlidingCards({
  children,
  header,
  scrubSpeed = 1,
  gap = 32,
  wrapperClassName,
  cardClassName,
  minScale = 0.7,
  maxScale = 1,
  minOpacity = 0.4,
}: ScalingSlidingCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setCardRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      cardRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];

    if (cards.length === 0) return;
    cards.forEach((card) => {
      gsap.set(card, { scale: minScale, opacity: minOpacity });
    });

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const viewportCenter = vw / 2;

      const lastCard = cards[cards.length - 1];
      const lastCardCenterInTrack =
        lastCard.offsetLeft + lastCard.offsetWidth / 2;

      const startX = vw * 0.6;
      const endX = viewportCenter - lastCardCenterInTrack;

      const totalMovement = startX - endX;
      const scrollDistance = totalMovement * 1.1;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${scrollDistance}`,
          scrub: scrubSpeed,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(track, { x: startX }, { x: endX, ease: "none" });

      tl.eventCallback("onUpdate", () => {
        cards.forEach((card) => {
          const rect = card.getBoundingClientRect();
          const cardCenter = rect.left + rect.width / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          const rawPercent = (1 - distance / (viewportCenter * 0.85)) * 100;
          const clamped = Math.max(0, Math.min(100, rawPercent));
          const t = clamped / 100;

          const scaleFactor = minScale + (maxScale - minScale) * t;
          const opacityFactor = minOpacity + (1 - minOpacity) * t;

          gsap.set(card, {
            scale: scaleFactor,
            opacity: opacityFactor,
          });
        });
      });
    }, container);

    return () => ctx.revert();
  }, [scrubSpeed, minScale, maxScale, minOpacity]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "overflow-x-clip overflow-y-visible h-screen flex flex-col",
        wrapperClassName
      )}
    >
      {header && <div className="flex-shrink-0">{header}</div>}
      <div className="flex-1 flex items-center">
        <div
          ref={trackRef}
          style={{ gap: `${gap}px` }}
          className="flex items-center"
        >
          {React.Children.map(children, (child, i) => (
            <div
              key={i}
              ref={(el) => setCardRef(el, i)}
              className={cn("flex-shrink-0", cardClassName)}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
