import type { GradeLetter } from "@/lib/types";
import { gradeColorClass, gradeSurfaceClass } from "@/lib/types";

export function ScoreBadge({
  value,
  grade,
  label,
  size = "md",
}: {
  value: number;
  grade: GradeLetter;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeMap = {
    sm: "px-2 py-1 text-caption",
    md: "px-3 py-1.5 text-body-sm",
    lg: "px-4 py-2 text-body",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill border font-mono font-semibold ${sizeMap[size]} ${gradeSurfaceClass(grade)} ${gradeColorClass(grade)}`}
      aria-label={label ? `${label}: ${value} (${grade})` : `Grade ${grade}, score ${value}`}
    >
      <span>{grade}</span>
      <span className="text-text/60 font-normal">·</span>
      <span>{value}</span>
    </span>
  );
}
