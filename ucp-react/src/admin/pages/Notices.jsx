import { useEffect, useState } from "react";
import { noticesService } from "../services";

const DEFAULT_HERO = {
  icon: "📋",
  eyebrow: "Stay Informed",
  title: "Notice Board",
  description: "Announcements, academic updates, events and news from across campus.",
};

export default function Notices() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  
  // UI States
  const [heroOpen, setHeroOpen] = useState(false);
  const [showAnnModal, setShowAnnModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  
  // Form States
  const [editingAnnIdx, setEditingAnnIdx] = useState(null);
  const [annForm, setAnnForm] = useState({});
  
  const [editingEventIdx, setEditingEventIdx] = useState(null);
  const [eventForm, setEventForm] = useState({});

  // ─── fetchData ────────────────────────────────────────
  const fetchData = async () => {
    try {
      const [annRes, eventsRes] = await Promise.all([
        noticesService.getAllNotices(),
        noticesService.getAllEvents()
      ]);

      // Correct extraction – access the nested arrays directly
      const safeAnnouncements = annRes?.data?.announcements || [];
      const safeEvents = eventsRes?.data?.events || [];

      setData({
        hero: DEFAULT_HERO,
        announcements: safeAnnouncements,
        events: safeEvents
      });
    } catch (error) {
      alert("Failed to load notices.");
      setData({ hero: DEFAULT_HERO, announcements: [], events: [] });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-4xl">⏳</span>
      </div>
    );
  }

  const updateHero = (field, value) => setData((s) => ({ ...s, hero: { ...s.hero, [field]: value } }));

  // --- ANNOUNCEMENT HANDLERS ---
  const handleAddAnn = () => {
    setEditingAnnIdx(null);
    setAnnForm({ day: "", month: "", tag: "", title: "", description: "", tagClass: "bg-blue-50 text-blue-600 border-blue-200" });
    setShowAnnModal(true);
  };

  const handleEditAnn = (idx) => {
    setEditingAnnIdx(idx);
    setAnnForm(data.announcements[idx]);
    setShowAnnModal(true);
  };

  const saveAnnLocal = () => {
    if (!annForm.title || !annForm.description || !annForm.day || !annForm.month || !annForm.tag) {
      alert("All fields are required (Day, Month, Tag, Title, Description)");
      return;
    }
    
    const formattedAnn = {
      ...annForm,
      day: Number(annForm.day),
      tagClass: annForm.tagClass || "bg-blue-50 text-blue-600 border-blue-200"
    };

    setData((s) => {
      const next = [...(s.announcements || [])];
      if (editingAnnIdx !== null) {
        next[editingAnnIdx] = formattedAnn;
      } else {
        next.push({ ...formattedAnn, id: `temp_${Date.now()}` });
      }
      return { ...s, announcements: next };
    });
    setShowAnnModal(false);
  };

  const removeAnnouncement = async (idx) => {
    if (!window.confirm("Delete this announcement?")) return;
    const item = data.announcements[idx];
    const realId = item._id || (typeof item.id === 'string' && !item.id.startsWith('temp_') ? item.id : null);
    
    try {
      if (realId) await noticesService.deleteNotice(realId);
      setData((s) => ({ ...s, announcements: (s.announcements || []).filter((_, i) => i !== idx) }));
      alert("Announcement deleted");
    } catch (err) {
      alert("Failed to delete announcement");
    }
  };

  // --- EVENT HANDLERS ---
  const handleAddEvent = () => {
    setEditingEventIdx(null);
    setEventForm({ day: "", month: "", color: "#3B82F6", title: "", time: "", location: "" });
    setShowEventModal(true);
  };

  const handleEditEvent = (idx) => {
    setEditingEventIdx(idx);
    setEventForm(data.events[idx]);
    setShowEventModal(true);
  };

  const saveEventLocal = () => {
    if (!eventForm.title || !eventForm.day || !eventForm.month || !eventForm.time || !eventForm.location) {
      alert("Please fill all required event fields (Title, Day, Month, Time, Location)");
      return;
    }
    
    const formattedEvent = {
      ...eventForm,
      day: Number(eventForm.day)
    };

    setData((s) => {
      const next = [...(s.events || [])];
      if (editingEventIdx !== null) {
        next[editingEventIdx] = formattedEvent;
      } else {
        next.push({ ...formattedEvent, id: `temp_${Date.now()}` });
      }
      return { ...s, events: next };
    });
    setShowEventModal(false);
  };

  const removeEvent = async (idx) => {
    if (!window.confirm("Delete this event?")) return;
    const item = data.events[idx];
    const realId = item._id || (typeof item.id === 'string' && !item.id.startsWith('temp_') ? item.id : null);

    try {
      if (realId) await noticesService.deleteEvent(realId);
      setData((s) => ({ ...s, events: (s.events || []).filter((_, i) => i !== idx) }));
      alert("Event deleted");
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  // --- DATABASE SAVE ---
  const saveAll = async () => {
    try {
      setSaving(true);
      const promises = [];

      for (const ann of data.announcements) {
        const realId = ann._id || (typeof ann.id === 'string' && !ann.id.startsWith('temp_') ? ann.id : null);
        const payload = { ...ann };
        if (payload.id && payload.id.startsWith('temp_')) delete payload.id;
        // ✅ CRITICAL FIX: Remove the MongoDB _id from the payload
        delete payload._id; 

        if (realId) promises.push(noticesService.updateNotice(realId, payload));
        else promises.push(noticesService.createNotice(payload));
      }

      for (const ev of data.events) {
        const realId = ev._id || (typeof ev.id === 'string' && !ev.id.startsWith('temp_') ? ev.id : null);
        const payload = { ...ev };
        if (payload.id && payload.id.startsWith('temp_')) delete payload.id;
        // ✅ CRITICAL FIX: Remove the MongoDB _id from the payload
        delete payload._id; 

        if (realId) promises.push(noticesService.updateEvent(realId, payload));
        else promises.push(noticesService.createEvent(payload));
      }

      await Promise.all(promises);
      alert("All changes saved to database! 🎉");
      fetchData(); // reload to show latest from DB
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to save changes";
      alert(errMsg);
    } finally {
      setSaving(false);
    }
  };

  // --- RENDER HELPERS ---
  const safeAnnouncements = data.announcements || [];
  const safeEvents = data.events || [];
  const categories = Array.from(new Set(safeAnnouncements.map((a) => a.tag).filter(Boolean)));

  const filteredAnnouncements = safeAnnouncements.filter((a) => {
    const matchSearch = (a.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (a.description || a.desc || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter ? a.tag === categoryFilter : true;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-0 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Notice Board</h1>
          <p className="text-sm text-slate-500 mt-1">Manage announcements, news, and upcoming campus events.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:opacity-50"
        >
          <span>{saving ? "⏳" : "💾"}</span>
          {saving ? "Saving to Database..." : "Save All to Database"}
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Notices" value={safeAnnouncements.length} icon="📢" color="blue" />
        <StatCard label="Categories" value={categories.length} icon="🏷️" color="green" />
        <StatCard label="Upcoming Events" value={safeEvents.length} icon="📅" color="indigo" />
        <StatCard label="Active Status" value={"Live"} icon="✅" color="purple" />
      </div>

      {/* HERO SECTION */}
      <div className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between cursor-pointer select-none" onClick={() => setHeroOpen(!heroOpen)}>
          <div className="flex items-center gap-3">
            <span className="text-blue-500 text-xl">🖼️</span>
            <h2 className="text-lg font-semibold text-slate-800">Page Header (Hero)</h2>
          </div>
          <button className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition">
            <span>{heroOpen ? "▲" : "▼"}</span>
          </button>
        </div>
        {heroOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
            <InputField label="Icon (Emoji)" value={data.hero.icon} onChange={(e) => updateHero("icon", e.target.value)} placeholder="📋" />
            <InputField label="Eyebrow Text" value={data.hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} placeholder="Stay Informed" />
            <InputField label="Main Title" value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} placeholder="Notice Board" />
            <InputField label="Description" value={data.hero.description} onChange={(e) => updateHero("description", e.target.value)} placeholder="Announcements..." />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ANNOUNCEMENTS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-blue-500 text-xl">📢</span> Announcements
            </h2>
            <button onClick={handleAddAnn} className="bg-blue-100 text-blue-600 hover:bg-blue-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition">
              <span>+</span> Add New
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
              <input className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-blue-400" placeholder="Search notices..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            <select className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm outline-none" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400">No announcements found.</div>
            ) : (
              filteredAnnouncements.map((ann, idx) => (
                <div key={ann._id || ann.id || idx} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 hover:shadow-md transition group">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl min-w-[70px] h-16 flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-slate-500 uppercase">{ann.month?.substring(0,3) || "---"}</span>
                    <span className="text-xl font-bold text-slate-800">{ann.day || "--"}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{ann.tag || "General"}</span>
                    </div>
                    <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate">{ann.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{ann.description || ann.desc}</p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditAnn(idx)} className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg"><span>✏️</span></button>
                    <button onClick={() => removeAnnouncement(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><span>🗑️</span></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* EVENTS COLUMN */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-indigo-500 text-xl">📅</span> Upcoming Events
            </h2>
            <button onClick={handleAddEvent} className="bg-indigo-100 text-indigo-600 hover:bg-indigo-200 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition">
              <span>+</span> Add Event
            </button>
          </div>

          <div className="space-y-3">
            {safeEvents.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200 border-dashed text-slate-400">No events scheduled.</div>
            ) : (
              safeEvents.map((ev, idx) => (
                <div key={ev._id || ev.id || idx} className="bg-white rounded-2xl border border-slate-200 p-4 flex gap-4 hover:shadow-md transition group overflow-hidden relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: ev.color || "#3B82F6" }} />
                  <div className="bg-slate-50 border border-slate-100 rounded-xl min-w-[70px] h-16 flex flex-col items-center justify-center ml-2">
                    <span className="text-xs font-medium text-slate-500 uppercase">{ev.month?.substring(0,3) || "---"}</span>
                    <span className="text-xl font-bold text-slate-800">{ev.day || "--"}</span>
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-slate-800 leading-tight mb-1 truncate">{ev.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      {ev.time && <span className="flex items-center gap-1"><span>🕒</span> {ev.time}</span>}
                      {(ev.location || ev.venue) && <span className="flex items-center gap-1"><span>📍</span> {ev.location || ev.venue}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEditEvent(idx)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg"><span>✏️</span></button>
                    <button onClick={() => removeEvent(idx)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><span>🗑️</span></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* MODALS */}
      {showAnnModal && (
        <GlassModal onClose={() => setShowAnnModal(false)} title={editingAnnIdx !== null ? "Edit Announcement" : "New Announcement"}>
          <div className="grid grid-cols-2 gap-4">
            <InputField type="number" label="Day (e.g. 15) *" value={annForm.day} onChange={(e) => setAnnForm({...annForm, day: e.target.value})} placeholder="15" />
            <InputField label="Month (e.g. August) *" value={annForm.month} onChange={(e) => setAnnForm({...annForm, month: e.target.value})} placeholder="August" />
            <div className="col-span-2">
              <InputField label="Category Tag *" value={annForm.tag} onChange={(e) => setAnnForm({...annForm, tag: e.target.value})} placeholder="Academic" />
            </div>
            <div className="col-span-2">
              <InputField label="Title *" value={annForm.title} onChange={(e) => setAnnForm({...annForm, title: e.target.value})} placeholder="Notice title..." />
            </div>
            <div className="col-span-2">
              <InputField label="Description *" value={annForm.description || annForm.desc || ""} onChange={(e) => setAnnForm({...annForm, description: e.target.value})} placeholder="Notice details..." multiline rows={4} />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowAnnModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
            <button onClick={saveAnnLocal} className="px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition">Done</button>
          </div>
        </GlassModal>
      )}

      {showEventModal && (
        <GlassModal onClose={() => setShowEventModal(false)} title={editingEventIdx !== null ? "Edit Event" : "New Event"}>
          <div className="grid grid-cols-2 gap-4">
            <InputField type="number" label="Day (e.g. 20) *" value={eventForm.day} onChange={(e) => setEventForm({...eventForm, day: e.target.value})} placeholder="20" />
            <InputField label="Month (e.g. Jun) *" value={eventForm.month} onChange={(e) => setEventForm({...eventForm, month: e.target.value})} placeholder="Jun" />
            <div className="col-span-2">
              <InputField label="Event Title *" value={eventForm.title} onChange={(e) => setEventForm({...eventForm, title: e.target.value})} placeholder="Carnival 2026..." />
            </div>
            <InputField label="Time *" value={eventForm.time} onChange={(e) => setEventForm({...eventForm, time: e.target.value})} placeholder="3:00 PM" />
            <InputField label="Location *" value={eventForm.location || eventForm.venue || ""} onChange={(e) => setEventForm({...eventForm, location: e.target.value})} placeholder="Main Quad" />
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Theme Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={eventForm.color} onChange={(e) => setEventForm({...eventForm, color: e.target.value})} className="w-12 h-10 rounded-lg cursor-pointer border-0 p-0" />
                <span className="text-sm text-slate-500 font-mono">{eventForm.color}</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button onClick={() => setShowEventModal(false)} className="px-4 py-2 text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition">Cancel</button>
            <button onClick={saveEventLocal} className="px-6 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition">Done</button>
          </div>
        </GlassModal>
      )}
    </div>
  );
}

// --- UI COMPONENTS ---
function StatCard({ label, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-emerald-100 text-emerald-600",
    indigo: "bg-indigo-100 text-indigo-600",
    purple: "bg-purple-100 text-purple-600",
  };
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm">
      <div className={`p-3 rounded-xl ${colorMap[color]} text-2xl`}><span>{icon}</span></div>
      <div><div className="text-2xl font-bold text-slate-800">{value}</div><div className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</div></div>
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, multiline = false, rows = 1 }) {
  const base = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition";
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {multiline ? <textarea className={base} rows={rows} value={value} onChange={onChange} placeholder={placeholder} /> : <input type={type} className={base} value={value} onChange={onChange} placeholder={placeholder} />}
    </div>
  );
}

function GlassModal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl shadow-2xl relative animate-slideUp">
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition"><span className="text-xl">✕</span></button>
        </div>
        {children}
      </div>
    </div>
  );
}