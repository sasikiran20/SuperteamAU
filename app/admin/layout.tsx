"use client";

import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.documentElement.classList.remove("lenis", "lenis-smooth");
    document.body.style.overflow = "";

    type LenisInstance = { stop: () => void; start: () => void; isStopped: boolean };

    function stopLenis() {
      const lenis = (window as { __lenis?: LenisInstance }).__lenis;
      if (lenis && !lenis.isStopped) lenis.stop();
    }

    stopLenis();
    const interval = setInterval(stopLenis, 100);
    const timeout = setTimeout(() => clearInterval(interval), 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.documentElement.classList.add("lenis", "lenis-smooth");
      const lenis = (window as { __lenis?: LenisInstance }).__lenis;
      if (lenis) lenis.start();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden bg-[#0F0B0A]" data-lenis-prevent>
      <style>{`
        body > div > div > header { display: none !important; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }

        /* Admin scrollbar */
        .admin-scroll::-webkit-scrollbar { width: 5px; }
        .admin-scroll::-webkit-scrollbar-track { background: transparent; }
        .admin-scroll::-webkit-scrollbar-thumb { background: rgba(181,75,51,0.25); border-radius: 3px; }
        .admin-scroll::-webkit-scrollbar-thumb:hover { background: rgba(181,75,51,0.4); }

        /* Glass card */
        .glass {
          background: linear-gradient(135deg, rgba(245,237,230,0.05) 0%, rgba(181,75,51,0.04) 50%, rgba(0,168,150,0.03) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(245,237,230,0.10);
          box-shadow: 0 0 40px rgba(181,75,51,0.03), inset 0 1px 0 rgba(245,237,230,0.06);
        }
        .glass-bright {
          background: linear-gradient(135deg, rgba(245,237,230,0.08) 0%, rgba(181,75,51,0.05) 50%, rgba(0,168,150,0.04) 100%);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(245,237,230,0.12);
          box-shadow: 0 0 60px rgba(181,75,51,0.05), 0 0 20px rgba(0,168,150,0.03), inset 0 1px 0 rgba(245,237,230,0.08);
        }
        .glass:hover, .glass-hover:hover {
          background: linear-gradient(135deg, rgba(245,237,230,0.08) 0%, rgba(181,75,51,0.06) 50%, rgba(0,168,150,0.04) 100%);
          border-color: rgba(245,237,230,0.15);
          box-shadow: 0 0 50px rgba(181,75,51,0.06), inset 0 1px 0 rgba(245,237,230,0.08);
        }

        /* Rotating gradient border — same as CTA */
        @property --sidebar-angle {
          syntax: '<angle>';
          initial-value: 0deg;
          inherits: false;
        }
        .sidebar-glow {
          background: conic-gradient(
            from var(--sidebar-angle),
            transparent 20%,
            #B54B33 35%,
            #E1C699 50%,
            #00A896 65%,
            transparent 80%
          );
          animation: sidebar-spin 8s linear infinite;
        }
        @keyframes sidebar-spin {
          to { --sidebar-angle: 360deg; }
        }

        /* Pulse */
        @keyframes admin-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .pulse-dot { animation: admin-pulse 2s ease-in-out infinite; }

        /* Stagger fade-in */
        .stagger > * { opacity: 0; animation: stagger-in 0.5s ease-out forwards; }
        .stagger > *:nth-child(1) { animation-delay: 0.04s; }
        .stagger > *:nth-child(2) { animation-delay: 0.08s; }
        .stagger > *:nth-child(3) { animation-delay: 0.12s; }
        .stagger > *:nth-child(4) { animation-delay: 0.16s; }
        .stagger > *:nth-child(5) { animation-delay: 0.2s; }
        .stagger > *:nth-child(6) { animation-delay: 0.24s; }
        .stagger > *:nth-child(7) { animation-delay: 0.28s; }
        .stagger > *:nth-child(8) { animation-delay: 0.32s; }
        @keyframes stagger-in { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        /* Table row hover */
        .table-row { transition: background 0.15s ease; }
        .table-row:hover { background: rgba(245,237,230,0.04); }

        /* Badge styles */
        .badge-rust { background: rgba(181,75,51,0.18); color: #E8826C; border: 1px solid rgba(181,75,51,0.3); }
        .badge-teal { background: rgba(0,168,150,0.18); color: #4DD8C8; border: 1px solid rgba(0,168,150,0.3); }
        .badge-gold { background: rgba(225,198,153,0.18); color: #E1C699; border: 1px solid rgba(225,198,153,0.3); }
      `}</style>
      {children}
    </div>
  );
}
