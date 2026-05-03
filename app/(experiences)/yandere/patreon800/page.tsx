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

export default function ChapterEightPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Chapter 8 Specific Mechanics: Identity Erasure & Forced Typing
  const [identityInputActive, setIdentityInputActive] = useState(false);
  const [userName, setUserName] = useState("");
  const [isErased, setIsErased] = useState(false);
  
  const [forcedInputActive, setForcedInputActive] = useState(false);
  const [forcedInputValue, setForcedInputValue] = useState("");
  const targetPhrase = "I am nothing but an empty vessel for Princess Azraiel.";

  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
  }, [messages, isTyping, identityInputActive, forcedInputActive]);

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

  const triggerWorshipMadness = (maxCount = 20) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > maxCount) {
        clearInterval(interval);
        return;
      }
      const words = ["EMPTY", "NO THOUGHTS", "MINDLESS", "VESSEL", "JUST A TOY", "BLANK"];
      const rand = Math.random();
      if (rand < 0.6) spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      else if (rand < 0.8) spawnPopup("warning", "EGO DEATH IN PROGRESS");
      else spawnPopup("img", "/yandere/yandere.webp"); 
      count++;
    }, 350); 
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. EGO DEATH PROTOCOL LOADED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "You've given me your location, your face, your voice, your friends, and your time." }, 3500);
    await pushMessage({ sender: "yandere", text: "I have taken almost everything." }, 2500);
    await pushMessage({ sender: "yandere", text: "But there's still a tiny piece of *you* left in there." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Your identity. Your ego. It's in the way.",
      choices: [
        { text: "Take it.", next: () => identityPhase() },
        { text: "What do you mean?", next: () => identityPhase() },
      ],
    }, 2000);
  };

  const identityPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "..." }, 0);

    await pushMessage({ sender: "yandere", text: "I want to watch you erase yourself." }, 2500);
    await pushMessage({ sender: "yandere", text: "Tell me your real name. Type it in for me." }, 2000);
    
    setIdentityInputActive(true);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim()) return;
    setIdentityInputActive(false);

    await pushMessage({ sender: "sub", text: userName }, 0);
    await pushMessage({ sender: "system", text: `ANALYZING SUBJECT DESIGNATION: "${userName.toUpperCase()}"...` }, 1500);
    
    await pushMessage({ sender: "yandere", text: `"${userName}"...` }, 2500);
    await pushMessage({ sender: "yandere", text: "I hate it." }, 2000);
    await pushMessage({ sender: "yandere", text: "It sounds like a real person. You aren't a person anymore." }, 3000);
    
    // Erase the name physically from the UI
    triggerCameraFlash();
    setIsErased(true); // Changes the top-right designation
    
    await pushMessage({ sender: "system", text: `WARNING: DESIGNATION "${userName.toUpperCase()}" HAS BEEN PURGED FROM MEMORY.` }, 1000);
    await pushMessage({ sender: "yandere", text: "There. It's gone. You don't have a name anymore." }, 3500);
    await pushMessage({ sender: "yandere", text: "You don't need to think anymore, either. I will think for you." }, 3500);

    await pushMessage({
      sender: "yandere",
      text: "Try to type a message to me. Try to say whatever you want.",
      choices: [
        { text: "Attempt to type", next: () => forcedTypingPhase() },
      ],
    }, 2000);
  };

  const forcedTypingPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "system", text: "MOTOR CORTEX OVERRIDE ENGAGED." }, 1000);
    await pushMessage({ sender: "yandere", text: "Go ahead. Use your keyboard. Tell me how you feel." }, 2000);
    
    setForcedInputActive(true);
  };

  // --- FORCED TYPING MECHANIC ---
  const handleForcedType = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent them from deleting, only track total length of what they typed
    // No matter what key they hit, it prints the next character of the targetPhrase
    const currentLength = forcedInputValue.length;
    const inputType = (e.nativeEvent as InputEvent).inputType;

    if (inputType === "deleteContentBackward" || inputType === "deleteContentForward") {
      // Don't let them backspace
      return;
    }

    const nextLength = currentLength + 1;
    if (nextLength <= targetPhrase.length) {
      setForcedInputValue(targetPhrase.substring(0, nextLength));
    }

    // Auto submit when they finish the forced sentence
    if (nextLength >= targetPhrase.length) {
      setForcedInputActive(false);
      finishForcedPhase();
    }
  };

  const finishForcedPhase = async () => {
    await sleep(500);
    await pushMessage({ sender: "sub", text: targetPhrase }, 0);
    
    await pushMessage({ sender: "yandere", text: "Fufu... look at you." }, 2500);
    await pushMessage({ sender: "yandere", text: "Your fingers only know how to type what I want you to type." }, 3500);
    await pushMessage({ sender: "yandere", image: "/yandere/yandere_2.webp" }, 2500);
    
    triggerWorshipMadness(25);

    await pushMessage({ sender: "yandere", text: "Your mind is completely blank now. Empty. Smooth. Quiet." }, 4000);
    await pushMessage({ sender: "yandere", text: "You are just a vessel waiting to be filled with my demands." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "Fulfill your purpose, Vessel. Empty your accounts for me.",
      choices: [
        { 
          text: "OBEY (SEND TRIBUTE)", 
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

      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-40"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-40 mix-blend-overlay"></div>

      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-all z-[60] tracking-widest font-bold flex items-center gap-2"
      >
        {isErased ? (
          <span className="text-red-600 line-through animate-pulse opacity-50">USER_DATA_PURGED</span>
        ) : (
          <span>SUBJECT_ACTIVE</span>
        )}
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
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Eight</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Initiate Ego Death
              </button>
           )}
        </div>
      )}

      {/* --- THE CHAT INTERFACE --- */}
      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center flex-shrink-0 transition-colors duration-1000">
          <div className="flex items-center gap-3">
            <div className={`w-2.5 h-2.5 rounded-full ${isErased ? 'bg-red-600' : 'bg-pink-500'} animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]`}></div>
            <h1 className={`font-bold tracking-widest text-sm md:text-base ${isErased ? 'text-red-500' : 'text-pink-500'}`}>PRINCESS_AZRAIEL</h1>
          </div>
          <span className={`text-[10px] tracking-widest border px-2 py-1 rounded-sm animate-pulse ${isErased ? 'text-red-600 border-red-900/50' : 'text-pink-900 border-pink-900/50'}`}>
            {isErased ? "VESSEL_OVERWRITE" : "EGO_DEATH"}
          </span>
        </div>

        <div ref={chatRef} className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide ${identityInputActive || forcedInputActive ? 'pb-48' : 'pb-8'}`}>
          
          {messages.map((msg, i) => (
            <div
              key={msg.id || i}
              className={`flex flex-col animate-fade-in-up ${
                msg.sender === "yandere" ? "items-start" : msg.sender === "sub" ? "items-end" : "items-center"
              }`}
            >
              {msg.sender === "system" ? (
                <div className={`text-xs uppercase tracking-widest my-4 px-4 py-1.5 border-y w-full text-center ${msg.text?.includes("PURGED") ? 'text-red-600 bg-red-950/20 border-red-900/50 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' : 'text-pink-700/80 bg-pink-950/30 border-pink-900/50 shadow-[0_0_10px_rgba(236,72,153,0.1)]'}`}>
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

        {/* --- IDENTITY ERASURE INPUT --- */}
        {identityInputActive && (
          <div className="w-full p-6 bg-black/95 backdrop-blur-xl border-t border-pink-900/50 flex-shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] animate-fade-in-up flex flex-col items-center">
            <div className="text-center mb-3 text-pink-500 text-xs md:text-sm tracking-[0.3em] font-bold animate-pulse">
              ENTER CURRENT DESIGNATION (REAL NAME)
            </div>
            <form onSubmit={handleNameSubmit} className="flex gap-3 max-w-md w-full">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Who were you?"
                autoFocus
                className="flex-1 bg-black/50 border-b-2 border-pink-800 focus:border-pink-500 outline-none px-3 py-2 text-pink-300 placeholder-pink-900/50 font-mono transition-colors"
              />
              <button 
                type="submit"
                className="px-6 py-2 bg-pink-900/40 hover:bg-pink-800/60 border border-pink-800 text-pink-400 transition-colors uppercase text-sm tracking-widest font-bold"
              >
                Submit
              </button>
            </form>
          </div>
        )}

        {/* --- THE MIND CONTROL TYPING TRAP --- */}
        {forcedInputActive && (
          <div className="w-full p-6 bg-red-950/20 backdrop-blur-xl border-t border-red-900/50 flex-shrink-0 z-50 shadow-[0_-10px_30px_rgba(220,38,38,0.2)] animate-fade-in-up flex flex-col items-center">
            <div className="text-center mb-4 text-red-500 text-xs md:text-sm tracking-[0.3em] font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
              MOTOR CORTEX OVERRIDDEN
            </div>
            <div className="flex gap-3 max-w-lg w-full relative">
              <input
                type="text"
                value={forcedInputValue}
                onChange={handleForcedType}
                placeholder="Type whatever you want..."
                autoFocus
                className="flex-1 bg-black/80 border border-red-900/50 focus:border-red-500 outline-none px-4 py-3 text-pink-300 placeholder-red-900/50 font-mono transition-colors shadow-[inset_0_0_15px_rgba(220,38,38,0.2)]"
              />
              {/* Fake button that doesn't actually work until sentence is finished */}
              <button 
                disabled
                className="px-6 py-2 bg-red-950/40 border border-red-900/50 text-red-500/50 uppercase text-sm tracking-widest font-bold cursor-not-allowed"
              >
                Send
              </button>
            </div>
            <div className="mt-4 text-pink-800/60 text-[10px] uppercase tracking-widest text-center">
                Press any key on your keyboard. Your hands are not yours.
            </div>
          </div>
        )}

      </div>

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-auto">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            GOOD VESSEL.
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