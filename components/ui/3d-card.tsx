"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";

const Card3DContext = createContext<{ isHovering: boolean }>({
  isHovering: false,
});

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!innerRef.current) return;
      const rect = innerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      innerRef.current.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    },
    []
  );

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    if (innerRef.current) {
      innerRef.current.style.transition = "none";
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    if (innerRef.current) {
      innerRef.current.style.transition =
        "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
      innerRef.current.style.transform = "rotateY(0deg) rotateX(0deg)";
    }
  }, []);

  return (
    <div className={cn("[perspective:1200px]", className)}>
      <div
        ref={innerRef}
        className={cn(
          "relative w-full [transform-style:preserve-3d]",
          containerClassName
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <Card3DContext.Provider value={{ isHovering }}>
          {children}
        </Card3DContext.Provider>
      </div>
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("[transform-style:preserve-3d]", className)}>
      {children}
    </div>
  );
}

export function CardItem({
  children,
  className,
  translateX = 0,
  translateY = 0,
  translateZ = 0,
}: {
  children: React.ReactNode;
  className?: string;
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
}) {
  const { isHovering } = useContext(Card3DContext);

  const tx = typeof translateX === "number" ? `${translateX}px` : translateX;
  const ty = typeof translateY === "number" ? `${translateY}px` : translateY;
  const tz = typeof translateZ === "number" ? `${translateZ}px` : translateZ;

  return (
    <div
      className={cn(
        "[transform-style:preserve-3d] transition-transform duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
        className
      )}
      style={{
        transform: isHovering
          ? `translate3d(${tx}, ${ty}, ${tz})`
          : "translate3d(0px, 0px, 0px)",
      }}
    >
      {children}
    </div>
  );
}
