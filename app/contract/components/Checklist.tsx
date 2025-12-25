export function Checklist({
  items,
  checked,
  onToggle,
}: {
  items: string[];
  checked: boolean[];
  onToggle: (i: number) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <label
          key={i}
          className="flex items-center gap-3 text-white/70"
        >
          <input
            type="checkbox"
            checked={checked[i]}
            onChange={() => onToggle(i)}
            className="accent-pink-500"
          />
          <span>{item}</span>
        </label>
      ))}
    </div>
  );
}
