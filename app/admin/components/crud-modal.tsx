"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export default function CrudModal({
  open,
  onClose,
  title,
  children,
  onSubmit,
  loading = false,
  submitLabel = "Save",
}: CrudModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onClose();
    }
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, loading, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === overlayRef.current && !loading) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#B54B33]/20 via-transparent to-[#00A896]/10 pointer-events-none" style={{ padding: "1px" }}>
              <div className="w-full h-full rounded-2xl bg-[#0E0C0A]" />
            </div>

            <div className="relative flex flex-col max-h-[85vh] bg-[#0E0C0A] rounded-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#B54B33]/40 to-transparent" />

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <h2 className="text-base font-semibold text-[#F5EDE6]">{title}</h2>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="p-1.5 rounded-lg text-[#8A7A6E] hover:text-[#F5EDE6] hover:bg-white/[0.06] transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto admin-scroll px-6 py-5 space-y-4">
                {children}
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] shrink-0 bg-[#0A0807]/50">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#A09080] hover:text-[#F5EDE6] hover:bg-white/[0.04] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmit}
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#B54B33] to-[#C55A42] text-white shadow-lg shadow-[#B54B33]/20 hover:shadow-[#B54B33]/40 transition-all duration-300 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    submitLabel
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function FormField({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#A09080] uppercase tracking-wider mb-1.5">
        {label}
        {required && <span className="text-[#B54B33] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputClass =
  "w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[#F5EDE6] text-sm placeholder-[#6A5A4E] focus:outline-none focus:border-[#B54B33]/50 focus:bg-white/[0.06] focus:shadow-lg focus:shadow-[#B54B33]/10 transition-all duration-300";
