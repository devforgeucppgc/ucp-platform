import { useState } from "react";
import { Bell, Search, Menu, LogOut, Sparkles } from "lucide-react";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const PAGE_TITLES = {
  "/admin": "Dashboard",
  "/admin/home": "Home Editor",
  "/admin/about": "About Editor",
  "/admin/societies": "Societies",
  "/admin/campus-info": "Campus Info",
  "/admin/notices": "Notice Board",
  "/admin/magazines": "E-Magazine",
  "/admin/projects": "Projects",
  "/admin/contact-messages": "Contact Messages",
  "/admin/settings": "Settings",
};

export default function Topbar({ onMenu }) {
  const { logout } = useAdminAuth();
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  const title =
    PAGE_TITLES[location.pathname] ||
    Object.entries(PAGE_TITLES).find(([k]) => location.pathname.startsWith(k))?.[1] ||
    "Admin Panel";

  return (
    <header className="fixed top-0 left-0 right-0 md:left-72 z-30 pt-4 px-4 md:px-8">
      <div className="flex items-center justify-between gap-3 px-5 h-16 bg-white/70 backdrop-blur-xl border border-white shadow-[0_4px_24px_rgb(0,0,0,0.04)] rounded-2xl transition-all">
        {/* Left: menu + title */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={onMenu}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex items-center gap-3 border-r border-slate-200/60 pr-5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 leading-tight tracking-tight">{title}</h1>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">UCP RAWALPINDI</p>
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-800 sm:hidden truncate">{title}</h1>
        </div>

        {/* Center: search */}
        <div className="relative hidden lg:block w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full rounded-xl border border-slate-200/70 bg-white/50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 focus:bg-white"
          />
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {/* Notification bell */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen((prev) => !prev)}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <Bell className="h-5 w-5" />
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" 
              />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-slate-200/70 bg-white/90 backdrop-blur-xl p-4 shadow-2xl shadow-indigo-100/50 z-50">
                <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm font-bold text-slate-800">Notifications</span>
                  <button
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    Mark all as read
                  </button>
                </div>
                <div className="py-6 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
                  <Bell className="w-8 h-8 text-slate-200" />
                  <p>You're all caught up!</p>
                </div>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

          {/* Logout */}
          <button
            onClick={() => logout(false)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition shadow-sm hover:shadow"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}