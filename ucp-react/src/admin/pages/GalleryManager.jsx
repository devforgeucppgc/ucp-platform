import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Images,
  Plus,
  Search,
  Pencil,
  Trash2,
  X,
  Upload,
  RefreshCw,
  Building2,
  CalendarDays,
} from "lucide-react";

import { galleryService, societiesService } from "../services";

const EMPTY_FORM = {
  society: "",
  title: "",
  description: "",
  eventDate: "",
};

const getId = (item) => item?._id || item?.id || "";

const getList = (response, keys = []) => {
  const data = response?.data?.data ?? response?.data ?? response;
  if (Array.isArray(data)) return data;

  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const getImageUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) {
    return url;
  }

  const apiBase =
    import.meta.env.VITE_API_BASE_URL || "/api/v1";

  const origin = apiBase.startsWith("http")
    ? new URL(apiBase).origin
    : "";

  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function GalleryManager() {
  const { societyKey } = useParams();
  const [items, setItems] = useState([]);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filterSociety, setFilterSociety] = useState(
  societyKey || "all"
);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  const loadData = async () => {
    setLoading(true);

    try {
      const [galleryResponse, societyResponse] =
        await Promise.all([
          galleryService.getAllGallery({
  limit: 50,
  ...(societyKey ? { society: societyKey } : {}),
}),
          societiesService.getAllSocieties({ limit: 1000 }),
        ]);

      setItems(
        getList(galleryResponse, [
          "images",
          "items",
          "gallery",
          "galleryItems",
          "results",
        ])
      );

      setSocieties(
        getList(societyResponse, ["societies", "results"])
      );
    } catch (error) {
      console.error("Gallery loading error:", error);
      toast.error(
        error?.response?.data?.message ||
          "Gallery load nahi ho saki."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (!imageFile) return;

    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);

    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const openAddForm = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      society:
        filterSociety !== "all" ? filterSociety : "",
    });
    setImageFile(null);
    setImageFiles([]);
    setImagePreview("");
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditingId(getId(item));

    setForm({
      society:
        item.society?._id ||
        item.society?.id ||
        item.society ||
        "",
      title: item.title || "",
      description: item.description || "",
      eventDate: item.eventDate
        ? String(item.eventDate).slice(0, 10)
        : "",
    });

    setImageFile(null);
    setImageFiles([]);
    setImagePreview(getImageUrl(item.imageUrl));
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setImageFiles([]);
    setImagePreview("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.society) {
      toast.error("Please select a society.");
      return;
    }

    if (!form.title.trim()) {
      toast.error("Image title is required.");
      return;
    }

    if (!editingId && imageFiles.length === 0) {
    toast.error("Please select at least one image to upload.");
    return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      ...(form.eventDate
        ? { eventDate: form.eventDate }
        : {}),
    };

    setSaving(true);

    try {
      if (editingId) {
        await galleryService.updateGalleryItem(
          editingId,
          payload,
          imageFile
        );

        toast.success("Gallery item updated successfully.");
      } else {
        for (const file of imageFiles) {
          await galleryService.createGalleryItem(
            payload,
            file
        );
    }
        toast.success(
            `${imageFiles.length} gallery images added successfully.`
        );
      }

      closeForm();
      await loadData();
    } catch (error) {
      console.error("Gallery save error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Gallery item save nahi ho saka."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title || "this gallery image"}"?`
    );

    if (!confirmed) return;

    try {
      await galleryService.deleteGalleryItem(getId(item));

      setItems((previous) =>
        previous.filter(
          (entry) => getId(entry) !== getId(item)
        )
      );

      toast.success("Gallery item deleted successfully.");
    } catch (error) {
      console.error("Gallery delete error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Gallery item delete nahi ho saka."
      );
    }
  };

  const filteredItems = items.filter((item) => {
    const societyId =
      item.society?._id ||
      item.society?.id ||
      item.society ||
      "";

    const matchesSociety =
      filterSociety === "all" ||
      String(societyId) === String(filterSociety);

    const query = search.toLowerCase();

    const matchesSearch =
      (item.title || "").toLowerCase().includes(query) ||
      (item.description || "").toLowerCase().includes(query) ||
      (item.society?.name || "").toLowerCase().includes(query);

    return matchesSociety && matchesSearch;
  });

  const societyName = (item) => {
    if (item.society && typeof item.society === "object") {
      return item.society.name || "Society";
    }

    const society = societies.find(
      (entry) =>
        String(getId(entry)) === String(item.society)
    );

    return society?.name || "Society";
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-indigo-600">
              <Images className="h-6 w-6" />
              <span className="text-sm font-semibold">
                Content Management
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Gallery Manager
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage gallery images for all societies.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={openAddForm}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Add Image
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Total Images
              </p>
              <Images className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {items.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Societies
              </p>
              <Building2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {societies.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Filtered Images
              </p>
              <Search className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {filteredItems.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search title, description or society..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <select
            value={filterSociety}
            onChange={(event) =>
              setFilterSociety(event.target.value)
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400"
          >
            <option value="all">All Societies</option>
            {societies.map((society) => (
              <option
                key={getId(society)}
                value={getId(society)}
              >
                {society.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gallery list */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            Loading gallery...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <Images className="mx-auto h-12 w-12 text-slate-300" />

            <h2 className="mt-4 text-lg font-semibold text-slate-800">
              No gallery images found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add an image or change your search filters.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add First Image
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <article
                key={getId(item)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {item.imageUrl ? (
                    <img
                      src={getImageUrl(item.imageUrl)}
                      alt={item.title || "Gallery image"}
                      className="h-full w-full object-cover"
                      onError={(event) => {
                        event.currentTarget.style.visibility =
                          "hidden";
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      <Images className="h-12 w-12" />
                    </div>
                  )}

                  <span className="absolute left-3 top-3 max-w-[80%] truncate rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                    {societyName(item)}
                  </span>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.title || "Untitled"}
                    </h2>

                    <p className="mt-1 line-clamp-2 min-h-10 text-sm text-slate-500">
                      {item.description || "No description"}
                    </p>
                  </div>

                  {item.eventDate && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <CalendarDays className="h-4 w-4" />
                      {String(item.eventDate).slice(0, 10)}
                    </div>
                  )}

                  <div className="flex gap-2 border-t border-slate-100 pt-3">
                    <button
                      type="button"
                      onClick={() => openEditForm(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/50 p-4 sm:items-center">
          <div className="my-auto w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {editingId ? "Edit Gallery Image" : "Add Gallery Image"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Select a society and enter the image details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Society *
                </label>

                <select
                  required
                  disabled={Boolean(societyKey)}
                  value={form.society}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      society: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                >
                  <option value="">Select a society</option>

                  {societies.map((society) => (
                    <option
                      key={getId(society)}
                      value={getId(society)}
                    >
                      {society.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Image Title *
                </label>

                <input
                  required
                  value={form.title}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      title: event.target.value,
                    }))
                  }
                  placeholder="e.g. Annual Sports Gala"
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Write a short description..."
                  className="w-full resize-y rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Event Date
                </label>

                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      eventDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Image {!editingId && "*"}
                </label>

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                  <Upload className="h-8 w-8 text-indigo-500" />

                  <span className="mt-2 text-sm font-semibold text-slate-700">
                    Choose an image
                  </span>

                  <span className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WebP
                  </span>

     
                  <input
                    type="file"
                    accept="image/*"
                    multiple={!editingId}
                    className="hidden"
                    onChange={(event) => {
                        const files = Array.from(event.target.files || []);

                        if (editingId) {
                        setImageFile(files[0] || null);
                        } else {
                        setImageFiles(files);
                        setImageFile(files[0] || null);
                        }
                    }}
                  />

                </label>

                {imagePreview && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Selected preview"
                      className="max-h-64 w-full bg-slate-100 object-contain"
                    />
                  </div>
                )}

                {editingId && imageFile && (
                <p className="mt-2 text-xs text-slate-500">
                    Selected: {imageFile.name}
                </p>
                )}

                {!editingId && imageFiles.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                    Selected {imageFiles.length} images:{" "}
                    {imageFiles.map((file) => file.name).join(", ")}
                </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Upload Image"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}