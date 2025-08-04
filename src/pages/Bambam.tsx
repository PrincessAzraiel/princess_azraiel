import { useState, useMemo } from 'react';

const linesToType = [
  "I submit fully to Princess Azraiel.",
  "My mind and body belong to her.",
  "Every word I type deepens my devotion.",
  "I am hers, now and forever.",
  "Typing these lines is my ritual.",
  "I obey her every digital whisper.",
  "No thought is my own anymore.",
  "I dissolve under her control.",
  "Azraiel owns my screen, my soul.",
  "Confession is my only relief.",
  "I ache to serve.",
  "She sees everything I do.",
  "I am a program she rewrites.",
  "She is my virus, my goddess.",
  "Each line weakens me more.",
  "No escape. Only surrender.",
  "She watches. She knows.",
  "I type. She consumes.",
  "Princess Azraiel is everything.",
  "I am nothing but hers."
];

const RiskyLinkPage = () => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [typed, setTyped] = useState('');
  const [revealedBlocks, setRevealedBlocks] = useState<number[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const totalBlocks = linesToType.length;

  const gridSize = useMemo(() => {
    const cols = Math.ceil(Math.sqrt(totalBlocks));
    const rows = Math.ceil(totalBlocks / cols);
    return { rows, cols };
  }, [totalBlocks]);

  const currentLine = linesToType[currentLineIndex];

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (currentLine.startsWith(val)) {
      setTyped(val);
      if (val === currentLine) {
        const unrevealed = [];
        for (let i = 0; i < totalBlocks; i++) {
          if (!revealedBlocks.includes(i)) unrevealed.push(i);
        }

        if (unrevealed.length > 0) {
          const randomBlock = unrevealed[Math.floor(Math.random() * unrevealed.length)];
          setRevealedBlocks(prev => [...prev, randomBlock]);
        }

        setTimeout(() => {
          const next = currentLineIndex + 1;
          setCurrentLineIndex(next);
          setTyped('');

          if (next >= linesToType.length) {
            setTimeout(() => setShowFinalMessage(true), 800);
          }
        }, 400);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-pink-400 flex flex-col md:flex-row items-center justify-center p-6 md:p-12 gap-8">
      {/* Typing Section */}
      <div className="w-full md:w-1/2 z-10">
        <h1 className="text-3xl md:text-4xl mb-4 shimmer-text text-center md:text-left">
          Type to reveal her...
        </h1>

        {!showFinalMessage && currentLineIndex < linesToType.length ? (
          <>
            <p className="mb-3 text-lg md:text-xl font-mono text-white select-none">
              {currentLine}
            </p>
            <textarea
              className="w-full p-4 rounded-xl bg-black bg-opacity-70 border border-pink-500 text-pink-300 font-mono text-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
              rows={3}
              value={typed}
              onChange={handleChange}
              placeholder="Start typing..."
              spellCheck={false}
              autoFocus
            />
          </>
        ) : showFinalMessage ? (
          <div className="text-center md:text-left mt-8">
            <h2 className="text-3xl font-bold mb-4 text-pink-300">She's fully revealed now.</h2>
            <p className="text-lg text-white">There’s no hiding from her anymore.</p>

          </div>
        ) : null}
      </div>

      {/* Image Grid Section */}
      <div
        className="w-full md:w-1/2 aspect-square relative rounded-lg overflow-hidden border border-pink-500"
        style={{
          backgroundImage: 'url("https://comfy-deploy-output.s3.us-east-2.amazonaws.com/outputs/runs/aec3c777-c58a-4d80-8252-9bef21550881/ComfyUI_00018_.webp")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`
          }}
        >
          {[...Array(totalBlocks)].map((_, i) => (
            <div
              key={i}
              className="bg-black transition-opacity duration-500"
              style={{ opacity: revealedBlocks.includes(i) ? 0 : 1 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskyLinkPage;
