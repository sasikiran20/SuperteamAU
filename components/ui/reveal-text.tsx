"use client";

import React, { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

type RevealTextProps = {
  children: React.ReactNode;
  className?: string;
  image?: string;
  imageClassName?: string;
  hoverContent?: React.ReactNode;
  hoverClassName?: string;
  href?: string;
};

const RevealText = ({
  children,
  className = "",
  image,
  imageClassName,
  hoverContent,
  hoverClassName,
  href,
}: RevealTextProps) => {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const quickToX = useRef<gsap.QuickToFunc | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = () => {
    const trigger = triggerRef.current;
    const hover = hoverRef.current;
    if (!trigger || !hover) return;

    const rect = trigger.getBoundingClientRect();

    gsap.set(hover, {
      left: rect.left + rect.width / 2,
      top: rect.top - 16,
      xPercent: -50,
      yPercent: -100,
      x: 0,
    });

    gsap.killTweensOf(hover);
    quickToX.current = gsap.quickTo(hover, "x", { duration: 0.6 });

    gsap.to(hover, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.75)",
    });
  };

  const handleMouseLeave = () => {
    const hover = hoverRef.current;
    if (!hover) return;
    gsap.killTweensOf(hover);
    gsap.to(hover, {
      opacity: 0,
      scale: 0.5,
      x: 0,
      duration: 0.3,
      ease: "power3.in",
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (triggerRef.current && quickToX.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const offset = ((x - rect.width / 2) / rect.width) * 80;
      quickToX.current(offset);
    }
  };

  const hasHoverElement = image || hoverContent;

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-block group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
          >
            {children}
          </a>
        ) : (
          <span className={className}>{children}</span>
        )}
      </span>

      {hasHoverElement &&
        mounted &&
        createPortal(
          <div
            ref={hoverRef}
            className={cn("pointer-events-none", hoverClassName)}
            style={{
              position: "fixed",
              zIndex: 9999,
              opacity: 0,
              transform: "scale(0.5)",
              willChange: "transform, opacity",
            }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                className={cn(
                  "aspect-video min-w-36 h-24 md:min-w-40 md:h-28 lg:min-w-48 lg:h-32 object-cover rounded-xl shadow-lg border-4 lg:border-[6px] border-white/20",
                  imageClassName
                )}
              />
            ) : (
              hoverContent
            )}
          </div>,
          document.body
        )}
    </>
  );
};

export { RevealText };
