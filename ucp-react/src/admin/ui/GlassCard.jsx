import clsx from "clsx";

export default function GlassCard({ className, children }) {
  return (
    <div className={clsx("glass glass-hover rounded-xl3", className)}>
      {children}
    </div>
  );
}