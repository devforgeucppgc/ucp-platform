import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import {
  X,
  Home,
  LayoutDashboard,
  Info,
  Users,
  Building2,
  Bell,
  BookOpen,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Images,
  ChevronRight
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/home", icon: Home, label: "Home Page" },
  { to: "/admin/about", icon: Info, label: "About" },
  { to: "/admin/societies", end: true, icon: Users, label: "Societies" },
  { to: "/admin/campus-info", icon: Building2, label: "Campus Info" },
  { to: "/admin/notices", icon: Bell, label: "Notice Board" },
  { to: "/admin/magazines", icon: BookOpen, label: "E-Magazine" },
  { to: "/admin/projects", icon: FolderKanban, label: "Projects" },
  { to: "/admin/contact-messages", icon: MessageSquare, label: "Contact" },
];

function NavItem({ to, end, icon: Icon, label, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 no-underline overflow-hidden ${
          isActive
            ? "text-indigo-700 bg-indigo-50/80 shadow-[inset_0_1px_1px_rgba(255,255,255,1)] ring-1 ring-indigo-100/50"
            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.5)]" />
          )}
          <Icon className={`w-5 h-5 flex-shrink-0 transition-colors duration-300 ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
          <span className="flex-1">{label}</span>
          {isActive && <ChevronRight className="w-4 h-4 text-indigo-400 opacity-60" />}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ open, onClose }) {
  const { logout } = useAdminAuth?.() || {};
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (logout) await logout();
    } catch (e) { /* ignore */ }
    navigate("/admin/login", { replace: true });
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-72 bg-white/80 backdrop-blur-2xl border-r border-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex flex-col transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-slate-100/60 bg-white/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-200 text-white font-bold text-xl ring-2 ring-white">
              <img
                src="/images/team/logo-1.png"
                alt="Logo"
                className="h-7 w-7 rounded-lg object-contain drop-shadow-md"
                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = 'U'; }}
              />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-base leading-tight tracking-tight">Admin Portal</div>
              <div className="text-[11px] text-indigo-600 font-bold tracking-wider uppercase">Punjab College</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden p-2 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-hide">
          <p className="text-[11px] font-bold text-slate-400/80 uppercase tracking-widest px-3 mb-4">Content Management</p>
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.to} {...item} onClick={open ? onClose : undefined} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100/60 bg-gradient-to-b from-transparent to-slate-50/50">
          <div className="space-y-1 mb-4">
            <NavLink
              to="/admin/settings"
              onClick={open ? onClose : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300 no-underline ${
                  isActive ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`
              }
            >
              <Settings className="w-5 h-5 text-slate-400" />
              Settings
            </NavLink>
          </div>

          {/* Admin badge */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/60 p-3 shadow-sm hover:shadow-md transition duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md ring-2 ring-white">
                  AD
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white" title="Online" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-800 truncate">Administrator</div>
                <div className="text-[11px] text-slate-500 font-medium truncate">admin@ucp.edu.pk</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}