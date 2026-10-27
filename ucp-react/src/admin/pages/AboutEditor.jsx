import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { aboutService } from "../services";
import {
  Save,
  Plus,
  Edit,
  Trash2,
  Sparkles,
  FileText,
  Award,
  Users,
  Heart,
  ChevronDown,
  ChevronUp,
  Loader2,
  Upload,
} from "lucide-react";

const DEFAULT_DATA = {
  hero: {
    badge: "About Us",
    title: "Crafting Excellence",
    description: "We're a team of passionate innovators dedicated to building solutions that empower businesses.",
  },
  intro: {
    title: "A legacy of excellence",
    paragraphOne: "For over two decades, we've been at the forefront of digital transformation.",
    paragraphTwo: "Today, we work with over 2,500 teams across 50+ countries.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
    overlayText: "Our team at work — building the future, together",
  },
  salientFeatures: [],
  leadership: [],
  values: [],
};

const emptySalient = { year: 2024, title: "", description: "", icon: " ", displayOrder: 1 };

const emptyLeader = {
  image: "",
  name: "",
  role: "",
  joinedYear: "",
  quote: "",
  biography: "",
};

const emptyValue = {
  frontIcon: "",
  title: "",
  frontDescription: "",
  backIcon: "",
  backDescription: "",
};

