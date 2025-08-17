type LoadingDotsProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  label?: string;
};

export default function LoadingDots({ size = "md", className = "text-gray-500", label = "Loading…" }: LoadingDotsProps) {
  const sizeMap: Record<"xs" | "sm" | "md" | "lg", string> = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const dotSize = sizeMap[size];

  return (
    <div
      className={`inline-flex items-end gap-1 align-middle ${className}`}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Visually hidden label for screen readers */}
      <span className="sr-only">{label}</span>

      {/* Dots use currentColor via bg-current so you can style with text-* utilities */}
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "0ms" }}
      />
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "150ms" }}
      />
      <span
        className={`${dotSize} rounded-full bg-current animate-bounce`}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}