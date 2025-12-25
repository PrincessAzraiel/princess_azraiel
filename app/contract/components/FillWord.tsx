export function FillWord({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        mx-1 inline-block bg-transparent border-b
        border-pink-500/40 focus:border-pink-500
        text-pink-300 outline-none min-w-[6ch]
      "
    />
  );
}
