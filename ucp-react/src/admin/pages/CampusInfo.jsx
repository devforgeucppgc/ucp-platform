import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { campusService } from "../services";
import {
  Save,
  Plus,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Sparkles,
  BarChart3,
  FileText,
  GraduationCap,
  DollarSign,
  Award,
  CheckCircle,
  Users,
  Building2,
} from "lucide-react";

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
  className = "",
  inputClass,
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-slate-500 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          className={inputClass}
          rows={rows}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
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
    title: "Your Gateway to Academic Excellence",
    description:
      "Explore our programs, fee structure, scholarships, and vibrant campus life — all the information you need to begin your journey at UCP Rawalpindi.",
    academicYear: "2026",
    badgeText: "Academic Year 2026",
  },
  stats: [
    { icon: "fa-graduation-cap", count: "20+", label: "Diverse Programs" },
    { icon: "fa-trophy", count: "100%", label: "Scholarships Available" },
    { icon: "fa-university", count: "1", label: "Prestigious UCP Degree" },
    { icon: "fa-chalkboard-teacher", count: "50%", label: "Highly Qualified Faculty" },
    { icon: "fa-flask", count: "5+", label: "Well Equipped Labs" },
    { icon: "fa-map-marker-alt", count: "2", label: "Campuses in Punjab" },
  ],
  admissionPolicy: {
    minEligibility: "45% marks in Intermediate / A-Levels or equivalent.",
    bscsCriteria: "BSCS requires 50% or above.",
    otherCriteria: "All other BS programs require 45% or above.",
    registrationPolicy:
      "1st semester courses are assigned by CPS Portal. Subsequent semesters require coordination with campus portal managers.",
    timeLimit: "2-year programs: max 4 years; 4-year programs: max 6 years (CGPA ≥ 2.0).",
    attendancePolicy:
      "100% attendance required; non-compliance leads to 'W' grade and forfeiture of fees.",
  },
  degreePrograms: [
    { name: "ADP Computer Science", type: "ADP", duration: "2 Years" },
    { name: "ADP Artificial Intelligence", type: "ADP", duration: "2 Years" },
    { name: "ADP Data Sciences", type: "ADP", duration: "2 Years" },
    { name: "ADP Bio-Technology", type: "ADP", duration: "2 Years" },
    { name: "ADP English", type: "ADP", duration: "2 Years" },
    { name: "ADP Business Administration", type: "ADP", duration: "2 Years" },
    { name: "ADP Business Analytics", type: "ADP", duration: "2 Years" },
    { name: "ADP Accounting & Finance", type: "ADP", duration: "2 Years" },
    { name: "ADP Psychology", type: "ADP", duration: "2 Years" },
    { name: "BSCS", type: "BS", duration: "4 Years" },
    { name: "BBA", type: "BS", duration: "4 Years" },
    { name: "BS Accounting & Finance", type: "BS", duration: "4 Years" },
    { name: "BS Business Analytics", type: "BS", duration: "4 Years" },
    { name: "BS Psychology", type: "BS", duration: "4 Years" },
    { name: "BS Bio-Technology", type: "BS", duration: "4 Years" },
    { name: "BS English", type: "BS", duration: "4 Years" },
  ],
  feeStructures: [
    {
      programName: "BS Business Analytics",
      programType: "BS",
      creditHours: 131,
      registration: 2500,
      admission: 10500,
      perCredit: 6700,
      total: 890700,
      yearlyAvg: 222675,
    },
    {
      programName: "BBA",
      programType: "BS",
      creditHours: 131,
      registration: 2500,
      admission: 10500,
      perCredit: 6700,
      total: 890700,
      yearlyAvg: 222675,
    },
    {
      programName: "BS Acc & Finance",
      programType: "BS",
      creditHours: 131,
      registration: 2500,
      admission: 10500,
      perCredit: 6700,
      total: 890700,
      yearlyAvg: 222675,
    },
    {
      programName: "BS Computer Science",
      programType: "BS",
      creditHours: 133,
      registration: 2500,
      admission: 10500,
      perCredit: 7900,
      total: 1063700,
      yearlyAvg: 265925,
    },
    {
      programName: "BS Psychology",
      programType: "BS",
      creditHours: 132,
      registration: 2250,
      admission: 8000,
      perCredit: 5900,
      total: 789300,
      yearlyAvg: 197325,
    },
    {
      programName: "BS English",
      programType: "BS",
      creditHours: 132,
      registration: 2250,
      admission: 8000,
      perCredit: 5900,
      total: 789300,
      yearlyAvg: 191325,
    },
    {
      programName: "BS Biotechnology",
      programType: "BS",
      creditHours: 137,
      registration: 2500,
      admission: 8000,
      perCredit: 5900,
      total: 818800,
      yearlyAvg: 204700,
    },
    {
      programName: "ADP Psychology",
      programType: "ADP",
      creditHours: 63,
      registration: 2500,
      admission: 10000,
      perCredit: 4800,
      total: 314900,
      yearlyAvg: 157450,
    },
    {
      programName: "ADP English",
      programType: "ADP",
      creditHours: 66,
      registration: 2500,
      admission: 10000,
      perCredit: 4800,
      total: 329300,
      yearlyAvg: 164650,
    },
    {
      programName: "ADP Business Analytics",
      programType: "ADP",
      creditHours: 64,
      registration: 2500,
      admission: 10000,
      perCredit: 5600,
      total: 370900,
      yearlyAvg: 185450,
    },
    {
      programName: "ADP Business Admin",
      programType: "ADP",
      creditHours: 66,
      registration: 2500,
      admission: 10000,
      perCredit: 5600,
      total: 382100,
      yearlyAvg: 191050,
    },
    {
      programName: "ADP Biotechnology",
      programType: "ADP",
      creditHours: 70,
      registration: 2500,
      admission: 10000,
      perCredit: 5000,
      total: 362500,
      yearlyAvg: 181250,
    },
    {
      programName: "ADP Accounting & Finance",
      programType: "ADP",
      creditHours: 66,
      registration: 2500,
      admission: 10000,
      perCredit: 5600,
      total: 382100,
      yearlyAvg: 191050,
    },
    {
      programName: "ADP Computer Science",
      programType: "ADP",
      creditHours: 75,
      registration: 2500,
      admission: 10000,
      perCredit: 6600,
      total: 507500,
      yearlyAvg: 253750,
    },
    {
      programName: "ADP Artificial Intelligence",
      programType: "ADP",
      creditHours: 75,
      registration: 2500,
      admission: 10000,
      perCredit: 7200,
      total: 552500,
      yearlyAvg: 276250,
    },
    {
      programName: "ADP Data Science",
      programType: "ADP",
      creditHours: 78,
      registration: 2500,
      admission: 10000,
      perCredit: 7200,
      total: 574100,
      yearlyAvg: 287050,
    },
    {
      programName: "Post-ADP Acc & Finance",
      programType: "Post-ADP",
      creditHours: 63,
      registration: 2500,
      admission: 10500,
      perCredit: 6700,
      total: 435100,
      yearlyAvg: 217550,
    },
    {
      programName: "Post-ADP Business Admin",
      programType: "Post-ADP",
      creditHours: 60,
      registration: 2500,
      admission: 10500,
      perCredit: 6700,
      total: 415000,
      yearlyAvg: 207500,
    },
    {
      programName: "Post-ADP Computer Science",
      programType: "Post-ADP",
      creditHours: 64,
      registration: 2500,
      admission: 10500,
      perCredit: 7900,
      total: 518600,
      yearlyAvg: 259300,
    },
  ],
  scholarships: [
    {
      title: "Merit Based Scholarship",
      type: "BS",
      eligibility: "CGPA/Percentage ≥ 80%",
      percentage: "50%",
      program: "BS",
    },
    {
      title: "BS Acc & Finance, BS Psychology, BS English",
      type: "BS",
      eligibility: "Percentage ≥ 75%",
      percentage: "50%",
      program: "BS",
    },
    {
      title: "Old Student & Kinship",
      type: "BS",
      eligibility: "At admission",
      percentage: "50%",
      program: "BS",
    },
    {
      title: "Merit Based Scholarship",
      type: "ADP",
      eligibility: "Percentage ≥ 75%",
      percentage: "50%",
      program: "ADP",
    },
    {
      title: "Old Student",
      type: "ADP",
      eligibility: "≥ 65% marks → 50% ; < 65% → 25%",
      percentage: "50% / 25%",
      program: "ADP",
    },
    {
      title: "Kinship / Govt / Armed Forces / Teacher's Child",
      type: "ADP",
      eligibility: "At admission",
      percentage: "25%",
      program: "ADP",
    },
    {
      title: "CGPA Based Performance Scholarship",
      type: "All",
      eligibility: "CGPA ≥ 3.5 → 50%, 3.25 – 3.49 → 25%",
      percentage: "50% / 25%",
      program: "All",
    },
  ],
  features: [
    "HEC Recognized Degree Programs",
    "Outcome-Based Education",
    "Industry-Aligned Curriculum",
    "AI & Emerging Technologies Integration",
    "State-of-the-Art Smart Classrooms",
    "Modern Computer & Science Laboratories",
    "Robotics, Automation & IoT Labs",
    "Entrepreneurship & Startup Incubation Support",
    "Industry Certifications & Micro-Credentials",
    "Research & Innovation Culture",
    "Career Development",
    "Business & Leadership Development Programs",
    "Student Exchange & Mobility Opportunities",
    "Soft Skills & Professional Grooming Workshops",
    "Competitive Scholarships & Financial Assistance",
    "Sports Complex, Gym & Recreational Facilities",
    "Alumni Networking & Mentorship Programs",
  ],
  clubs: [
    { name: "Devforge Digital Club", icon: "fa-code", image: "", description: "" },
    { name: "Alumni Association Club", icon: "fa-handshake", image: "", description: "" },
    { name: "Dramatic Club", icon: "fa-theater-masks", image: "", description: "" },
    { name: "Blood Donors Society", icon: "fa-heartbeat", image: "", description: "" },
    { name: "Sports & Hiking Club", icon: "fa-hiking", image: "", description: "" },
    { name: "Gaming Club", icon: "fa-gamepad", image: "", description: "" },
    { name: "CSR Club", icon: "fa-hand-holding-heart", image: "", description: "" },
    { name: "Robotics & Automation Society", icon: "fa-robot", image: "", description: "" },
    { name: "Literary Society", icon: "fa-book", image: "", description: "" },
    { name: "Scientific Society", icon: "fa-flask", image: "", description: "" },
    { name: "UCP Research World", icon: "fa-globe", image: "", description: "" },
    { name: "Academic Community", icon: "fa-chalkboard", image: "", description: "" },
  ],
  campusDetails: {
    name: "Punjab College",
    address: "D-464, 6th Road, Satellite Town, Rawalpindi",
    phone: "051-4421672 | 051-4421459",
    email: "info@ucp.edu.pk",
    mapEmbedUrl: "",
  },
};

