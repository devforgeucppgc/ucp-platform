import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, ArrowUpDown, Plus, Pencil, Trash2 } from "lucide-react";

import Modal from "./Modal";
import Pagination from "./Pagination";
import ConfirmDialog from "./ConfirmDialog";
import FieldRenderer from "./FieldRenderer";

export default function CrudPage({
  title,
  service,
  searchFields = [],
  columns = [],
  fields = [],
  filters = [],
  canCreate = true,
  canEdit = true,
  canDelete = true,
  rowActionsExtra,
}) {
  const [query, setQuery] = useState({
    page: 1,
    limit: 8,
    search: "",
    sortBy: "createdAt",
    sortDir: "desc",
    filters: {},
  });

  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  
  const load = async () => {
    setLoading(true);
    try {
      const res = await service.list({ ...query, searchFields });
      setData(res);
    } catch (e) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    
  }, [query.page, query.search, query.sortBy, query.sortDir, JSON.stringify(query.filters)]);

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm(row);
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const required = fields.filter((f) => f.required);
    for (const f of required) {
      const v = form[f.name];
      if (v === undefined || v === null || String(v).trim() === "") {
        toast.error(`${f.label} is required`);
        return;
      }
    }

    try {
      if (editing) {
        await service.update(editing.id, form);
        toast.success("Updated successfully ✨");
      } else {
        await service.create(form);
        toast.success("Created successfully 🎉");
      }
      setModalOpen(false);
      setQuery((q) => ({ ...q, page: 1 }));
      await load();
    } catch (e2) {
      toast.error("Save failed");
    }
  };

  const askDelete = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await service.remove(deleteId);
      toast.success("Deleted successfully");
      setConfirmOpen(false);
      setDeleteId(null);
      await load();
    } catch {
      toast.error("Delete failed");
    }
  };

  
  const glassCard =
    "rounded-3xl border border-white/10 bg-white/10 backdrop-blur-2xl shadow-2xl";

  const inputClass =
    "w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30 transition-all";

  return (
    <div className="space-y-6">
    
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-white/60 mt-1">
            Manage {title.toLowerCase()} •{" "}
            <span className="font-semibold text-white">{data.total}</span> items
          </p>
        </div>

        {canCreate && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreate}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New
          </motion.button>
        )}
      </motion.div>

    
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className={`${glassCard} p-4`}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
            <input
              className={`${inputClass} pl-11`}
              placeholder="Search..."
              value={query.search}
              onChange={(e) => setQuery((q) => ({ ...q, page: 1, search: e.target.value }))}
            />
          </div>

          {filters.map((f) => (
            <select
              key={f.name}
              className={`${inputClass} md:w-48`}
              value={query.filters[f.name] ?? ""}
              onChange={(e) =>
                setQuery((q) => ({
                  ...q,
                  page: 1,
                  filters: { ...q.filters, [f.name]: e.target.value },
                }))
              }
            >
              {f.options.map((o) => (
                <option key={String(o.value)} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ))}

          <select
            className={`${inputClass} md:w-44`}
            value={`${query.sortBy}:${query.sortDir}`}
            onChange={(e) => {
              const [sortBy, sortDir] = e.target.value.split(":");
              setQuery((q) => ({ ...q, sortBy, sortDir }));
            }}
          >
            <option value="createdAt:desc">Newest First</option>
            <option value="createdAt:asc">Oldest First</option>
            <option value="title:asc">Title A–Z</option>
            <option value="title:desc">Title Z–A</option>
          </select>
        </div>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className={`${glassCard} overflow-hidden`}
      >
        <div className="overflow-x-auto admin-scroll max-h-[65vh]">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 z-10 bg-white/10 backdrop-blur-xl border-b border-white/10">
              <tr>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-widest text-white/70"
                  >
                    {c.header}
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-widest text-white/70">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="py-20 text-center text-white/60">
                    Loading...
                  </td>
                </tr>
              ) : data.items.length > 0 ? (
                data.items.map((row, idx) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="hover:bg-white/10 transition-colors duration-200"
                  >
                    {columns.map((c) => (
                      <td key={c.key} className="px-6 py-4 text-white/80">
                        {c.render ? c.render(row) : String(row[c.key] ?? "—")}
                      </td>
                    ))}

                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {rowActionsExtra?.(row)}

                        {canEdit && (
                          <button
                            onClick={() => openEdit(row)}
                            className="p-2.5 rounded-2xl hover:bg-white/10 text-white/70 hover:text-white transition-all"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}

                        {canDelete && (
                          <button
                            onClick={() => askDelete(row.id)}
                            className="p-2.5 rounded-2xl hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-20 text-center text-white/50">
                    No results found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

    
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Pagination
          page={data.page}
          pages={data.pages}
          onPrev={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
          onNext={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
        />
      </motion.div>

      
      <Modal
        open={modalOpen}
        title={editing ? `Edit ${title}` : `Add ${title}`}
        onClose={() => setModalOpen(false)}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {fields.map((f) => (
              <div key={f.name} className={f.full ? "md:col-span-2" : ""}>
                {f.type !== "checkbox" && (
                  <label className="mb-1.5 block text-sm font-medium text-white/80">
                    {f.label}
                  </label>
                )}
                <FieldRenderer
                  field={f}
                  value={form[f.name]}
                  onChange={(val) => setForm((s) => ({ ...s, [f.name]: val }))}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-6 py-2.5 rounded-2xl border border-white/20 text-white/80 hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-semibold text-white hover:scale-105 active:scale-95 transition"
            >
              {editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}