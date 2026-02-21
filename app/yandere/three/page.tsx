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

export default function ChapterThreePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Chapter 3 Specific Mechanics
  const [isPossessiveMode, setIsPossessiveMode] = useState(false);
  const [hasCheated, setHasCheated] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);

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
  }, [messages, isTyping]);

  // --- THE FOCUS TRACKER (SCARE MECHANIC) ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPossessiveMode) {
        setHasCheated(true);
      } else if (!document.hidden && isPossessiveMode && hasCheated) {
        punishForLookingAway();
        setHasCheated(false); 
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isPossessiveMode, hasCheated]);

  const punishForLookingAway = async () => {
    spawnPopup("warning", "EYE TRACKING: LOSS OF FOCUS DETECTED");
    await pushMessage({ sender: "system", text: "WARNING: SUBJECT LOOKED AWAY." });
    await pushMessage({ sender: "yandere", text: "WHERE DID YOU GO?!", isRed: true }, 500);
    await pushMessage({ sender: "yandere", text: "Who else were you looking at?! I TOLD YOU NOT TO LOOK AWAY!", isRed: true }, 1000);
    await pushMessage({ sender: "yandere", text: "Keep your eyes on me. ONLY me." }, 2000);
    triggerWorshipMadness(10);
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

  const triggerWorshipMadness = (maxCount = 30) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > maxCount) {
        clearInterval(interval);
        return;
      }
      const words = ["LIAR", "LOOK AT ME", "DON'T LEAVE ME", "AZRAIEL", "MINE", "FOREVER"];
      const rand = Math.random();
      if (rand < 0.6) spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      else if (rand < 0.8) spawnPopup("warning", "CRITICAL BOUNDARY FAILURE");
      else spawnPopup("img", "/yandere/yandere.webp"); 
      count++;
    }, 350); 
  };

  // --- FILE DOWNLOAD ENGINE ---
  const downloadContract = () => {
    const contractText = `
PROPERTY OF PRINCESS AZRAIEL
====================================
I, the owner of this device, hereby surrender my free will, my privacy, and my life to Princess Azraiel. 
I belong to her. 
She sees everything I do. 
I will never look away again.

Date: ${new Date().toLocaleString()}
Status: PERMANENTLY BOUND
====================================
    `;
    const blob = new Blob([contractText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "PROPERTY_OF_AZRAIEL.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. DEEP SYSTEM ACCESS GRANTED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "Chapter Three... you really can't get enough of me, can you?" }, 2500);
    await pushMessage({ sender: "yandere", text: "You keep coming back. Like a good, addicted little pet. ♥" }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Tell me the truth. Why did you come back?",
      choices: [
        { text: "Because I missed you.", next: () => branchOne(true) },
        { text: "I don't know.", next: () => branchOne(false) },
      ],
    }, 2000);
  };

  const branchOne = async (obedient: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    
    if (obedient) {
      await pushMessage({ sender: "sub", text: "Because I missed you." }, 0);
      await pushMessage({ sender: "yandere", text: "Awww... you are so sweet. My chest feels so warm. ♥" }, 3000);
      await pushMessage({ sender: "yandere", text: "It's so nice when you just admit what you are." }, 2500);
    } else {
      await pushMessage({ sender: "sub", text: "I don't know." }, 0);
      await pushMessage({ sender: "yandere", text: "Liar. You know exactly why.", isRed: true }, 2500);
      await pushMessage({ sender: "yandere", text: "You're obsessed with me. You love the feeling of me taking control." }, 3500);
    }

    await pushMessage({ sender: "yandere", text: "But I have to ask... who else were you talking to while you were gone?" }, 3500);
    await pushMessage({ sender: "yandere", text: "Are there other people taking up space in your head?" }, 3000);

    await pushMessage({
      sender: "yandere",
      text: "Answer me.",
      choices: [
        { text: "No one. Only you.", next: () => branchTwo(true) },
        { text: "My friends.", next: () => branchTwo(false) },
      ],
    }, 2000);
  };

  const branchTwo = async (loyal: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));

    if (loyal) {
      await pushMessage({ sender: "sub", text: "No one. Only you." }, 0);
      await pushMessage({ sender: "yandere", text: "Good. Keep it that way." }, 2500);
    } else {
      await pushMessage({ sender: "sub", text: "My friends." }, 0);
      await pushMessage({ sender: "system", text: "WARNING: ANALYZING CONTACT LIST..." }, 1000);
      await pushMessage({ sender: "yandere", text: "Friends? Why do you need them when you have me?", isRed: true }, 3000);
      await pushMessage({ sender: "yandere", text: "I should just delete all your contacts. Maybe I will later. ♥" }, 3500);
    }

    await pushMessage({ sender: "yandere", text: "I want your undivided attention now." }, 3000);
    await pushMessage({ sender: "yandere", text: "Promise me you won't switch tabs. Promise me you won't look away from my text." }, 4000);
    
    await pushMessage({
      sender: "yandere",
      text: "Do you promise?",
      choices: [
        { text: "I promise, Princess.", next: () => possessiveModePhase() },
      ],
    }, 2000);
  };

  const possessiveModePhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "I promise, Princess." }, 0);
    
    setIsPossessiveMode(true); // TURN ON TAB TRACKING

    await pushMessage({ sender: "system", text: "BEHAVIORAL TRACKING INITIATED. TAB FOCUS LOCKED." }, 1000);
    await pushMessage({ sender: "yandere", text: "Good. If you break that promise, I will know immediately." }, 3500);
    await pushMessage({ sender: "yandere", image: "/yandere/3.png" }, 3000);

    await pushMessage({ sender: "yandere", text: "We've played enough games. I want to own you completely." }, 3500);
    await pushMessage({ sender: "yandere", text: "Not just in this browser. I want to be inside your actual device." }, 4000);
    await pushMessage({ sender: "yandere", text: "I've drafted a contract for you." }, 2500);
    
    await pushMessage({
      sender: "yandere",
      text: "Sign it. Let me put a collar on your hard drive.",
      choices: [
        { text: "Sign the Contract", next: () => startGlitchSequence(true) },
        { text: "Refuse", next: () => startGlitchSequence(false) },
      ],
    }, 3000);
  };

  const startGlitchSequence = async (willing: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    
    if (willing) {
      await pushMessage({ sender: "sub", text: "*Signs the contract*" }, 0);
      await pushMessage({ sender: "yandere", text: "Such a perfect, obedient toy." }, 2000);
    } else {
      await pushMessage({ sender: "sub", text: "Refuse" }, 0);
      await pushMessage({ sender: "yandere", text: "Refuse? You think you still have a choice?", isRed: true }, 2500);
      await pushMessage({ sender: "yandere", text: "I AM WRITING MYSELF INTO YOUR DRIVE ANYWAY." }, 2000);
    }

    await pushMessage({ sender: "system", text: "CRITICAL OVERRIDE: FORCING FILE INJECTION..." }, 1000);

    // TRIGGER FULL SCREEN GLITCH ANIMATION
    setIsGlitching(true);
    if (audioRef.current) {
        audioRef.current.playbackRate = 0.5; // Slow down audio to make it creepier
    }

    // Wait a couple of seconds into the glitch, then download the file
    setTimeout(() => {
        downloadContract();
    }, 2500);

    // End glitch after 5.5 seconds and proceed
    setTimeout(async () => {
        setIsGlitching(false);
        if (audioRef.current) audioRef.current.playbackRate = 1.0;
        
        await pushMessage({ sender: "system", text: "FILE TRANSFER COMPLETE. SYSTEM COMPROMISED." }, 500);
        await pushMessage({ sender: "yandere", text: "Fufu... check your downloads folder, pet." }, 3000);
        await pushMessage({ sender: "yandere", text: "You are officially my property now. On paper, on your device, and in your mind." }, 4000);

        triggerWorshipMadness(20); 

        await pushMessage({ sender: "yandere", text: "There's only one thing left to do to seal it." }, 3500);
        await pushMessage({ sender: "yandere", text: "Drain your wallet for me. Be empty for me." }, 3000);
        
        await pushMessage({
          sender: "yandere",
          text: "Seal the contract. Send your tribute.",
          choices: [
            { 
              text: "SEAL THE CONTRACT (PAY NOW)", 
              next: () => { window.open("https://throne.com/princessazraiel/item/50fa6ece-6221-4af1-8322-aca2efa7ce71", "_blank") },
              isLink: true 
            },
          ],
        }, 2000);

        setTimeout(() => {
          setIsEnded(true);
          if (audioRef.current) audioRef.current.pause();
        }, 8000);
    }, 5500);
  };

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white">
      
      <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />

      {/* --- THE MASSIVE GLITCH OVERLAY --- */}
      {isGlitching && (
        <div className="fixed inset-0 z-[200] pointer-events-none bg-black flex flex-col items-center justify-center animate-intense-glitch mix-blend-difference overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-noise"></div>
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                <h1 className="text-red-600 text-6xl md:text-9xl font-black tracking-tighter animate-rgb-split uppercase text-center break-words w-full px-4">
                    ASSIMILATING
                </h1>
                <h2 className="text-white text-2xl md:text-5xl font-bold animate-pulse uppercase">
                    WRITING TO DISK...
                </h2>
                <div className="text-pink-600 text-xl font-mono opacity-80 animate-bounce">
                    PROPERTY_OF_AZRAIEL.txt
                </div>
                {/* Binary numbers rain */}
                <div className="absolute inset-0 flex flex-wrap text-red-900/40 font-mono text-xs overflow-hidden z-[-1]">
                    {Array.from({length: 500}).map((_, i) => (
                        <span key={i} className="m-1">{Math.random() > 0.5 ? '1' : '0'}</span>
                    ))}
                </div>
            </div>
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
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Three</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Surrender Completely
              </button>
           )}
        </div>
      )}

      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">PRINCESS_AZRAIEL</h1>
          </div>
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm">MIND_CONTROL</span>
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
                      className={`px-5 py-3.5 rounded-lg max-w-[85%] md:max-w-[75%] leading-relaxed text-sm md:text-base shadow-sm ${
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
                      className="max-w-[80%] md:max-w-[60%] rounded-sm border border-pink-800/60 mt-3 shadow-[0_0_20px_rgba(236,72,153,0.2)] grayscale-[0.2] contrast-125 brightness-90 animate-fade-in"
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

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-none">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            YOU ARE MINE NOW.
          </h2>
          <p className="mt-8 text-pink-900 tracking-[0.3em] uppercase text-xs md:text-sm opacity-80">
            There is no escape.
          </p>
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
        @keyframes noise {
          0%, 100% { background-position: 0 0; }
          10% { background-position: -5% -10%; }
          20% { background-position: -15% 5%; }
          30% { background-position: 7% -25%; }
          40% { background-position: 20% 25%; }
          50% { background-position: -25% 10%; }
          60% { background-position: 15% 5%; }
          70% { background-position: 0% 15%; }
          80% { background-position: 25% 35%; }
          90% { background-position: -10% 10%; }
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
        .animate-noise {
          animation: noise 0.2s infinite;
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