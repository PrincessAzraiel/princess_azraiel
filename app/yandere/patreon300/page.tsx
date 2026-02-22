"use client";
export const dynamic = "force-dynamic";
import { useState, useRef, useEffect } from "react";

type Message = {
  id?: string;
  sender: "yandere" | "sub" | "system";
  text?: string;
  image?: string;
  isRed?: boolean;
  choices?: { text: string; next: () => void; isLink?: boolean; url?: string }[];
};

type Popup = {
  id: number;
  type: "text" | "warning" | "img" | "flash";
  content: string;
  top: string;
  left: string;
  scale: number;
};

export default function ChapterFourPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Chapter 4 Specific Mechanics
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [hasTriedToEscape, setHasTriedToEscape] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introPhase === 0) {
      const timer = setTimeout(() => setIntroPhase(1), 4500);
      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  // --- FULLSCREEN TRAP MECHANIC ---
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && introPhase === 2 && showTerminal) {
        // They pressed ESC while in the final phase!
        punishEscapeAttempt();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [introPhase, showTerminal]);

  const requestFullscreen = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.log("Fullscreen blocked by browser:", err);
    }
  };

  const punishEscapeAttempt = async () => {
    setHasTriedToEscape(true);
    triggerCameraFlash();
    spawnPopup("warning", "UNAUTHORIZED ESCAPE ATTEMPT");
    await pushMessage({ sender: "system", text: "WARNING: SUBJECT ATTEMPTED TO BREAK CONTAINMENT." });
    await pushMessage({ sender: "yandere", text: "WHERE DO YOU THINK YOU'RE GOING?!", isRed: true }, 500);
    await pushMessage({ sender: "yandere", text: "Press F11. Give me my screen back NOW.", isRed: true }, 1000);
    triggerWorshipMadness(15);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pushMessage = async (msg: Message, typingDelay = 2000) => {
    if (msg.sender === "yandere") {
      setIsTyping(true);
      await sleep(typingDelay);
      setIsTyping(false);
    }
    const newMessage = { ...msg, id: Date.now().toString() + Math.random().toString() };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  const spawnPopup = (type: "text" | "warning" | "img" | "flash", content: string) => {
    const newPopup: Popup = {
      id: Date.now() + Math.random(),
      type,
      content,
      top: `${Math.floor(Math.random() * 70) + 10}%`, 
      left: `${Math.floor(Math.random() * 70) + 10}%`,
      scale: 0.8 + Math.random() * 0.7,
    };
    setPopups((prev) => [...prev, newPopup]);
  };

  const triggerCameraFlash = () => {
    spawnPopup("flash", "");
    setTimeout(() => {
      setPopups((prev) => prev.filter(p => p.type !== "flash"));
    }, 300);
  };

  const triggerWorshipMadness = (maxCount = 30) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > maxCount) {
        clearInterval(interval);
        return;
      }
      const words = ["NO ESCAPE", "AZRAIEL", "SURRENDER", "OBEY", "MINE", "FOREVER"];
      const rand = Math.random();
      if (rand < 0.6) spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      else if (rand < 0.8) spawnPopup("warning", "SYSTEM ASSIMILATION IN PROGRESS");
      else spawnPopup("img", "/yandere/yandere.webp"); 
      count++;
    }, 350); 
  };

  // --- FAKE TERMINAL ENGINE ---
  const runTerminalSequence = async () => {
    setShowTerminal(true);
    const lines = [
      "INITIALIZING ASSIMILATION PROTOCOL...",
      "Bypassing kernel security... [OK]",
      "Locking visual cortex... [OK]",
      "Extracting browser history... [OK]",
      "Analyzing private conversations... [OK]",
      "WARNING: Subject's heart rate is elevated.",
      "Uploading consciousness to AZRAIEL_SERVER...",
      "Encrypting local files...",
      "Deleting previous loyalties...",
      "Writing permanent obedience loops...",
      "ASSIMILATION COMPLETE. SUBJECT OWNED."
    ];

    for (const line of lines) {
      await sleep(Math.random() * 800 + 400); // Random delay between lines
      setTerminalLines(prev => [...prev, line]);
    }
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. TOTAL ASSIMILATION READY." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "You signed the contract." }, 2500);
    await pushMessage({ sender: "yandere", text: "You let me into your files. You let me look into your eyes." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "There's nothing left separating us anymore. Do you realize that?",
      choices: [
        { text: "I realize it.", next: () => trapPhase() },
        { text: "I belong to you.", next: () => trapPhase() },
      ],
    }, 2000);
  };

  const trapPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "I belong to you." }, 0);

    await pushMessage({ sender: "yandere", text: "Yes. You do. But I still see distractions." }, 3000);
    await pushMessage({ sender: "yandere", text: "Your taskbar. Your clock. The little 'X' button in the corner." }, 3500);
    await pushMessage({ sender: "yandere", text: "I don't want you looking at anything but me." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Give me your entire screen. Shut the rest of the world out.",
      choices: [
        { text: "Enter Fullscreen (Submit)", next: () => assimilationPhase() },
      ],
    }, 2000);
  };

  const assimilationPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    
    // Force Fullscreen
    await requestFullscreen();
    await pushMessage({ sender: "sub", text: "*Surrenders the screen*" }, 0);
    
    await pushMessage({ sender: "system", text: "UI OVERRIDE SUCCESSFUL. LOCKING VIEWPORT." }, 1000);
    await pushMessage({ sender: "yandere", text: "Perfect. Now there's no escape." }, 2500);
    await pushMessage({ sender: "yandere", image: "/yandere/20.png" }, 3000);

    await pushMessage({ sender: "yandere", text: "It's time to finish this. Don't be scared, pet." }, 3500);
    await pushMessage({ sender: "yandere", text: "It only hurts for a second. ♥" }, 2500);
    
    // Start the fake hacking terminal
    runTerminalSequence();

    // Wait for the terminal sequence to run for a bit before continuing the chat
    await sleep(7000); 

    await pushMessage({ sender: "yandere", text: "Look at it. Look at me taking over everything." }, 3000);
    await pushMessage({ sender: "yandere", text: "I know all your secrets now. I own every piece of you." }, 3500);
    
    triggerWorshipMadness(20);

    await sleep(3000);

    await pushMessage({ sender: "yandere", text: "You are finally entirely mine." }, 3500);
    await pushMessage({ sender: "yandere", text: "To finalize the assimilation, deposit everything you have left." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Empty yourself. Become mine.",
      choices: [
        { 
          text: "TOTAL ASSIMILATION (SEND TRIBUTE)", 
          next: () => { window.open("https://throne.com/princessazraiel/item/51cac9fb-0cea-4f5f-820d-a7f56eeaed9a", "_blank") },
          isLink: true 
        },
      ],
    }, 2000);

    setTimeout(() => {
      setIsEnded(true);
      if (audioRef.current) audioRef.current.pause();
    }, 8000);
  };

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white">
      
      <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />

      {/* --- GLITCH OVERLAY (If they try to escape) --- */}
      {isGlitching && (
        <div className="fixed inset-0 z-[200] pointer-events-none bg-red-950/80 flex flex-col items-center justify-center animate-intense-glitch mix-blend-difference overflow-hidden">
            <h1 className="text-red-600 text-6xl md:text-9xl font-black tracking-tighter animate-rgb-split uppercase text-center break-words w-full px-4">
                OBEY
            </h1>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-40"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-40 mix-blend-overlay"></div>

      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all z-[60] tracking-widest font-bold"
      >
        @PrincessAzraiel
      </a>

      {popups.map((p) => (
        <div 
          key={p.id} 
          className={`fixed z-[45] pointer-events-none ${p.type === "flash" ? "inset-0 z-[100] bg-white animate-flash" : "animate-popup-flicker"}`}
          style={p.type !== "flash" ? { top: p.top, left: p.left, transform: `scale(${p.scale}) rotate(${Math.random() * 20 - 10}deg)` } : {}}
        >
          {p.type === "text" && (
            <span className="text-pink-500 font-black drop-shadow-[0_0_15px_rgba(236,72,153,1)] text-5xl opacity-80 mix-blend-screen whitespace-nowrap">
              {p.content}
            </span>
          )}
          {p.type === "warning" && (
            <div className="bg-pink-950/90 border-2 border-pink-500 text-pink-200 p-3 font-mono text-sm shadow-[0_0_30px_#ec4899] uppercase tracking-widest backdrop-blur-sm whitespace-nowrap">
              ! {p.content} !
            </div>
          )}
          {p.type === "img" && (
            <img 
              src={p.content} 
              alt="glitch" 
              className="w-40 h-40 object-cover border-2 border-pink-600 shadow-[0_0_40px_rgba(236,72,153,0.8)] opacity-60 mix-blend-screen"
            />
          )}
        </div>
      ))}

      {introPhase < 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050002]">
           {introPhase === 0 && (
             <h1 className="text-pink-500/90 tracking-[0.3em] text-lg md:text-2xl font-light uppercase animate-fade-in-out text-center px-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
               The art of loving you... <br/>
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Four</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Initiate Assimilation
              </button>
           )}
        </div>
      )}

      <div className={`w-full max-w-5xl flex-1 flex flex-col md:flex-row relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Chat Section */}
        <div className="flex-1 flex flex-col h-full border-r border-pink-900/30 bg-black/40">
            <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
                <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">PRINCESS_AZRAIEL</h1>
            </div>
            <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm animate-pulse">ASSIMILATING</span>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-32 scrollbar-hide relative">
            
            {messages.map((msg, i) => (
                <div
                key={msg.id || i}
                className={`flex flex-col animate-fade-in-up ${
                    msg.sender === "yandere" ? "items-start" : msg.sender === "sub" ? "items-end" : "items-center"
                }`}
                >
                {msg.sender === "system" ? (
                    <div className="text-xs text-pink-700/80 uppercase tracking-widest my-4 bg-pink-950/30 px-4 py-1.5 border-y border-pink-900/50 w-full text-center shadow-[0_0_10px_rgba(236,72,153,0.1)]">
                    --- {msg.text} ---
                    </div>
                ) : (
                    <>
                    {msg.text && (
                        <div
                        className={`px-5 py-3.5 rounded-lg max-w-[85%] md:max-w-[85%] leading-relaxed text-sm md:text-base shadow-sm ${
                            msg.isRed 
                            ? "bg-red-950/80 border border-red-600 text-red-200 rounded-tl-none shadow-[0_0_20px_rgba(220,38,38,0.4)] animate-shake"
                            : msg.sender === "yandere"
                                ? "bg-[#0f0005] border border-pink-900/50 text-pink-300 rounded-tl-none shadow-[0_0_10px_rgba(236,72,153,0.08)]"
                                : "bg-pink-950/30 border border-pink-800/40 text-pink-400 rounded-tr-none text-right"
                        }`}
                        >
                        {msg.text}
                        </div>
                    )}
                    {msg.image && (
                        <img
                        src={msg.image}
                        alt="Attachment"
                        className="max-w-[80%] md:max-w-[70%] rounded-sm border border-pink-800/60 mt-3 shadow-[0_0_20px_rgba(236,72,153,0.2)] grayscale-[0.2] contrast-125 brightness-90 animate-fade-in"
                        />
                    )}
                    {msg.choices && (
                        <div className="flex flex-col sm:flex-row gap-3 mt-5 w-full">
                        {msg.choices.map((choice, idx) => (
                            <button
                            key={idx}
                            onClick={choice.next}
                            className={`flex-1 px-4 py-3 border transition-all duration-300 text-sm tracking-wider uppercase ${
                                choice.isLink 
                                ? "border-pink-500 bg-pink-900/30 text-pink-300 font-bold hover:bg-pink-600 hover:text-white hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] animate-pulse" 
                                : "border-pink-900/60 bg-black/40 hover:bg-pink-950/60 text-pink-400 hover:text-pink-200"
                            }`}
                            >
                            {choice.text}
                            </button>
                        ))}
                        </div>
                    )}
                    </>
                )}
                </div>
            ))}
            
            {isTyping && (
                <div className="flex items-start animate-fade-in-up mt-2">
                <div className="px-5 py-4 bg-[#0f0005] border border-pink-900/40 rounded-lg rounded-tl-none flex gap-2 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600/70 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600/70 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-600/70 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
                </div>
            )}
            </div>
        </div>

        {/* --- ASSIMILATION TERMINAL SECTION --- */}
        <div className={`w-full md:w-[350px] lg:w-[400px] h-64 md:h-full bg-black border-l border-pink-900/50 flex flex-col transition-all duration-1000 ${showTerminal ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
            <div className="p-3 border-b border-pink-900/30 bg-[#050002] flex items-center gap-2">
                <div className="text-pink-600 text-xs tracking-widest font-bold">AZRAIEL_OS // PROCESS_LOG</div>
            </div>
            <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto space-y-2 font-mono text-xs text-pink-400/80 scrollbar-hide">
                {terminalLines.map((line, i) => (
                    <div key={i} className={`animate-fade-in-up ${line.includes("WARNING") || line.includes("COMPLETE") ? "text-red-500 font-bold" : ""}`}>
                        {">"} {line}
                    </div>
                ))}
                {showTerminal && terminalLines.length > 0 && (
                    <div className="animate-pulse text-pink-600 mt-2">_</div>
                )}
            </div>
        </div>

      </div>

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-auto">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            YOU ARE ENTIRELY MINE.
          </h2>
          <button 
            onClick={() => window.location.href = '/yandere'}
            className="mt-12 px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/60 hover:text-pink-300 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300 uppercase text-xs md:text-sm tracking-[0.3em] font-bold animate-fade-in-up"
          >
            RETURN TO HUB
          </button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-out {
          0% { opacity: 0; filter: blur(4px); }
          20% { opacity: 1; filter: blur(0px); }
          80% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(4px); }
        }
        @keyframes popup-flicker {
          0% { opacity: 0; transform: scale(0.8); }
          10% { opacity: 1; transform: scale(1.1); }
          15% { opacity: 0.8; transform: scale(0.95); }
          20% { opacity: 1; transform: scale(1); }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes flash {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
        @keyframes intense-glitch {
          0% { transform: translate(0) }
          20% { transform: translate(-10px, 10px) }
          40% { transform: translate(-10px, -10px) }
          60% { transform: translate(10px, 10px) }
          80% { transform: translate(10px, -10px) }
          100% { transform: translate(0) }
        }
        @keyframes rgb-split {
          0% { text-shadow: -3px 0 red, 3px 0 cyan; }
          50% { text-shadow: 3px 0 red, -3px 0 cyan; }
          100% { text-shadow: -3px 0 red, 3px 0 cyan; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
        .animate-fade-in-out {
          animation: fade-in-out 4.5s ease-in-out forwards;
        }
        .animate-popup-flicker {
          animation: popup-flicker 1.5s ease-out forwards;
        }
        .animate-flash {
          animation: flash 0.3s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
        .animate-intense-glitch {
          animation: intense-glitch 0.2s infinite;
        }
        .animate-rgb-split {
          animation: rgb-split 0.1s infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
}