// src/admin/Magazines.jsx
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { magazinesService } from "../services";
import {
  Save,
  Plus,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  FolderOpen,
  Tag,
  Trash2,
  MoveUp,
  MoveDown,
  Pin,
  EyeOff,
  Eye,
  Upload,
} from "lucide-react";

// ⭐ HELPER: Convert base64 to File
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function SectionCard({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="border-b border-slate-200/70 pb-6 last:border-0">
      <div
        className="flex items-center justify-between cursor-pointer select-none group"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
        <button className="p-1 rounded-lg hover:bg-slate-100 transition">
          {open ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </button>
      </div>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  rows = 1,
  type = "text",
  id,
  className = "",
  inputClass,
}) {
  return (
    <div className={className}>
      {label && <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>}
      {multiline ? (
        <textarea
          id={id}
          className={inputClass}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          id={id}
          type={type}
          className={inputClass}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}

const DEFAULT_DATA = {
  hero: {
    icon: "📖",
    eyebrow: "Explore",
    title: "Horizon: Campus",
    highlight: "Edition",
    description: "Our official university magazine — stories, research and campus life.",
  },
  magazines: [],
  topicsList: [],
  folders: ["2024", "2025", "Special Edition"],
};

const emptyMagazine = {
  title: "",
  issue: "",
  description: "",
  date: new Date().toISOString().split("T")[0],
  status: "draft",
  topics: [],
  folder: "",
  coverImage: "",
  pdfUrl: "",
};

export default function Magazines() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingMagazineId, setEditingMagazineId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sections, setSections] = useState({
    overview: true,
    hero: true,
    topics: true,
    folders: true,
    magazines: true,
    sidebar: true,
  });

  const loadMagazines = async () => {
    try {
      const response = await magazinesService.getAllMagazines();
      const magList = (response?.data?.magazines || 
        (Array.isArray(response?.data) ? response.data : [])).map((m) => ({
        ...m,
        id: m._id || m.id,
        date: m.publicationDate 
          ? new Date(m.publicationDate).toISOString().split('T')[0] 
          : (m.date || ''),
      }));

      const fullData = {
        ...DEFAULT_DATA,
        hero: { ...DEFAULT_DATA.hero },
        magazines: magList,
        topicsList: DEFAULT_DATA.topicsList || [],
        folders: DEFAULT_DATA.folders,
      };

      const allTopics = new Set();
      magList.forEach((m) => (m.topics || []).forEach((t) => allTopics.add(t)));
      if (allTopics.size > 0) {
        fullData.topicsList = Array.from(allTopics);
      }

      const allFolders = new Set(DEFAULT_DATA.folders);
      magList.forEach((m) => {
        if (m.folder) allFolders.add(m.folder);
      });
      fullData.folders = Array.from(allFolders);

      setData(fullData);
    } catch (err) {
      console.error("Failed to load magazines:", err);
      setData(DEFAULT_DATA);
    }
  };

  useEffect(() => {
    loadMagazines();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const input =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition";

  const saveAll = async () => {
    try {
      setSaving(true);
      await loadMagazines();
      toast.success("All magazines synced successfully 🎉");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateHero = (field, value) => {
    setData((s) => ({
      ...s,
      hero: { ...s.hero, [field]: value },
    }));
  };

  const addTopic = (topic) => {
    const trimmed = topic.trim();
    if (!trimmed) return toast.error("Topic cannot be empty");
    if (data.topicsList.includes(trimmed)) return toast.error("Topic already exists");
    setData((s) => ({
      ...s,
      topicsList: [...s.topicsList, trimmed],
    }));
    toast.success("Topic added");
  };

  const removeTopic = (topic) => {
    setData((s) => ({
      ...s,
      topicsList: s.topicsList.filter((t) => t !== topic),
    }));
    toast.success("Topic removed");
  };

  const addFolder = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return toast.error("Folder name cannot be empty");
    if (data.folders.includes(trimmed)) return toast.error("Folder already exists");
    setData((s) => ({
      ...s,
      folders: [...s.folders, trimmed],
    }));
    toast.success(`Folder "${trimmed}" added`);
  };

  const removeFolder = (name) => {
    const inUse = data.magazines.some((m) => m.folder === name);
    if (inUse) {
      if (!window.confirm(`Folder "${name}" is in use. Remove it from all magazines?`)) return;
      setData((s) => ({
        ...s,
        folders: s.folders.filter((f) => f !== name),
        magazines: s.magazines.map((m) =>
          m.folder === name ? { ...m, folder: "" } : m
        ),
      }));
      toast.success(`Folder "${name}" removed`);
    } else {
      setData((s) => ({
        ...s,
        folders: s.folders.filter((f) => f !== name),
      }));
      toast.success(`Folder "${name}" removed`);
    }
  };

  // ⭐ FIXED: Use FormData with proper file conversion
  const addMagazine = async (newMag) => {
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('title', newMag.title?.trim() || '');
      formData.append('issue', newMag.issue?.trim() || '');
      formData.append('description', newMag.description || '');
      formData.append('publicationDate', newMag.date || new Date().toISOString());
      formData.append('status', newMag.status || 'published');
      formData.append('topics', JSON.stringify(newMag.topics || []));
      formData.append('folder', newMag.folder || '');

      // Convert base64 to File objects
      if (newMag.coverImage) {
        if (newMag.coverImage.startsWith('data:')) {
          const coverFile = dataURLtoFile(newMag.coverImage, 'cover.jpg');
          formData.append('coverImage', coverFile);
          console.log('✅ Cover converted to file:', coverFile.size, 'bytes');
        } else {
          formData.append('coverImage', newMag.coverImage);
        }
      }

      if (newMag.pdfUrl) {
        if (newMag.pdfUrl.startsWith('data:')) {
          const pdfFile = dataURLtoFile(newMag.pdfUrl, 'magazine.pdf');
          formData.append('pdf', pdfFile);
          console.log('✅ PDF converted to file:', pdfFile.size, 'bytes');
        } else {
          formData.append('pdfUrl', newMag.pdfUrl);
        }
      }
      
      console.log('📤 Submitting FormData...');
      await magazinesService.createMagazine(formData);
      toast.success("Magazine added successfully! 🎉");
      setShowAddForm(false);
      await loadMagazines();
    } catch (err) {
      console.error('❌ Add magazine error:', err);
      const msg = err.response?.data?.errors?.[0]?.message 
        || err.response?.data?.message 
        || "Failed to add magazine";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateMagazine = async (id, field, value) => {
    try {
      const mag = data.magazines.find((m) => m.id === id || m._id === id);
      if (!mag) return;
      const updatedMag = { ...mag, [field]: value };
      setData((s) => ({
        ...s,
        magazines: s.magazines.map((m) =>
          m.id === id || m._id === id ? updatedMag : m
        ),
      }));
      const realId = mag._id || id;
      if (typeof realId === "string" && realId.length === 24) {
        const payload =
          field === "date"
            ? { date: value }
            : { [field]: value };
        await magazinesService.updateMagazine(realId, payload);
      }
    } catch (err) {
      console.error("Failed to update magazine:", err);
    }
  };

  const deleteMagazine = async (id) => {
    if (!window.confirm("Delete this magazine?")) return;
    try {
      const mag = data.magazines.find((m) => m.id === id || m._id === id);
      const realId = mag?._id || id;
      if (typeof realId === "string" && realId.length === 24) {
        await magazinesService.deleteMagazine(realId);
      }
      setData((s) => ({
        ...s,
        magazines: s.magazines.filter((m) => m.id !== id && m._id !== id),
      }));
      toast.success("Magazine deleted");
    } catch (err) {
      toast.error("Failed to delete magazine");
    }
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      callback(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      updateMagazine(id, "coverImage", base64);
      toast.success("Cover image uploaded");
    });
    e.target.value = "";
  };

  const handlePdfUpload = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      updateMagazine(id, "pdfUrl", base64);
      toast.success("PDF uploaded");
    });
    e.target.value = "";
  };

  

  const moveMagazine = (id, direction) => {
    const idx = data.magazines.findIndex((m) => m.id === id);
    if (idx === -1) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= data.magazines.length) return;
    const newMags = [...data.magazines];
    [newMags[idx], newMags[newIdx]] = [newMags[newIdx], newMags[idx]];
    setData((s) => ({ ...s, magazines: newMags }));
  };

  const togglePin = (id) => {
    setData((s) => ({
      ...s,
      magazines: s.magazines.map((m) =>
        m.id === id ? { ...m, pinned: !m.pinned } : m
      ),
    }));
  };

  const toggleHide = (id) => {
    setData((s) => ({
      ...s,
      magazines: s.magazines.map((m) =>
        m.id === id ? { ...m, hidden: !m.hidden } : m
      ),
    }));
  };

  const totalMagazines = data.magazines.length;
  const publishedIssues = data.magazines.filter((m) => m.status === "published").length;
  const draftIssues = data.magazines.filter((m) => m.status === "draft").length;
  const totalDownloads = data.magazines.reduce((sum, m) => sum + (m.downloads || 0), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Magazines Editor</h1>
          <p className="text-sm text-slate-500">
            Manage hero, topics, folders, magazines, and sidebar ordering.
          </p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200/50 transition hover:shadow-lg hover:shadow-indigo-200/70 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm p-6 md:p-8 space-y-8">
        <SectionCard
          title="Dashboard Overview"
          icon={LayoutDashboard}
          open={sections.overview}
          onToggle={() => toggleSection("overview")}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{totalMagazines}</p>
              <p className="text-sm text-slate-500">Total Magazines</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-emerald-600">{publishedIssues}</p>
              <p className="text-sm text-slate-500">Published</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-amber-600">{draftIssues}</p>
              <p className="text-sm text-slate-500">Drafts</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{totalDownloads}</p>
              <p className="text-sm text-slate-500">Total Downloads</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Hero Section"
          icon={Sparkles}
          open={sections.hero}
          onToggle={() => toggleSection("hero")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                label="Icon"
                value={data.hero.icon}
                onChange={(e) => updateHero("icon", e.target.value)}
                placeholder="📖"
                inputClass={input}
              />
              <InputField
                label="Eyebrow"
                value={data.hero.eyebrow}
                onChange={(e) => updateHero("eyebrow", e.target.value)}
                placeholder="Explore"
                inputClass={input}
              />
              <InputField
                label="Title"
                value={data.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
                placeholder="Horizon: Campus"
                inputClass={input}
              />
              <InputField
                label="Highlight"
                value={data.hero.highlight}
                onChange={(e) => updateHero("highlight", e.target.value)}
                placeholder="Edition"
                inputClass={input}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Description"
                  value={data.hero.description}
                  onChange={(e) => updateHero("description", e.target.value)}
                  placeholder="Description..."
                  multiline
                  rows={2}
                  inputClass={input}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Topics Management"
          icon={Tag}
          open={sections.topics}
          onToggle={() => toggleSection("topics")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="flex items-center gap-2">
              <InputField
                label="Add Topic"
                id="newTopic"
                placeholder="Enter topic name"
                className="flex-1"
                inputClass={input}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = e.target.value;
                    if (val) {
                      addTopic(val);
                      e.target.value = "";
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  const inp = document.getElementById("newTopic");
                  if (inp && inp.value) {
                    addTopic(inp.value);
                    inp.value = "";
                  }
                }}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2.5 text-sm font-medium hover:bg-indigo-100 transition"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.topicsList.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-1 rounded-full bg-white/70 border border-slate-200 px-3 py-1 text-sm text-slate-700"
                >
                  {topic}
                  <button
                    onClick={() => removeTopic(topic)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
              {data.topicsList.length === 0 && (
                <span className="text-sm text-slate-400">No topics yet</span>
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Magazines"
          icon={BookOpen}
          open={sections.magazines}
          onToggle={() => toggleSection("magazines")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage all magazine issues</span>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Magazine
            </button>
          </div>

          {showAddForm && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
              <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Add New Magazine</h3>
                <AddMagazineForm
                  onSave={addMagazine}
                  onCancel={() => setShowAddForm(false)}
                  topicsList={data.topicsList || []}
                  folders={data.folders || []}
                  inputClass={input}
                />
              </div>
            </div>
          )}

          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/50">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200/60 bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cover</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Issue</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Folder</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.magazines.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-6 text-center text-slate-400">
                      No magazines yet.
                    </td>
                  </tr>
                ) : (
                  data.magazines.map((mag) => (
                    <tr key={mag.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3">
                        {mag.coverImage ? (
                          <img
                            src={mag.coverImage}
                            alt={mag.title}
                            className="h-12 w-10 object-cover rounded border border-slate-200"
                          />
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800">{mag.title}</td>
                      <td className="px-4 py-3 text-slate-600">{mag.issue}</td>
                      <td className="px-4 py-3">
                        {mag.folder ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                            <FolderOpen className="w-3 h-3" />
                            {mag.folder}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{mag.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            mag.status === "published"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {mag.status === "published" ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() =>
                            setEditingMagazineId(editingMagazineId === mag.id ? null : mag.id)
                          }
                          className="text-sm text-blue-500 hover:text-blue-600 transition"
                        >
                          {editingMagazineId === mag.id ? "Close" : "Edit"}
                        </button>
                        <button
                          onClick={() => deleteMagazine(mag.id)}
                          className="text-sm text-red-500 hover:text-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {editingMagazineId && (
            <div className="mt-4 rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">Edit Magazine</h3>
              <EditMagazineForm
                magazine={data.magazines.find((m) => m.id === editingMagazineId)}
                onUpdate={updateMagazine}
                onCancel={() => setEditingMagazineId(null)}
                onCoverUpload={handleCoverUpload}
                onPdfUpload={handlePdfUpload}
                topicsList={data.topicsList || []}
                folders={data.folders || []}
                inputClass={input}
              />
            </div>
          )}
        </SectionCard>

        <SectionCard
          title="Sidebar Management"
          icon={MoveUp}
          open={sections.sidebar}
          onToggle={() => toggleSection("sidebar")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <p className="text-sm text-slate-500 mb-3">
              Reorder, pin, or hide magazines from the sidebar.
            </p>
            <div className="space-y-2">
              {data.magazines.map((mag, idx) => (
                <div
                  key={mag.id}
                  className={`flex items-center justify-between rounded-xl bg-white/50 p-3 border ${
                    mag.hidden ? "border-slate-200/50 opacity-50" : "border-slate-200/60"
                  } ${mag.pinned ? "border-indigo-300 bg-indigo-50/30" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm text-slate-700">{mag.title}</span>
                    {mag.pinned && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs text-indigo-700">
                        <Pin className="w-3 h-3" /> Pinned
                      </span>
                    )}
                    {mag.hidden && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                        <EyeOff className="w-3 h-3" /> Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveMagazine(mag.id, -1)}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-indigo-500 transition disabled:opacity-30"
                      title="Move up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveMagazine(mag.id, 1)}
                      disabled={idx === data.magazines.length - 1}
                      className="p-1 text-slate-400 hover:text-indigo-500 transition disabled:opacity-30"
                      title="Move down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => togglePin(mag.id)}
                      className={`p-1 transition ${
                        mag.pinned ? "text-indigo-500" : "text-slate-400 hover:text-indigo-500"
                      }`}
                      title={mag.pinned ? "Unpin" : "Pin"}
                    >
                      <Pin className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleHide(mag.id)}
                      className={`p-1 transition ${
                        mag.hidden ? "text-slate-500" : "text-slate-400 hover:text-slate-600"
                      }`}
                      title={mag.hidden ? "Show" : "Hide"}
                    >
                      {mag.hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
              {data.magazines.length === 0 && (
                <div className="text-sm text-slate-400 text-center py-4">No magazines to manage.</div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function AddMagazineForm({ onSave, onCancel, topicsList, folders, inputClass }) {
  const [form, setForm] = useState({ ...emptyMagazine });

  const handleChange = (field, value) => setForm({ ...form, [field]: value });
  const handleTopicToggle = (topic) => {
    const topics = form.topics.includes(topic)
      ? form.topics.filter((t) => t !== topic)
      : [...form.topics, topic];
    handleChange("topics", topics);
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => callback(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      handleChange("coverImage", base64);
    });
    e.target.value = "";
  };

  const handlePdfFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      handleChange("pdfUrl", base64);
    });
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <InputField
          label="Title"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Magazine title"
          inputClass={inputClass}
        />
        <InputField
          label="Issue"
          value={form.issue}
          onChange={(e) => handleChange("issue", e.target.value)}
          placeholder="Issue number/name"
          inputClass={inputClass}
        />
        <div className="md:col-span-2">
          <InputField
            label="Description"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Description..."
            multiline
            rows={2}
            inputClass={inputClass}
          />
        </div>
        <InputField
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          inputClass={inputClass}
        />
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select
            className={inputClass}
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Folder</label>
          <select
            className={inputClass}
            value={form.folder}
            onChange={(e) => handleChange("folder", e.target.value)}
          >
            <option value="">None</option>
            {folders.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topicsList.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicToggle(topic)}
                className={`rounded-full px-3 py-1 text-xs ${
                  form.topics.includes(topic)
                    ? "bg-indigo-500 text-white"
                    : "bg-white/70 border border-slate-200 text-slate-700 hover:bg-slate-100"
                } transition`}
              >
                {topic}
              </button>
            ))}
            {topicsList.length === 0 && (
              <span className="text-xs text-slate-400">No topics available</span>
            )}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">Cover Image</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="Image URL"
              value={form.coverImage}
              onChange={(e) => handleChange("coverImage", e.target.value)}
            />
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
              <Upload className="w-4 h-4" />
              Upload Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverFile}
              />
            </label>
          </div>
          {form.coverImage && (
            <div className="mt-2">
              <img
                src={form.coverImage}
                alt="Cover preview"
                className="max-h-40 rounded-xl border border-slate-200 object-contain"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-slate-500 mb-1">PDF</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="PDF URL"
              value={form.pdfUrl}
              onChange={(e) => handleChange("pdfUrl", e.target.value)}
            />
            <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
              <Upload className="w-4 h-4" />
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handlePdfFile}
              />
            </label>
          </div>
          {form.pdfUrl && (
            <div className="mt-2">
              <a
                href={form.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-500 hover:underline"
              >
                View PDF
              </a>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
        <button
          onClick={() => onSave(form)}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-2 text-sm text-white hover:from-indigo-600 hover:to-indigo-700 transition shadow-sm"
        >
          Save Magazine
        </button>
      </div>
    </div>
  );
}

function EditMagazineForm({
  magazine,
  onUpdate,
  onCancel,
  onCoverUpload,
  onPdfUpload,
  topicsList,
  folders,
  inputClass,
}) {
  const [form, setForm] = useState({ ...magazine });

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    onUpdate(magazine.id, field, value);
  };

  const handleTopicToggle = (topic) => {
    const topics = form.topics.includes(topic)
      ? form.topics.filter((t) => t !== topic)
      : [...form.topics, topic];
    handleChange("topics", topics);
  };

  const handleFileUpload = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => callback(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleCoverFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      handleChange("coverImage", base64);
    });
    e.target.value = "";
  };

  const handlePdfFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleFileUpload(file, (base64) => {
      handleChange("pdfUrl", base64);
    });
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <InputField
        label="Title"
        value={form.title}
        onChange={(e) => handleChange("title", e.target.value)}
        placeholder="Title"
        inputClass={inputClass}
      />
      <InputField
        label="Issue"
        value={form.issue}
        onChange={(e) => handleChange("issue", e.target.value)}
        placeholder="Issue"
        inputClass={inputClass}
      />
      <div className="md:col-span-2">
        <InputField
          label="Description"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description..."
          multiline
          rows={2}
          inputClass={inputClass}
        />
      </div>
      <InputField
        label="Date"
        type="date"
        value={form.date}
        onChange={(e) => handleChange("date", e.target.value)}
        inputClass={inputClass}
      />
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
        <select
          className={inputClass}
          value={form.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1">Folder</label>
        <select
          className={inputClass}
          value={form.folder || ""}
          onChange={(e) => handleChange("folder", e.target.value)}
        >
          <option value="">None</option>
          {folders.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-slate-500 mb-1">Topics</label>
        <div className="flex flex-wrap gap-2">
          {topicsList.map((topic) => (
            <button
              key={topic}
              type="button"
              onClick={() => handleTopicToggle(topic)}
              className={`rounded-full px-3 py-1 text-xs ${
                form.topics.includes(topic)
                  ? "bg-indigo-500 text-white"
                  : "bg-white/70 border border-slate-200 text-slate-700 hover:bg-slate-100"
                } transition`}
            >
              {topic}
            </button>
          ))}
          {topicsList.length === 0 && (
            <span className="text-xs text-slate-400">No topics</span>
          )}
        </div>
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-slate-500 mb-1">Cover Image</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="Image URL"
            value={form.coverImage}
            onChange={(e) => handleChange("coverImage", e.target.value)}
          />
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverFile}
            />
          </label>
        </div>
        {form.coverImage && (
          <div className="mt-2">
            <img
              src={form.coverImage}
              alt="Cover preview"
              className="max-h-40 rounded-xl border border-slate-200 object-contain"
            />
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-xs font-medium text-slate-500 mb-1">PDF</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            className={`${inputClass} flex-1`}
            placeholder="PDF URL"
            value={form.pdfUrl}
            onChange={(e) => handleChange("pdfUrl", e.target.value)}
          />
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Upload PDF
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfFile}
            />
          </label>
        </div>
        {form.pdfUrl && (
          <div className="mt-2">
            <a
              href={form.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-blue-500 hover:underline"
            >
              View PDF
            </a>
          </div>
        )}
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}