export default function CampusInfo() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState({
    overview: true,
    hero: true,
    stats: true,
    policy: true,
    programs: true,
    fees: true,
    scholarships: true,
    features: true,
    clubs: true,
    campus: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campusRes = await campusService.getCampusInformation();
        const fetchedData = campusRes.data || {};

        const merged = {
          ...DEFAULT_DATA,
          ...fetchedData,
          hero: { ...DEFAULT_DATA.hero, ...(fetchedData.hero || {}) },
          admissionPolicy: { ...DEFAULT_DATA.admissionPolicy, ...(fetchedData.admissionPolicy || {}) },
          campusDetails: { ...DEFAULT_DATA.campusDetails, ...(fetchedData.campusDetails || {}) },
          stats: fetchedData.stats || DEFAULT_DATA.stats,
          degreePrograms: fetchedData.degreePrograms || DEFAULT_DATA.degreePrograms,
          feeStructures: fetchedData.feeStructures || DEFAULT_DATA.feeStructures,
          scholarships: fetchedData.scholarships || DEFAULT_DATA.scholarships,
          features: fetchedData.features || DEFAULT_DATA.features,
          clubs: fetchedData.clubs || DEFAULT_DATA.clubs,
        };
        setData(merged);
      } catch (error) {
        toast.error("Failed to fetch campus information.");
        console.error(error);
        setData(DEFAULT_DATA);
      }
    };
    fetchData();
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

