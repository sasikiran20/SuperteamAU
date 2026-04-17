"use client";

import React, { useEffect } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  type MotionValue,
} from "framer-motion";

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
  fontSize?: number;
  className?: string;
}

const getRotationTransition = (
  duration: number,
  from: number,
  loop = true
) => ({
  from,
  to: from + 360,
  ease: "linear" as const,
  duration,
  type: "tween" as const,
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: "spring" as const,
    damping: 20,
    stiffness: 300,
  },
});

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  onHover = "speedUp",
  fontSize = 14,
  className = "",
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation: MotionValue<number> = useMotionValue(0);

  useEffect(() => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  }, [spinDuration, text, onHover, controls, rotation]);

  const handleHoverStart = () => {
    const start = rotation.get();
    if (!onHover) return;

    switch (onHover) {
      case "slowDown":
        controls.start({
          rotate: start + 360,
          scale: 1,
          transition: getTransition(spinDuration * 2, start),
        });
        break;
      case "speedUp":
        controls.start({
          rotate: start + 360,
          scale: 1,
          transition: getTransition(spinDuration / 4, start),
        });
        break;
      case "pause":
        controls.start({
          rotate: start,
          scale: 1,
          transition: {
            rotate: { type: "spring", damping: 20, stiffness: 300 },
            scale: { type: "spring", damping: 20, stiffness: 300 },
          },
        });
        break;
      case "goBonkers":
        controls.start({
          rotate: start + 360,
          scale: 0.8,
          transition: getTransition(spinDuration / 20, start),
        });
        break;
    }
  };

  const handleHoverEnd = () => {
    const start = rotation.get();
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  return (
    <motion.div
      className={`relative mx-auto cursor-pointer rounded-full text-center font-bold ${className}`}
      style={{ rotate: rotation, transformOrigin: "50% 50%" }}
      animate={controls}
      onHoverStart={handleHoverStart}
      onHoverEnd={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotationDeg = (360 / letters.length) * i;

        return (
          <span
            key={`char-${i}`}
            className="absolute inset-0 inline-block"
            style={{
              fontSize,
              transform: `rotateZ(${rotationDeg}deg)`,
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
