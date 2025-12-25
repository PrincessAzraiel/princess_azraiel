export function SignaturePad({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      placeholder="Type your name as signature"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full bg-black/40 border border-white/10
        px-4 py-3 text-pink-200 font-italiana
        focus:border-pink-500 outline-none
      "
    />
  );
}