export default function AboutEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editingSalient, setEditingSalient] = useState(null);
  const [editingLeader, setEditingLeader] = useState(null);
  const [editingValue, setEditingValue] = useState(null);

  const [salientForm, setSalientForm] = useState(emptySalient);
  const [leaderForm, setLeaderForm] = useState(emptyLeader);
  const [valueForm, setValueForm] = useState(emptyValue);

  const [sections, setSections] = useState({
    hero: true,
    intro: true,
    salient: true,
    leadership: true,
    values: true,
  });

  const [introImageFile, setIntroImageFile] = useState(null);
  const [leaderImageFile, setLeaderImageFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          aboutRes,
          timelineRes,
          leadersRes,
          valuesRes,
        ] = await Promise.all([
          aboutService.getAbout(),
          aboutService.getTimeline(),
          aboutService.getLeaders(),
          aboutService.getValues(),
        ]);

        const aboutData = aboutRes?.data || {};

        // Auto-fix old database fields to match new schemas
        const safeLeaders = (leadersRes?.data || []).map(leader => ({
          _id: leader._id,
          image: leader.image || "",
          name: leader.name || "",
          role: leader.role || "",
          joinedYear: leader.joinedYear || leader.joiningYear || "", 
          quote: leader.quote || "",
          biography: leader.biography || leader.bio || "", 
        }));

        const safeValues = (valuesRes?.data || []).map(val => ({
          _id: val._id,
          frontIcon: val.frontIcon || "",
          title: val.title || "",
          frontDescription: val.frontDescription || val.shortDescription || "",
          backIcon: val.backIcon || "",
          backDescription: val.backDescription || val.detailedDescription || "",
        }));

        const safeData = {
          hero: {
            badge: aboutData.hero?.badge || DEFAULT_DATA.hero.badge,
            title: aboutData.hero?.title || DEFAULT_DATA.hero.title,
            description: aboutData.hero?.description || DEFAULT_DATA.hero.description,
          },
          intro: {
            title: aboutData.introduction?.title || DEFAULT_DATA.intro.title,
            paragraphOne: aboutData.introduction?.paragraphOne || DEFAULT_DATA.intro.paragraphOne,
            paragraphTwo: aboutData.introduction?.paragraphTwo || DEFAULT_DATA.intro.paragraphTwo,
            image: aboutData.introduction?.image || DEFAULT_DATA.intro.image,
            overlayText: aboutData.introduction?.overlayText || DEFAULT_DATA.intro.overlayText,
          },
          salientFeatures: timelineRes?.data || [],
          leadership: safeLeaders,
          values: safeValues,
        };

        setData(safeData);
      } catch (error) {
        toast.error("Failed to fetch about page data.");
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ FIXED: Only saves Hero and Intro (lists save instantly via their own buttons)
  const save = async () => {
    try {
      setSaving(true);

      const heroPromise = aboutService.updateHero(data.hero, null);
      const introPromise = aboutService.updateIntroduction(data.intro, introImageFile);

      await Promise.all([heroPromise, introPromise]);

      toast.success("About page updated successfully 🎉");
      setIntroImageFile(null);
    } catch(err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to save changes";
      toast.error(errMsg);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (field, value) => {
    setData((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };
  const updateIntro = (field, value) => {
    setData((prev) => ({ ...prev, intro: { ...prev.intro, [field]: value } }));
  };

  const handleFileUpload = (file, callback, fileStateSetter) => {
    if (!file) return;
    if (fileStateSetter) {
      fileStateSetter(file);
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // --- Salient Features (Timeline) Handlers ---
  const addSalient = async () => {
    if (!salientForm.title.trim() || !salientForm.description.trim() || !salientForm.year || !salientForm.displayOrder) {
      toast.error("Please fill all fields (Year, Title, Description, Order)");
      return;
    }
    try {
      const payload = { ...salientForm, icon: salientForm.icon || " " };

      if (editingSalient !== null) {
        const itemToUpdate = data.salientFeatures[editingSalient];
        const updatedItem = await aboutService.updateTimelineItem(itemToUpdate._id, payload);
        const updated = [...data.salientFeatures];
        updated[editingSalient] = updatedItem.data;
        setData((prev) => ({ ...prev, salientFeatures: updated }));
        setEditingSalient(null);
        toast.success("Feature updated.");
      } else {
        const newItem = await aboutService.createTimelineItem(payload);
        setData((prev) => ({
          ...prev,
          salientFeatures: [...prev.salientFeatures, newItem.data],
        }));
        toast.success("Feature added.");
      }
      setSalientForm(emptySalient);
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to save feature";
      toast.error(errMsg);
    }
  };

  const editSalient = (index) => {
    setSalientForm(data.salientFeatures[index]);
    setEditingSalient(index);
  };

  const deleteSalient = async (index) => {
    const itemToDelete = data.salientFeatures[index];
    if (!window.confirm(`Delete "${itemToDelete.title}"?`)) return;
    try {
      if (itemToDelete._id) await aboutService.deleteTimelineItem(itemToDelete._id);
      const updated = data.salientFeatures.filter((_, i) => i !== index);
      setData((prev) => ({ ...prev, salientFeatures: updated }));
      toast.success("Feature deleted.");
    } catch (err) {
      toast.error("Failed to delete feature.");
    }
  };

  // --- Leadership Handlers ---
  const addLeader = async () => {
    if (!leaderForm.name.trim() || !leaderForm.role.trim() || !leaderForm.joinedYear.trim() || !leaderForm.quote.trim() || !leaderForm.biography.trim() || (!leaderForm.image && !leaderImageFile)) {
      toast.error("Please fill all leader fields, including an image.");
      return;
    }
    try {
      if (editingLeader !== null) {
        const itemToUpdate = data.leadership[editingLeader];
        const updatedItem = await aboutService.updateLeader(itemToUpdate._id, leaderForm, leaderImageFile);
        const updated = [...data.leadership];
        updated[editingLeader] = updatedItem.data;
        setData((prev) => ({ ...prev, leadership: updated }));
        setEditingLeader(null);
        toast.success("Leader updated.");
      } else {
        const newItem = await aboutService.createLeader(leaderForm, leaderImageFile);
        setData((prev) => ({
          ...prev,
          leadership: [...prev.leadership, newItem.data],
        }));
        toast.success("Leader added.");
      }
      setLeaderForm(emptyLeader);
      setLeaderImageFile(null);
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to save leader";
      toast.error(errMsg);
    }
  };

  const editLeader = (index) => {
    setLeaderForm(data.leadership[index]);
    setEditingLeader(index);
  };

  const deleteLeader = async (index) => {
    const itemToDelete = data.leadership[index];
    if (!window.confirm(`Delete ${itemToDelete.name}?`)) return;
    try {
      if (itemToDelete._id) await aboutService.deleteLeader(itemToDelete._id);
      const updated = data.leadership.filter((_, i) => i !== index);
      setData((prev) => ({ ...prev, leadership: updated }));
      toast.success("Leader deleted.");
    } catch (err) {
      toast.error("Failed to delete leader.");
    }
  };

  // --- Core Values Handlers ---
  const addValue = async () => {
    if (!valueForm.title.trim() || !valueForm.frontIcon.trim() || !valueForm.frontDescription.trim() || !valueForm.backIcon.trim() || !valueForm.backDescription.trim()) {
      toast.error("Please fill all Value fields (Front & Back).");
      return;
    }
    try {
      if (editingValue !== null) {
        const itemToUpdate = data.values[editingValue];
        const updatedItem = await aboutService.updateValue(itemToUpdate._id, valueForm);
        const updated = [...data.values];
        updated[editingValue] = updatedItem.data;
        setData((prev) => ({ ...prev, values: updated }));
        setEditingValue(null);
        toast.success("Value updated.");
      } else {
        const newItem = await aboutService.createValue(valueForm);
        setData((prev) => ({ ...prev, values: [...prev.values, newItem.data] }));
        toast.success("Value added.");
      }
      setValueForm(emptyValue);
    } catch (err) {
      const errMsg = err.response?.data?.errors?.[0]?.msg || err.response?.data?.message || "Failed to save value";
      toast.error(errMsg);
    }
  };

  const editValue = (index) => {
    setValueForm(data.values[index]);
    setEditingValue(index);
  };

  const deleteValue = async (index) => {
    const itemToDelete = data.values[index];
    if (!window.confirm(`Delete "${itemToDelete.title}"?`)) return;
    try {
      if (itemToDelete._id) await aboutService.deleteValue(itemToDelete._id);
      const updated = data.values.filter((_, i) => i !== index);
      setData((prev) => ({ ...prev, values: updated }));
      toast.success("Value deleted.");
    } catch (err) {
      toast.error("Failed to delete value.");
    }
  };

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const input =
    "w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-400 outline-none transition";

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
         <h1 className="text-2xl font-bold text-slate-800">
            About Page Editor
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Manage hero, intro, salient features (timeline), leadership, and values
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm p-6 md:p-8 space-y-8">
        
        {/* HERO SECTION */}
        <SectionCard title="Hero" icon={Sparkles} open={sections.hero} onToggle={() => toggleSection("hero")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Badge / Eyebrow" value={data.hero.badge} onChange={(e) => updateHero("badge", e.target.value)} placeholder="e.g. About Us" inputClass={input} />
            <InputField label="Title" value={data.hero.title} onChange={(e) => updateHero("title", e.target.value)} placeholder="e.g. Crafting Excellence" inputClass={input} />
            <div className="md:col-span-2">
              <InputField label="Description" value={data.hero.description} onChange={(e) => updateHero("description", e.target.value)} placeholder="We're a team..." multiline rows={3} inputClass={input} />
            </div>
          </div>
        </SectionCard>

        {/* INTRO SECTION */}
        <SectionCard title="Introduction" icon={FileText} open={sections.intro} onToggle={() => toggleSection("intro")}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <InputField label="Title" value={data.intro.title} onChange={(e) => updateIntro("title", e.target.value)} placeholder="A legacy of excellence" inputClass={input} />
            </div>
            <div className="md:col-span-2">
              <InputField label="Paragraph One" value={data.intro.paragraphOne} onChange={(e) => updateIntro("paragraphOne", e.target.value)} placeholder="First paragraph..." multiline rows={3} inputClass={input} />
            </div>
            <div className="md:col-span-2">
              <InputField label="Paragraph Two" value={data.intro.paragraphTwo} onChange={(e) => updateIntro("paragraphTwo", e.target.value)} placeholder="Second paragraph..." multiline rows={3} inputClass={input} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-500 mb-1">Intro Image URL</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input className={input} placeholder="Image URL (or upload below)" value={data.intro.image} onChange={(e) => updateIntro("image", e.target.value)} />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
                  <Upload className="w-4 h-4" /> Upload
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleFileUpload(e.target.files[0], (base64) => updateIntro("image", base64), setIntroImageFile);
                      }
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>
              {data.intro.image && <div className="mt-2"><img src={data.intro.image} alt="Intro preview" className="max-h-40 rounded-xl border border-slate-200 object-contain" /></div>}
            </div>
            <div className="md:col-span-2">
              <InputField label="Overlay Text (Text over the image)" value={data.intro.overlayText} onChange={(e) => updateIntro("overlayText", e.target.value)} placeholder="Our team at work..." inputClass={input} />
            </div>
          </div>
        </SectionCard>

        {/* SALIENT FEATURES (TIMELINE) */}
        <SectionCard title="Salient Features (Timeline)" icon={Award} open={sections.salient} onToggle={() => toggleSection("salient")}>
          <div className="space-y-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="Year" type="number" value={salientForm.year} onChange={(e) => setSalientForm({ ...salientForm, year: Number(e.target.value) })} placeholder="2024" inputClass={input} />
                <InputField label="Display Order (1, 2, 3...)" type="number" value={salientForm.displayOrder} onChange={(e) => setSalientForm({ ...salientForm, displayOrder: Number(e.target.value) })} placeholder="1" inputClass={input} />
                <div className="md:col-span-2">
                  <InputField label="Title" value={salientForm.title} onChange={(e) => setSalientForm({ ...salientForm, title: e.target.value })} placeholder="Feature title" inputClass={input} />
                </div>
                <div className="md:col-span-2">
                  <InputField label="Description" value={salientForm.description} onChange={(e) => setSalientForm({ ...salientForm, description: e.target.value })} placeholder="Describe the feature..." multiline rows={2} inputClass={input} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={addSalient} className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm text-white hover:bg-indigo-600 transition">
                  {editingSalient !== null ? "Update" : <><Plus className="w-4 h-4" /> Add Feature</>}
                </button>
                {editingSalient !== null && <button onClick={() => { setEditingSalient(null); setSalientForm(emptySalient); }} className="text-xs text-slate-400 hover:text-red-400">Cancel</button>}
              </div>
            </div>
            <div className="space-y-2">
              {data.salientFeatures.sort((a,b) => a.displayOrder - b.displayOrder).map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-slate-800">
                      <span className="text-indigo-600 mr-2">[{item.year}]</span>
                      {item.title} 
                      <span className="text-slate-400 text-xs ml-2">(Order: {item.displayOrder})</span>
                    </span>
                    <span className="text-slate-500 text-xs truncate max-w-sm">{item.description}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editSalient(idx)} className="p-1 hover:text-indigo-400 transition"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteSalient(idx)} className="p-1 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* LEADERSHIP */}
        <SectionCard title="Leadership" icon={Users} open={sections.leadership} onToggle={() => toggleSection("leadership")}>
          <div className="space-y-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-slate-500 mb-1">Image URL</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input className={input} placeholder="Image URL (or upload below)" value={leaderForm.image} onChange={(e) => setLeaderForm({ ...leaderForm, image: e.target.value })} />
                    <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition text-sm font-medium whitespace-nowrap">
                      <Upload className="w-4 h-4" /> Upload
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          if (e.target.files?.[0]) handleFileUpload(e.target.files[0], (base64) => setLeaderForm({ ...leaderForm, image: base64 }), setLeaderImageFile);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {leaderForm.image && <div className="mt-2"><img src={leaderForm.image} alt="Preview" className="max-h-24 rounded-xl border border-slate-200 object-contain" /></div>}
                </div>
                
                <InputField label="Name" value={leaderForm.name} onChange={(e) => setLeaderForm({ ...leaderForm, name: e.target.value })} placeholder="John Doe" inputClass={input} />
                <InputField label="Role" value={leaderForm.role} onChange={(e) => setLeaderForm({ ...leaderForm, role: e.target.value })} placeholder="Director" inputClass={input} />
                <div className="md:col-span-2">
                  <InputField label="Joined Year" value={leaderForm.joinedYear} onChange={(e) => setLeaderForm({ ...leaderForm, joinedYear: e.target.value })} placeholder="Since 2002" inputClass={input} />
                </div>
                <div className="md:col-span-2">
                  <InputField label="Quote" value={leaderForm.quote} onChange={(e) => setLeaderForm({ ...leaderForm, quote: e.target.value })} placeholder="'Innovation is...'" multiline rows={2} inputClass={input} />
                </div>
                <div className="md:col-span-2">
                  <InputField label="Biography" value={leaderForm.biography} onChange={(e) => setLeaderForm({ ...leaderForm, biography: e.target.value })} placeholder="With 25+ years..." multiline rows={3} inputClass={input} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={addLeader} className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm text-white hover:bg-indigo-600 transition">
                  {editingLeader !== null ? "Update" : <><Plus className="w-4 h-4" /> Add Leader</>}
                </button>
                {editingLeader !== null && <button onClick={() => { setEditingLeader(null); setLeaderForm(emptyLeader); }} className="text-xs text-slate-400 hover:text-red-400">Cancel</button>}
              </div>
            </div>
            <div className="space-y-2">
              {data.leadership.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-4 text-sm">
                    {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />}
                    <div><div className="font-medium text-slate-800">{item.name}</div><div className="text-xs text-slate-500">{item.role}</div></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editLeader(idx)} className="p-1 hover:text-indigo-400 transition"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteLeader(idx)} className="p-1 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* CORE VALUES */}
        <SectionCard title="Core Values" icon={Heart} open={sections.values} onToggle={() => toggleSection("values")}>
          <div className="space-y-4">
            <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/60 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <InputField label="Front Icon (emoji or text)" value={valueForm.frontIcon} onChange={(e) => setValueForm({ ...valueForm, frontIcon: e.target.value })} placeholder="🎯" inputClass={input} />
                <InputField label="Title" value={valueForm.title} onChange={(e) => setValueForm({ ...valueForm, title: e.target.value })} placeholder="Innovation" inputClass={input} />
                <div className="md:col-span-2">
                  <InputField label="Front Description" value={valueForm.frontDescription} onChange={(e) => setValueForm({ ...valueForm, frontDescription: e.target.value })} placeholder="Pushing boundaries..." multiline rows={2} inputClass={input} />
                </div>
                
                <InputField label="Back Icon (emoji or text)" value={valueForm.backIcon} onChange={(e) => setValueForm({ ...valueForm, backIcon: e.target.value })} placeholder="🚀" inputClass={input} />
                <div className="md:col-span-2">
                  <InputField label="Back Description" value={valueForm.backDescription} onChange={(e) => setValueForm({ ...valueForm, backDescription: e.target.value })} placeholder="We embrace creativity..." multiline rows={3} inputClass={input} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={addValue} className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2.5 text-sm text-white hover:bg-indigo-600 transition">
                  {editingValue !== null ? "Update" : <><Plus className="w-4 h-4" /> Add Value</>}
                </button>
                {editingValue !== null && <button onClick={() => { setEditingValue(null); setValueForm(emptyValue); }} className="text-xs text-slate-400 hover:text-red-400">Cancel</button>}
              </div>
            </div>
            <div className="space-y-2">
              {data.values.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/50 p-3 rounded-xl border border-slate-200/60">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-xl">{item.frontIcon}</span>
                    <span className="font-medium text-slate-800">{item.title}</span>
                    <span className="text-slate-500 truncate max-w-xs">{item.frontDescription}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => editValue(idx)} className="p-1 hover:text-indigo-400 transition"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => deleteValue(idx)} className="p-1 hover:text-red-400 transition"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, icon: Icon, open, onToggle, children }) {
  return (
    <div className="border-b border-slate-200/70 pb-6 last:border-0">
      <div className="flex items-center justify-between cursor-pointer select-none group" onClick={onToggle}>
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
        </div>
        <button className="p-1 rounded-lg hover:bg-slate-100 transition">
          {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
      </div>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function InputField({ label, type = "text", value, onChange, placeholder, multiline = false, rows = 1, className = "", inputClass }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      {multiline ? (
        <textarea className={inputClass} rows={rows} value={value} onChange={onChange} placeholder={placeholder} />
      ) : (
        <input type={type} className={inputClass} value={value} onChange={onChange} placeholder={placeholder} />
      )}
    </div>
  );
}