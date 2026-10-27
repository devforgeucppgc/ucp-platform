import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  Users,
  Award,
  ChevronDown,
  ChevronUp,
  Eye,
  User,
  Activity,
  Sparkles,
  FolderOpen,
  UserPlus,
  Upload,
} from "lucide-react";

import { societiesService } from "../services";

// --- Helpers ---
const emptyTeamMember = { name: "", designation: "", image: "", skills: [], linkedin: "", github: "" };
const SOCIETIES = [
  { key: "devforge", label: "DevForge" },
  { key: "alumni", label: "Alumni" },
  { key: "dramatic", label: "Dramatic" },
  { key: "sportsHiking", label: "Sports & Hiking" },
  { key: "academicCommunity", label: "Academic Community" },
  { key: "researchWorld", label: "Research World" },
  { key: "scientific", label: "Scientific" },
  { key: "literary", label: "Literary" },
  { key: "robotics", label: "Robotics" },
  { key: "csr", label: "CSR" },
  { key: "gaming", label: "Gaming" }
];

const getSocietyById = async (id) => {
  try {
    // getSociety() -> unwrapped by apiClient's `get()` helper, so this is
    // the full backend response: { success, message, data: <society> }
    const response = await societiesService.getSociety(id);
    return response?.data || null;
  } catch (error) {
    console.warn(`Society '${id}' not found. It needs to be created.`);
    return null;
  }
};

const loadAllSocieties = async () => {
  try {
    // getAllSocieties() response shape from the backend:
    // { success, message, data: { societies: [...], pagination: {...} } }
    // response.data is the { societies, pagination } object, NOT an array.
    const response = await societiesService.getAllSocieties({ limit: 1000 });
    return response?.data?.societies || [];
  } catch (error) {
    console.warn("Failed to load societies. Database might be empty.");
    return [];
  }
};

