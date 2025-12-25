import { FillWord } from "./FillWord";

export function ContractParagraph({
  text,
  values,
  onChange,
}: {
  text: string;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <p className="font-manrope text-white/70 leading-relaxed">
      {text.split(/({{.*?}})/g).map((chunk, i) => {
        const match = chunk.match(/{{(.*?)}}/);
        if (!match) return chunk;

        const key = match[1];
        return (
          <FillWord
            key={i}
            value={values[key] || ""}
            onChange={(v) => onChange(key, v)}
          />
        );
      })}
    </p>
  );
}
