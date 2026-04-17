"use client";

import { useRouter } from "next/navigation";

export type AdminSection =
  | "overview"
  | "events"
  | "members"
  | "hero_images"
  | "stats"
  | "partners"
  | "mission_items"
  | "community_cards"
  | "signups"
  | "calendar";

interface NavItem {
  key: AdminSection;
  label: string;
  icon: string;
  badge?: string;
}

const NAV: NavItem[] = [
  { key: "overview", label: "Overview", icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" },
  { key: "calendar", label: "Calendar", icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5", badge: "Live" },
  { key: "events", label: "Events", icon: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" },
  { key: "members", label: "Members", icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { key: "hero_images", label: "Hero Images", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12.75A2.25 2.25 0 005.25 21z" },
  { key: "stats", label: "Statistics", icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { key: "partners", label: "Partners", icon: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" },
  { key: "mission_items", label: "Mission", icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" },
  { key: "community_cards", label: "Community", icon: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
  { key: "signups", label: "Signups", icon: "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" },
];

interface SidebarProps {
  active: AdminSection;
  onNavigate: (section: AdminSection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ active, onNavigate, collapsed, onToggle }: SidebarProps) {
  const router = useRouter();

  function handleLogout() {
    sessionStorage.removeItem("admin_authenticated");
    router.push("/admin/login");
  }

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          collapsed ? "w-0 lg:w-[72px] overflow-hidden" : "w-[260px]"
        }`}
      >
        <div className="absolute inset-y-2 inset-x-0 lg:inset-x-1 lg:right-0 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none overflow-hidden pointer-events-none">
          <div className="sidebar-glow absolute inset-0 opacity-50" />
        </div>

        <div className="absolute inset-y-2 inset-x-0 lg:inset-x-1 lg:right-0 rounded-2xl lg:rounded-r-2xl lg:rounded-l-none overflow-hidden" style={{ margin: "1px" }}>
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, rgba(15,11,10,0.92) 0%, rgba(20,14,12,0.95) 50%, rgba(15,11,10,0.92) 100%)",
              backdropFilter: "blur(40px)",
            }}
          />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#B54B33]/10 to-transparent rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-gradient-to-t from-[#00A896]/8 to-transparent rounded-full blur-2xl" />
        </div>

        <div className="relative flex flex-col h-full py-2 lg:py-2 lg:pl-1">
          <div className="flex items-center gap-3 px-5 h-14 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B54B33] to-[#D4654E] flex items-center justify-center shrink-0 shadow-lg shadow-[#B54B33]/30">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-[#F5EDE6] font-bold text-sm leading-tight truncate">Superteam</span>
                <span className="text-[#9A8A78] text-[10px] font-semibold uppercase tracking-[0.15em]">Admin Panel</span>
              </div>
            )}
          </div>

          <div className="mx-4 my-1 h-px bg-gradient-to-r from-transparent via-[#F5EDE6]/10 to-transparent" />

          <nav className="flex-1 overflow-y-auto admin-scroll py-2 px-2.5 space-y-0.5">
            {NAV.map((item) => {
              const isActive = active === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { onNavigate(item.key); if (window.innerWidth < 1024) onToggle(); }}
                  className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-[#B54B33]/15 text-[#F5EDE6]"
                      : "text-[#9A8A78] hover:text-[#E1C699] hover:bg-[#F5EDE6]/[0.04]"
                  }`}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={`shrink-0 transition-colors duration-200 ${isActive ? "text-[#E8826C]" : "text-[#A09080] group-hover:text-[#C0A890]"}`}>
                    <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                    </svg>
                  </span>
                  {!collapsed && (
                    <>
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span className="ml-auto flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#00A896]/15 border border-[#00A896]/25 text-[#4DD8C8] text-[9px] font-bold uppercase tracking-wider">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00A896] pulse-dot" />
                          {item.badge}
                        </span>
                      )}
                      {isActive && !item.badge && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#B54B33] shadow-lg shadow-[#B54B33]/60" />
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mx-4 my-1 h-px bg-gradient-to-r from-transparent via-[#F5EDE6]/10 to-transparent" />

          <div className="px-2.5 pb-1 shrink-0">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#A09080] hover:text-red-400 hover:bg-red-500/[0.08] transition-all duration-300"
              title={collapsed ? "Sign Out" : undefined}
            >
              <svg className="w-[18px] h-[18px] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
