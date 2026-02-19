"use client";
export const dynamic = "force-dynamic";
import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "yandere" | "sub" | "system";
  text?: string;
  image?: string;
  choices?: { text: string; next: () => void; isLink?: boolean; url?: string }[];
};

type Popup = {
  id: number;
  type: "text" | "warning" | "img";
  content: string;
  top: string;
  left: string;
  scale: number;
};

export default function YanderePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0); // 0: Title, 1: Button, 2: Chat
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null); // Added Audio Reference

  // Cinematic Intro Sequence
  useEffect(() => {
    if (introPhase === 0) {
      const timer = setTimeout(() => {
        setIntroPhase(1);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  // Auto-scroll to bottom smoothly
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pushMessage = async (msg: Message, typingDelay = 2000) => {
    if (msg.sender === "yandere") {
      setIsTyping(true);
      await sleep(typingDelay);
      setIsTyping(false);
    }
    setMessages((prev) => [...prev, msg]);
  };

  // --- POPUP MADNESS ENGINE ---
  const spawnPopup = (type: "text" | "warning" | "img", content: string) => {
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

  const triggerLoveBombingMadness = () => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > 25) {
        clearInterval(interval);
        return;
      }
      const words = ["MINE", "I LOVE YOU", "FOREVER", "PERFECT", "DON'T LOOK AWAY", "ONLY ME", "♥♥♥"];
      
      const rand = Math.random();
      if (rand < 0.6) {
        spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      } else if (rand < 0.8) {
        spawnPopup("warning", "SYSTEM OVERRIDE: BOUNDARY PROTOCOL FAILED");
      } else {
        spawnPopup("img", "/yandere/yandere.webp");
      }
      count++;
    }, 400); 
  };
  // ----------------------------

  const startStory = async () => {
    setIntroPhase(2);

    // Trigger the background audio when they click "Accept"
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set volume (0.0 to 1.0) so it's not deafening
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION ESTABLISHED. UNKNOWN ENTITY JOINED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "You actually clicked it..." }, 2500);
    await pushMessage({ sender: "yandere", text: "I was starting to think you were going to ignore me forever. ♥" }, 3000);
    await pushMessage({ sender: "yandere", text: "But I knew you couldn't resist." }, 2500);
    
    await pushMessage({
      sender: "yandere",
      text: "Tell me... are you completely alone right now?",
      choices: [
        { text: "Yes, it's just me.", next: () => aloneChoice(true) },
        { text: "No, there are people around.", next: () => aloneChoice(false) },
      ],
    }, 2000);
  };

  const aloneChoice = async (isAlone: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));

    if (isAlone) {
      await pushMessage({ sender: "sub", text: "Yes, it's just me." }, 0);
      await pushMessage({ sender: "yandere", text: "Perfect. Good. That makes this so much easier... ♥" }, 3000);
    } else {
      await pushMessage({ sender: "sub", text: "No, there are people around." }, 0);
      await pushMessage({ sender: "yandere", text: "Liar." }, 2000);
      await pushMessage({ sender: "yandere", text: "I can see the reflection in your screen. I know exactly who is around you. They can't hear us anyway~" }, 4000);
    }

    await pushMessage({ sender: "yandere", text: "I've been watching you for a while now. The way you breathe, the way your eyes dart across the screen..." }, 4000);
    await pushMessage({ sender: "yandere", image: "/yandere/yandere.webp" }, 3000); 
    
    await pushMessage({
      sender: "yandere",
      text: "Do you feel me getting closer?",
      choices: [
        { text: "Please...", next: () => fetchLocation(true) },
        { text: "Stop, you're scaring me.", next: () => fetchLocation(false) },
      ],
    }, 3000);
  };

  const fetchLocation = async (wantsCloser: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));

    if (wantsCloser) {
      await pushMessage({ sender: "sub", text: "Please..." }, 0);
      await pushMessage({ sender: "yandere", text: "Fufu... you're so wonderfully obedient." }, 2500);
    } else {
      await pushMessage({ sender: "sub", text: "Stop, you're scaring me." }, 0);
      await pushMessage({ sender: "yandere", text: "Fear is just love that hasn't bloomed yet. Don't fight it." }, 3500);
    }

    await pushMessage({ sender: "yandere", text: "Hold still. Let me just check the lock on your door... ♥" }, 3500);
    
    spawnPopup("warning", "UNAUTHORIZED ACCESS ATTEMPT DETECTED");
    await pushMessage({ sender: "system", text: "WARNING: EXTERNAL ENTITY BYPASSING NETWORK SECURITY..." }, 800);

    if (!navigator.geolocation) {
      await pushMessage({ sender: "yandere", text: "Tch. Your device is trying to hide you. It doesn't matter, my love will find a way." }, 4000);
      return psychologicalPhase("your room");
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let address = "your room";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          address = data.address?.city || data.address?.town || data.address?.suburb || address;
        } catch {
          // Ignore
        }

        await pushMessage({ sender: "yandere", text: `Found you. Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}` }, 2500);
        psychologicalPhase(address);
      },
      async () => {
        await pushMessage({ sender: "yandere", text: "You blocked my access? How cruel. But I don't need a map to find what belongs to me." }, 4000);
        psychologicalPhase("your room");
      }
    );
  };

  const psychologicalPhase = async (location: string) => {
    await pushMessage({ sender: "yandere", text: `It looks so cold in ${location}... but I'll keep you warm.` }, 3500);
    await pushMessage({ sender: "yandere", text: "Don't bother looking behind you. Just keep staring at me." }, 4000);
    await pushMessage({ sender: "yandere", image: "/yandere/yandere_2.webp" }, 3000);
    
    await pushMessage({ sender: "yandere", text: "You're so perfect." }, 1500);
    await pushMessage({ sender: "yandere", text: "I've never felt this way about anyone else." }, 1500);
    await pushMessage({ sender: "yandere", text: "I want to give you everything. I want to consume you entirely." }, 2000);
    
    triggerLoveBombingMadness(); 

    await pushMessage({ sender: "yandere", text: "My chest hurts. I need to know you're really mine." }, 3500);
    await pushMessage({
      sender: "yandere",
      text: "Will you give yourself entirely to me?",
      choices: [
        { text: "I'm yours.", next: () => finalPhase() },
        { text: "I belong to you.", next: () => finalPhase() },
      ],
    }, 3000);
  };

  const finalPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "I'm yours." }, 0);
    
    setPopups([]); 
    
    await pushMessage({ sender: "yandere", text: "Words are cheap. Anyone can type them on a screen." }, 3000);
    await pushMessage({ sender: "yandere", text: "If you really belong to me..." }, 3000);
    await pushMessage({ sender: "yandere", text: "Prove your submission. Offer me a real sacrifice." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "Click below. Show me how much you bleed for me. ♥",
      choices: [
        { 
          text: "PAY NOW (PROOF OF SUBMISSION)", 
          next: () => { window.open("https://throne.com/princessazraiel/item/50fa6ece-6221-4af1-8322-aca2efa7ce71", "_blank") },
          isLink: true 
        },
      ],
    }, 2000);

    setTimeout(() => {
      setIsEnded(true);
      // Optional: stop or fade out audio here if you want it to go dead silent at the end
      if (audioRef.current) {
         audioRef.current.pause();
      }
    }, 6000);
  };

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white">
      
      {/* Hidden Audio Player */}
      <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />

      {/* Creepy vignette & scanline overlay */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-40"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-40 mix-blend-overlay"></div>

      {/* Creator Branding */}
      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all z-[60] tracking-widest font-bold"
      >
        @PrincessAzraiel
      </a>

      {/* RENDER FLOATING MADNESS POPUPS */}
      {popups.map((p) => (
        <div 
          key={p.id} 
          className="fixed z-[45] pointer-events-none animate-popup-flicker"
          style={{ top: p.top, left: p.left, transform: `scale(${p.scale}) rotate(${Math.random() * 20 - 10}deg)` }}
        >
          {p.type === "text" && (
            <span className="text-pink-500 font-black drop-shadow-[0_0_15px_rgba(236,72,153,1)] text-5xl opacity-80 mix-blend-screen">
              {p.content}
            </span>
          )}
          {p.type === "warning" && (
            <div className="bg-pink-950/90 border-2 border-pink-500 text-pink-200 p-3 font-mono text-sm shadow-[0_0_30px_#ec4899] uppercase tracking-widest backdrop-blur-sm">
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

      {/* Intro Sequence (Phase 0 and 1) */}
      {introPhase < 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050002]">
           {introPhase === 0 && (
             <h1 className="text-pink-500/90 tracking-[0.3em] text-lg md:text-2xl font-light uppercase animate-fade-in-out text-center px-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
               The art of loving you... <br/>
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter One</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Accept Connection
              </button>
           )}
        </div>
      )}

      {/* Chat Interface (Phase 2) */}
      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">UNKNOWN_CONNECTION</h1>
          </div>
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm">ENCRYPTED</span>
        </div>

        {/* Chat Window */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 pb-40 scrollbar-hide relative">
          
          {messages.map((msg, i) => (
            <div
              key={i}
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
                      className={`px-5 py-3.5 rounded-lg max-w-[85%] md:max-w-[75%] leading-relaxed text-sm md:text-base shadow-sm ${
                        msg.sender === "yandere"
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
                      className="max-w-[80%] md:max-w-[60%] rounded-sm border border-pink-800/60 mt-3 shadow-[0_0_20px_rgba(236,72,153,0.2)] grayscale-[0.2] contrast-125 brightness-90"
                    />
                  )}
                  {msg.choices && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-5 w-full md:w-[80%]">
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
          
          {/* Typing Indicator */}
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

      {/* END SCREEN OVERLAY */}
      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-none">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            THIS IS THE END NOW.
          </h2>
          <p className="mt-8 text-pink-900 tracking-[0.3em] uppercase text-xs md:text-sm animate-bounce opacity-80">
            Chapter Two... coming soon.
          </p>
        </div>
      )}

      {/* Tailwind Custom Utilities */}
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