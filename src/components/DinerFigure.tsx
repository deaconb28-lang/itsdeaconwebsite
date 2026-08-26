/**
 * The human figure used throughout the page — solid for a diner talked out of
 * going, outlined for one who still came in.
 */
export function DinerFigure({
  variant,
  color,
  className,
}: {
  variant: "solid" | "outline";
  /** Any CSS colour; defaults to the accent so cards can stay declarative. */
  color?: string;
  className?: string;
}) {
  const fill = variant === "solid" ? (color ?? "var(--ac)") : "none";
  const stroke = variant === "solid" ? "none" : (color ?? "var(--ac)");

  return (
    <svg viewBox="0 0 12 18" className={className} aria-hidden="true">
      <circle cx="6" cy="3.6" r="3.1" fill={fill} stroke={stroke} strokeWidth="1" />
      <path
        d="M6 8.2c-3 0-4.6 2.2-4.6 5.3V17h9.2v-3.5C10.6 10.4 9 8.2 6 8.2Z"
        fill={fill}
        stroke={stroke}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
