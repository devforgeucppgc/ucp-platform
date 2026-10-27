import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminShell() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans">
      {/* Decorative Premium Light Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[40rem] h-[40rem] rounded-full bg-gradient-to-br from-indigo-100/60 to-purple-100/60 blur-[80px]" />
        <div className="absolute top-[40%] -left-[10%] w-[35rem] h-[35rem] rounded-full bg-gradient-to-tr from-blue-100/50 to-cyan-50/50 blur-[80px]" />
      </div>

      {/* Sidebar */}
      <div className="relative z-20">
        <Sidebar open={open} onClose={() => setOpen(false)} />
      </div>

      {/* Main content area */}
      <div className="md:pl-72 relative z-10">
        {/* Floating Top bar */}
        <Topbar onMenu={() => setOpen(true)} />

        {/* Page content - padded for topbar */}
        <main className="pt-24 min-h-screen pb-12">
          <div className="mx-auto max-w-7xl p-4 md:px-8 md:py-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.99 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="relative bg-white/40 backdrop-blur-3xl rounded-[2rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-8"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}