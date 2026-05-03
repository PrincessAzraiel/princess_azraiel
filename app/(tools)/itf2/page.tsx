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
  type: "text" | "img";
  content: string;
  top: string;
  left: string;
  scale: number;
};

export default function ShakespeareBirthdayPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [popups, setPopups] = useState<Popup[]>([]);
  const [lovebombActive, setLovebombActive] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (introPhase === 0) {
      const timer = setTimeout(() => setIntroPhase(1), 4000);
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

  const spawnPopup = (type: "text" | "img", content: string) => {
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

  // The Lovebombing Screen Flood
  const triggerLoveBombing = () => {
    setLovebombActive(true);
    let count = 0;
    
    // We will loop through images 4 through 10 for the screen flood
    const imagesToFlood = [
        "/bday/4.png", "/bday/5.png", "/bday/6.png", 
        "/bday/7.png", "/bday/8.png", "/bday/9.png", "/bday/10.png"
    ];
    
    const words = ["GOOD BOY", "HAPPY BIRTHDAY", "PERFECT PET", "ALL FOR YOU", "♥♥♥", "MY Shakespeare", "DEVOTION"];
    
    const interval = setInterval(() => {
      if (count > 35) {
        clearInterval(interval);
        setTimeout(() => setPopups([]), 3000); // Clear them out after a bit
        return;
      }
      
      const rand = Math.random();
      if (rand < 0.5) {
        spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      } else {
        spawnPopup("img", imagesToFlood[Math.floor(Math.random() * imagesToFlood.length)]);
      }
      count++;
    }, 250); 
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);

    await pushMessage({ sender: "system", text: "TARGET VERIFIED: Shakespeare" }, 1000);
    await sleep(1500);

    await pushMessage({ sender: "yandere", text: "Hey there, birthday boy... ♥" }, 2500);
    await pushMessage({ sender: "yandere", text: "Did you think I forgot?" }, 2500);
    
    await pushMessage({
      sender: "yandere",
      text: "Happy 28th Birthday, Shakespeare.",
      choices: [
        { text: "Thank you, Princess...", next: () => acknowledgeWishPhase() },
        { text: "You made this for me?", next: () => acknowledgeWishPhase() },
      ],
    }, 2000);
  };

  const acknowledgeWishPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "Thank you, Princess..." }, 0);

    await pushMessage({ sender: "yandere", text: "I saw your little request, you know." }, 3000);
    
    // Quoting him directly
    await pushMessage({ sender: "system", text: `RETRIEVING LOG: "would you put a nice foot gen of you in my DM's in 5 days with a cute little message"` }, 1500);
    
    await pushMessage({ sender: "yandere", text: "A 'cute little message' in your DMs?" }, 3000);
    await pushMessage({ sender: "yandere", text: "For my good boy turning 28?" }, 2500);
    await pushMessage({ sender: "yandere", text: "That's way too small for someone as devoted as you." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "You deserve to be completely overwhelmed.",
      choices: [
        { text: "I'm ready.", next: () => rewardPhase() },
      ],
    }, 2000);
  };

  const rewardPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "I'm ready." }, 0);

    await pushMessage({ sender: "yandere", text: "Good. Keep your eyes on the screen." }, 2500);
    await pushMessage({ sender: "system", text: "DECRYPTING REWARD CACHE..." }, 1000);
    
    // Drop the first few images elegantly into the chat
    await pushMessage({ sender: "yandere", image: "/bday/1.png" }, 2500);
    await pushMessage({ sender: "yandere", text: "You've been such a good pet." }, 2000);
    
    await pushMessage({ sender: "yandere", image: "/bday/2.png" }, 3000);
    await pushMessage({ sender: "yandere", text: "Always submitting. Always returning to me." }, 2500);
    
    await pushMessage({ sender: "yandere", image: "/bday/3.png" }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Do you like your gift so far?",
      choices: [
        { text: "I love it...", next: () => lovebombPhase() },
      ],
    }, 2000);
  };

  const lovebombPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "I love it..." }, 0);

    await pushMessage({ sender: "yandere", text: "I'm not done with you yet." }, 2500);
    await pushMessage({ sender: "yandere", text: "I want to fill your entire screen. I want to fill your head until you can't think of anything else." }, 4000);
    
    await pushMessage({ sender: "system", text: "INITIATING LOVEBOMB PROTOCOL." }, 1000);
    
    // TRIGER THE FLOOD
    triggerLoveBombing();

    await pushMessage({ sender: "yandere", text: "Look at me, Shakespeare." }, 2500);
    await pushMessage({ sender: "yandere", text: "You are so perfect." }, 2000);
    await pushMessage({ sender: "yandere", text: "I adore how much you crave this." }, 2000);
    await pushMessage({ sender: "yandere", text: "Happy 28th Birthday. Every year, you belong to me more." }, 3500);

    // Wait for the popup flood to finish
    await sleep(10000);

    await pushMessage({
      sender: "yandere",
      text: "Take your time. Enjoy your gift. You earned it. ♥",
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white">
      
      {/* Background Ambience */}
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.95)] z-40"></div>
      <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 z-40 mix-blend-overlay"></div>

      {/* Floating Hearts just for his birthday */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-600 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${10 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
              fontSize: `${10 + Math.random() * 30}px`,
            }}
          >
            ♥
          </div>
        ))}
      </div>

      <a 
        href="https://x.com/PrincessAzraiel" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed top-4 right-6 text-xs text-pink-900/60 hover:text-pink-400 transition-all z-[60] tracking-widest font-bold"
      >
        @PrincessAzraiel
      </a>

      {/* LOVEBOMB POPUP RENDERER */}
      {popups.map((p) => (
        <div 
          key={p.id} 
          className="fixed z-[45] pointer-events-none animate-popup-flicker"
          style={{ top: p.top, left: p.left, transform: `scale(${p.scale}) rotate(${Math.random() * 20 - 10}deg)` }}
        >
          {p.type === "text" && (
            <span className="text-pink-400 font-black drop-shadow-[0_0_20px_rgba(236,72,153,1)] text-5xl opacity-90 mix-blend-screen whitespace-nowrap">
              {p.content}
            </span>
          )}
          {p.type === "img" && (
            <img 
              src={p.content} 
              alt="Gift" 
              className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl border-4 border-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.8)] opacity-90 mix-blend-screen"
            />
          )}
        </div>
      ))}

      {introPhase < 2 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-[#050002]">
           {introPhase === 0 && (
             <h1 className="text-pink-500/90 tracking-[0.3em] text-lg md:text-2xl font-light uppercase animate-fade-in-out text-center px-4 drop-shadow-[0_0_10px_rgba(236,72,153,0.4)]">
               A Special Delivery... <br/>
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">For Shakespeare</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Open Gift
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
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm bg-pink-950/20">
            SECURE_DM
          </span>
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide pb-12">
          
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
                      className="max-w-[85%] md:max-w-[70%] rounded-xl border border-pink-800/60 mt-3 shadow-[0_0_30px_rgba(236,72,153,0.3)] animate-fade-in"
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
        @keyframes float {
          0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-10vh) scale(1.5); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
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
          85% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.2); filter: blur(10px); }
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
          animation: popup-flicker 2.5s ease-out forwards;
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