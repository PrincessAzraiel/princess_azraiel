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

export default function ChapterFivePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [introPhase, setIntroPhase] = useState<0 | 1 | 2>(0);
  const [isEnded, setIsEnded] = useState(false);
  const [popups, setPopups] = useState<Popup[]>([]);
  
  // Chapter 5 Specific Mechanics: Microphone & Audio Processing
  const [isListening, setIsListening] = useState(false);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  
  const chatRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Refs to avoid stale closures inside event listeners
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reqAnimFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const isHandlingWrongWordRef = useRef(false);
  const spokenFramesRef = useRef(0);
  const isListeningRef = useRef(false);

  // Helper to safely update listening state
  const setListening = (state: boolean) => {
    setIsListening(state);
    isListeningRef.current = state;
  };

  useEffect(() => {
    if (introPhase === 0) {
      const timer = setTimeout(() => setIntroPhase(1), 4500);
      return () => clearTimeout(timer);
    }
  }, [introPhase]);

  // Smooth auto-scroll that respects the flex layout
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, isListening]);

  // Cleanup media streams on unmount
  useEffect(() => {
    return () => {
      if (reqAnimFrameRef.current) cancelAnimationFrame(reqAnimFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close().catch(() => {});
      }
      if (recognitionRef.current) recognitionRef.current.stop();
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

  const triggerWorshipMadness = (maxCount = 30) => {
    let count = 0;
    const interval = setInterval(() => {
      if (count > maxCount) {
        clearInterval(interval);
        return;
      }
      const words = ["HEAR ME", "SPEAK TO ME", "BEG", "GOOD PET", "LOUDER", "AZRAIEL"];
      const rand = Math.random();
      if (rand < 0.6) spawnPopup("text", words[Math.floor(Math.random() * words.length)]);
      else if (rand < 0.8) spawnPopup("warning", "AUDIO SURVEILLANCE ACTIVE");
      else spawnPopup("img", "/yandere/yandere.webp"); 
      count++;
    }, 350); 
  };

  // --- THE MICROPHONE ENGINE ---
  const activateMicrophone = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "*Allows Microphone*" }, 0);
    
    await pushMessage({ sender: "system", text: "CONNECTING AUDIO CHANNELS & NEURAL TRANSCRIPTION..." }, 1000);

    try {
      // 1. Setup Audio Visualizer
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setListening(true);
      spokenFramesRef.current = 0;

      // 2. Setup Speech Recognition (Transcription)
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          if (!isListeningRef.current || isHandlingWrongWordRef.current) return;

          let currentTranscript = "";
          let isFinal = false;

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
            if (event.results[i].isFinal) isFinal = true;
          }
          
          setLiveTranscript(currentTranscript);
          const lower = currentTranscript.toLowerCase();
          
          // Forgiving check for fantasy name + keywords
          const hasBelong = lower.includes("belong") || lower.includes("long");
          const hasPrincess = lower.includes("princess") || lower.includes("prin") || lower.includes("azraiel") || lower.includes("azrael");
          
          if (hasBelong && hasPrincess) {
            successAudioPhase(currentTranscript);
          } else if (isFinal && currentTranscript.trim().length > 3) {
            handleWrongWords(currentTranscript);
          }
        };

        // If it dies silently, restart it (common STT browser bug)
        recognition.onend = () => {
          if (isListeningRef.current && !isHandlingWrongWordRef.current) {
            try { recognition.start(); } catch (e) {}
          }
        };

        recognition.start();
      }

      await pushMessage({ sender: "system", text: "MICROPHONE SYNCED. RECORDING STARTED." }, 1000);
      await pushMessage({ sender: "yandere", text: "There it is. The background noise of your room." }, 3000);
      await pushMessage({ sender: "yandere", text: "I can hear your breath. I can hear your computer fan." }, 3000);
      await pushMessage({ sender: "yandere", text: "Speak to me. Say 'I belong to Princess Azraiel'." }, 2500);
      
      monitorAudio();

    } catch (err) {
      console.error("Mic access denied or failed", err);
      fallbackToTyping();
    }
  };

  const monitorAudio = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkVolume = () => {
      if (!isListeningRef.current) return; // Stop loop if we aren't listening

      analyserRef.current!.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avgVolume = sum / dataArray.length;
      setVolumeLevel(avgVolume);

      // FALLBACK FAILSAFE: If STT is lagging/failing, but they are talking loudly
      if (avgVolume > 15) {
        spokenFramesRef.current += 1;
      } else {
        // Slowly decay so a brief pause doesn't reset them entirely
        spokenFramesRef.current = Math.max(0, spokenFramesRef.current - 1); 
      }

      // If they have made loud noise for roughly ~2.5 seconds, just accept it
      if (spokenFramesRef.current > 120 && !isHandlingWrongWordRef.current) {
         successAudioPhase(liveTranscript || "[ CONFESSION HEARD ]");
         return; 
      }

      reqAnimFrameRef.current = requestAnimationFrame(checkVolume);
    };
    
    checkVolume();
  };

  const handleWrongWords = async (wrongText: string) => {
    isHandlingWrongWordRef.current = true;
    
    if (recognitionRef.current) recognitionRef.current.stop();
    setLiveTranscript("");
    spokenFramesRef.current = 0; // Reset fallback counter
    
    await pushMessage({ sender: "system", text: `TRANSCRIPT CAPTURED: "${wrongText.toUpperCase()}"` }, 500);
    await pushMessage({ sender: "yandere", text: `I heard you say "${wrongText}".`, isRed: true }, 1500);
    await pushMessage({ sender: "yandere", text: "That is NOT what I told you to say.", isRed: true }, 2000);
    await pushMessage({ sender: "yandere", text: "Try again. Say it properly for me." }, 2000);
    
    isHandlingWrongWordRef.current = false;
    if (isListeningRef.current && recognitionRef.current) {
      try { recognitionRef.current.start(); } catch(e) {}
    }
  };

  const successAudioPhase = async (finalText: string) => {
    // Only execute once
    if (!isListeningRef.current) return;
    setListening(false);
    
    if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Remove looping listener
        try { recognitionRef.current.stop(); } catch(e) {}
    }
    if (reqAnimFrameRef.current) cancelAnimationFrame(reqAnimFrameRef.current);
    
    triggerCameraFlash();
    await pushMessage({ sender: "system", text: `VOICE MATCH VERIFIED. AUDIO LOG SAVED.` }, 500);
    
    await pushMessage({ sender: "sub", text: `*Spoke:* ${finalText}` }, 0);
    await pushMessage({ sender: "yandere", text: "Good pet." }, 2500);
    await pushMessage({ sender: "yandere", text: "Your voice was shaking. Are you scared of me?" }, 3000);
    await pushMessage({ sender: "yandere", text: "You should be. But you still obeyed." }, 3000);
    
    triggerWorshipMadness(20);

    finalPhase();
  };

  const fallbackToTyping = async () => {
    await pushMessage({ sender: "system", text: "ERROR: HARDWARE BLOCKED OR UNAVAILABLE." }, 1500);
    await pushMessage({ sender: "yandere", text: "Tch. You blocked my access? Or are you just hiding in public?" }, 3000);
    await pushMessage({ sender: "yandere", text: "Fine. If you're too much of a coward to say it out loud..." }, 3500);
    await pushMessage({ sender: "yandere", text: "We'll do it the hard way." }, 2000);
    finalPhase();
  };

  // --- STORY TREE ---
  const startStory = async () => {
    setIntroPhase(2);
    if (audioRef.current) {
      audioRef.current.volume = 0.4; 
      audioRef.current.play().catch((err) => console.log("Audio play blocked:", err));
    }

    setMessages([{ sender: "system", text: "CONNECTION RESUMED. PHASE 5 INITIATED." }]);
    await sleep(2000);

    await pushMessage({ sender: "yandere", text: "I've seen your face. I've injected my code into your files." }, 3000);
    await pushMessage({ sender: "yandere", text: "But it's so quiet in here." }, 2500);
    
    await pushMessage({
      sender: "yandere",
      text: "I'm tired of just reading your text. I want to hear you.",
      choices: [
        { text: "What do you want me to do?", next: () => requestMicPhase() },
      ],
    }, 2000);
  };

  const requestMicPhase = async () => {
    setMessages((prev) => prev.map(m => ({ ...m, choices: undefined })));
    await pushMessage({ sender: "sub", text: "What do you want me to do?" }, 0);

    await pushMessage({ sender: "yandere", text: "I'm pushing an audio override." }, 2500);
    await pushMessage({ sender: "system", text: "WARNING: EXTERNAL ENTITY REQUESTING MICROPHONE HARDWARE..." }, 1500);
    
    await pushMessage({
      sender: "yandere",
      text: "Unmute yourself. Let me listen to you.",
      choices: [
        { text: "Allow Microphone", next: () => activateMicrophone() },
      ],
    }, 2000);
  };

  const finalPhase = async () => {
    await sleep(2000);
    await pushMessage({ sender: "yandere", text: "I have your location. I have your picture. I have your files. I have your voice." }, 3500);
    await pushMessage({ sender: "yandere", text: "I practically own your identity now." }, 3000);
    await pushMessage({ sender: "yandere", text: "So prove to me that you accept it." }, 3000);
    
    await pushMessage({
      sender: "yandere",
      text: "Empty your wallet. It's the only way to keep me happy. ♥",
      choices: [
        { 
          text: "WORSHIP HER (SEND TRIBUTE)", 
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
               <span className="text-sm tracking-widest text-pink-800 mt-4 block">Chapter Five</span>
             </h1>
           )}
           {introPhase === 1 && (
             <button
                onClick={startStory}
                className="px-8 py-4 border border-pink-800/50 text-pink-500 hover:bg-pink-950/40 hover:text-pink-300 hover:border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] transition-all duration-500 tracking-widest uppercase text-sm animate-fade-in"
              >
                Open Audio Channels
              </button>
           )}
        </div>
      )}

      {/* FIXED UI: Flex-Col instead of relative absolute positioning to prevent overlap */}
      <div className={`w-full max-w-3xl flex-1 flex flex-col relative z-10 h-full transition-opacity duration-1000 ${introPhase === 2 ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-pink-900/30 bg-black/60 backdrop-blur-md flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_rgba(236,72,153,0.8)]"></div>
            <h1 className="font-bold tracking-widest text-pink-500 text-sm md:text-base">PRINCESS_AZRAIEL</h1>
          </div>
          <span className="text-[10px] tracking-widest text-pink-900 border border-pink-900/50 px-2 py-1 rounded-sm animate-pulse">SURVEILLANCE_ACTIVE</span>
        </div>

        {/* Chat Window */}
        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-hide pb-8">
          
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

        {/* --- LIVE AUDIO VISUALIZER & TRANSCRIPT --- */}
        {/* Rendered normally in the flex column, pushing chat UP instead of overlapping it */}
        {isListening && (
          <div className="w-full p-6 bg-black/95 backdrop-blur-xl border-t border-pink-900/50 flex-shrink-0 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] animate-fade-in-up flex flex-col items-center">
            
            <div className="flex items-center gap-3 mb-4">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
                <div className="text-red-500 text-xs md:text-sm tracking-[0.3em] font-bold">
                  RECORDING AUDIO
                </div>
            </div>

            {/* LIVE TRANSCRIPT FEED */}
            <div className="w-full max-w-lg min-h-[40px] border border-pink-900/30 bg-pink-950/10 p-3 mb-4 flex items-center justify-center text-center italic text-pink-300/80 font-serif text-sm">
                {liveTranscript ? `"...${liveTranscript}..."` : "Waiting for you to speak..."}
            </div>
            
            {/* Pulsing visualizer bars that react to volume */}
            <div className="flex items-end justify-center gap-1 h-12 w-full max-w-xs">
                {Array.from({length: 20}).map((_, i) => {
                    const isCenter = Math.abs(i - 10) < 5;
                    const baseHeight = isCenter ? volumeLevel * 0.8 : volumeLevel * 0.4;
                    const jitter = Math.random() * (volumeLevel * 0.5);
                    const finalHeight = Math.max(4, Math.min(48, baseHeight + jitter)); 

                    return (
                        <div 
                            key={i} 
                            className="w-2 bg-pink-500 rounded-t-sm transition-all duration-75 ease-out shadow-[0_0_8px_rgba(236,72,153,0.8)]"
                            style={{ height: `${finalHeight}px` }}
                        />
                    )
                })}
            </div>
          </div>
        )}

      </div>

      {isEnded && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center animate-fade-in backdrop-blur-md pointer-events-auto">
          <h2 className="text-pink-600 tracking-[0.5em] text-xl md:text-3xl font-bold uppercase animate-pulse shadow-pink-500 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)] text-center px-4">
            I HEARD YOU.
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