export default function SocietyManager() {
  const { societyKey } = useParams();
  const navigate = useNavigate();
  const isSingleMode = Boolean(societyKey);

  // --- State Variables ---
  const [allSocieties, setAllSocieties] = useState([]);
  const [currentSociety, setCurrentSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  // UI States
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [objInput, setObjInput] = useState("");
  const [actInput, setActInput] = useState("");

  const [heroOpen, setHeroOpen] = useState(true);
  const [societiesOpen, setSocietiesOpen] = useState(true);
  const [teamOpen, setTeamOpen] = useState(true);
  const [hero, setHero] = useState({ eyebrow: "", title: "", gradientText: "", description: "" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingSociety, setViewingSociety] = useState(null);

  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamForm, setTeamForm] = useState(emptyTeamMember);
  const [teamSkillInput, setTeamSkillInput] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isSingleMode) {
        const society = await getSocietyById(societyKey);
        if (society) {
          setCurrentSociety(society);
          // Automatically load existing team members from the database
          setTeamMembers(society.team || society.teamMembers || []);
        } else {
          setCurrentSociety(null);
          setTeamMembers([]);
        }
      } else {
        const data = await loadAllSocieties();
        setAllSocieties(data);
      }
    } catch (err) {
      console.error("Critical loadData error:", err);
      if (!isSingleMode) {
        toast.error("Failed to connect to database");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [societyKey]);

  const handleAdd = () => {
    const matchedLabel = SOCIETIES.find(s => s.key === societyKey)?.label || societyKey;
    setFormData({
      slug: isSingleMode ? societyKey : "",
      name: isSingleMode && matchedLabel ? matchedLabel : "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    const socToEdit = allSocieties.find((s) => s.id === id || s._id === id) || currentSociety;
    if (socToEdit) {
      setFormData(socToEdit);
      setEditingId(id);
      setShowForm(true);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name?.trim()) {
      toast.error("Society Name is required");
      return;
    }

    try {
      if (editingId) {
        await societiesService.updateSociety(editingId, formData);
      } else {
        await societiesService.createSociety(formData);
      }
      await loadData();
      setShowForm(false);
      setEditingId(null);
      toast.success(editingId ? "Updated" : "Added");
    } catch (error) {
      const errMsg =
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Failed to save society";
      toast.error(errMsg);
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this society?")) return;
    try {
      await societiesService.deleteSociety(id);
      await loadData();
      toast.success("Deleted");
    } catch (error) {
      toast.error("Failed to delete society.");
      console.error(error);
    }
  };

  const addObjective = () => {
    if (objInput.trim()) {
      setFormData((prev) => ({ ...prev, objectives: [...(prev.objectives || []), objInput.trim()] }));
      setObjInput("");
    }
  };
  const removeObjective = (idx) => {
    setFormData((prev) => ({ ...prev, objectives: prev.objectives.filter((_, i) => i !== idx) }));
  };

  const addActivity = () => {
    if (actInput.trim()) {
      setFormData((prev) => ({ ...prev, activities: [...(prev.activities || []), actInput.trim()] }));
      setActInput("");
    }
  };
  const removeActivity = (idx) => {
    setFormData((prev) => ({ ...prev, activities: prev.activities.filter((_, i) => i !== idx) }));
  };

  const saveHero = (updatedHero) => {
    console.log("Saving hero data:", updatedHero);
  };

  const updateHero = (field, value) => {
    const updated = { ...hero, [field]: value };
    setHero(updated);
    saveHero(updated);
    toast.success("Hero updated");
  };

  // Saves the team members to the database
  const updateSocietyTeam = async (updatedTeam) => {
    if (!currentSociety || (!currentSociety._id && !currentSociety.id)) {
      toast.error("Please create this society first before adding team members!");
      return;
    }

    try {
      const societyId = currentSociety._id || currentSociety.id;
      const payload = { ...currentSociety, team: updatedTeam, teamMembers: updatedTeam };

      await societiesService.updateSociety(societyId, payload);
      setCurrentSociety(payload);
      toast.success("Team updated successfully!");
    } catch (error) {
      toast.error("Failed to save team member to database");
      console.error(error);
    }
  };

  const handleAddTeam = (society = null) => {
    if (society) {
      setCurrentSociety(society);
      setTeamMembers(society.team || society.teamMembers || []);
    }

    setEditingTeamId(null);
    setTeamForm(emptyTeamMember);
    setShowTeamForm(true);
  };

  const handleEditTeam = (id) => {
    const member = teamMembers.find((m) => m.id === id);
    if (member) {
      setEditingTeamId(id);
      setTeamForm(member);
      setShowTeamForm(true);
    }
  };

  const handleDeleteTeam = async (id) => {
    if (!window.confirm("Delete team member?")) return;
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    await updateSocietyTeam(updated);
  };

  const handleSubmitTeam = async () => {
    if (!teamForm.name?.trim()) {
      toast.error("Name is required");
      return;
    }
    const toSave = {
      ...teamForm,
      id: teamForm.id || `team_${Date.now()}`,
      skills: teamForm.skills || [],
    };
    let updated;
    if (editingTeamId) {
      updated = teamMembers.map((m) => (m.id === editingTeamId ? { ...toSave, id: m.id } : m));
    } else {
      updated = [...teamMembers, toSave];
    }

    setTeamMembers(updated);
    await updateSocietyTeam(updated);

    setShowTeamForm(false);
    setEditingTeamId(null);
  };

  const addTeamSkill = () => {
    if (teamSkillInput.trim()) {
      setTeamForm((prev) => ({ ...prev, skills: [...(prev.skills || []), teamSkillInput.trim()] }));
      setTeamSkillInput("");
    }
  };
  const removeTeamSkill = (idx) => {
    setTeamForm((prev) => ({ ...prev, skills: prev.skills.filter((_, i) => i !== idx) }));
  };

  let displayedSocieties = [];
  let currentSocietyLabel = "All Societies";

  if (isSingleMode) {
    if (currentSociety) {
      displayedSocieties = [currentSociety];
    }
    const societyConfig = SOCIETIES.find((s) => s.key === societyKey);
    currentSocietyLabel = societyConfig ? societyConfig.label : societyKey;
  } else {
    displayedSocieties = allSocieties;
    currentSocietyLabel = "All Societies";
  }

  const allTags = Array.from(new Set(displayedSocieties.map((s) => s.tag).filter(Boolean)));

  let filtered = displayedSocieties.filter((item) => {
    const matchSearch =
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tagline || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tag || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchTag = filterTag === "all" || item.tag === filterTag;
    const matchStatus = filterStatus === "all" || item.status === filterStatus;
    return matchSearch && matchTag && matchStatus;
  });

  filtered.sort((a, b) => {
    if (sortBy === "name") {
      return a.name?.localeCompare(b.name || "") || 0;
    } else if (sortBy === "status") {
      return (a.status === "active" ? 0 : 1) - (b.status === "active" ? 0 : 1);
    }
    return 0;
  });

  const total = displayedSocieties.length;
  const active = displayedSocieties.filter((s) => s.status === "active").length;
  const members = displayedSocieties.reduce((acc, s) => acc + (s.headOfSociety?.name ? 1 : 0), 0);
  const events = displayedSocieties.reduce((acc, s) => acc + (s.activities?.length || 0), 0);

  if (loading) {
    return (
      <div className="space-y-4 p-4 max-w-7xl mx-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 capitalize">
          {currentSocietyLabel}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {isSingleMode
            ? `Manage ${currentSocietyLabel} society and its team (if applicable)`
            : "Manage all societies, hero, and team members"}
        </p>
      </div>

      {displayedSocieties.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Societies" value={total} icon={Users} color="indigo" />
          <StatCard label="Active" value={active} icon={Award} color="green" />
          <StatCard label="Heads" value={members} icon={User} color="blue" />
          <StatCard label="Activities" value={events} icon={Activity} color="purple" />
        </div>
      )}

      {!isSingleMode && (
        <SectionCard title="Hero Section" icon={Sparkles} open={heroOpen} onToggle={() => setHeroOpen(!heroOpen)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Eyebrow" value={hero.eyebrow} onChange={(e) => updateHero("eyebrow", e.target.value)} placeholder="Student Life" />
            <InputField label="Title" value={hero.title} onChange={(e) => updateHero("title", e.target.value)} placeholder="Clubs &" />
            <InputField label="Gradient Text" value={hero.gradientText} onChange={(e) => updateHero("gradientText", e.target.value)} placeholder="Societies" />
            <div className="md:col-span-2">
              <InputField label="Description" value={hero.description} onChange={(e) => updateHero("description", e.target.value)} placeholder="Engage, network, and grow..." multiline rows={2} />
            </div>
          </div>
        </SectionCard>
      )}

      {displayedSocieties.length > 0 ? (
        <SectionCard title={isSingleMode ? `${currentSocietyLabel} Society` : "All Societies"} icon={FolderOpen} open={societiesOpen} onToggle={() => setSocietiesOpen(!societiesOpen)}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input className="pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white/50 text-sm dark:border-slate-700 dark:bg-slate-800/50" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
            </div>
            {!isSingleMode && (
              <button onClick={handleAdd} className="inline-flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700">
                <Plus className="w-4 h-4" /> Add Society
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div key={item.id || item._id} className="bg-slate-50/70 rounded-xl border border-slate-200/60 p-4 flex flex-col hover:shadow-sm transition">
                <div className="flex items-center gap-3 mb-2">
                  {item.logo ? (
                    <img src={item.logo} alt={item.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-2xl">{item.icon || "📌"}</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{item.tagline}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/50">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleAddTeam(item)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                      title="Add Team Member"
                    >
                      <UserPlus className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                    </button>

                    <button
                      onClick={() => {
                        setViewingSociety(item);
                        setShowViewModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                      title="View Society"
                    >
                      <Eye className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                    </button>

                    <button
                      onClick={() => handleEdit(item.id || item._id)}
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                      title="Edit Society"
                    >
                      <Edit className="w-4 h-4 text-slate-400 hover:text-indigo-500" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/societies/${item.id || item._id}/gallery`
                        )
                      }
                      className="p-1.5 rounded-lg hover:bg-indigo-50 transition"
                      title="Manage Society Gallery"
                    >
                      <FolderOpen className="w-4 h-4 text-indigo-500" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id || item._id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 transition"
                      title="Delete Society"
                    >
                      <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      ) : (
        <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-10 backdrop-blur-sm shadow-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center mb-4"><Plus className="w-8 h-8" /></div>
          <h2 className="text-xl font-bold text-slate-800 mb-2 capitalize">{currentSocietyLabel} Society Not Found</h2>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition">
            <Plus className="w-5 h-5" /> Setup {currentSocietyLabel} Society Now
          </button>
        </div>
      )}

      {/* DEVFORGE TEAM SECTION */}
      {isSingleMode && currentSociety && displayedSocieties.length > 0 && (        <SectionCard title={`${currentSocietyLabel} Team Members`} icon={UserPlus} open={teamOpen} onToggle={() => setTeamOpen(!teamOpen)}>
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={handleAddTeam} className="inline-flex items-center gap-1 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-600">
                <Plus className="w-4 h-4" /> Add Team Member
              </button>
            </div>
            {teamMembers.length === 0 ? (
              <div className="text-center text-slate-400 py-8">No team members added yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white/60 rounded-2xl p-4 border border-slate-200/70 shadow-sm hover:shadow-md transition">
                    <div className="flex items-start gap-3">
                      {member.image ? (
                        <img src={member.image} alt={member.name} className="w-14 h-14 rounded-full object-cover" />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center text-2xl"><User className="w-6 h-6 text-slate-400" /></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-800">{member.name}</h4>
                        <p className="text-sm text-slate-500">{member.designation}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => handleEditTeam(member.id)} className="p-1 hover:text-indigo-500"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDeleteTeam(member.id)} className="p-1 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ADD TEAM MEMBER MODAL */}
      {showTeamForm && (
        <GlassModal onClose={() => setShowTeamForm(false)} title={editingTeamId ? "Edit Team Member" : "Add Team Member"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Name *" value={teamForm.name || ""} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} placeholder="John Doe" />
              <InputField label="Designation" value={teamForm.designation || ""} onChange={(e) => setTeamForm({ ...teamForm, designation: e.target.value })} placeholder="Lead Developer" />

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Profile Image</label>
                <div className="space-y-2">
                  <input type="url" className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" placeholder="Image URL (https://...)" value={teamForm.image || ""} onChange={(e) => setTeamForm({ ...teamForm, image: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium">
                      <Upload className="w-4 h-4" /> Upload Photo
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => { setTeamForm({ ...teamForm, image: reader.result }); };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = "";
                        }} />
                    </label>
                    {teamForm.image && <button type="button" onClick={() => setTeamForm({ ...teamForm, image: "" })} className="text-sm text-red-500 hover:text-red-600">Remove</button>}
                  </div>
                  {teamForm.image && <div className="mt-2"><img src={teamForm.image} alt="Preview" className="max-h-20 rounded border" /></div>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Skills</label>
                <div className="flex gap-2">
                  <input className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-3 py-1 text-sm" placeholder="Add skill" value={teamSkillInput} onChange={(e) => setTeamSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTeamSkill()} />
                  <button type="button" onClick={addTeamSkill} className="rounded-lg bg-indigo-500 px-3 py-1 text-sm text-white hover:bg-indigo-600">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {teamForm.skills?.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-full text-xs">
                      {s} <button type="button" onClick={() => removeTeamSkill(idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <InputField label="LinkedIn URL" value={teamForm.linkedin || ""} onChange={(e) => setTeamForm({ ...teamForm, linkedin: e.target.value })} placeholder="https://linkedin.com/in/..." />
              <InputField label="GitHub URL" value={teamForm.github || ""} onChange={(e) => setTeamForm({ ...teamForm, github: e.target.value })} placeholder="https://github.com/..." />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowTeamForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button type="button" onClick={handleSubmitTeam} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition">
                <Save className="w-4 h-4" /> Save Member
              </button>
            </div>
          </form>
        </GlassModal>
      )}

      {/* Main Society Form Modal */}
      {showForm && (
        <GlassModal onClose={() => setShowForm(false)} title={editingId ? "Edit Society" : "Add Society"}>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-2">
                <p className="text-xs text-indigo-800 font-medium mb-2">Database Slug (Used for URLs, no spaces)</p>
                <input className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm outline-none" placeholder="e.g., devforge" value={formData.slug || ""} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} disabled={isSingleMode} />
              </div>
              <InputField label="Society Name *" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="DevForge" />

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Logo URL *</label>
                <div className="space-y-2">
                  <input type="url" className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" value={formData.logo || ""} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium">
                      <Upload className="w-4 h-4" /> Upload Image
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => { setFormData({ ...formData, logo: reader.result }); };
                            reader.readAsDataURL(file);
                          }
                          e.target.value = "";
                        }} />
                    </label>
                    {formData.logo && <button type="button" onClick={() => setFormData({ ...formData, logo: "" })} className="text-sm text-red-500 hover:text-red-600">Remove</button>}
                  </div>
                  {formData.logo && <div className="mt-2"><img src={formData.logo} alt="Logo preview" className="max-h-20 rounded border" /></div>}
                </div>
              </div>

              <InputField label="Icon URL or emoji *" value={formData.icon || ""} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} placeholder="📌" />
              <InputField label="Tagline *" value={formData.tagline || ""} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="Build the Future" />
              <InputField label="Category Tag" value={formData.tag || ""} onChange={(e) => setFormData({ ...formData, tag: e.target.value })} placeholder="Technology" />
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" value={formData.status || "active"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="md:col-span-2"><InputField label="Description *" value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Full description..." multiline rows={3} /></div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Head of Society</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InputField label="Name" value={formData.headOfSociety?.name || ""} onChange={(e) => setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, name: e.target.value }})} placeholder="John Doe" />
                  <InputField label="Designation" value={formData.headOfSociety?.designation || ""} onChange={(e) => setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, designation: e.target.value }})} placeholder="President" />
                  <InputField label="Phone" value={formData.headOfSociety?.phone || ""} onChange={(e) => setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, phone: e.target.value }})} placeholder="+92-..." />

                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-slate-500 mb-1">Profile Image URL</label>
                    <div className="space-y-2">
                      <input type="url" className="w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" value={formData.headOfSociety?.image || ""} onChange={(e) => setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, image: e.target.value }})} />
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium">
                          <Upload className="w-4 h-4" /> Upload Image
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => { setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, image: reader.result }}); };
                                reader.readAsDataURL(file);
                              }
                              e.target.value = "";
                            }} />
                        </label>
                        {formData.headOfSociety?.image && <button type="button" onClick={() => setFormData({ ...formData, headOfSociety: { ...formData.headOfSociety, image: "" }})} className="text-sm text-red-500 hover:text-red-600">Remove</button>}
                      </div>
                      {formData.headOfSociety?.image && <div className="mt-2"><img src={formData.headOfSociety.image} alt="Head preview" className="max-h-20 rounded border" /></div>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2"><InputField label="Mission *" value={formData.mission || ""} onChange={(e) => setFormData({ ...formData, mission: e.target.value })} placeholder="Our mission is..." multiline rows={2} /></div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Objectives *</label>
                <div className="flex gap-2 mb-2">
                  <input className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" placeholder="Add objective" value={objInput} onChange={(e) => setObjInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addObjective()} />
                  <button type="button" onClick={addObjective} className="rounded-lg bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.objectives?.map((obj, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-xs text-slate-700">
                      {obj} <button type="button" onClick={() => removeObjective(idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Activities *</label>
                <div className="flex gap-2 mb-2">
                  <input className="flex-1 rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm" placeholder="Add activity" value={actInput} onChange={(e) => setActInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addActivity()} />
                  <button type="button" onClick={addActivity} className="rounded-lg bg-indigo-500 px-3 py-2 text-sm text-white hover:bg-indigo-600 transition">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.activities?.map((act, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full text-xs text-slate-700">
                      {act} <button type="button" onClick={() => removeActivity(idx)} className="hover:text-red-500"><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2"><InputField label="Vision *" value={formData.vision || ""} onChange={(e) => setFormData({ ...formData, vision: e.target.value })} placeholder="Our vision..." multiline rows={2} /></div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-slate-700 mb-2">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <InputField label="Phone" value={formData.contact?.phone || ""} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value }})} placeholder="+92-..." />
                  <InputField label="Email *" value={formData.contact?.email || ""} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value }})} placeholder="society@univ.edu" />
                  <InputField label="Office" value={formData.contact?.office || ""} onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, office: e.target.value }})} placeholder="Room 301, CS Building" />
                </div>
              </div>

              <div className="md:col-span-2"><InputField label="Motto" value={formData.motto || ""} onChange={(e) => setFormData({ ...formData, motto: e.target.value })} placeholder="Innovate together" /></div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Gallery Images (comma-separated URLs)</label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition"
                  rows={3}
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg, ..."
                  value={(formData.gallery || []).join(', ')}
                  onChange={(e) => {
                    const urls = e.target.value.split(',').map(u => u.trim()).filter(Boolean);
                    setFormData({ ...formData, gallery: urls });
                  }}
                />
                <p className="text-xs text-slate-400 mt-1">Paste image URLs separated by commas. These will show as a gallery on the public page.</p>
                {(formData.gallery || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(formData.gallery || []).map((url, idx) => (
                      <div key={idx} className="relative group">
                        <img src={url} alt={`Gallery ${idx + 1}`} className="h-16 w-24 object-cover rounded-lg border border-slate-200" onError={(e) => { e.target.style.opacity = '0.3'; }} />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== idx) })}
                          className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                        ><X className="w-3 h-3" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition">Cancel</button>
              <button type="button" onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg transition">
                <Save className="w-4 h-4" /> Save
              </button>
            </div>
          </form>
        </GlassModal>
      )}

      {showViewModal && viewingSociety && (
        <GlassModal onClose={() => setShowViewModal(false)} title="Society Details">
          <div className="space-y-4 text-slate-700">
            <div className="flex items-center gap-4">
              {viewingSociety.logo ? <img src={viewingSociety.logo} alt={viewingSociety.name} className="w-16 h-16 rounded-full object-cover" /> : <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl">{viewingSociety.icon || "📌"}</div>}
              <div>
                <h3 className="text-xl font-bold text-slate-800">{viewingSociety.name}</h3>
                <p className="text-sm text-slate-500">{viewingSociety.tagline}</p>
              </div>
            </div>
          </div>
        </GlassModal>
      )}

    </div>
  );
}

// UI Components
function StatCard({ label, value, icon: Icon, color }) {
  const colorMap = { indigo: "from-indigo-500 to-purple-500", green: "from-green-500 to-emerald-500", blue: "from-blue-500 to-cyan-500", purple: "from-purple-500 to-pink-500" };
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm hover:shadow-md">
      <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]} bg-opacity-20`}><Icon className="w-6 h-6 text-white" /></div>
      <div><div className="text-2xl font-bold text-slate-800">{value}</div><div className="text-xs text-slate-500">{label}</div></div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/60 p-6 shadow-sm">
      <div className="flex items-center justify-between cursor-pointer select-none group" onClick={onToggle}>
        <div className="flex items-center gap-3"><Icon className="w-5 h-5 text-indigo-500" /><h2 className="text-lg font-semibold text-slate-800">{title}</h2></div>
        <button className="p-1 rounded-lg hover:bg-slate-100 transition">{open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}</button>
      </div>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline = false, rows = 1, className = "", type = "text", disabled = false }) {
  const base = "w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2.5 text-sm text-slate-700 outline-none transition disabled:opacity-50 disabled:cursor-not-allowed";
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {multiline ? <textarea className={base} rows={rows} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} /> : <input type={type} className={base} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} />}
    </div>
  );
}

function GlassModal({ children, onClose, title }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 rounded-3xl shadow-xl relative animate-slideUp">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition"><X className="w-6 h-6" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}