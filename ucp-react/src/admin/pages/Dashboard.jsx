
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, BookOpen, FolderKanban, Users, MessageSquare,
  TrendingUp, ArrowUpRight, Plus, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

import {
  noticesService,
  magazinesService,
  projectsService,
  societiesService,
  contactService,
} from "../services";

async function fetchCounts() {
  try {
    const [
      noticesRes,
      magazinesRes,
      projectsRes,
      societiesRes,
      messagesRes,
    ] = await Promise.all([
      noticesService.getAllNotices(),
      magazinesService.getAllMagazines(),
      projectsService.getAllProjects(),
      societiesService.getAllSocieties(),
      contactService.getAllMessages(),
    ]);

    // Helper to safely extract arrays from various API response formats
    const safeArray = (response) => {
      if (!response?.data) return [];
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data.data)) return response.data.data;
      if (Array.isArray(response.data.announcements)) return response.data.announcements;
      if (Array.isArray(response.data.magazines)) return response.data.magazines;
      if (Array.isArray(response.data.projects)) return response.data.projects;
      if (Array.isArray(response.data.societies)) return response.data.societies;
      if (Array.isArray(response.data.messages)) return response.data.messages;
      if (Array.isArray(response.data.results)) return response.data.results;
      return [];
    };

    const notices = safeArray(noticesRes);
    const magazines = safeArray(magazinesRes);
    const projects = safeArray(projectsRes);
    const societies = safeArray(societiesRes);
    const messages = safeArray(messagesRes);

    return {
      notices: notices.length,
      magazines: magazines.length,
      projects: projects.length,
      societies: societies.length,
      messages: messages.length,
      unread: messages.filter((m) => m.status === "unread").length,
      weekly: [
        { name: "Mon", value: 4 },
        { name: "Tue", value: 6 },
        { name: "Wed", value: 5 },
        { name: "Thu", value: 8 },
        { name: "Fri", value: 9 },
        { name: "Sat", value: 7 },
        { name: "Sun", value: 6 },
      ],
    };
  } catch (error) {
    console.error("Failed to load stats:", error);
    return {
      notices: 0,
      magazines: 0,
      projects: 0,
      societies: 0,
      messages: 0,
      unread: 0,
      weekly: [],
    };
  }
}

function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const tick = (now) => {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(start + (target - start) * eased));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function StatCard({ title, value, icon: Icon, gradient, trend, delay }) {
  const count = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.10)" }}
      className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm transition-all duration-200"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-slate-800">{count}</p>
          {trend && (
            <div className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </div>
          )}
        </div>
        <div
          className="grid h-11 w-11 place-items-center rounded-xl shadow-sm"
          style={{ background: gradient }}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm animate-pulse">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-3 w-16 bg-slate-200 rounded" />
          <div className="h-8 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-11 w-11 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounts()
      .then(data => setStats(data))
      .catch(err => console.error("Failed to load stats:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl bg-white border border-slate-200/70 p-8 shadow-sm animate-pulse">
          <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
          <div className="h-4 w-72 bg-slate-200 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
          {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm animate-pulse" />
          <div className="h-80 rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 h-80 rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm animate-pulse" />
          <div className="h-80 rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  const { notices, magazines, projects, societies, messages, unread, weekly } = stats;

  const barData = [
    { name: "Notices", value: notices },
    { name: "Magazines", value: magazines },
    { name: "Projects", value: projects },
    { name: "Societies", value: societies },
    { name: "Messages", value: messages },
  ];

  const pieData = [
    { name: "Notices", value: notices || 1 },
    { name: "Projects", value: projects || 1 },
    { name: "Societies", value: societies || 1 },
    { name: "Messages", value: messages || 1 },
  ];
  const pieColors = ["#4F46E5", "#06B6D4", "#7C3AED", "#38BDF8"];

  const quickActions = [
    { label: "Add Notice", to: "/admin/notices", gradient: "linear-gradient(135deg,#4F46E5,#7C3AED)" },
    { label: "Add Project", to: "/admin/projects", gradient: "linear-gradient(135deg,#10B981,#06B6D4)" },
    { label: "Upload Magazine", to: "/admin/magazines", gradient: "linear-gradient(135deg,#EC4899,#7C3AED)" },
    { label: "View Messages", to: "/admin/contact-messages", gradient: "linear-gradient(135deg,#F59E0B,#EF4444)" },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100/50 p-8 shadow-sm"
      >
        <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-indigo-200/30 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-purple-200/20 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100/60 px-3 py-1 text-xs font-medium text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" />
              University Management System
            </div>
            <h1 className="mt-4 text-3xl font-black text-slate-800 tracking-tight md:text-4xl">
              Welcome Back, <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Admin</span> 👋
            </h1>
            <p className="mt-2 max-w-md text-slate-500">
              Manage your university content with ease — notices, projects, societies, and more.
            </p>
            <div className="mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="hidden md:grid h-24 w-24 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md"
          >
            <TrendingUp className="h-10 w-10 text-white" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Notices" value={notices} icon={Bell} gradient="linear-gradient(135deg,#4F46E5,#7C3AED)" trend="+12%" delay={0.05} />
        <StatCard title="Magazines" value={magazines} icon={BookOpen} gradient="linear-gradient(135deg,#EC4899,#7C3AED)" trend="+8%" delay={0.1} />
        <StatCard title="Projects" value={projects} icon={FolderKanban} gradient="linear-gradient(135deg,#10B981,#06B6D4)" trend="+5%" delay={0.15} />
        <StatCard title="Societies" value={societies} icon={Users} gradient="linear-gradient(135deg,#38BDF8,#4F46E5)" trend="+3%" delay={0.2} />
        <StatCard title="Unread Messages" value={unread} icon={MessageSquare} gradient="linear-gradient(135deg,#F59E0B,#EF4444)" trend="new" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Activity Overview</h3>
              <p className="text-xs text-slate-400">Content added this week</p>
            </div>
            <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">Weekly</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    color: "#0F172A",
                  }}
                />
                <Area type="monotone" dataKey="value" stroke="#4F46E5" strokeWidth={2} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800">Content Split</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={pieColors[i % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    color: "#0F172A",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {pieData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                {d.name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm lg:col-span-2"
        >
          <h3 className="mb-4 text-lg font-bold text-slate-800">Totals by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                <YAxis stroke="#94A3B8" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "#F1F5F9" }}
                  contentStyle={{
                    background: "white",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    color: "#0F172A",
                  }}
                />
                <Bar dataKey="value" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.25 }}
          className="rounded-2xl bg-white border border-slate-200/70 p-5 shadow-sm"
        >
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
            <Plus className="h-5 w-5 text-indigo-500" /> Quick Actions
          </h3>
          <div className="space-y-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                to={a.to}
                className="group flex items-center justify-between rounded-xl border border-slate-200/60 bg-slate-50/50 p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: a.gradient }}>
                    <Plus className="h-4 w-4 text-white" />
                  </span>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition">
                    {a.label}
                  </span>
                </span>
                <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
 