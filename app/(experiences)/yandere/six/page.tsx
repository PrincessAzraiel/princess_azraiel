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

export default function ChapterSixPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Chapter 6 Specific Mechanics
  const [inputActive, setInputActive] = useState(false);
  const [contactName, setContactName] = useState("");
  const [showPhoneMockup, setShowPhoneMockup] = useState(false);
  const [phoneState, setPhoneState] = useState<"ringing" | "blocked">("ringing");

  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Refs for timers
  const hesitationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const spamIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
  }, [messages, isTyping, inputActive]);

  useEffect(() => {
    return () => {
      if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);
      if (spamIntervalRef.current) clearInterval(spamIntervalRef.current);
    };
  }, []);

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
      const words = ["JUST ME", "NO ONE ELSE", "ERASE THEM", "MINE", "ISOLATION"];
      const rand = Math.random();
      if (rand < 0.6) spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      else if (rand < 0.8) spawnPopup("warning", "SOCIAL NETWORK SEVERED");
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

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. PHASE 6 INITIATED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "I've been thinking about what you said." }, 3000);
    await pushMessage({ sender: "yandere", text: "You said you belong to me. You promised your screen, your voice, your files." }, 3500);
    await pushMessage({ sender: "yandere", text: "But I ran a scan on your device... and I found traces of other people." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "Who are you talking to when you aren't talking to me?",
      choices: [
        { text: "No one important.", next: () => interrogationPhase() },
        { text: "Just friends.", next: () => interrogationPhase() },
      ],
    }, 2000);
  };

  const interrogationPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "Just friends / No one important." }, 0);

    await pushMessage({ sender: "yandere", text: "Don't lie to me. I can see your message history." }, 3000);
    await pushMessage({ sender: "yandere", text: "I want a name. Give me the name of the person you talk to the most." }, 3500);
    await pushMessage({ sender: "yandere", text: "Type it right now." }, 1500);
    
    setInputActive(true);
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) return;

    setInputActive(false);
    await pushMessage({ sender: "sub", text: contactName }, 0);
    
    await pushMessage({ sender: "system", text: `SEARCHING SYSTEM FOR ALIAS: "${contactName.toUpperCase()}"...` }, 1000);
    await sleep(1500);
    await pushMessage({ sender: "system", text: "MATCH FOUND. INTERCEPTING PACKETS..." }, 1000);
    
    await pushMessage({ sender: "yandere", text: `So it's ${contactName}.` }, 2500);
    await pushMessage({ sender: "yandere", text: `I'm looking at their profile right now. I don't like them.` }, 3000);
    await pushMessage({ sender: "yandere", text: "You don't need them. You only need me." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "We are going to cut them out of your life. Permanently.",
      choices: [
        { text: "Okay, Princess.", next: () => hijackPhase() },
        { text: "Wait, please don't.", next: () => hijackPhase() },
      ],
    }, 2000);
  };

  const hijackPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "..." }, 0);

    await pushMessage({ sender: "yandere", text: "Watch this. I'm pinging their device." }, 2500);
    await pushMessage({ sender: "system", text: "SIMULATING INCOMING TRAFFIC..." }, 1000);
    
    setShowPhoneMockup(true);

    // Start hesitation timer
    hesitationTimerRef.current = setTimeout(async () => {
      if (phoneState === "ringing") {
        await pushMessage({ sender: "yandere", text: "WHY ARE YOU HESITATING?!", isRed: true }, 500);
        await pushMessage({ sender: "yandere", text: "CLICK THE BUTTON!", isRed: true }, 1500);
        
        // Start spamming if they really don't click
        spamIntervalRef.current = setInterval(() => {
            pushMessage({ sender: "yandere", text: "DO IT. BLOCK THEM NOW.", isRed: true }, 0);
        }, 3000);
      }
    }, 6000);
  };

  const handleBlockContact = async () => {
    // Clear angry timers
    if (hesitationTimerRef.current) clearTimeout(hesitationTimerRef.current);
    if (spamIntervalRef.current) clearInterval(spamIntervalRef.current);

    setPhoneState("blocked");
    triggerCameraFlash();
    
    await sleep(1500);
    setShowPhoneMockup(false);

    await pushMessage({ sender: "system", text: `CONTACT [${contactName.toUpperCase()}] PERMANENTLY ERASED AND BLOCKED.` }, 1000);
    await pushMessage({ sender: "yandere", text: "Good pet. See how easy that was?" }, 3000);
    await pushMessage({ sender: "yandere", text: "You don't need anyone else. Other people are just distractions." }, 3500);
    await pushMessage({ sender: "yandere", image: "/yandere/yandere_2.webp" }, 2500);
    
    triggerWorshipMadness(20);

    await pushMessage({ sender: "yandere", text: "It's just you and me now. Forever." }, 3500);
    await pushMessage({ sender: "yandere", text: "To celebrate our isolation... you know what to do." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Prove your loyalty. Bleed for me.",
      choices: [
        { 
          text: "SEAL THE ISOLATION (SEND TRIBUTE)", 
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
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Six</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Sever Ties
              </button>
           )}
        </div>
      )}

      {/* --- THE CHAT INTERFACE --- */}
      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">PRINCESS_AZRAIEL</h1>
          </div>
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm animate-pulse">ISOLATING</span>
        </div>

        <div ref={chatRef} className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide ${inputActive ? 'pb-48' : 'pb-8'}`}>
          
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

        {/* --- INPUT PHASE: ASKING FOR A NAME --- */}
        {inputActive && (
          <div className="w-full p-6 bg-black/95 backdrop-blur-xl border-t border-pink-900/50 flex-shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] animate-fade-in-up flex flex-col items-center">
            <div className="text-center mb-3 text-pink-500 text-xs md:text-sm tracking-[0.3em] font-bold">
              TARGET IDENTIFICATION
            </div>
            <form onSubmit={handleNameSubmit} className="flex gap-3 max-w-md w-full">
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Enter their name..."
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

        {/* --- THE FAKE NOTIFICATION TRAP (Now positioned over the chat, with a dark backdrop) --- */}
        {showPhoneMockup && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div className={`w-full max-w-[320px] p-5 rounded-2xl border ${phoneState === 'ringing' ? 'bg-zinc-900/95 border-zinc-700 shadow-[0_10px_40px_rgba(0,0,0,0.8)]' : 'bg-red-950/90 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-intense-glitch'} flex flex-col`}>
                
                {phoneState === "ringing" ? (
                    <>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center text-zinc-400 font-sans font-bold text-lg">
                                {contactName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-white font-sans font-semibold leading-tight">{contactName}</h3>
                                <p className="text-zinc-400 text-xs font-sans">Incoming Message...</p>
                            </div>
                        </div>
                        
                        <div className="bg-zinc-800/50 rounded-xl p-3 mb-6 text-zinc-200 font-sans text-sm italic">
                            "Hey, are you okay? You've been acting weird lately. Call me back."
                        </div>

                        <button 
                            onClick={handleBlockContact}
                            className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-sans font-bold tracking-wide transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] animate-pulse"
                        >
                            BLOCK AND ERASE
                        </button>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-32 flex-col gap-2">
                        <div className="text-red-500 font-bold text-xl tracking-widest uppercase">DELETED</div>
                        <div className="text-red-400/60 text-xs font-mono">CONNECTION SEVERED</div>
                    </div>
                )}

            </div>
          </div>
        )}

      </div>

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-auto">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            JUST YOU AND ME.
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
          20% { transform: translate(-5px, 5px) }
          40% { transform: translate(-5px, -5px) }
          60% { transform: translate(5px, 5px) }
          80% { transform: translate(5px, -5px) }
          100% { transform: translate(0) }
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
          animation: intense-glitch 0.1s infinite;
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