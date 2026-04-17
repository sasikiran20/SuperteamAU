"use client";

import { useEffect, useRef, useCallback } from "react";
import Script from "next/script";


function extractLumaEventId(url: string): string {
  if (!url) return "";
  if (url.startsWith("evt-")) return url;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/^\//, "").replace(/\/$/, "");
    if (path.startsWith("event/")) return path.replace("event/", "");
    return path;
  } catch {
    return url;
  }
}

interface LumaCheckoutButtonProps {
  lumaUrl: string;
  className?: string;
  children: React.ReactNode;
}


export function LumaCheckoutButton({
  lumaUrl,
  className,
  children,
}: LumaCheckoutButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const eventId = extractLumaEventId(lumaUrl);

  useEffect(() => {
    const win = window as Window & { luma?: { initCheckout?: () => void } };
    if (win.luma?.initCheckout) {
      win.luma.initCheckout();
    }
  }, [eventId]);

  return (
    <button
      ref={ref}
      type="button"
      data-luma-action="checkout"
      data-luma-event-id={eventId}
      className={className}
    >
      {children}
    </button>
  );
}


export function LumaCheckoutScript() {
  const handleLoad = useCallback(() => {
    const win = window as Window & { luma?: { initCheckout?: () => void } };
    if (win.luma?.initCheckout) {
      win.luma.initCheckout();
    }
  }, []);

  return (
    <Script
      id="luma-checkout"
      src="https://embed.lu.ma/checkout-button.js"
      strategy="lazyOnload"
      onLoad={handleLoad}
    />
  );
}
