import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { homeService } from "../services";
import {
  Sparkles,
  Save,
  Video,
  Upload,
  BarChart3,
  Type,
} from "lucide-react";

export default function HomeEditor() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [aboutImageFile, setAboutImageFile] = useState(null);
  const [adVideoFile, setAdVideoFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // Fetch all home content on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await homeService.getHomeContent();

        const safeData = {
          hero: {
            badge: "",
            title: "",
            description: "",
            studentsJoined: 0,
            rating: 0,
            heroImage: "",
            ...response?.data?.hero,
          },
          about: {
            title: "",
            paragraphOne: "",
            paragraphTwo: "",
            image: "",
            ...response?.data?.about,
          },
          stats: {
            students: 0,
            faculty: 0,
            programs: 0,
            ...response?.data?.stats,
          },
          video: {
            videoUrl: "",
            ...response?.data?.video,
          },
        };

        setData(safeData);
      } catch (error) {
        toast.error("Failed to fetch home page data.");
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // ── VALIDATION ─────────────────────────────────────
  const validate = () => {
    const errors = [];
    const h = data?.hero;
    const a = data?.about;
    const s = data?.stats;

    if (!h?.badge?.trim()) errors.push("Hero: Badge is required");
    if (!h?.title?.trim()) errors.push("Hero: Title is required");
    if (!h?.description?.trim()) errors.push("Hero: Description is required");
    if (h?.studentsJoined === "" || h?.studentsJoined === undefined)
      errors.push("Hero: Students joined is required");
    if (h?.rating === "" || h?.rating === undefined)
      errors.push("Hero: Rating is required");
    if (h?.rating < 0 || h?.rating > 5)
      errors.push("Hero: Rating must be between 0 and 5");

    if (!a?.title?.trim()) errors.push("About: Title is required");
    if (!a?.paragraphOne?.trim())
      errors.push("About: Paragraph One is required");
    if (!a?.paragraphTwo?.trim())
      errors.push("About: Paragraph Two is required");

    if (s?.students === undefined || s?.students === null)
      errors.push("Stats: Students count is required");
    if (s?.faculty === undefined || s?.faculty === null)
      errors.push("Stats: Faculty count is required");
    if (s?.programs === undefined || s?.programs === null)
      errors.push("Stats: Programs count is required");

    return errors;
  };

  // ── SAVE ───────────────────────────────────────────
  const save = async () => {
    const errors = validate();
    if (errors.length) {
      errors.forEach((e) => toast.error(e));
      return;
    }

    try {
      setSaving(true);
      const tasks = [];

      // 1. Hero
      const heroPayload = {
        badge: data.hero.badge,
        title: data.hero.title,
        description: data.hero.description,
        studentsJoined: Number(data.hero.studentsJoined) || 0,
        rating: Number(data.hero.rating) || 0,
        heroImage: data.hero.heroImage,
      };
      tasks.push({
        name: "Hero",
        promise: homeService.updateHero(heroPayload, heroImageFile),
      });

      // 2. About
      const aboutPayload = {
        title: data.about.title,
        paragraphOne: data.about.paragraphOne,
        paragraphTwo: data.about.paragraphTwo,
        image: data.about.image,
      };
      tasks.push({
        name: "About",
        promise: homeService.updateAbout(aboutPayload, aboutImageFile),
      });

      // 3. Stats
      const statsPayload = {
        students: Number(data.stats.students) || 0,
        faculty: Number(data.stats.faculty) || 0,
        programs: Number(data.stats.programs) || 0,
      };
      tasks.push({
        name: "Stats",
        promise: homeService.updateStats(statsPayload),
      });

      // 4. Video — file upload OR URL-only update
      if (adVideoFile) {
        tasks.push({
          name: "Video",
          promise: homeService.uploadVideo(adVideoFile),
        });
      } else if (data.video?.videoUrl?.trim()) {
        tasks.push({
          name: "Video",
          promise: homeService.updateVideo({
            videoUrl: data.video.videoUrl,
          }),
        });
      }

      // AllSettled so one failure doesn't kill the rest
      const outcomes = await Promise.allSettled(
        tasks.map((t) => t.promise)
      );

      let hasError = false;
      outcomes.forEach((outcome, i) => {
        if (outcome.status === "rejected") {
          hasError = true;
          const msg =
            outcome.reason?.response?.data?.errors?.[0]?.message ||
            outcome.reason?.response?.data?.message ||
            `Failed to update ${tasks[i].name}`;
          toast.error(msg);
          console.error(`${tasks[i].name} error:`, outcome.reason);
        }
      });

      if (!hasError) {
        toast.success("Home page updated successfully 🎉");
        setHeroImageFile(null);
        setAboutImageFile(null);
        setAdVideoFile(null);
        setIsDirty(false);
      }
    } catch (err) {
      toast.error("Unexpected error occurred");
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  // ── UPDATERS ───────────────────────────────────────
  const updateHero = (field, value) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      hero: { ...prev?.hero, [field]: value },
    }));
  };

  const updateAbout = (field, value) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      about: { ...prev?.about, [field]: value },
    }));
  };

  const updateStats = (field, value) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      stats: { ...prev?.stats, [field]: Number(value) },
    }));
  };

  const updateVideo = (value) => {
    setIsDirty(true);
    setData((prev) => ({
      ...prev,
      video: { ...prev?.video, videoUrl: value },
    }));
  };

  const handleFileUpload = (field, file) => {
    if (!file) return;
    setIsDirty(true);
    if (field === "heroImage") setHeroImageFile(file);
    if (field === "aboutImage") setAboutImageFile(file);
    if (field === "adVideo") setAdVideoFile(file);
  };

  // ── LOADING ────────────────────────────────────────
  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
      </div>
    );
  }

  // ── RENDER ─────────────────────────────────────────
  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Home Page Editor
          </h1>
          <p className="text-sm text-slate-500">
            Manage hero, about section, statistics, and video
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-70 hover:shadow-lg transition-shadow"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200/70 shadow-sm p-6 md:p-8 space-y-8">
        {/* ── HERO SECTION ─────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Hero Section
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Badge <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.hero?.badge || ""}
                onChange={(e) => updateHero("badge", e.target.value)}
                placeholder="e.g. Admissions Open"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.hero?.title || ""}
                onChange={(e) => updateHero("title", e.target.value)}
                placeholder="e.g. Welcome to UCP"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                rows={3}
                value={data.hero?.description || ""}
                onChange={(e) => updateHero("description", e.target.value)}
                placeholder="Hero section description..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Students Joined <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="0"
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.hero?.studentsJoined ?? ""}
                onChange={(e) =>
                  updateHero("studentsJoined", Number(e.target.value))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Rating (0–5) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                step="0.1"
                min="0"
                max="5"
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.hero?.rating ?? ""}
                onChange={(e) =>
                  updateHero("rating", Number(e.target.value))
                }
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hero Image <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    placeholder="https://..."
                    value={data.hero?.heroImage || ""}
                    onChange={(e) => updateHero("heroImage", e.target.value)}
                  />
                  {heroImageFile && (
                    <span className="text-xs text-green-600 mt-1 block">
                      📎 {heroImageFile.name} selected
                    </span>
                  )}
                </div>
                <label className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer text-sm font-medium hover:bg-indigo-100 whitespace-nowrap">
                  <Upload className="w-4 h-4 inline mr-1" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("heroImage", e.target.files?.[0])
                    }
                  />
                </label>
              </div>
              {data.hero?.heroImage && !heroImageFile && (
                <img
                  src={data.hero.heroImage}
                  alt="Hero preview"
                  className="h-20 rounded-lg object-cover border mt-2"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── ABOUT SECTION ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Type className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              About Section
            </h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Section Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                placeholder="About Our University"
                value={data.about?.title || ""}
                onChange={(e) => updateAbout("title", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Paragraph One <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                rows={4}
                value={data.about?.paragraphOne || ""}
                onChange={(e) => updateAbout("paragraphOne", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Paragraph Two <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full rounded-xl border px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                rows={4}
                value={data.about?.paragraphTwo || ""}
                onChange={(e) => updateAbout("paragraphTwo", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                About Image <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                    placeholder="https://..."
                    value={data.about?.image || ""}
                    onChange={(e) => updateAbout("image", e.target.value)}
                  />
                  {aboutImageFile && (
                    <span className="text-xs text-green-600 mt-1 block">
                      📎 {aboutImageFile.name} selected
                    </span>
                  )}
                </div>
                <label className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer text-sm font-medium hover:bg-indigo-100 whitespace-nowrap">
                  <Upload className="w-4 h-4 inline mr-1" /> Upload
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload("aboutImage", e.target.files?.[0])
                    }
                  />
                </label>
              </div>
              {data.about?.image && !aboutImageFile && (
                <img
                  src={data.about.image}
                  alt="About preview"
                  className="h-20 rounded-lg object-cover border mt-2"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
            </div>
          </div>
        </section>

        {/* ── STATISTICS SECTION ───────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Statistics
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Students Count <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="0"
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.stats?.students ?? ""}
                onChange={(e) => updateStats("students", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Faculty Count <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="0"
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.stats?.faculty ?? ""}
                onChange={(e) => updateStats("faculty", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Programs Count <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                min="0"
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                value={data.stats?.programs ?? ""}
                onChange={(e) => updateStats("programs", e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* ── VIDEO SECTION ────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Video className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-slate-800">
              Promotional Video
            </h2>
          </div>
          <div className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                className="w-full rounded-xl border px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 outline-none"
                placeholder="Video URL"
                value={data.video?.videoUrl || ""}
                onChange={(e) => updateVideo(e.target.value)}
              />
              {adVideoFile && (
                <span className="text-xs text-green-600 mt-1 block">
                  📎 {adVideoFile.name} selected
                </span>
              )}
            </div>
            <label className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 cursor-pointer text-sm font-medium hover:bg-indigo-100 whitespace-nowrap">
              <Upload className="w-4 h-4 inline mr-1" /> Upload
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) =>
                  handleFileUpload("adVideo", e.target.files?.[0])
                }
              />
            </label>
          </div>
          {data.video?.videoUrl && !adVideoFile && (
            <div className="mt-3">
              <video
                src={data.video.videoUrl}
                className="w-full max-w-md rounded-lg border"
                controls
                preload="metadata"
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
