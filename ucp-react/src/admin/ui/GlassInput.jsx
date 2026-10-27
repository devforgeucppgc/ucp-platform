import clsx from "clsx";

export default function GlassInput({ label, value, className, ...props }) {
  return (
    <div className={clsx("relative", className)}>
      <input
        value={value}
        className={clsx(
          "peer w-full rounded-xl bg-white/5 border border-white/15 px-4 pt-5 pb-2 text-sm text-white",
          "outline-none focus:ring-2 focus:ring-indigoX/40 focus:border-indigoX/50 transition"
        )}
        {...props}
      />
      <label
        className={clsx(
          "absolute left-4 top-3 text-xs text-white/60 transition-all",
          "peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-white/70",
          value ? "top-2 text-[11px] text-white/70" : ""
        )}
      >
        {label}
      </label>
    </div>
  );
}