import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { contactService } from "../services";

import {
  Save,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  Sparkles,
  Mail,
  MapPin,
  Building2,
  Users,
  Settings,
  Reply,
  Plus,
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
        <button type="button" className="p-1 rounded-lg hover:bg-slate-100 transition">
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
    title: "Contact Us",
    subtitle: "Get in touch with UCP Rawalpindi...",
    icon: "✉️",
  },
  messages: [],
  contactInfo: {
    address: "D-464 6th Road, Rawalpindi",
    phone: "(051) 4421672",
    email: "info@ucp.edu.pk",
    postalCode: "46000",
  },
  departments: [],
  emailSettings: {
    receiverEmail: "syedashahnoor1412@gmail.com",
    subject: "New Contact Inquiry",
    autoReply: "Thank you for reaching out. We'll get back to you soon.",
  },
};

export default function ContactMessages() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingDeptId, setEditingDeptId] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [sections, setSections] = useState({
    overview: true,
    hero: true,
    contactInfo: true,
    departments: true,
    messages: true,
    emailSettings: true,
    analytics: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, messagesRes, deptRes] = await Promise.all([
          contactService.getContactPage(),
          contactService.getAllMessages({ limit: 100 }),
          contactService.getAcademicPrograms(),
        ]);

        const pageData = pageRes?.data || {};
        const messageData = messagesRes?.data?.messages || [];
        const departmentData = deptRes?.data || [];

        setData({
          hero: pageData.hero || DEFAULT_DATA.hero,
          contactInfo: pageData.contactInfo || DEFAULT_DATA.contactInfo,
          emailSettings: pageData.emailSettings || DEFAULT_DATA.emailSettings,
          messages: messageData,
          departments: departmentData,
        });
      } catch (error) {
        toast.error("Failed to fetch contact page data.");
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

  const saveAll = async () => {
    try {
      setSaving(true);
      await contactService.updateContactPage({
        hero: data.hero,
        contactInfo: data.contactInfo,
        emailSettings: data.emailSettings,
      });
      toast.success("All changes saved successfully 🎉");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateHero = (field, value) => {
    setData((s) => ({ ...s, hero: { ...s.hero, [field]: value } }));
  };

  const updateContactInfo = (field, value) => {
    setData((s) => ({
      ...s,
      contactInfo: { ...s.contactInfo, [field]: value },
    }));
  };

  const updateEmailSettings = (field, value) => {
    setData((s) => ({
      ...s,
      emailSettings: { ...s.emailSettings, [field]: value },
    }));
  };

  const markRead = async (id) => {
    const msg = data.messages.find((m) => m._id === id);
    if (!msg) return;

    const newStatus = msg.status === "read" ? "unread" : "read";

    try {
      await contactService.patchMessage(id, { status: newStatus });
      setData((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m._id === id ? { ...m, status: newStatus } : m
        ),
      }));
      toast.success(`Marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;

    try {
      await contactService.deleteMessage(id);
      setData((s) => ({
        ...s,
        messages: s.messages.filter((m) => m._id !== id),
      }));
      toast.success("Message deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message.");
    }
  };

  const replyToMessage = async (id) => {
    const msg = data.messages.find((m) => m._id === id);
    if (!msg) return;

    const reply = replyText.trim() || "Thank you for your inquiry.";

    try {
      await contactService.patchMessage(id, {
        status: "replied",
        replyMessage: reply,
      });

      setData((s) => ({
        ...s,
        messages: s.messages.map((m) =>
          m._id === id ? { ...m, status: "replied", replyMessage: reply } : m
        ),
      }));

      const subject = encodeURIComponent(
        `Re: ${data.emailSettings.subject || "New Contact Inquiry"}`
      );
      const body = encodeURIComponent(
        `Hi ${msg.name},\n\n${reply}\n\n--\n${data.emailSettings.autoReply || ""}`
      );

      window.location.href = `mailto:${msg.email}?subject=${subject}&body=${body}`;
      toast.success("Reply prepared in email client");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update reply status");
    }

    setReplyingTo(null);
    setReplyText("");
  };

  const addDepartment = async (name) => {
    const trimmed = name.trim();

    if (!trimmed) {
      return toast.error("Department name is required");
    }

    if (
      data.departments.some(
        (d) => d.name.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      return toast.error("Department already exists");
    }

    try {
      const newProgram = await contactService.addAcademicProgram({ name: trimmed });
      setData((s) => ({
        ...s,
        departments: [...s.departments, newProgram.data],
      }));
      toast.success("Department added");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add department.");
    }
  };

  const updateDepartment = async (id, newName) => {
    const trimmed = newName.trim();

    if (!trimmed) {
      return toast.error("Name cannot be empty");
    }

    try {
      await contactService.removeAcademicProgram(id);
      const newProgram = await contactService.addAcademicProgram({ name: trimmed });

      setData((s) => ({
        ...s,
        departments: s.departments.map((d) =>
          d._id === id ? newProgram.data : d
        ),
      }));

      setEditingDeptId(null);
      toast.success("Department updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update department.");
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await contactService.removeAcademicProgram(id);
      setData((s) => ({
        ...s,
        departments: s.departments.filter((d) => d._id !== id),
      }));
      toast.success("Department deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete department.");
    }
  };

  const totalMessages = data.messages.length;
  const unreadMessages = data.messages.filter((m) => m.status === "unread").length;
  const repliedMessages = data.messages.filter((m) => m.status === "replied").length;
  const today = new Date().toISOString().split("T")[0];
  const todayMessages = data.messages.filter((m) =>
    m.createdAt?.startsWith(today)
  ).length;

  const getMonthlyCounts = () => {
    const counts = {};
    data.messages.forEach((m) => {
      if (m.createdAt) {
        const month = m.createdAt.slice(0, 7);
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    return Object.entries(counts).sort();
  };

  const getDepartmentCounts = () => {
    const counts = {};
    data.messages.forEach((m) => {
      const dept = m.interest || "Unknown";
      counts[dept] = (counts[dept] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const getCityCounts = () => {
    const counts = {};
    data.messages.forEach((m) => {
      const city = m.city || "Unknown";
      counts[city] = (counts[city] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const filteredMessages = data.messages.filter((m) => {
    const query = searchTerm.toLowerCase();

    const matchSearch =
      m.name?.toLowerCase().includes(query) ||
      m.email?.toLowerCase().includes(query) ||
      m.message?.toLowerCase().includes(query) ||
      m.interest?.toLowerCase().includes(query);

    const matchStatus =
      filterStatus === "all" ? true : m.status === filterStatus;

    const matchDate = dateFilter ? m.createdAt?.startsWith(dateFilter) : true;

    return matchSearch && matchStatus && matchDate;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contact Messages</h1>
          <p className="text-sm text-slate-500">
            Manage contact messages, hero, contact info, departments, and email settings.
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
        {unreadMessages > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-amber-800">
            <span className="text-xl">🔔</span>
            <span className="text-sm font-medium">
              You have {unreadMessages} unread message{unreadMessages > 1 ? "s" : ""}.
            </span>
          </div>
        )}

        <SectionCard
          title="Dashboard Overview"
          icon={LayoutDashboard}
          open={sections.overview}
          onToggle={() => toggleSection("overview")}
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{totalMessages}</p>
              <p className="text-sm text-slate-500">Total Messages</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-amber-600">{unreadMessages}</p>
              <p className="text-sm text-slate-500">Unread</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-emerald-600">{repliedMessages}</p>
              <p className="text-sm text-slate-500">Replied</p>
            </div>
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <p className="text-2xl font-bold text-indigo-600">{todayMessages}</p>
              <p className="text-sm text-slate-500">Today's Inquiries</p>
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
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <InputField
                label="Icon"
                value={data.hero.icon}
                onChange={(e) => updateHero("icon", e.target.value)}
                placeholder="✉️"
                inputClass={input}
              />
              <InputField
                label="Title"
                value={data.hero.title}
                onChange={(e) => updateHero("title", e.target.value)}
                placeholder="Contact Us"
                inputClass={input}
              />
              <InputField
                label="Subtitle"
                value={data.hero.subtitle}
                onChange={(e) => updateHero("subtitle", e.target.value)}
                placeholder="Get in touch..."
                inputClass={input}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Contact Information"
          icon={MapPin}
          open={sections.contactInfo}
          onToggle={() => toggleSection("contactInfo")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                label="Address"
                value={data.contactInfo.address}
                onChange={(e) => updateContactInfo("address", e.target.value)}
                placeholder="Address"
                inputClass={input}
              />
              <InputField
                label="Phone"
                value={data.contactInfo.phone}
                onChange={(e) => updateContactInfo("phone", e.target.value)}
                placeholder="Phone"
                inputClass={input}
              />
              <InputField
                label="Email"
                value={data.contactInfo.email}
                onChange={(e) => updateContactInfo("email", e.target.value)}
                placeholder="Email"
                inputClass={input}
              />
              <InputField
                label="Postal Code"
                value={data.contactInfo.postalCode}
                onChange={(e) => updateContactInfo("postalCode", e.target.value)}
                placeholder="Postal Code"
                inputClass={input}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Departments"
          icon={Building2}
          open={sections.departments}
          onToggle={() => toggleSection("departments")}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-500">Manage academic interest departments</span>
            <button
              onClick={() => {
                const name = prompt("Enter new department name:");
                if (name) addDepartment(name);
              }}
              className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-2 text-sm font-medium hover:bg-indigo-100 transition"
            >
              <Plus className="w-4 h-4" /> Add Department
            </button>
          </div>

          <div className="space-y-2">
            {data.departments.map((dept) => (
              <div
                key={dept._id}
                className="flex items-center justify-between rounded-xl bg-white/50 p-3 border border-slate-200/60"
              >
                {editingDeptId === dept._id ? (
                  <div className="flex w-full gap-2">
                    <input
                      className={input}
                      defaultValue={dept.name}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateDepartment(dept._id, e.target.value);
                        }
                      }}
                      id={`dept-edit-${dept._id}`}
                    />
                    <button
                      onClick={() => {
                        const inp = document.getElementById(`dept-edit-${dept._id}`);
                        updateDepartment(dept._id, inp.value);
                      }}
                      className="rounded-xl bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-600 transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingDeptId(null)}
                      className="rounded-xl bg-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-300 transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-slate-700">{dept.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingDeptId(dept._id)}
                        className="text-sm text-indigo-500 hover:text-indigo-600 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteDepartment(dept._id)}
                        className="text-sm text-red-500 hover:text-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {data.departments.length === 0 && (
              <div className="text-sm text-slate-400">No departments added yet.</div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Messages"
          icon={Mail}
          open={sections.messages}
          onToggle={() => toggleSection("messages")}
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <InputField
              label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, message..."
              className="w-64"
              inputClass={input}
            />

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
              <select
                className={input}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
              </select>
            </div>

            <InputField
              label="Date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-48"
              inputClass={input}
            />
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200/60 bg-white/50">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200/60 bg-slate-50/70">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interest</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredMessages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-slate-400">
                      No messages found.
                    </td>
                  </tr>
                ) : (
                  filteredMessages.map((msg) => (
                    <tr
                      key={msg._id}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">{msg.name}</td>
                      <td className="px-4 py-3 text-slate-600">{msg.email}</td>
                      <td className="px-4 py-3 text-slate-600">{msg.interest || "—"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            msg.status === "unread"
                              ? "bg-rose-100 text-rose-700"
                              : msg.status === "replied"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {msg.status || "unread"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {msg.createdAt?.slice(0, 10) || "—"}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => markRead(msg._id)}
                          className="text-sm text-blue-500 hover:text-blue-600 transition"
                        >
                          {msg.status === "read" ? "Unread" : "Read"}
                        </button>
                        <button
                          onClick={() => setReplyingTo(msg._id)}
                          className="text-sm text-indigo-500 hover:text-indigo-600 transition"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => deleteMessage(msg._id)}
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
        </SectionCard>

        <SectionCard
          title="Email Settings"
          icon={Settings}
          open={sections.emailSettings}
          onToggle={() => toggleSection("emailSettings")}
        >
          <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <InputField
                label="Receiver Email"
                value={data.emailSettings.receiverEmail}
                onChange={(e) => updateEmailSettings("receiverEmail", e.target.value)}
                placeholder="Receiver Email"
                inputClass={input}
              />
              <InputField
                label="Email Subject"
                value={data.emailSettings.subject}
                onChange={(e) => updateEmailSettings("subject", e.target.value)}
                placeholder="Subject"
                inputClass={input}
              />
              <div className="md:col-span-2">
                <InputField
                  label="Auto-Reply Message"
                  value={data.emailSettings.autoReply}
                  onChange={(e) => updateEmailSettings("autoReply", e.target.value)}
                  placeholder="Auto-reply message"
                  multiline
                  rows={3}
                  inputClass={input}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Message Analytics"
          icon={Users}
          open={sections.analytics}
          onToggle={() => toggleSection("analytics")}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Messages per Month</h3>
              <ul className="space-y-1 text-sm">
                {getMonthlyCounts().map(([month, count]) => (
                  <li key={month} className="flex justify-between">
                    <span className="text-slate-600">{month}</span>
                    <span className="font-bold text-indigo-600">{count}</span>
                  </li>
                ))}
                {getMonthlyCounts().length === 0 && (
                  <li className="text-slate-400">No data</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Top Departments</h3>
              <ul className="space-y-1 text-sm">
                {getDepartmentCounts().map(([dept, count]) => (
                  <li key={dept} className="flex justify-between">
                    <span className="text-slate-600">{dept}</span>
                    <span className="font-bold text-indigo-600">{count}</span>
                  </li>
                ))}
                {getDepartmentCounts().length === 0 && (
                  <li className="text-slate-400">No data</li>
                )}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-50/70 border border-slate-200/60 p-4">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Inquiries by City</h3>
              <ul className="space-y-1 text-sm">
                {getCityCounts().map(([city, count]) => (
                  <li key={city} className="flex justify-between">
                    <span className="text-slate-600">{city}</span>
                    <span className="font-bold text-indigo-600">{count}</span>
                  </li>
                ))}
                {getCityCounts().length === 0 && (
                  <li className="text-slate-400">No data</li>
                )}
              </ul>
            </div>
          </div>
        </SectionCard>
      </div>

      {replyingTo && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 p-4 z-50">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Reply to Message</h3>
            <textarea
              className={`${input} h-32`}
              placeholder="Type your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyText("");
                }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => replyToMessage(replyingTo)}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-500 px-4 py-2 text-sm text-white hover:bg-indigo-600 transition"
              >
                <Reply className="w-4 h-4" />
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}