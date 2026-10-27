export default function FieldRenderer({ field, value, onChange }) {
  const base =
    "w-full rounded-lg border border-slate-200 bg-transparent px-3 py-2 text-sm dark:border-slate-700";

  if (field.type === "textarea") {
    return (
      <textarea
        className={base}
        rows={field.rows || 4}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
      />
    );
  }

  if (field.type === "select") {
    return (
      <select className={base} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {field.options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }

  return (
    <input
      className={base}
      type={field.type || "text"}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={field.placeholder}
    />
  );
}