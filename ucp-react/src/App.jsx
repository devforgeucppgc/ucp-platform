import { Routes, Route, Navigate } from "react-router-dom";
import { useAdminAuth } from "./admin/context/AdminAuthContext";
import Layout from "./components/Layout";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Societies from "./pages/Societies/Societies";
import CampusInfo from "./pages/CampusInfo/CampusInfo";
import NoticeBoard from "./pages/NoticeBoard/NoticeBoard";
import EMagazine from "./pages/EMagazine/EMagazine";
import Projects from "./pages/Projects/Projects";

import AdminLogin from "./admin/pages/AdminLogin";
import AdminShell from "./admin/components/AdminShell";
import Dashboard from "./admin/pages/Dashboard";
import HomeEditor from "./admin/pages/HomeEditor";
import AboutEditor from "./admin/pages/AboutEditor";
import Notices from "./admin/pages/Notices";
import Magazines from "./admin/pages/Magazines";
import AdminProjects from "./admin/pages/Projects";
import AdminCampusInfo from "./admin/pages/CampusInfo";
import ContactMessages from "./admin/pages/ContactMessages";
import SocietyManager from "./admin/pages/SocietyManager";
import GalleryManager from "./admin/pages/GalleryManager";
import AdminSettings from "./admin/components/AdminSettings"; // ✅ correct import

function Protected({ children }) {
  const { isAuthed, loading } = useAdminAuth();

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return isAuthed ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <Routes>
       
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/societies" element={<Societies />} />
        <Route path="/societies/:societyKey" element={<Societies />} />
        <Route path="/campus-info" element={<CampusInfo />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/e-magazine" element={<EMagazine />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact" element={<Contact />} />
      </Route>

      {/* ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      
      <Route
        path="/admin"
        element={
          <Protected>
            <AdminShell />
          </Protected>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="home" element={<HomeEditor />} />
        <Route path="about" element={<AboutEditor />} />
        <Route path="notices" element={<Notices />} />
        <Route path="magazines" element={<Magazines />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="campus-info" element={<AdminCampusInfo />} />
        <Route path="contact-messages" element={<ContactMessages />} />

        {/* Societies */}
        <Route path="societies" element={<SocietyManager />} />
        <Route path="societies/:societyKey" element={<SocietyManager />} />
        <Route
  path="societies/:societyKey/gallery"
  element={<GalleryManager />}
/>
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}