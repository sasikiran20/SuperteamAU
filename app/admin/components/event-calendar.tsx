"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CalendarEvent {
  id: string | number;
  title: string;
  date: string;
  location: string;
  description: string;
}

interface EventCalendarProps {
  events: CalendarEvent[];
  onCreateEvent: (date: string) => void;
  onEditEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const EVENT_COLORS = [
  { bg: "bg-[#B54B33]/20", ring: "ring-[#B54B33]/30", text: "text-[#E8826C]", dot: "bg-[#B54B33]" },
  { bg: "bg-[#00A896]/20", ring: "ring-[#00A896]/30", text: "text-[#4DD8C8]", dot: "bg-[#00A896]" },
  { bg: "bg-[#E1C699]/20", ring: "ring-[#E1C699]/30", text: "text-[#E1C699]", dot: "bg-[#E1C699]" },
  { bg: "bg-purple-500/20", ring: "ring-purple-500/30", text: "text-purple-300", dot: "bg-purple-500" },
  { bg: "bg-blue-500/20", ring: "ring-blue-500/30", text: "text-blue-300", dot: "bg-blue-500" },
];

function getColor(index: number) {
  return EVENT_COLORS[index % EVENT_COLORS.length];
}

export default function EventCalendar({ events, onCreateEvent, onEditEvent }: EventCalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDow = firstDay.getDay() - 1;
    if (startDow < 0) startDow = 6;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month, -i), isCurrentMonth: false });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push({ date: new Date(year, month, d), isCurrentMonth: true });
    }
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        days.push({ date: new Date(year, month + 1, d), isCurrentMonth: false });
      }
    }
    return days;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.date);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const arr = map.get(key) || [];
      arr.push(event);
      map.set(key, arr);
    }
    return map;
  }, [events]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return events
      .filter((e) => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 6);
  }, [events]);

  function navigate(dir: -1 | 1) {
    const newMonth = month + dir;
    if (newMonth < 0) { setMonth(11); setYear(year - 1); }
    else if (newMonth > 11) { setMonth(0); setYear(year + 1); }
    else setMonth(newMonth);
  }

  function isToday(date: Date) {
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }

  function formatDateStr(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function handleDateClick(date: Date) {
    const key = formatDateStr(date);
    if (selectedDate === key) {
      onCreateEvent(key);
      setSelectedDate(null);
    } else {
      setSelectedDate(key);
    }
  }

  return (
    <div className="space-y-6 admin-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#F5EDE6] tracking-tight">Event Calendar</h2>
          <p className="text-sm text-[#8A7A6E] mt-0.5">Click a date to create, click an event to edit</p>
        </div>
        <button
          onClick={() => onCreateEvent(formatDateStr(today))}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B54B33] to-[#C55A42] text-white text-sm font-semibold shadow-lg shadow-[#B54B33]/20 hover:shadow-[#B54B33]/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Event
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
        <div className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-white/[0.06] text-[#8A7A6E] hover:text-[#F5EDE6] transition-all duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#F5EDE6]">{MONTHS[month]}</h3>
              <span className="text-xs text-[#8A7A6E] font-medium">{year}</span>
            </div>
            <button onClick={() => navigate(1)} className="p-2 rounded-xl hover:bg-white/[0.06] text-[#8A7A6E] hover:text-[#F5EDE6] transition-all duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 border-b border-white/[0.04]">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-3 text-center text-[10px] font-bold text-[#8A7A6E] uppercase tracking-widest">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => {
              const key = `${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`;
              const dayEvents = eventsByDate.get(key) || [];
              const isTodayCell = isToday(day.date);
              const isSelected = selectedDate === formatDateStr(day.date);

              return (
                <div
                  key={i}
                  onClick={() => handleDateClick(day.date)}
                  className={`min-h-[80px] sm:min-h-[100px] p-1.5 border-b border-r border-white/[0.04] cursor-pointer transition-all duration-200 ${
                    !day.isCurrentMonth ? "opacity-20" : "hover:bg-white/[0.03]"
                  } ${isSelected ? "bg-[#B54B33]/[0.08] ring-1 ring-inset ring-[#B54B33]/30" : ""}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 ${
                        isTodayCell
                          ? "bg-gradient-to-br from-[#B54B33] to-[#D4654E] text-white shadow-lg shadow-[#B54B33]/30"
                          : isSelected
                          ? "text-[#E8826C]"
                          : "text-[#8A7A6E]"
                      }`}
                    >
                      {day.date.getDate()}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((evt, idx) => {
                      const color = getColor(idx);
                      return (
                        <button
                          key={evt.id}
                          onClick={(e) => { e.stopPropagation(); onEditEvent(evt); }}
                          className={`w-full text-left px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold truncate ring-1 ${color.bg} ${color.ring} ${color.text} hover:scale-[1.02] transition-transform duration-150`}
                        >
                          {evt.title}
                        </button>
                      );
                    })}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-[#8A7A6E] font-medium px-1.5">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
            className="w-full glass glass-hover rounded-xl p-3 flex items-center gap-3 transition-all duration-300"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B54B33]/20 to-[#B54B33]/5 flex items-center justify-center">
              <span className="text-[#E8826C] font-bold text-sm">{today.getDate()}</span>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-[#F5EDE6]">Today</p>
              <p className="text-[11px] text-[#8A7A6E]">
                {today.toLocaleDateString("en-AU", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </button>

          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#F5EDE6] uppercase tracking-wider">Upcoming</h3>
              <span className="text-[10px] font-semibold text-[#8A7A6E] bg-white/[0.04] px-2 py-1 rounded-full">
                {upcomingEvents.length} events
              </span>
            </div>
            <AnimatePresence>
              {upcomingEvents.length === 0 ? (
                <p className="text-sm text-[#6A5A4E] text-center py-6">No upcoming events</p>
              ) : (
                <div className="space-y-2.5">
                  {upcomingEvents.map((evt, idx) => {
                    const color = getColor(idx);
                    const evtDate = new Date(evt.date);
                    return (
                      <motion.button
                        key={evt.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => onEditEvent(evt)}
                        className="w-full text-left group"
                      >
                        <div className={`rounded-xl p-3.5 ring-1 ${color.bg} ${color.ring} transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-2 h-2 rounded-full mt-1.5 ${color.dot} shrink-0`} />
                            <div className="min-w-0 flex-1">
                              <p className={`text-sm font-semibold ${color.text} truncate`}>{evt.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[11px] text-[#A09080]">
                                  {evtDate.toLocaleDateString("en-AU", { month: "short", day: "numeric" })}
                                </span>
                                {evt.location && (
                                  <>
                                    <span className="w-0.5 h-0.5 rounded-full bg-[#3A2A1E]" />
                                    <span className="text-[11px] text-[#8A7A6E] truncate">{evt.location}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
