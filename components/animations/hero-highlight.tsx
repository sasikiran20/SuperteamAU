"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Highlight({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ backgroundSize: "0% 100%" }}
      whileInView={{ backgroundSize: "100% 100%" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "linear", delay: 0.3 }}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left center",
        display: "inline",
      }}
      className={cn(
        "relative inline-block rounded-lg bg-gradient-to-r from-[#B54B33] to-[#E1C699] px-1 pb-1",
        className
      )}
    >
      {children}
    </motion.span>
  );
}