const save = async () => {
    try {
      setSaving(true);
      await campusService.updateCampusInformation(data);
      toast.success("All changes saved successfully 🎉");
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };
  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const addItem = (arrayKey, defaultItem) => {
    setData((s) => ({
      ...s,
      [arrayKey]: [...(s[arrayKey] || []), defaultItem],
    }));
  };

  const removeItem = (arrayKey, index) => {
    setData((s) => ({
      ...s,
      [arrayKey]: s[arrayKey].filter((_, i) => i !== index),
    }));
  };

  const updateItem = (arrayKey, index, field, value) => {
    setData((s) => {
      const next = [...s[arrayKey]];
      next[index] = { ...next[index], [field]: value };
      return { ...s, [arrayKey]: next };
    });
  };

  const updateCampusDetail = (field, value) => {
    setData((s) => ({
      ...s,
      campusDetails: { ...s.campusDetails, [field]: value },
    }));
  };

  const updateHero = (field, value) => {
    setData((s) => ({
      ...s,
      hero: { ...s.hero, [field]: value },
    }));
  };

  const updatePolicy = (field, value) => {
    setData((s) => ({
      ...s,
      admissionPolicy: { ...s.admissionPolicy, [field]: value },
    }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
         <h1 className="text-2xl font-bold text-slate-800">
  Campus Info Editor
</h1>
          <p className="text-sm text-slate-500">
            Manage all campus data including programs, fees, scholarships, and more.
          </p>
        </div>
        <button
          onClick={save}
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
              <p className="text-2xl font-bold text-indigo-600">{data.degreePrograms.length}</p>
              <p className="text-sm text-slate-500">Total Programs</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{data.clubs.length}</p>
              <p className="text-sm text-slate-500">Clubs & Societies</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">1</p>
              <p className="text-sm text-slate-500">Campuses</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{data.scholarships.length}</p>
              <p className="text-sm text-slate-500">Scholarships</p>
            </div>
          </div>
          {data.stats.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              {data.stats.map((stat, idx) => (
                <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                  <div className="flex items-center gap-2">
                    <i className={`fas ${stat.icon || "fa-circle"}`} />
                    <span className="text-2xl font-bold text-indigo-600">{stat.count}</span>
                  </div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
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
                label="Hero Title"
                value={data.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
                placeholder="Hero Title"
                inputClass={input}
              />
              <InputField
                label="Hero Description"
                value={data.hero.description}
                onChange={(e) => updateHero("description", e.target.value)}
                placeholder="Hero Description"
                multiline
                rows={2}
                inputClass={input}
              />
              <InputField
                label="Academic Year"
                value={data.hero.academicYear}
                onChange={(e) => updateHero("academicYear", e.target.value)}
                placeholder="e.g., 2026"
                inputClass={input}
              />
              <InputField
                label="Badge Text"
                value={data.hero.badgeText}
                onChange={(e) => updateHero("badgeText", e.target.value)}
                placeholder="Badge Text"
                inputClass={input}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Statistics"
          icon={BarChart3}
          open={sections.stats}
          onToggle={() => toggleSection("stats")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage statistics cards</span>
            <button
              onClick={() => addItem("stats", { icon: "fa-graduation-cap", count: "0", label: "" })}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Statistic
            </button>
          </div>
          <div className="space-y-3">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <InputField
                    label="Icon class"
                    value={stat.icon}
                    onChange={(e) => updateItem("stats", idx, "icon", e.target.value)}
                    placeholder="fa-graduation-cap"
                    inputClass={input}
                  />
                  <InputField
                    label="Count"
                    value={stat.count}
                    onChange={(e) => updateItem("stats", idx, "count", e.target.value)}
                    placeholder="e.g., 20+"
                    inputClass={input}
                  />
                  <InputField
                    label="Label"
                    value={stat.label}
                    onChange={(e) => updateItem("stats", idx, "label", e.target.value)}
                    placeholder="Label"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("stats", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Admission Policy"
          icon={FileText}
          open={sections.policy}
          onToggle={() => toggleSection("policy")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                label="Minimum Eligibility"
                value={data.admissionPolicy.minEligibility}
                onChange={(e) => updatePolicy("minEligibility", e.target.value)}
                placeholder="Minimum Eligibility"
                inputClass={input}
              />
              <InputField
                label="BSCS Criteria"
                value={data.admissionPolicy.bscsCriteria}
                onChange={(e) => updatePolicy("bscsCriteria", e.target.value)}
                placeholder="BSCS Criteria"
                inputClass={input}
              />
              <InputField
                label="Other Programs Criteria"
                value={data.admissionPolicy.otherCriteria}
                onChange={(e) => updatePolicy("otherCriteria", e.target.value)}
                placeholder="Other Programs Criteria"
                inputClass={input}
              />
              <InputField
                label="Registration Policy"
                value={data.admissionPolicy.registrationPolicy}
                onChange={(e) => updatePolicy("registrationPolicy", e.target.value)}
                placeholder="Registration Policy"
                inputClass={input}
              />
              <InputField
                label="Time Limit"
                value={data.admissionPolicy.timeLimit}
                onChange={(e) => updatePolicy("timeLimit", e.target.value)}
                placeholder="Time Limit"
                inputClass={input}
              />
              <InputField
                label="Attendance Policy"
                value={data.admissionPolicy.attendancePolicy}
                onChange={(e) => updatePolicy("attendancePolicy", e.target.value)}
                placeholder="Attendance Policy"
                inputClass={input}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Degree Programs"
          icon={GraduationCap}
          open={sections.programs}
          onToggle={() => toggleSection("programs")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage degree programs</span>
            <button
              onClick={() => addItem("degreePrograms", { name: "", type: "BS", duration: "" })}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Program
            </button>
          </div>
          <div className="space-y-3">
            {data.degreePrograms.map((prog, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <InputField
                    label="Program Name"
                    value={prog.name}
                    onChange={(e) => updateItem("degreePrograms", idx, "name", e.target.value)}
                    placeholder="Program Name"
                    inputClass={input}
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select
                      className={input}
                      value={prog.type}
                      onChange={(e) => updateItem("degreePrograms", idx, "type", e.target.value)}
                    >
                      <option value="BS">BS</option>
                      <option value="ADP">ADP</option>
                      <option value="Post-ADP">Post-ADP</option>
                    </select>
                  </div>
                  <InputField
                    label="Duration"
                    value={prog.duration}
                    onChange={(e) => updateItem("degreePrograms", idx, "duration", e.target.value)}
                    placeholder="e.g., 4 Years"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("degreePrograms", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Fee Structure"
          icon={DollarSign}
          open={sections.fees}
          onToggle={() => toggleSection("fees")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage fee structures</span>
            <button
              onClick={() =>
                addItem("feeStructures", {
                  programName: "",
                  programType: "BS",
                  creditHours: 0,
                  registration: 0,
                  admission: 0,
                  perCredit: 0,
                  total: 0,
                  yearlyAvg: 0,
                })
              }
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Fee
            </button>
          </div>
          <div className="space-y-3">
            {data.feeStructures.map((fee, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <InputField
                    label="Program Name"
                    value={fee.programName}
                    onChange={(e) => updateItem("feeStructures", idx, "programName", e.target.value)}
                    placeholder="Program Name"
                    inputClass={input}
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-500 mb-1">Type</label>
                    <select
                      className={input}
                      value={fee.programType}
                      onChange={(e) => updateItem("feeStructures", idx, "programType", e.target.value)}
                    >
                      <option value="BS">BS</option>
                      <option value="ADP">ADP</option>
                      <option value="Post-ADP">Post-ADP</option>
                    </select>
                  </div>
                  <InputField
                    label="Credit Hours"
                    type="number"
                    value={fee.creditHours}
                    onChange={(e) => updateItem("feeStructures", idx, "creditHours", Number(e.target.value))}
                    placeholder="Credit Hours"
                    inputClass={input}
                  />
                  <InputField
                    label="Registration Fee (PKR)"
                    type="number"
                    value={fee.registration}
                    onChange={(e) => updateItem("feeStructures", idx, "registration", Number(e.target.value))}
                    placeholder="Registration Fee"
                    inputClass={input}
                  />
                  <InputField
                    label="Admission Fee (PKR)"
                    type="number"
                    value={fee.admission}
                    onChange={(e) => updateItem("feeStructures", idx, "admission", Number(e.target.value))}
                    placeholder="Admission Fee"
                    inputClass={input}
                  />
                  <InputField
                    label="Per Credit Hour Fee (PKR)"
                    type="number"
                    value={fee.perCredit}
                    onChange={(e) => updateItem("feeStructures", idx, "perCredit", Number(e.target.value))}
                    placeholder="Per Credit Hour Fee"
                    inputClass={input}
                  />
                  <InputField
                    label="Total Fee (PKR)"
                    type="number"
                    value={fee.total}
                    onChange={(e) => updateItem("feeStructures", idx, "total", Number(e.target.value))}
                    placeholder="Total Fee"
                    inputClass={input}
                  />
                  <InputField
                    label="Yearly Average (PKR)"
                    type="number"
                    value={fee.yearlyAvg}
                    onChange={(e) => updateItem("feeStructures", idx, "yearlyAvg", Number(e.target.value))}
                    placeholder="Yearly Average"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("feeStructures", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Scholarships"
          icon={Award}
          open={sections.scholarships}
          onToggle={() => toggleSection("scholarships")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage scholarships</span>
            <button
              onClick={() =>
                addItem("scholarships", {
                  title: "",
                  type: "",
                  eligibility: "",
                  percentage: "",
                  program: "",
                })
              }
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Scholarship
            </button>
          </div>
          <div className="space-y-3">
            {data.scholarships.map((sch, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <InputField
                    label="Title"
                    value={sch.title}
                    onChange={(e) => updateItem("scholarships", idx, "title", e.target.value)}
                    placeholder="Title"
                    inputClass={input}
                  />
                  <InputField
                    label="Type"
                    value={sch.type}
                    onChange={(e) => updateItem("scholarships", idx, "type", e.target.value)}
                    placeholder="e.g., Merit"
                    inputClass={input}
                  />
                  <InputField
                    label="Eligibility"
                    value={sch.eligibility}
                    onChange={(e) => updateItem("scholarships", idx, "eligibility", e.target.value)}
                    placeholder="e.g., 75% marks"
                    inputClass={input}
                  />
                  <InputField
                    label="Percentage"
                    value={sch.percentage}
                    onChange={(e) => updateItem("scholarships", idx, "percentage", e.target.value)}
                    placeholder="e.g., 50%"
                    inputClass={input}
                  />
                  <InputField
                    label="Program (BS/ADP/All)"
                    value={sch.program || ""}
                    onChange={(e) => updateItem("scholarships", idx, "program", e.target.value)}
                    placeholder="BS/ADP/All"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("scholarships", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Features"
          icon={CheckCircle}
          open={sections.features}
          onToggle={() => toggleSection("features")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage features list</span>
            <button
              onClick={() => addItem("features", { text: "" })}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Feature
            </button>
          </div>
          <div className="space-y-3">
            {data.features.map((feat, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <InputField
                    label="Feature Text"
                    value={feat.text}
                    onChange={(e) => updateItem("features", idx, "text", e.target.value)}
                    placeholder="Feature text"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("features", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Clubs & Societies"
          icon={Users}
          open={sections.clubs}
          onToggle={() => toggleSection("clubs")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage clubs and societies</span>
            <button
              onClick={() => addItem("clubs", { name: "", icon: "", image: "", description: "" })}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Club
            </button>
          </div>
          <div className="space-y-3">
            {data.clubs.map((club, idx) => (
              <div key={idx} className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <InputField
                    label="Club Name"
                    value={club.name}
                    onChange={(e) => updateItem("clubs", idx, "name", e.target.value)}
                    placeholder="Club Name"
                    inputClass={input}
                  />
                  <InputField
                    label="Icon (fa-*)"
                    value={club.icon}
                    onChange={(e) => updateItem("clubs", idx, "icon", e.target.value)}
                    placeholder="fa-gamepad"
                    inputClass={input}
                  />
                  <InputField
                    label="Image URL"
                    value={club.image || ""}
                    onChange={(e) => updateItem("clubs", idx, "image", e.target.value)}
                    placeholder="Image URL (optional)"
                    inputClass={input}
                  />
                  <InputField
                    label="Description"
                    value={club.description}
                    onChange={(e) => updateItem("clubs", idx, "description", e.target.value)}
                    placeholder="Description"
                    inputClass={input}
                  />
                  <button
                    onClick={() => removeItem("clubs", idx)}
                    className="inline-flex items-center justify-center gap-1 rounded-xl bg-red-500/10 text-red-600 border border-red-200 px-4 py-2 text-sm font-medium hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Campus Management"
          icon={Building2}
          open={sections.campus}
          onToggle={() => toggleSection("campus")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                label="Campus Name"
                value={data.campusDetails.name}
                onChange={(e) => updateCampusDetail("name", e.target.value)}
                placeholder="Campus Name"
                inputClass={input}
              />
              <InputField
                label="Address"
                value={data.campusDetails.address}
                onChange={(e) => updateCampusDetail("address", e.target.value)}
                placeholder="Address"
                inputClass={input}
              />
              <InputField
                label="Phone"
                value={data.campusDetails.phone}
                onChange={(e) => updateCampusDetail("phone", e.target.value)}
                placeholder="Phone"
                inputClass={input}
              />
              <InputField
                label="Email"
                value={data.campusDetails.email}
                onChange={(e) => updateCampusDetail("email", e.target.value)}
                placeholder="Email"
                inputClass={input}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Google Maps Embed URL"
                  value={data.campusDetails.mapEmbedUrl}
                  onChange={(e) => updateCampusDetail("mapEmbedUrl", e.target.value)}
                  placeholder="Google Maps Embed URL"
                  inputClass={input}
                />
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}