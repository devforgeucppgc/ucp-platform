import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

import Layout from "../../components/Layout";
import Home from "../../pages/Home/Home";
import About from "../../pages/About/About";
import Contact from "../../pages/Contact/Contact";
import Societies from "../../pages/Societies/Societies";
import CampusInfo from "../../pages/CampusInfo/CampusInfo";
import NoticeBoard from "../../pages/NoticeBoard/NoticeBoard";
import EMagazine from "../../pages/EMagazine/EMagazine";
import Projects from "../../pages/Projects/Projects";
import GalleryManager from "../pages/GalleryManager";
import AdminLogin from "../pages/AdminLogin";
import AdminShell from "../components/AdminShell";
import Dashboard from "../pages/Dashboard";
import HomeEditor from "../pages/HomeEditor";
import AboutEditor from "../pages/AboutEditor";
import Notices from "../pages/Notices";
import Magazines from "../pages/Magazines";
import AdminProjects from "../pages/Projects";
import AdminCampusInfo from "../pages/CampusInfo";
import ContactMessages from "../pages/ContactMessages";
import SocietyManager from "../pages/SocietyManager";
import ChangePassword from "../pages/ChangePassword";

function Protected({ children }) {
  const { isAuthed, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) return <div className="p-6 text-slate-600">Loading...</div>;
  return isAuthed ? (
    children
  ) : (
    <Navigate to="/admin/login" replace state={{ from: location }} />
  );
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/societies/:societyKey" element={<Societies />} />
        <Route path="/campus-info" element={<CampusInfo />} />
        <Route path="/notice-board" element={<NoticeBoard />} />
        <Route path="/e-magazine" element={<EMagazine />} />
        <Route path="/projects" element={<Projects />} />
      </Route>

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
        <Route path="societies" element={<SocietyManager />} />
        <Route path="societies/:societyKey" element={<SocietyManager />} />
        <Route
  path="societies/:societyKey/gallery"
  element={<GalleryManager />}
/>
        <Route path="change-password" element={<ChangePassword />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}