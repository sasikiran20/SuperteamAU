"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Sidebar, { type AdminSection } from "./components/sidebar";
import EventCalendar from "./components/event-calendar";
import CrudModal, { FormField, inputClass } from "./components/crud-modal";
import ImageUpload from "./components/image-upload";

interface TableRow {
  id: string | number;
  [key: string]: unknown;
}

interface ColumnDef {
  key: string;
  label: string;
  type: "text" | "number" | "textarea" | "image" | "date" | "select" | "json";
  required?: boolean;
  options?: string[];
  imageFolder?: string;
  placeholder?: string;
  hidden?: boolean;
}

interface TableConfig {
  table: string;
  label: string;
  columns: ColumnDef[];
  orderBy?: string;
  orderAsc?: boolean;
  readOnly?: boolean;
}


const TABLE_CONFIGS: Record<string, TableConfig> = {
  events: {
    table: "events",
    label: "Events",
    columns: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "date", label: "Date", type: "text", required: true, placeholder: "April 22, 2026" },
      { key: "location", label: "Location", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "lumaUrl", label: "Luma URL", type: "text", placeholder: "https://lu.ma/..." },
    ],
    orderBy: "date",
    orderAsc: false,
  },
  members: {
    table: "members",
    label: "Members",
    columns: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "text", required: true },
      { key: "company", label: "Company", type: "text" },
      { key: "handle", label: "Handle", type: "text" },
      { key: "avatar", label: "Avatar", type: "image", imageFolder: "members" },
      { key: "twitter", label: "Twitter", type: "text" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "skills", label: "Skills (JSON array)", type: "json", placeholder: '["Developer","Designer"]' },
      { key: "badges", label: "Badges (JSON array)", type: "json", placeholder: '["Builder"]', hidden: true },
    ],
  },
  hero_images: {
    table: "hero_images",
    label: "Hero Images",
    columns: [
      { key: "image_url", label: "Image", type: "image", required: true, imageFolder: "hero" },
    ],
  },
  stats: {
    table: "stats",
    label: "Statistics",
    columns: [
      { key: "label", label: "Label", type: "text", required: true },
      { key: "value", label: "Value", type: "number", required: true },
      { key: "suffix", label: "Suffix", type: "text", placeholder: "+, %, etc." },
    ],
    orderBy: "id",
    orderAsc: true,
  },
  partners: {
    table: "partners",
    label: "Partners",
    columns: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "logo", label: "Logo", type: "image", required: true, imageFolder: "partners" },
      { key: "url", label: "Website URL", type: "text" },
    ],
    orderBy: "id",
    orderAsc: true,
  },
  mission_items: {
    table: "mission_items",
    label: "Mission Items",
    columns: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea", required: true },
      { key: "image_url", label: "Image", type: "image", imageFolder: "mission" },
    ],
    orderBy: "id",
    orderAsc: true,
  },
  community_cards: {
    table: "community_cards",
    label: "Community Cards",
    columns: [
      { key: "type", label: "Type", type: "select", required: true, options: ["tweet", "testimonial", "social"] },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "src", label: "Avatar URL", type: "text" },
      { key: "handle", label: "Handle", type: "text" },
      { key: "content", label: "Content / Quote", type: "textarea" },
      { key: "quote", label: "Quote (testimonial)", type: "textarea", hidden: true },
      { key: "designation", label: "Designation", type: "text", hidden: true },
      { key: "title", label: "Title (social)", type: "text", hidden: true },
      { key: "description", label: "Description", type: "textarea", hidden: true },
      { key: "metric", label: "Metric", type: "text", hidden: true },
      { key: "likes", label: "Likes", type: "number", hidden: true },
      { key: "retweets", label: "Retweets", type: "number", hidden: true },
      { key: "timestamp", label: "Timestamp", type: "text", hidden: true },
    ],
  },
  signups: {
    table: "get_involved_signups",
    label: "Signups",
    columns: [
      { key: "name", label: "Name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "location", label: "Location", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "skills", label: "Skills", type: "json" },
      { key: "experience_level", label: "Experience", type: "text" },
      { key: "twitter_handle", label: "Twitter", type: "text" },
      { key: "created_at", label: "Signed Up", type: "text" },
    ],
    readOnly: true,
    orderBy: "created_at",
    orderAsc: false,
  },
};

