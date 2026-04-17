"use client";

import Link from "next/link";
import Image from "next/image";
import {
  IconBrandTelegram,
  IconBrandDiscord,
  IconBrandX,
  IconBrandGithub,
  IconLock,
} from "@tabler/icons-react";

const navLinks = [
  { label: "Mission", href: "#mission" },
  { label: "Events", href: "#events" },
  { label: "Members", href: "#members" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "FAQ", href: "#faq" },
  // { label: "Get Involved", href: "/get-involved" },
];

const socialLinks = [
  { icon: IconBrandTelegram, href: "https://t.me/superteamau", label: "Telegram" },
  { icon: IconBrandDiscord, href: "https://discord.gg/superteamau", label: "Discord" },
  { icon: IconBrandX, href: "https://x.com/superteamau", label: "Twitter" },
];

function FooterContent() {
  return (
    <div className="relative z-10 flex h-full flex-col justify-center">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-2xl font-bold text-foreground">
              Superteam{" "}
              <span className="text-accent">Australia</span>
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              Accelerating builders, founders, creatives and institutions
              working towards internet capital markets on Solana.
            </p>
            <a
              href="https://superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary transition-colors hover:text-primary/80"
            >
              Part of Superteam Global →
            </a>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Navigation
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 hover:border-accent/50 hover:bg-accent/10 hover:text-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-between gap-4 border-t border-accent/10 pt-6 sm:pt-8 sm:flex-row pb-safe">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <p className="text-xs text-muted-foreground text-center sm:text-left">
              &copy; {new Date().getFullYear()} Superteam Australia. All rights
              reserved.
            </p>
            <Link
              href="/admin/login"
              className="group flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-accent"
            >
              <IconLock className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
              Admin
            </Link>
          </div>
          <a
            href="https://solana.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Image
              src="/images/partners/solana.svg"
              alt="Solana Logo"
              width={16}
              height={16}
              className="opacity-70 transition-opacity group-hover:opacity-100 dark:invert"
            />
            <span>Solana Foundation</span>
          </a>
        </div>
      </div>
    </div>
  );
}


export default function Footer() {
  return (
    <footer
      className="relative"
      style={{
        height: "var(--footer-h)",
        clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)",
      }}
    >
      <div
        className="relative -top-[100vh]"
        style={{ height: "calc(100vh + var(--footer-h))" }}
      >
        <div
          className="sticky w-full overflow-hidden"
          style={{
            height: "var(--footer-h)",
            top: "calc(100vh - var(--footer-h))",
          }}
        >
          <div className="absolute inset-[-40px] overflow-hidden">
            <Image
              src="/images/hero/ Uluru.jpg"
              alt=""
              fill
              className="scale-110 object-cover"
              style={{ filter: "blur(50px) saturate(1.3)" }}
              sizes="100vw"
              priority={false}
            />
          </div>

          <div className="absolute inset-0 bg-background/55" />

          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 30% 80%, rgba(181,75,51,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(225,198,153,0.08) 0%, transparent 50%)",
            }}
          />

          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />

          <FooterContent />
        </div>
      </div>
    </footer>
  );
}
