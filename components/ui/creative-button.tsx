"use client";

import { cn } from "@/lib/utils";
import { IconArrowRight, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";

interface CreativeButtonProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  loadingText?: string;
  showArrow?: boolean;
  fillClass?: string;
  textClass?: string;
  href?: string;
  onClick?: () => void;
}

export function CreativeButton({
  children,
  className,
  disabled,
  isLoading,
  loadingText = "Loading...",
  showArrow = true,
  fillClass = "bg-primary",
  textClass = "text-primary",
  href,
  onClick,
}: CreativeButtonProps) {
  const sharedClassName = cn(
    "group relative inline-flex items-center justify-center rounded-full border border-primary/20 bg-transparent overflow-hidden cursor-pointer",
    showArrow ? "px-12" : "px-8",
    "transition-[border-color,transform,box-shadow] duration-200 ease-out",
    "hover:border-transparent active:scale-[0.97]",
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
    className
  );

  const content = (
    <>
      <span
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full z-0",
          "transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]",
          "group-hover:scale-[200]",
          fillClass
        )}
      />

      {isLoading ? (
        <span
          className={cn(
            "relative z-10 flex items-center gap-2 transition-colors duration-200 group-hover:text-white",
            textClass
          )}
        >
          <IconLoader2 className="animate-spin h-5 w-5" />
          <span>{loadingText}</span>
        </span>
      ) : (
        <>
          <span
            className={cn(
              "relative z-10 font-semibold text-lg transition-all duration-300 ease-out group-hover:text-white",
              showArrow && "group-hover:-translate-x-2.5",
              textClass
            )}
          >
            {children}
          </span>

          {showArrow && (
            <IconArrowRight
              className={cn(
                "absolute z-10 right-5 top-1/2 -translate-y-1/2 w-5 h-5",
                "opacity-0 -translate-x-2",
                "transition-all duration-300 ease-out",
                "group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-white",
                textClass
              )}
              stroke={2.5}
            />
          )}
        </>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={sharedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={sharedClassName}
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
