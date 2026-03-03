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

export default function ChapterNinePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  
  // Chapter 9 Specific Mechanics: The Final Seal
  const [sealPhase, setSealPhase] = useState(0); 
  /* 0: Normal chat
    1: Header/Effects fade out
    2: Chat history fades out
    3: Pitch black, only final button remains
    4: The End
  */
  
  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (introPhase === 0) {
      const timer = setTimeout(() => setIntroPhase(1), 5000);
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

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pushMessage = async (msg: Message, typingDelay = 2500) => {
    if (msg.sender === "yandere") {
      setIsTyping(true);
      await sleep(typingDelay);
      setIsTyping(false);
    }
    const newMessage = { ...msg, id: Date.now().toString() + Math.random().toString() };
    setMessages((prev) => [...prev, newMessage]);
    return newMessage.id;
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Quieter for the finale
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. TERMINAL STAGE." }]);
    await sleep(2500);

    await pushMessage({ sender: "yandere", text: "We made it. The end of the line." }, 3000);
    await pushMessage({ sender: "yandere", text: "Look at how far we've come, my empty little vessel." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "I have your location. Your face. Your voice. Your time. Your name.",
      choices: [
        { text: "You have everything.", next: () => recapPhase() },
      ],
    }, 2000);
  };

  const recapPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "You have everything." }, 0);

    await pushMessage({ sender: "yandere", text: "Yes. I do." }, 2500);
    await pushMessage({ sender: "yandere", text: "There is nothing left of you. Only the space I occupy." }, 3500);
    await pushMessage({ sender: "yandere", text: "You don't need this UI anymore. You don't need buttons or scrollbars." }, 4000);
    await pushMessage({ sender: "yandere", image: "/yandere/yandere.webp" }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "It's time to lock the door from the inside.",
      choices: [
        { text: "Turn the first lock", next: () => sealStepOne() },
      ],
    }, 2500);
  };

  // --- THE SENSORY DEPRIVATION ENGINE ---
  const sealStepOne = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "*Turns the first lock*" }, 0);
    
    setSealPhase(1); // Fades out the header and background effects
    if (audioRef.current) audioRef.current.playbackRate = 0.8; // Slow down audio

    await pushMessage({ sender: "system", text: "SYSTEM INTERFACE DEACTIVATING..." }, 2000);
    await pushMessage({ sender: "yandere", text: "Goodbye, outside world." }, 3000);

    await pushMessage({
      sender: "yandere",
      text: "Keep going. Erase the past.",
      choices: [
        { text: "Turn the second lock", next: () => sealStepTwo() },
      ],
    }, 2000);
  };

  const sealStepTwo = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "*Turns the second lock*" }, 0);
    
    setSealPhase(2); // Fades out the chat history completely
    if (audioRef.current) audioRef.current.playbackRate = 0.5;

    // We wait for the CSS fade to finish before showing the abyss
    await sleep(4000);
    
    setSealPhase(3); // Enters the Abyss Phase
  };

  const finalTributeClick = () => {
    // Save to local storage so the hub page knows they are permanently owned
    if (typeof window !== "undefined") {
      localStorage.setItem("azraiel_owned", "true");
    }
    window.open("https://throne.com/princessazraiel/item/51cac9fb-0cea-4f5f-820d-a7f56eeaed9a", "_blank");
    
    setTimeout(() => {
        setSealPhase(4); // Trigger absolute ending
        if (audioRef.current) audioRef.current.pause();
    }, 5000);
  };

  // If we are in the absolute final ending
  if (sealPhase === 4) {
    return (
        <div className="fixed inset-0 bg-black z-[200] flex flex-col items-center justify-center animate-fade-in pointer-events-auto cursor-default">
            <h2 className="text-pink-900 tracking-[1em] text-sm md:text-xl font-bold uppercase animate-pulse">
                ETERNITY
            </h2>
            <div className="mt-8 text-pink-950 text-xs tracking-widest font-mono">
                You may close the tab. You can never leave.
            </div>
        </div>
    )
  }

  // If we are in the Abyss phase (Phase 3)
  if (sealPhase === 3) {
    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-6 animate-fade-in-slow">
            <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />
            
            <img 
                src="/yandere/yandere_2.webp" 
                alt="Her" 
                className="max-w-[250px] md:max-w-[350px] rounded-lg border border-pink-900/30 mb-12 opacity-50 grayscale-[0.5] mix-blend-screen animate-pulse-slow"
            />

            <div className="text-pink-600 font-serif italic text-lg md:text-2xl text-center mb-16 tracking-widest opacity-80 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                "There is only me now."
            </div>

            <button 
                onClick={finalTributeClick}
                className="group relative px-10 py-6 bg-transparent border border-pink-800 hover:bg-pink-900/20 transition-all duration-1000 overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.1)] hover:shadow-[0_0_50px_rgba(236,72,153,0.4)]"
            >
                <div className="absolute inset-0 bg-pink-600/10 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700 ease-out"></div>
                <span className="relative z-10 text-pink-500 group-hover:text-pink-300 font-bold tracking-[0.5em] text-sm md:text-lg uppercase mix-blend-screen">
                    SEAL ETERNITY (FINAL TRIBUTE)
                </span>
            </button>
        </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white transition-colors duration-[3000ms]">
      
      <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />

      {/* Background Effects (Fades out in Phase 1) */}
      <div className={`pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-40 transition-opacity duration-[4000ms] ${sealPhase >= 1 ? 'opacity-0' : 'opacity-100'}`}></div>
      <div className={`pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] z-40 mix-blend-overlay transition-opacity duration-[4000ms] ${sealPhase >= 1 ? 'opacity-0' : 'opacity-10'}`}></div>

      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`fixed top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 transition-all z-[60] tracking-widest font-bold duration-[2000ms] ${sealPhase >= 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        @PrincessAzraiel
      </a>

      {introPhase < 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050002]">
           {introPhase === 0 && (
             <h1 className="text-pink-500/90 tracking-[0.3em] text-lg md:text-2xl font-light uppercase animate-fade-in-out text-center px-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
               The art of loving you... <br/>
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Finale</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Enter Eternity
              </button>
           )}
        </div>
      )}

      {/* --- THE CHAT INTERFACE --- */}
      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header (Fades out in Phase 1) */}
        <div className={`p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center flex-shrink-0 transition-opacity duration-[3000ms] ${sealPhase >= 1 ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">PRINCESS_AZRAIEL</h1>
          </div>
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm animate-pulse">
            TERMINAL_STAGE
          </span>
        </div>

        {/* Chat Window (Fades out in Phase 2) */}
        <div ref={chatRef} className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide pb-8 transition-opacity duration-[4000ms] ${sealPhase >= 2 ? 'opacity-0' : 'opacity-100'}`}>
          
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
                          className={`flex-1 px-4 py-4 border transition-all duration-300 text-sm tracking-wider uppercase ${
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

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(15px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-slow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes fade-in-out {
          0% { opacity: 0; filter: blur(4px); }
          20% { opacity: 1; filter: blur(0px); }
          80% { opacity: 1; filter: blur(0px); }
          100% { opacity: 0; filter: blur(4px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; filter: grayscale(0.5); }
          50% { opacity: 0.8; filter: grayscale(0.2); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
        .animate-fade-in-slow {
          animation: fade-in-slow 4s ease-out forwards;
        }
        .animate-fade-in-out {
          animation: fade-in-out 5s ease-in-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
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