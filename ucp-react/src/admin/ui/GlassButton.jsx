import clsx from "clsx";

export default function GlassButton({ variant="primary", className, children, ...props }) {
  const base =
    "ripple inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition active:scale-[.98]";

  const variants = {
    primary: "bg-gradient-to-r from-indigoX to-purpleX text-white shadow-glass",
    ghost: "glass text-white/90 hover:text-white",
    danger: "bg-gradient-to-r from-pinkX to-purpleX text-white shadow-glass",
    outline: "border border-white/15 bg-white/5 text-white hover:bg-white/10",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}