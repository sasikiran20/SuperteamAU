"use client";

import { useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Link from "next/link";
import { IconLock } from "@tabler/icons-react";


function SuperteamLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M32.6944 4.90892H41.4468V8.28973C41.4468 12.8741 37.742 16.5795 33.1571 16.5795H32.6938L32.6944 4.90892ZM20.2372 0H32.6944V31.9071H31.2127C22.1822 31.9071 20.3765 25.6088 20.3765 20.0055L20.2372 0ZM0 7.22433C0 12.9205 4.07522 15.0043 8.61369 15.6993H0V32H8.28973C16.6252 32 17.5978 28.2952 17.5978 24.7757C17.5978 20.4688 14.6338 17.459 10.0495 16.3007H17.5978V0H9.30807C0.972554 0 0 3.70477 0 7.22433Z"
        fill="currentColor"
      />
    </svg>
  );
}


const navLinks = [
  { title: "Mission", href: "#mission" },
  { title: "Events", href: "#events" },
  { title: "Members", href: "#members" },
  { title: "Ecosystem", href: "#ecosystem" },
  { title: "Community", href: "#community" },
  { title: "FAQ", href: "#faq" },
];

const socialLinks = [
  { title: "Telegram", href: "https://t.me/superteamau" },
  { title: "Discord", href: "https://discord.gg/superteamau" },
  { title: "Twitter/X", href: "https://x.com/superteamau" },
];


const menuVariants: Variants = {
  open: {
    width: "min(480px, calc(100vw - 40px))",
    height: "auto",
    top: "-25px",
    right: "-25px",
    transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] },
  },
  closed: {
    width: "100px",
    height: "40px",
    top: "0px",
    right: "0px",
    transition: {
      duration: 0.75,
      delay: 0.35,
      type: "tween",
      ease: [0.76, 0, 0.24, 1],
    },
  },
};

const perspectiveVariants: Variants = {
  initial: {
    opacity: 0,
    rotateX: 90,
    translateY: 80,
    translateX: -20,
  },
  enter: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    translateY: 0,
    translateX: 0,
    transition: {
      duration: 0.65,
      delay: 0.5 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1],
      opacity: { duration: 0.35 },
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
};

const slideInVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.75 + i * 0.1,
      ease: [0.215, 0.61, 0.355, 1],
    },
  }),
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};


function PerspectiveText({ label }: { label: string }) {
  return (
    <div className="perspective-text">
      <span className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
      <span className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}


function MenuButton({
  isActive,
  toggleMenu,
}: {
  isActive: boolean;
  toggleMenu: () => void;
}) {
  return (
    <div className="absolute right-0 top-0 z-10 h-[40px] w-[100px] cursor-pointer overflow-hidden rounded-[25px]">
      <motion.div
        className="relative h-full w-full"
        animate={{ top: isActive ? "-100%" : "0%" }}
        transition={{
          duration: 0.5,
          type: "tween",
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <div
          className="menu-el flex h-full w-full items-center justify-center bg-accent text-background"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Menu" />
        </div>
        <div
          className="menu-el flex h-full w-full items-center justify-center bg-muted text-accent ring-1 ring-inset ring-border/60"
          onClick={toggleMenu}
        >
          <PerspectiveText label="Close" />
        </div>
      </motion.div>
    </div>
  );
}


function MenuNav({ onLinkClick }: { onLinkClick: (href: string) => void }) {
  return (
    <div className="flex flex-col overflow-y-auto scrollbar-hide px-6 pb-14 pt-16 sm:pt-20 md:px-10 md:pb-16 md:pt-24">
      <div className="flex flex-col gap-2">
        {navLinks.map((link, i) => (
          <div
            key={link.title}
            style={{ perspective: "120px", perspectiveOrigin: "bottom" }}
          >
            <motion.div
              custom={i}
              variants={perspectiveVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <a
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  onLinkClick(link.href);
                }}
                className="text-[28px] font-semibold leading-tight text-foreground no-underline transition-colors duration-300 hover:text-accent sm:text-[36px] md:text-[46px]"
              >
                {link.title}
              </a>
            </motion.div>
          </div>
        ))}
      </div>

      <motion.div className="flex flex-wrap mt-8">
        {socialLinks.map((link, i) => (
          <motion.a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            custom={i}
            variants={slideInVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="mt-1.5 w-1/2 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
          >
            {link.title}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
}


const HIDDEN_ROUTES = ["/get-involved"];
const HIDDEN_MENU_ROUTES = ["/members"];

export default function Header() {
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsActive((prev) => !prev);
  }, []);

  const handleLinkClick = useCallback((href: string) => {
    setIsActive(false);
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      if (el) {
        setTimeout(() => {
          window.__lenis?.scrollTo(el as HTMLElement, { duration: 1.2 });
        }, 400);
      }
    }
  }, []);

  if (HIDDEN_ROUTES.includes(pathname)) return null;

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-40">
      <div className="flex items-start justify-between p-5 md:p-10">
        <button
          onClick={() => window.__lenis?.scrollTo(0, { duration: 1.5 })}
          className="pointer-events-auto cursor-pointer"
          aria-label="Scroll to top"
        >
          <SuperteamLogo className="h-auto w-8 text-foreground/80 transition-colors duration-300 hover:text-foreground md:w-10" />
        </button>

        {!HIDDEN_MENU_ROUTES.includes(pathname) && (
          <div className="pointer-events-auto relative">
            <motion.div
              className="relative overflow-hidden rounded-[25px] bg-muted border border-border/60 max-h-[calc(100vh-40px)]"
              variants={menuVariants}
              animate={isActive ? "open" : "closed"}
              initial="closed"
            >
              <AnimatePresence>
                {isActive && <MenuNav onLinkClick={handleLinkClick} />}
              </AnimatePresence>
            </motion.div>
            <MenuButton isActive={isActive} toggleMenu={toggleMenu} />
          </div>
        )}
      </div>
    </header>
  );
}
