"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { type FAQ as FAQType } from "@/types";
import { IconPlus } from "@tabler/icons-react";
import ScrollReveal from "@/components/animations/scroll-reveal";
import BlurText from "@/components/ui/blur-text";


function ParallaxText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x1 = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-15%", "0%"]);

  return (
    <div ref={ref} className="overflow-hidden mb-12">
      <motion.div
        style={{ x: x1 }}
        className="flex whitespace-nowrap gap-8 mb-4"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={`a-${i}`}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-foreground/[0.08] select-none"
          >
            Questions &amp; Answers
          </span>
        ))}
      </motion.div>
      <motion.div
        style={{ x: x2 }}
        className="flex whitespace-nowrap gap-8"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={`b-${i}`}
            className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-bold text-foreground/[0.06] select-none"
          >
            Frequently Asked
          </span>
        ))}
      </motion.div>
    </div>
  );
}


function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
  total,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  total: number;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={`border border-border/40 bg-muted/20 backdrop-blur-sm transition-colors duration-300
        ${isFirst ? "rounded-t-2xl" : ""}
        ${isLast ? "rounded-b-2xl" : ""}
        ${!isLast ? "border-b-0" : ""}
        ${isOpen ? "bg-muted/40" : "hover:bg-muted/30"}`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 py-5 sm:py-6 px-4 sm:px-6 md:px-8 text-left group"
        aria-expanded={isOpen}
      >
        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs sm:text-sm font-semibold text-primary transition-colors duration-200 group-hover:bg-primary/20">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="flex-1 text-base sm:text-lg font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
          {question}
        </span>

        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-border/60 transition-colors duration-200 group-hover:border-primary/40"
        >
          <IconPlus className="w-4 h-4 text-primary" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 md:px-8 pb-6 sm:pb-7 pl-[3.25rem] sm:pl-[4.5rem] md:pl-[5rem]">
              <BlurText
                text={answer}
                animateBy="words"
                direction="top"
                delay={30}
                stepDuration={0.3}
                className="text-muted-foreground leading-relaxed text-[15px]"
                animateOnMount
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}


export default function FAQ({ items = [] }: { items?: FAQType[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="relative py-16 sm:py-24 md:py-36 px-4 bg-background overflow-hidden">
      <ParallaxText />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <ScrollReveal
            tag="h2"
            baseRotation={3}
            blurStrength={4}
            baseOpacity={0.3}
            wordAnimationEnd="top bottom-=40%"
            containerClassName="text-center mb-4"
            textClassName="text-sm uppercase tracking-[0.3em] text-accent font-semibold"
          >
            FAQ
          </ScrollReveal>

          <ScrollReveal
            tag="div"
            baseRotation={2}
            blurStrength={3}
            baseOpacity={0.2}
            wordAnimationEnd="top bottom-=35%"
            containerClassName="text-center"
            textClassName="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground"
            renderWord={(word) =>
              word === "Questions" ? (
                <span className="text-primary">{word}</span>
              ) : (
                word
              )
            }
          >
            Common Questions
          </ScrollReveal>
        </div>

        <div>
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              index={index}
              total={items.length}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
