import React, { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getAllTasksApi } from "../API/tasks";

function parseISODateLocal(iso){
  if (!iso) return null;
  const [datePart] = String(iso).split("T");
  const [y,m,d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y,m-1,d);
}

function startOfDay(date){
  return new Date(date.getFullYear(),date.getMonth(), date.getDate())
}

function isSameDay(a,b){
  return (
    a && 
    b &&
    a.getFullYear()=== b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

// Monday-start week range (Mon 00:00:00 → Sun 23:59:59)
function getCurrentWeekRange(today = new Date()) {
  const t = startOfDay(today);
  const jsDay = t.getDay(); // 0=Sun .. 6=Sat
  const offsetToMon = (jsDay + 6) % 7; // Mon=0 .. Sun=6
  const monday = new Date(t); monday.setDate(t.getDate() - offsetToMon);
  const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6);
  return { monday, sunday };
}

export default function Dashboard({ userId }) {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);
  const [todaysTasks, setTodaysTasks] = useState([]);

  // If you later add a "completed" flag, compute it here.
  const completedTasks = 0;

  useEffect(() => {
    (async () => {
      try {
        // Ensure your getAllTasksApi returns the ARRAY (or adjust with .data)
        const arr = await getAllTasksApi();
        const clean = Array.isArray(arr) ? arr : (arr?.data ?? []);
        const today = startOfDay(new Date());
        const decorated = clean.map(t=>{
          const d = parseISODateLocal(t.due_date)
          let status = 'unscheduled'
          if(d){
            const sd = startOfDay(d)
            if (sd < today) status = 'overdue';
            else if (isSameDay(sd,today)) status = 'today';
            else status = 'upcoming'
          }
          return {...t , status}
        })
        setTasks(clean);


        // Derive totals
        const total = decorated.length;
        const overdue = decorated.filter(t=> t.status ==='overdue').length;
        const todays = decorated.filter(t=> t.status ==='today');

        setTotalTasks(total);
        setOverdueTasks(overdue);
        setTodaysTasks(todays);
      } catch (e) {
        console.error("Failed to load dashboard data:", e);
        setTasks([]);
        setTotalTasks(0);
        setOverdueTasks(0);
        setTodaysTasks([]);
      }
    })();
  }, [userId]);

  // Weekly distribution (current week Mon–Sun)
  const weeklyData = useMemo(() => {
    const { monday, sunday } = getCurrentWeekRange(new Date());
    const counts = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    tasks.forEach((t) => {
      const d = parseISODateLocal(t.due_date);
      if (!d) return;
      const sd = startOfDay(d);
      if (sd >= startOfDay(monday) && sd <= startOfDay(sunday)) {
        const dayName = labels[sd.getDay()];
        // remap so we show Mon..Sun in order
        const key = dayName === "Sun" ? "Sun" : dayName;
        counts[key]++;
      }
    });

    // Return in Mon..Sun order
    return [
      { day: "Mon", tasks: counts.Mon },
      { day: "Tue", tasks: counts.Tue },
      { day: "Wed", tasks: counts.Wed },
      { day: "Thu", tasks: counts.Thu },
      { day: "Fri", tasks: counts.Fri },
      { day: "Sat", tasks: counts.Sat },
      { day: "Sun", tasks: counts.Sun },
    ];
  }, [tasks]);

  const COLORS = ["#FF8042", "#00C49F", "#8884d8", "#82ca9d", "#ffc658", "#d0ed57", "#a4de6c"];
  const weeklyPieData = weeklyData.map((item) => ({ name: item.day, value: item.tasks }));
  const progressData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: Math.max(0, totalTasks - completedTasks) },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Statistic Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded text-center">
          <h4 className="text-lg font-semibold">Total Tasks</h4>
          <p className="text-2xl">{totalTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded text-center">
          <h4 className="text-lg font-semibold">Overdue</h4>
          <p className="text-2xl text-red-600">{overdueTasks}</p>
        </div>
        <div className="p-4 bg-white shadow rounded text-center">
          <h4 className="text-lg font-semibold">Due Today</h4>
          <p className="text-2xl">{todaysTasks.length}</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-8">
        {/* Weekly Tasks Pie Chart */}
        <div className="bg-white p-4 shadow rounded flex flex-col items-center">
          <h4 className="text-lg font-semibold mb-4">This Week's Due Tasks</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={weeklyPieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {weeklyPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Donut Chart (placeholder until you track completion) */}
        <div className="bg-white p-4 shadow rounded flex flex-col items-center">
          <h4 className="text-lg font-semibold mb-4">Progress</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={progressData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                {progressData.map((entry, index) => (
                  <Cell key={`cell-progress-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-sm text-gray-500 mt-2">
            (Add a <code>completed</code> flag to tasks to make this real)
          </div>
        </div>
      </div>

      {/* Today's Tasks List */}
      <div className="bg-white p-4 shadow rounded">
        <h4 className="text-lg font-semibold mb-4">Today's Tasks</h4>
        {todaysTasks.length === 0 ? (
          <div className="text-gray-500">No tasks due today.</div>
        ) : (
          <ul className="space-y-2">
            {todaysTasks.map((task) => (
              <li key={task.task_id} className="p-2 border rounded hover:bg-gray-50 flex justify-between items-center">
                <span>{task.task_name}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-800">
                  {task.status ==="today" ? "Today" :task.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
