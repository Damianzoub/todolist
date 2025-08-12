import React, { useMemo, useState } from "react";

/**
 * props:
 *  - tasks: [{ task_id, task_name, due_date: "YYYY-MM-DD", ... }]
 *  - onTaskClick?: (task) => void
 *  - onDayClick?: (isoDate, tasksForDay) => void
 */
export default function Calendar({ tasks = [], onTaskClick, onDayClick }) {
  const [cursor, setCursor] = useState(new Date()); // month being viewed

  // Group tasks by YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map = {};
    for (const t of tasks || []) {
      const key = (t.due_date || "").slice(0, 10); // assume ISO
      if (!key) continue;
      (map[key] ||= []).push(t);
    }
    return map;
  }, [tasks]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth(); // 0..11
  const firstOfMonth = new Date(year, month, 1);
  // Monday-first grid: getDay() Sun=0..Sat=6 -> Mon=0..Sun=6
  const weekdayOfFirst = (firstOfMonth.getDay() + 6) % 7;
  const gridStart = new Date(year, month, 1 - weekdayOfFirst);

  // Build 6x7 grid (42 days)
  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    days.push(d);
  }

  const isSameDate = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const fmtKey = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  const today = new Date();
  const goPrev = () => setCursor(new Date(year, month - 1, 1));
  const goNext = () => setCursor(new Date(year, month + 1, 1));
  const goToday = () => setCursor(new Date());
  const monthName = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl font-semibold">{monthName}</div>
        <div className="flex gap-2">
          <button onClick={goPrev} className="px-3 py-1 rounded border hover:bg-gray-100">‹</button>
          <button onClick={goToday} className="px-3 py-1 rounded border hover:bg-gray-100">Today</button>
          <button onClick={goNext} className="px-3 py-1 rounded border hover:bg-gray-100">›</button>
        </div>
      </div>

      {/* Weekday headings */}
      <div className="grid grid-cols-7 text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">
        {weekdayLabels.map((w) => (
          <div key={w} className="px-2 py-1">{w}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-[1px] bg-gray-200 rounded overflow-hidden">
        {days.map((d) => {
          const inThisMonth = d.getMonth() === month;
          const key = fmtKey(d);
          const dayTasks = tasksByDate[key] || [];
          const isToday = isSameDate(d, today);

          const maxPills = 2; // show up to 2 pills
          const extra = Math.max(0, dayTasks.length - maxPills);

          return (
            <div
              key={key}
              className={`min-h-24 bg-white dark:bg-gray-900 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition
                          ${inThisMonth ? "" : "opacity-50"}
                          ${isToday ? "ring-2 ring-orange-500" : ""}`}
              onClick={() => onDayClick?.(key, dayTasks)}
            >
              {/* Day number + dot if tasks */}
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm font-medium">{d.getDate()}</div>
                {dayTasks.length > 0 && (
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500" />
                )}
              </div>

              {/* Task pills */}
              <div className="flex flex-col gap-1">
                {dayTasks.slice(0, maxPills).map((t) => (
                  <button
                    key={t.task_id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onTaskClick?.(t);
                    }}
                    className="truncate w-full text-left text-xs px-2 py-1 rounded bg-orange-100 text-orange-900 hover:bg-orange-200"
                    title={t.task_name}
                  >
                    {t.task_name}
                  </button>
                ))}
                {extra > 0 && (
                  <div className="text-[11px] text-gray-500">+{extra} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