export default function AdminDashboard() {
  const router = useRouter();
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const [rows, setRows] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<TableRow | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | number | null>(null);

  const [overviewCounts, setOverviewCounts] = useState<Record<string, number>>({});
  const [upcomingEvents, setUpcomingEvents] = useState<TableRow[]>([]);
  const [recentCommunity, setRecentCommunity] = useState<TableRow[]>([]);
  useEffect(() => {
    if (sessionStorage.getItem("admin_authenticated") !== "true") {
      router.push("/admin/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    if (!toast) return;
    const duration = toast.type === "error" ? 6000 : 3000;
    const t = setTimeout(() => setToast(null), duration);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchData = useCallback(async (sec: AdminSection) => {
    const config = TABLE_CONFIGS[sec];
    if (!config) return;
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase.from(config.table).select("*");
      if (config.orderBy) query = query.order(config.orderBy, { ascending: config.orderAsc ?? true });
      const { data, error } = await query;
      if (error) throw error;
      setRows(data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    if (section === "overview") fetchOverviewCounts();
    else if (section === "calendar") fetchData("events");
    else fetchData(section);
    setSearchQuery("");
    setDeleteConfirm(null);
  }, [section, authenticated, fetchData]);

  async function fetchOverviewCounts() {
    const supabase = createClient();
    const tables = ["events", "members", "hero_images", "stats", "partners", "mission_items", "community_cards", "get_involved_signups"];
    const counts: Record<string, number> = {};
    await Promise.all([
      ...tables.map(async (t) => {
        const { count } = await supabase.from(t).select("*", { count: "exact", head: true });
        counts[t] = count || 0;
      }),
      (async () => {
        const { data } = await supabase.from("events").select("*").order("date", { ascending: true }).limit(4);
        setUpcomingEvents((data || []) as TableRow[]);
      })(),
      (async () => {
        const { data } = await supabase.from("community_cards").select("*").order("id", { ascending: false }).limit(5);
        setRecentCommunity((data || []) as TableRow[]);
      })(),
    ]);
    setOverviewCounts(counts);
  }

  function openCreate(prefill?: Record<string, unknown>) {
    setEditingRow(null);
    setFormData(prefill || {});
    setModalOpen(true);
  }

  function openEdit(row: TableRow) {
    setEditingRow(row);
    const clone: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      clone[k] = Array.isArray(v) ? JSON.stringify(v) : v;
    }
    setFormData(clone);
    setModalOpen(true);
  }

  async function handleSave() {
    const configKey = section === "calendar" ? "events" : section;
    const config = TABLE_CONFIGS[configKey];
    if (!config) return;

    setSaving(true);
    try {
      const supabase = createClient();

      const payload: Record<string, unknown> = {};
      for (const col of config.columns) {
        const val = formData[col.key];
        if (val === undefined || val === "") {
          if (col.required) throw new Error(`${col.label} is required`);
          payload[col.key] = null;
          continue;
        }
        if (col.type === "json" && typeof val === "string") {
          try { payload[col.key] = JSON.parse(val); } catch { payload[col.key] = null; }
        } else if (col.type === "number") {
          payload[col.key] = Number(val);
        } else {
          payload[col.key] = val;
        }
      }

      console.log("[Admin CRUD] Payload:", payload, "Table:", config.table, "Editing:", !!editingRow);

      if (editingRow) {
        const { data, error } = await supabase.from(config.table).update(payload).eq("id", editingRow.id).select();
        console.log("[Admin CRUD] Update result:", { data, error });
        if (error) throw new Error(`Update failed: ${error.message} (${error.code})`);
        if (!data || data.length === 0) throw new Error("Update failed: No rows affected. Check Supabase RLS policies — the anon key may not have UPDATE permission.");
        setToast({ message: "Updated successfully", type: "success" });
      } else {
        const { data, error } = await supabase.from(config.table).insert([payload]).select();
        console.log("[Admin CRUD] Insert result:", { data, error });
        if (error) throw new Error(`Insert failed: ${error.message} (${error.code})`);
        if (!data || data.length === 0) throw new Error("Insert failed: No rows returned. Check Supabase RLS policies — the anon key may not have INSERT permission.");
        setToast({ message: "Created successfully", type: "success" });
      }

      setModalOpen(false);
      setEditingRow(null);
      setFormData({});
      fetchData(configKey as AdminSection);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Operation failed";
      setToast({ message: msg, type: "error" });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string | number) {
    const configKey = section === "calendar" ? "events" : section;
    const config = TABLE_CONFIGS[configKey];
    if (!config) return;
    try {
      const supabase = createClient();
      const { error, count } = await supabase.from(config.table).delete().eq("id", id);
      console.log("[Admin CRUD] Delete result:", { error, count });
      if (error) throw new Error(`Delete failed: ${error.message} (${error.code})`);
      setDeleteConfirm(null);
      setToast({ message: "Deleted successfully", type: "success" });
      fetchData(configKey as AdminSection);
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : "Delete failed", type: "error" });
    }
  }

  const filteredRows = searchQuery
    ? rows.filter((row) =>
        Object.values(row).some((val) =>
          String(val ?? "").toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : rows;

  if (!authenticated) return null;

  const currentConfig = TABLE_CONFIGS[section === "calendar" ? "events" : section];
  const isTableSection = !!currentConfig && section !== "overview" && section !== "calendar";

  return (
    <div className="min-h-screen bg-[#0A0807] admin-scroll">
      <Sidebar
        active={section}
        onNavigate={setSection}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className={`transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"}`}>
        <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 sm:px-6 border-b border-white/[0.04] bg-[#0A0807]/90 backdrop-blur-xl">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-xl hover:bg-white/[0.06] text-[#9A8A78] hover:text-[#F5EDE6] transition-all duration-200"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-[#F5EDE6] tracking-tight">
              {section === "hero_images" ? "Hero Images" : section === "mission_items" ? "Mission" : section === "community_cards" ? "Community" : section.charAt(0).toUpperCase() + section.slice(1)}
            </h1>
            {isTableSection && (
              <span className="text-[10px] font-semibold text-[#8A7A6E] bg-white/[0.04] px-2 py-0.5 rounded-full">
                {filteredRows.length}
              </span>
            )}
          </div>

          <div className="flex-1" />

          {isTableSection && (
            <div className="hidden sm:block relative max-w-[240px] w-full">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6A5A4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs text-[#F5EDE6] placeholder-[#6A5A4E] focus:outline-none focus:border-[#B54B33]/40 transition-all duration-200"
              />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-[#6A5A4E] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00A896] pulse-dot" />
            <span className="hidden sm:inline">Connected</span>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              {section === "overview" && <OverviewSection counts={overviewCounts} onNavigate={setSection} upcomingEvents={upcomingEvents} recentCommunity={recentCommunity} />}
              {section === "calendar" && (
                <EventCalendar
                  events={rows as { id: string | number; title: string; date: string; location: string; description: string }[]}
                  onCreateEvent={(date) => openCreate({ date })}
                  onEditEvent={(evt) => openEdit(evt as unknown as TableRow)}
                />
              )}
              {isTableSection && (
                <DataTableSection
                  config={currentConfig}
                  rows={filteredRows}
                  loading={loading}
                  onRefresh={() => fetchData(section)}
                  onCreate={() => openCreate()}
                  onEdit={openEdit}
                  onDelete={(id) => setDeleteConfirm(id)}
                  deleteConfirm={deleteConfirm}
                  onDeleteConfirm={handleDelete}
                  onDeleteCancel={() => setDeleteConfirm(null)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {currentConfig && !currentConfig.readOnly && (
        <CrudModal
          open={modalOpen}
          onClose={() => { setModalOpen(false); setEditingRow(null); }}
          title={editingRow ? `Edit ${currentConfig.label}` : `New ${currentConfig.label}`}
          onSubmit={handleSave}
          loading={saving}
          submitLabel={editingRow ? "Update" : "Create"}
        >
          {currentConfig.columns.map((col) => {
            const value = formData[col.key] ?? "";

            if (col.type === "image") {
              return (
                <FormField key={col.key} label={col.label} required={col.required}>
                  <ImageUpload
                    folder={col.imageFolder || "general"}
                    currentUrl={typeof value === "string" ? value : undefined}
                    onUpload={(url) => setFormData((f) => ({ ...f, [col.key]: url }))}
                  />
                </FormField>
              );
            }

            if (col.type === "select") {
              return (
                <FormField key={col.key} label={col.label} required={col.required}>
                  <select
                    value={String(value)}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                    className={inputClass}
                  >
                    <option value="">Select...</option>
                    {col.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </FormField>
              );
            }

            if (col.type === "textarea") {
              return (
                <FormField key={col.key} label={col.label} required={col.required}>
                  <textarea
                    value={String(value)}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                    rows={3}
                    className={inputClass + " resize-none"}
                    placeholder={col.placeholder}
                  />
                </FormField>
              );
            }

            if (col.type === "json") {
              const displayVal = typeof value === "object" ? JSON.stringify(value) : String(value);
              return (
                <FormField key={col.key} label={col.label} required={col.required}>
                  <textarea
                    value={displayVal}
                    onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                    rows={2}
                    className={inputClass + " font-mono text-xs resize-none"}
                    placeholder={col.placeholder}
                  />
                </FormField>
              );
            }

            return (
              <FormField key={col.key} label={col.label} required={col.required}>
                <input
                  type={col.type === "number" ? "number" : "text"}
                  value={String(value)}
                  onChange={(e) => setFormData((f) => ({ ...f, [col.key]: e.target.value }))}
                  className={inputClass}
                  placeholder={col.placeholder}
                />
              </FormField>
            );
          })}
        </CrudModal>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className={`fixed bottom-6 left-1/2 z-[200] px-5 py-3 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "bg-[#00A896]/20 text-[#4DD8C8] ring-1 ring-[#00A896]/30"
                : "bg-red-500/20 text-red-300 ring-1 ring-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              {toast.type === "success" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              )}
              {toast.message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const OVERVIEW_CARDS: { key: AdminSection; table: string; label: string; color: string; iconPath: string }[] = [
  { key: "events", table: "events", label: "Events", color: "#B54B33", iconPath: "M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z" },
  { key: "members", table: "members", label: "Members", color: "#00A896", iconPath: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
  { key: "hero_images", table: "hero_images", label: "Hero Images", color: "#E1C699", iconPath: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12.75A2.25 2.25 0 005.25 21z" },
  { key: "stats", table: "stats", label: "Statistics", color: "#A855F7", iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
  { key: "partners", table: "partners", label: "Partners", color: "#3B82F6", iconPath: "M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757" },
  { key: "mission_items", table: "mission_items", label: "Mission", color: "#EC4899", iconPath: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" },
  { key: "community_cards", table: "community_cards", label: "Community", color: "#F59E0B", iconPath: "M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" },
  { key: "signups", table: "get_involved_signups", label: "Signups", color: "#10B981", iconPath: "M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" },
];

function OverviewSection({ counts, onNavigate, upcomingEvents, recentCommunity }: {
  counts: Record<string, number>;
  onNavigate: (s: AdminSection) => void;
  upcomingEvents: TableRow[];
  recentCommunity: TableRow[];
}) {
  const EVENT_COLORS = ["#B54B33", "#00A896", "#E1C699", "#A855F7"];

  return (
    <div className="space-y-6">
      <div className="glass-bright rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#B54B33]/10 via-[#E1C699]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#00A896]/8 to-transparent rounded-full blur-3xl" />
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-[#F5EDE6] tracking-tight">Welcome back</h2>
              <p className="text-sm text-[#9A8A78] mt-1">Here is what is happening with your Superteam Australia content today.</p>
            </div>
            <button
              onClick={() => onNavigate("calendar")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B54B33] to-[#C55A42] text-white text-sm font-semibold shadow-lg shadow-[#B54B33]/25 hover:shadow-[#B54B33]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Open Calendar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
        {OVERVIEW_CARDS.map((card) => (
          <button key={card.key} onClick={() => onNavigate(card.key)} className="text-left group">
            <div className="glass rounded-2xl p-4 sm:p-5 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-[#F5EDE6]/15" style={{ boxShadow: `0 0 30px ${card.color}06` }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${card.color}15`, border: `1px solid ${card.color}20` }}>
                  <svg className="w-4 h-4" style={{ color: card.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={card.iconPath} />
                  </svg>
                </div>
                <svg className="w-3.5 h-3.5 text-[#5A4A3E] group-hover:text-[#A09080] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-[#F5EDE6] tracking-tight">
                {counts[card.table] ?? <span className="inline-block w-8 h-6 bg-[#F5EDE6]/[0.04] rounded animate-pulse" />}
              </p>
              <p className="text-xs font-medium text-[#9A8A78] mt-0.5">{card.label}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-bright rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#B54B33]/8 to-transparent rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#B54B33]/15 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#E8826C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#F5EDE6]">Upcoming Events</h3>
              </div>
              <button onClick={() => onNavigate("events")} className="text-[10px] font-semibold text-[#B54B33] hover:text-[#E8826C] transition-colors">
                View All →
              </button>
            </div>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-[#8A7A6E] text-center py-8">No upcoming events</p>
            ) : (
              <div className="space-y-2.5">
                {upcomingEvents.map((evt, idx) => {
                  const color = EVENT_COLORS[idx % EVENT_COLORS.length];
                  const evtDate = new Date(String(evt.date));
                  const isValidDate = !isNaN(evtDate.getTime());
                  return (
                    <motion.div
                      key={evt.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-[#F5EDE6]/[0.04] cursor-pointer"
                      onClick={() => onNavigate("events")}
                    >
                      <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${color}12`, border: `1px solid ${color}20` }}>
                        <span className="text-[10px] font-bold uppercase" style={{ color }}>{isValidDate ? evtDate.toLocaleDateString("en-AU", { month: "short" }) : "TBD"}</span>
                        <span className="text-base font-bold text-[#F5EDE6] leading-none">{isValidDate ? evtDate.getDate() : "?"}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-[#F5EDE6] truncate">{String(evt.title)}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <svg className="w-3 h-3 text-[#8A7A6E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                          </svg>
                          <span className="text-[11px] text-[#A09080] truncate">{String(evt.location || "TBD")}</span>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-[#5A4A3E] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="glass-bright rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#F59E0B]/8 to-transparent rounded-full blur-2xl" />
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-[#F59E0B]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-[#F5EDE6]">Community</h3>
              </div>
              <button onClick={() => onNavigate("community_cards")} className="text-[10px] font-semibold text-[#F59E0B] hover:text-[#FCD34D] transition-colors">
                View All →
              </button>
            </div>
            {recentCommunity.length === 0 ? (
              <p className="text-sm text-[#8A7A6E] text-center py-8">No community posts yet</p>
            ) : (
              <div className="space-y-2">
                {recentCommunity.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5EDE6]/[0.04] transition-all duration-200 cursor-pointer"
                    onClick={() => onNavigate("community_cards")}
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F59E0B]/20 to-[#F59E0B]/5 flex items-center justify-center shrink-0 border border-[#F59E0B]/20 overflow-hidden">
                      {item.src ? (
                        <img src={String(item.src)} alt={String(item.name)} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-[#FCD34D]">
                          {String(item.name || "?").charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#F5EDE6] truncate">{String(item.name)}</p>
                      <p className="text-[11px] text-[#A09080] truncate">{String(item.handle || item.type)}</p>
                    </div>
                    <span className="text-[9px] font-semibold tracking-wider text-[#F59E0B] px-2 py-0.5 rounded flex-shrink-0" style={{ background: '#F59E0B15' }}>
                      {String(item.type).toUpperCase()}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="text-xs font-bold text-[#9A8A78] uppercase tracking-widest mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "View Calendar", section: "calendar" as AdminSection, color: "#B54B33" },
            { label: "Manage Events", section: "events" as AdminSection, color: "#00A896" },
            { label: "Manage Members", section: "members" as AdminSection, color: "#E1C699" },
            { label: "Upload Images", section: "hero_images" as AdminSection, color: "#A855F7" },
          ].map((action) => (
            <button
              key={action.section}
              onClick={() => onNavigate(action.section)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:scale-[1.03]"
              style={{ background: `${action.color}12`, color: action.color, border: `1px solid ${action.color}25` }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataTableSection({
  config, rows, loading, onRefresh, onCreate, onEdit, onDelete,
  deleteConfirm, onDeleteConfirm, onDeleteCancel,
}: {
  config: TableConfig; rows: TableRow[]; loading: boolean;
  onRefresh: () => void; onCreate: () => void; onEdit: (row: TableRow) => void;
  onDelete: (id: string | number) => void;
  deleteConfirm: string | number | null;
  onDeleteConfirm: (id: string | number) => void; onDeleteCancel: () => void;
}) {
  const visibleColumns = config.columns.filter((c) => !c.hidden);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#8A7A6E] font-medium">{rows.length} record{rows.length !== 1 ? "s" : ""}</p>
        <div className="flex items-center gap-2">
          <button onClick={onRefresh} className="p-2 rounded-xl hover:bg-white/[0.06] text-[#8A7A6E] hover:text-[#F5EDE6] transition-all duration-200" title="Refresh">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
            </svg>
          </button>
          {!config.readOnly && (
            <button
              onClick={onCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#B54B33] to-[#C55A42] text-white text-xs font-semibold shadow-lg shadow-[#B54B33]/20 hover:shadow-[#B54B33]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add New
            </button>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <svg className="animate-spin w-6 h-6 text-[#B54B33]" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-xs text-[#6A5A4E]">Loading...</span>
            </div>
          </div>
        ) : rows.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-[#5A4A3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
              </svg>
            </div>
            <p className="text-sm text-[#6A5A4E]">No records found</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto admin-scroll">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {visibleColumns.map((col) => (
                      <th key={col.key} className="text-left text-[10px] font-bold text-[#8A7A6E] uppercase tracking-widest px-5 py-3.5">
                        {col.label}
                      </th>
                    ))}
                    {!config.readOnly && (
                      <th className="text-right text-[10px] font-bold text-[#8A7A6E] uppercase tracking-widest px-5 py-3.5 w-[100px]">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, rowIdx) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIdx * 0.03 }}
                      className="table-row border-b border-white/[0.03] last:border-0"
                    >
                      {visibleColumns.map((col) => (
                        <td key={col.key} className="px-5 py-3.5 text-sm text-[#D4C4B0] max-w-[220px]">
                          <CellValue value={row[col.key]} type={col.type} />
                        </td>
                      ))}
                      {!config.readOnly && (
                        <td className="px-5 py-3.5 text-right">
                          <RowActions
                            rowId={row.id}
                            onEdit={() => onEdit(row)}
                            onDelete={() => onDelete(row.id)}
                            isDeleting={deleteConfirm === row.id}
                            onDeleteConfirm={() => onDeleteConfirm(row.id)}
                            onDeleteCancel={onDeleteCancel}
                          />
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-white/[0.04]">
              {rows.map((row) => (
                <div key={row.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#6A5A4E] font-mono">#{String(row.id).slice(0, 8)}</span>
                    {!config.readOnly && (
                      <RowActions
                        rowId={row.id}
                        onEdit={() => onEdit(row)}
                        onDelete={() => onDelete(row.id)}
                        isDeleting={deleteConfirm === row.id}
                        onDeleteConfirm={() => onDeleteConfirm(row.id)}
                        onDeleteCancel={onDeleteCancel}
                      />
                    )}
                  </div>
                  {visibleColumns.slice(0, 4).map((col) => (
                    <div key={col.key} className="flex items-start gap-2">
                      <span className="text-[10px] text-[#6A5A4E] min-w-[72px] shrink-0 font-medium uppercase tracking-wider">{col.label}</span>
                      <span className="text-xs text-[#D4C4B0] truncate"><CellValue value={row[col.key]} type={col.type} /></span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RowActions({ rowId, onEdit, onDelete, isDeleting, onDeleteConfirm, onDeleteCancel }: {
  rowId: string | number; onEdit: () => void; onDelete: () => void;
  isDeleting: boolean; onDeleteConfirm: () => void; onDeleteCancel: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-white/[0.08] text-[#8A7A6E] hover:text-[#F5EDE6] transition-all duration-200" title="Edit">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      </button>
      <AnimatePresence mode="wait">
        {isDeleting ? (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex gap-1">
            <button onClick={onDeleteConfirm} className="px-2 py-1 rounded-lg bg-red-500/15 text-red-400 text-[10px] font-bold ring-1 ring-red-500/25 hover:bg-red-500/25 transition-all">Yes</button>
            <button onClick={onDeleteCancel} className="px-2 py-1 rounded-lg text-[#8A7A6E] text-[10px] font-bold hover:bg-white/[0.06] transition-all">No</button>
          </motion.div>
        ) : (
          <motion.button key="delete" onClick={onDelete} className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#6A5A4E] hover:text-red-400 transition-all duration-200" title="Delete">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function CellValue({ value, type }: { value: unknown; type: string }) {
  if (value === null || value === undefined) return <span className="text-[#5A4A3E]">—</span>;

  if (type === "image" && typeof value === "string" && value) {
    return (
      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/[0.04] ring-1 ring-white/[0.06]">
        <Image src={value} alt="" fill className="object-cover" unoptimized />
      </div>
    );
  }

  if (type === "json" || Array.isArray(value)) {
    const arr = Array.isArray(value) ? value : [];
    if (arr.length === 0) return <span className="text-[#5A4A3E]">—</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {arr.slice(0, 3).map((item, i) => (
          <span key={i} className="badge-rust px-1.5 py-0.5 rounded-md text-[10px] font-semibold">{String(item)}</span>
        ))}
        {arr.length > 3 && <span className="text-[10px] text-[#6A5A4E] font-medium">+{arr.length - 3}</span>}
      </div>
    );
  }

  const str = String(value);
  if (str.length > 50) return <span className="truncate block max-w-[200px]" title={str}>{str}</span>;
  return <span>{str}</span>;
}
