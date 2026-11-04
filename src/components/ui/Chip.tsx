interface ChipListProps {
  items: readonly string[];
  label: string;
  className?: string;
}

/** Plain-text labels (stack, skills). Rendered as a real list so screen readers announce the count. */
export function ChipList({ items, label, className = "" }: ChipListProps) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-chip border border-rule px-2.5 py-1 text-small leading-snug text-ink"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
