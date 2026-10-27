import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, Sparkles, FolderOpen, Search, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { projectsService, homeService } from "../../admin/services";

const DEFAULT_HERO = {
  icon: "🚀", badge: "Showcase", title: "Final Year Projects",
  description: "Discover groundbreaking work across AI, robotics, blockchain..."
};

const CATEGORIES = ["AI/ML", "Robotics", "Blockchain", "IoT", "Web Dev", "Mobile App", "Game Dev", "Other"];

const EMPTY_PROJECT = {
  title: "", description: "", category: "", 
  technologies: [], github: "", demo: "", featured: false
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [hero, setHero] = useState(DEFAULT_HERO);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [currentProject, setCurrentProject] = useState(null);
  const [formData, setFormData] = useState({ ...EMPTY_PROJECT });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Load data on mount
  useEffect(() => {
    loadProjects();
    loadHero();
  }, []);

  const loadProjects = async () => {
    try {
      setSaving(true);
      const response = await projectsService.getAllProjects();
      const data = response?.data || [];
      const normalized = Array.isArray(data) ? data : data.projects || data.data || [];
      setProjects(normalized);
    } catch (error) {
      console.error("Failed to load projects:", error);
      toast.error("Failed to load projects.");
    } finally {
      setSaving(false);
    }
  };

  const loadHero = async () => {
    try {
      const response = await homeService.getHero();
      setHero(response.data?.hero || DEFAULT_HERO);
    } catch (error) {
      console.error("Failed to load hero:", error);
    }
  };

  const saveHero = async () => {
    try {
      setSaving(true);
      await homeService.updateHero(hero, null);
      toast.success("Hero settings saved!");
    } catch (error) {
      toast.error("Failed to save hero.");
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = () => {
    setModalMode("add");
    setFormData({ ...EMPTY_PROJECT });
    setImageFile(null);
    setPreviewImage(null);
    setShowModal(true);
  };

  const handleEdit = (project) => {
    setModalMode("edit");
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      technologies: project.technologies || [],
      github: project.github || "",
      demo: project.demo || "",
      featured: project.featured || false
    });
    setPreviewImage(project.image);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await projectsService.deleteProject(id);
      setProjects(projects.filter(p => p._id !== id));
      toast.success("Project deleted.");
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const addTech = () => {
    const techInput = document.getElementById("techInput");
    const tech = techInput.value.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({ ...prev, technologies: [...prev.technologies, tech] }));
      techInput.value = "";
    }
  };

  const removeTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || formData.technologies.length === 0) {
      toast.error("Title, description, category and at least one technology are required");
      return;
    }

    try {
      setSaving(true);
      
      // Prepare payload
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        technologies: formData.technologies,
        github: formData.github?.trim() || "",
        demo: formData.demo?.trim() || "",
        featured: formData.featured,
      };

      let result;
      if (modalMode === "add") {
        if (!imageFile) {
          toast.error("Image is required for new projects");
          setSaving(false);
          return;
        }
        result = await projectsService.createProject(payload, imageFile);
      } else {
        result = await projectsService.updateProject(currentProject._id, payload, imageFile || null);
      }

      if (result) {
        toast.success(modalMode === "add" ? "Project created!" : "Project updated!");
        loadProjects();
        setShowModal(false);
      }

    } catch (error) {
      console.error("Error saving project:", error);
      const errMsg = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || "Failed to save project";
      toast.error(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const filteredProjects = projects.filter(p => {
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      (p.technologies && p.technologies.some(t => t.toLowerCase().includes(q)))
    );
  });

  const input = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-400 outline-none transition";

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Projects Editor</h1>
          <p className="text-slate-500 mt-1">Manage final year projects showcase</p>
        </div>
        <button onClick={saveHero} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
          {saving ? "Saving..." : "Save Hero"}
        </button>
      </div>

      {/* Hero Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-500" /> Hero Section
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className={input} value={hero.title} onChange={(e) => setHero({...hero, title: e.target.value})} placeholder="Title" />
          <textarea className={input} rows="2" value={hero.description} onChange={(e) => setHero({...hero, description: e.target.value})} placeholder="Description" />
        </div>
      </div>

      {/* Projects Management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
          <button onClick={handleAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus className="w-4 h-4" /> Add Project
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 ${input}`}
          />
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No projects found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" onError={(e) => e.target.src = '/placeholder.jpg'} />
                <div className="p-4">
                  <div className="font-semibold text-slate-800 truncate">{project.title}</div>
                  <div className="text-xs text-slate-500 mt-1">{project.category}</div>
                  <div className="text-sm text-slate-600 mt-2 line-clamp-2">{project.description}</div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(project.technologies || []).slice(0, 3).map(tech => (
                      <span key={tech} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{tech}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button onClick={() => handleEdit(project)} className="text-indigo-600 hover:text-indigo-800">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-2xl font-bold mb-4">{modalMode === "add" ? "Add Project" : "Edit Project"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={input} placeholder="Title *" required />
              <textarea name="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className={input} placeholder="Description *" required />
              
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className={input} required>
                <option value="">Select Category *</option>
                {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Technologies *</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.technologies.map(tech => (
                    <span key={tech} className="inline-flex items-center gap-1 bg-slate-100 px-2 py-1 rounded text-sm">
                      {tech} <button type="button" onClick={() => removeTech(tech)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input id="techInput" placeholder="Add technology" className={`${input} flex-1`} />
                  <button type="button" onClick={addTech} className="bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">Add</button>
                </div>
              </div>

              <input type="url" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} className={input} placeholder="GitHub URL" />
              <input type="url" value={formData.demo} onChange={(e) => setFormData({...formData, demo: e.target.value})} className={input} placeholder="Demo URL" />
              
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({...formData, featured: e.target.checked})} className="w-4 h-4" />
                <label className="text-sm text-slate-700">Featured Project</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image {modalMode === "add" && "*"}</label>
                {previewImage && (
                  <div className="mb-2">
                    <img src={previewImage} alt="Preview" className="max-h-40 rounded" />
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                  {modalMode === "add" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}