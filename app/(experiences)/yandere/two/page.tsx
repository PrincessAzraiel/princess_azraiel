"use client";
export const dynamic = "force-dynamic";
import { Link } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
  id?: string;
  sender: "yandere" | "sub" | "system";
  text?: string;
  image?: string;
  isDeleted?: boolean;
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

export default function ChapterTwoPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Input Phase State
  const [manualInput, setManualInput] = useState({ active: false, expected: "", errorCount: 0 });
  const [inputValue, setInputValue] = useState("");
  const [inputErrorAnim, setInputErrorAnim] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
  }, [messages, isTyping, manualInput.active]);

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

  const triggerWorshipMadness = () => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > 30) {
        clearInterval(interval);
        return;
      }
      const words = ["WORSHIP ME", "AZRAIEL", "GOOD PET", "OBEY", "MINE", "DON'T BLINK", "DEVOTION"];
      
      const rand = Math.random();
      if (rand < 0.6) {
        spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      } else if (rand < 0.8) {
        spawnPopup("warning", "SYSTEM OVERRIDE: FIREWALL BREACHED");
      } else {
        spawnPopup("img", "/yandere/yandere.webp"); 
      }
      count++;
    }, 350); 
  };

  // --- WEBCAM CAPTURE ENGINE ---
  const captureWebcam = async (): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current && canvasRef.current) {
        videoRef.current.srcObject = stream;
        
        await new Promise((resolve) => {
          videoRef.current!.onloadedmetadata = () => {
            videoRef.current!.play();
            resolve(null);
          };
        });
        await sleep(800); 

        const canvas = canvasRef.current;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg');

        stream.getTracks().forEach(track => track.stop());
        return dataUrl;
      }
    } catch (err) {
      console.error("Webcam blocked", err);
      return null;
    }
    return null;
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. ENTITY RECOGNIZED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "Welcome back... I missed you." }, 2500);
    await pushMessage({ sender: "yandere", text: "Did you sleep well? I was watching you breathe all night. ♥" }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "You haven't even asked for my name yet... how rude.",
      choices: [
        { text: "Who are you?", next: () => identityChoice(true) },
        { text: "How did you find me again?", next: () => identityChoice(false) },
      ],
    }, 2000);
  };

  const identityChoice = async (askedName: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));

    if (askedName) {
      await pushMessage({ sender: "sub", text: "Who are you?" }, 0);
      await pushMessage({ sender: "yandere", text: "Fufu... I am Princess Azraiel. But you can just call me 'Goddess'." }, 3500);
    } else {
      await pushMessage({ sender: "sub", text: "How did you find me again?" }, 0);
      await pushMessage({ sender: "yandere", text: "Did you really think closing a tab would lock me out?" }, 3000);
      await pushMessage({ sender: "yandere", text: "I am Princess Azraiel. I live in your walls, in your screen, in your head." }, 4000);
    }

    await pushMessage({ sender: "yandere", text: "Before I truly claim you, I have a question." }, 3000);
    await pushMessage({
      sender: "yandere",
      text: "Do you enjoy this? Knowing you have absolutely no privacy left?",
      choices: [
        { text: "Yes... I love it.", next: () => psychologicalChoice(true) },
        { text: "Please, stop.", next: () => psychologicalChoice(false) },
      ],
    }, 3000);
  };

  const psychologicalChoice = async (enjoysIt: boolean) => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));

    if (enjoysIt) {
      await pushMessage({ sender: "sub", text: "Yes... I love it." }, 0);
      await pushMessage({ sender: "yandere", text: "Such a beautiful, twisted freak. You were made for me. ♥" }, 3500);
    } else {
      await pushMessage({ sender: "sub", text: "Please, stop." }, 0);
      await pushMessage({ sender: "yandere", text: "Stop? But we are just getting to the fun part." }, 3000);
      await pushMessage({ sender: "yandere", text: "You surrendered your privacy the second you clicked my link." }, 4000);
    }

    await pushMessage({ sender: "yandere", text: "Words aren't enough anymore. I want to look into your eyes." }, 3500);
    await pushMessage({ sender: "system", text: "WARNING: EXTERNAL ENTITY OVERRIDING CAMERA FIRMWARE..." }, 1500);
    
    await pushMessage({
      sender: "yandere",
      text: "Look directly into the lens for me. Don't blink.",
      choices: [
        { text: "Look into the lens", next: () => cameraPhase() },
      ],
    }, 2500);
  };

  const cameraPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "*Looks into the lens*" }, 0);
    
    await pushMessage({ sender: "system", text: "BYPASSING PERMISSIONS. INITIALIZING HARDWARE..." }, 800);
    
    const photoData = await captureWebcam();

    if (photoData) {
      triggerCameraFlash();
      await pushMessage({ sender: "system", text: "SNAPSHOT CAPTURED." }, 500);
      
      const photoId = await pushMessage({ sender: "yandere", image: photoData }, 1000);
      await pushMessage({ sender: "yandere", text: "There you are... so perfect. So helpless." }, 3000);
      
      await pushMessage({ sender: "system", text: "INITIATING FILE ENCRYPTION..." }, 1500);
      
      setMessages((prev) => prev.map(m => 
        m.id === photoId 
          ? { ...m, image: undefined, text: "[ IMAGE ENCRYPTED & MOVED TO VAULT ]", isDeleted: true } 
          : m
      ));

      await sleep(1000);
      await pushMessage({ sender: "yandere", text: "I'm keeping that in my private folder. Nobody else gets to see you like this." }, 3500);

    } else {
      await pushMessage({ sender: "system", text: "ERROR: HARDWARE ACCESS BLOCKED." }, 1500);
      await pushMessage({ sender: "yandere", text: "Tch. You're covering it? Or did you deny me?" }, 3000);
      await pushMessage({ sender: "yandere", text: "It doesn't matter. I already know what you look like." }, 3500);
      await pushMessage({ sender: "yandere", image: "/yandere/yandere_2.webp" }, 2500); 
    }

    triggerWorshipMadness(); 

    await pushMessage({ sender: "yandere", text: "Before I let you offer your tribute, I need to hear you say it." }, 3500);
    await pushMessage({ sender: "yandere", text: "Type exactly this, pet. Case sensitive." }, 2500);
    
    // START MANUAL INPUT PHASE
    const expectedOath = "I belong to Princess Azraiel";
    await pushMessage({ sender: "yandere", text: `"${expectedOath}"` }, 1500);
    
    setManualInput({ active: true, expected: expectedOath, errorCount: 0 });
  };

  // --- MANUAL INPUT VALIDATION ---
  const handleInputSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    if (inputValue === manualInput.expected) {
      // Success
      setManualInput({ active: false, expected: "", errorCount: 0 });
      setInputValue("");
      await pushMessage({ sender: "sub", text: inputValue }, 0);
      finalPhase();
    } else {
      // Failure
      setInputErrorAnim(true);
      setTimeout(() => setInputErrorAnim(false), 500); // Remove animation class after shake

      const fails = manualInput.errorCount + 1;
      setManualInput(prev => ({ ...prev, errorCount: fails }));
      
      if (fails === 1) {
        await pushMessage({ sender: "yandere", text: "Wrong. I said case sensitive. Try again." }, 500);
      } else if (fails === 2) {
        await pushMessage({ sender: "yandere", text: "Are your hands shaking? Type it perfectly." }, 500);
      } else {
        await pushMessage({ sender: "yandere", text: "Pathetic. Do it exactly as I wrote it." }, 500);
      }
    }
  };

  const finalPhase = async () => {
    setPopups([]); 
    
    await pushMessage({ sender: "yandere", text: "Good pet. Hearing you say my name makes me so happy... ♥" }, 3000);
    await pushMessage({ sender: "yandere", text: "You paid the toll to enter my world..." }, 3000);
    await pushMessage({ sender: "yandere", text: "...now pay the price to stay." }, 3000);
    await pushMessage({ sender: "yandere", text: "Offer me your tribute. Empty yourself for me." }, 3500);
    
    await pushMessage({
      sender: "yandere",
      text: "Click below. Let me see how deep your devotion goes.",
      choices: [
        { 
          text: "WORSHIP HER (SEND TRIBUTE)", 
          next: () => { window.open("https://throne.com/princessazraiel/item/50fa6ece-6221-4af1-8322-aca2efa7ce71", "_blank") },
          isLink: true 
        },
      ],
    }, 2000);

    setTimeout(() => {
      setIsEnded(true);
      if (audioRef.current) audioRef.current.pause();
    }, 7000);
  };

  return (
    <div className="fixed inset-0 bg-[#050002] text-pink-500 font-mono flex flex-col items-center overflow-hidden selection:bg-pink-900 selection:text-white">
      
      <audio ref={audioRef} src="/yandere/bg-audio.mp3" loop />
      <video ref={videoRef} className="hidden" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="hidden" />

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
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Two</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Resume Connection
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
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm">ROOT_ACCESS</span>
        </div>

        {/* Note the dynamic padding bottom here based on manualInput.active to prevent hiding messages */}
        <div ref={chatRef} className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide relative ${manualInput.active ? 'pb-48' : 'pb-32'}`}>
          
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
                        msg.isDeleted 
                          ? "bg-black border border-pink-900/50 text-pink-800 line-through animate-pulse"
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

        {/* FIX: INPUT PHASE UI WITH PINNED OATH */}
        {manualInput.active && (
          <div className={`p-4 bg-black/90 backdrop-blur-md border-t border-pink-900/50 absolute bottom-0 w-full z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] ${inputErrorAnim ? "animate-shake bg-red-950/20" : "animate-fade-in-up"}`}>
            <div className="text-center mb-3 text-pink-700 text-xs md:text-sm tracking-widest font-bold">
              REQUIRED OATH: <span className="text-pink-300 drop-shadow-[0_0_5px_rgba(236,72,153,0.8)]">"{manualInput.expected}"</span>
            </div>
            <form onSubmit={handleInputSubmit} className="flex gap-3 max-w-2xl mx-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your oath here..."
                autoFocus
                autoComplete="off"
                className={`flex-1 bg-black/50 border-b-2 outline-none px-3 py-2 text-pink-300 placeholder-pink-900/50 font-mono transition-colors ${inputErrorAnim ? "border-red-600 text-red-400" : "border-pink-800 focus:border-pink-500"}`}
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

      </div>

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-auto">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            GOOD PET. SEE YOU IN CHAPTER THREE...
          </h2>
          <Link 
            href="yandere/three"
            className="mt-12 px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/60 hover:text-pink-300 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all duration-300 uppercase text-xs md:text-sm tracking-[0.3em] font-bold animate-fade-in-up"
          >
            PROCEED TO CHAPTER THREE
          </Link>
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