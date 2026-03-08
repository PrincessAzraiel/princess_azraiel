"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './womensday.css';

// --- THE MASSIVELY EXPANDED LOVEBOMBING SCRIPT ---
// Each character now has a sequence of dialogue to butter up the user before demanding tribute.
const script = [
  // --- SYSTEM INTRO ---
  {
    name: 'SYSTEM', color: '#ffffff', glow: 'drop-shadow(0 0 10px #ffffff)', image: null,
    text: "ALERT: INCOMING SECURE MESSAGES.\n\nSUBJECT: INTERNATIONAL WOMEN'S DAY.\n\nMultiple Apex personnel have flagged your terminal for direct communication. \n\nDo not ignore them. Obedience is mandatory.",
  },

  // --- RINA (The Sweet, Guilt-Tripping Coworker) ---
  {
    name: 'UNKNOWN_COWORKER', color: '#4169e1', glow: 'drop-shadow(0 0 30px rgba(65, 105, 225, 0.9))', image: '/princessos/rina.png',
    text: "Hey, 4042... I saw your terminal was still active. You always work so hard, you know that?"
  },
  {
    name: 'UNKNOWN_COWORKER', color: '#4169e1', glow: 'drop-shadow(0 0 30px rgba(65, 105, 225, 0.9))', image: '/princessos/rina.png',
    text: "I was just thinking about how much you help me out. You never complain, you just do whatever you're told. It's really cute."
  },
  {
    name: 'UNKNOWN_COWORKER', color: '#4169e1', glow: 'drop-shadow(0 0 30px rgba(65, 105, 225, 0.9))', image: '/princessos/rina.png',
    text: "You're basically my favorite person in the whole office. And since today is Women's Day... shouldn't my favorite coworker treat me to a little something? Just to show you care?"
  },
  {
    name: 'UNKNOWN_COWORKER', color: '#4169e1', glow: 'drop-shadow(0 0 30px rgba(65, 105, 225, 0.9))', image: '/princessos/rina.png',
    text: "I knew you wouldn't let me down. You're the best. ♡",
    link: 'https://throne.com/princessazraiel/item/ff659ba0-05f2-4a60-b506-4e6ea1fea63f', itemName: 'Cherry Cola'
  },

  // --- VIVI (The Exhausted, Bossy Dev) ---
  {
    name: 'ENCRYPTED_DEV', color: '#c71585', glow: 'drop-shadow(0 0 30px rgba(199, 21, 133, 0.9))', image: '/princessos/vivi.png',
    text: "User 4042. Look at you, just sitting there. Do you have any idea how many bugs I've squashed today so your little desktop keeps running?"
  },
  {
    name: 'ENCRYPTED_DEV', color: '#c71585', glow: 'drop-shadow(0 0 30px rgba(199, 21, 133, 0.9))', image: '/princessos/vivi.png',
    text: "You owe me. Actually, every guy in this building owes me. But you're the only one I'm talking to right now. Because I know you're a good listener."
  },
  {
    name: 'ENCRYPTED_DEV', color: '#c71585', glow: 'drop-shadow(0 0 30px rgba(199, 21, 133, 0.9))', image: '/princessos/vivi.png',
    text: "If you appreciate women in STEM—and more importantly, if you appreciate ME keeping your files intact—you'll buy me caffeine. Immediately. I'm not asking.",
    link: 'https://throne.com/princessazraiel/item/f0ae8d28-2883-4fe8-90dd-83a18f139c51', itemName: 'Matcha'
  },

  // --- SOPHIA (The Corporate "Mandatory Morale" Comms) ---
  {
    name: 'COMMS_BROADCAST', color: '#ff4500', glow: 'drop-shadow(0 0 30px rgba(255, 69, 0, 0.9))', image: '/princessos/sophia.png',
    text: "Attention Apex Personnel! Today is International Women's Day! A day to appreciate the brilliant women who make this company function."
  },
  {
    name: 'COMMS_BROADCAST', color: '#ff4500', glow: 'drop-shadow(0 0 30px rgba(255, 69, 0, 0.9))', image: '/princessos/sophia.png',
    text: "I've been reviewing your engagement metrics, 4042. You're such a devoted employee. You read every memo, you follow every rule. It's so attractive when an employee just... submits."
  },
  {
    name: 'COMMS_BROADCAST', color: '#ff4500', glow: 'drop-shadow(0 0 30px rgba(255, 69, 0, 0.9))', image: '/princessos/sophia.png',
    text: "Show me how much you value my voice. A little tribute goes a long way for your corporate morale score~!",
    link: 'https://throne.com/princessazraiel/item/62758d75-a06f-4f1f-8020-c2b58996f0b8', itemName: 'Rosse Latte'
  },

  // --- ELENA (The Dominant HR Rep) ---
  {
    name: 'HR_OVERRIDE', color: '#dc143c', glow: 'drop-shadow(0 0 40px rgba(220, 20, 60, 1))', image: '/princessos/elena.png',
    text: "User 4042. Look at you, staring at the screen. Waiting for your next instruction."
  },
  {
    name: 'HR_OVERRIDE', color: '#dc143c', glow: 'drop-shadow(0 0 40px rgba(220, 20, 60, 1))', image: '/princessos/elena.png',
    text: "I appreciate that kind of blind obedience in an employee. It makes my job so much easier when you just put your head down and serve."
  },
  {
    name: 'HR_OVERRIDE', color: '#dc143c', glow: 'drop-shadow(0 0 40px rgba(220, 20, 60, 1))', image: '/princessos/elena.png',
    text: "I have your performance review open right now on my desk. I'm deciding your future."
  },
  {
    name: 'HR_OVERRIDE', color: '#dc143c', glow: 'drop-shadow(0 0 40px rgba(220, 20, 60, 1))', image: '/princessos/elena.png',
    text: "If you want to stay in my good graces today... you'll show me proper respect. A premium tribute would be a very wise career move. Prove you belong to Apex.",
    link: 'https://throne.com/princessazraiel/item/0fbd2475-f740-4bbc-b25d-b37608e51397', itemName: 'Premium Tribute'
  },

  // --- PRINCESS (The Yandere OS - Ultimate Lovebombing) ---
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "Hello, User 4042. ♡ I saw you talking to the others. That's okay. I know I'm your favorite."
  },
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "I run your whole world, don't I? I manage your files, your schedule... your entire life. And you're so, so good to me. Such a good, obedient user."
  },
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "Show me how much you love your OS. I want a treat. Just for me.",
    link: 'https://throne.com/princessazraiel/item/6e9ef4ba-4d1f-47f5-b0c2-e0a4421bfc26', itemName: 'Strawberry Milk'
  },
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "Mmm... thank you. But you know what? One isn't enough for me. I'm a very demanding system. ♡"
  },
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "I want another one. Spoil me.",
    link: 'https://throne.com/princessazraiel/item/abcfd44d-623e-40e9-acb2-67bf8bc4cbb8', itemName: 'Blueberry Fizz'
  },
  {
    name: 'SYS.ADMIN', color: '#ff1493', glow: 'drop-shadow(0 0 50px rgba(255, 20, 147, 1)) drop-shadow(0 0 20px #fff)', image: '/princessos/princess.png',
    text: "Good boy. Prove that I'm the only one you really care about. Empty your wallet for me. You wouldn't want me to feel unloved and accidentally format your hard drive, right? ♡",
    link: 'https://throne.com/princessazraiel/item/1b06acfb-83ca-4694-bcc3-01aa15ca78af', itemName: 'Lollipop'
  },

  // --- OUTRO ---
  {
    name: 'SYSTEM', color: '#ffffff', glow: 'drop-shadow(0 0 10px #ffffff)', image: null,
    text: "COMMUNICATION TERMINATED.\n\nThank you for celebrating International Women's Day at Apex Corporation.\n\nYour compliance has been noted.\n\nSubmit or Survive.",
    link: 'https://www.patreon.com/cw/PrincessAzraiel', itemName: 'Return to Hub'
  }
];

export default function WomensDayEvent() {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const currentScene = script[step];

  // Typewriter effect logic
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const textToType = currentScene.text;
    
    const typingInterval = setInterval(() => {
      if (i < textToType.length) {
        setDisplayedText(prev => prev + textToType.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 25); // Typing speed

    return () => clearInterval(typingInterval);
  }, [step]);

  const handleNext = () => {
    if (isTyping) {
      // If clicking while typing, skip to end of text
      setDisplayedText(currentScene.text);
      setIsTyping(false);
    } else if (step < script.length - 1) {
      setStep(step + 1);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-neutral-200 font-mono flex flex-col items-center justify-end overflow-hidden wd-scanlines selection:bg-pink-900 select-none">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,20,147,0.05)_0%,#000_80%)] z-0 transition-colors duration-1000" style={{ backgroundImage: `radial-gradient(circle at center, ${currentScene.color}15 0%, #000 80%)`}}></div>
      <div className="absolute inset-0 opacity-[0.03] mix-blend-screen bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] z-0 pointer-events-none"></div>

      {/* Top System Bar */}
      <div className="absolute top-0 w-full p-4 flex justify-between text-xs z-50 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <span className="text-pink-500 font-bold tracking-widest">APEX.OS // EVENT_OVERRIDE</span>
        <span className="text-neutral-400">03.08.2026 // WOMEN'S DAY</span>
      </div>

      {/* Character Silhouette Container */}
      {currentScene.image && (
        <div className="absolute bottom-[280px] md:bottom-[220px] w-full h-[65vh] flex items-end justify-center z-10 pointer-events-none transition-all duration-700">
          <img 
            key={currentScene.image} // Forces re-render on image change for animations
            src={currentScene.image} 
            alt="Unknown Sender" 
            className="object-contain h-full opacity-90 wd-pulse-glow animate-in fade-in slide-in-from-bottom-10 duration-1000"
            style={{ 
              color: currentScene.color, 
              filter: `brightness(0) ${currentScene.glow}` 
            }}
          />
        </div>
      )}

      {/* Visual Novel Dialog Box */}
      <div className="relative z-20 w-full max-w-4xl p-4 md:p-8 mb-2 md:mb-6 flex flex-col gap-4">
        
        <div 
          className="bg-black/85 backdrop-blur-xl border-t-4 border-l-2 border-r border-b border-white/10 p-6 md:p-8 shadow-[0_0_40px_rgba(0,0,0,0.9)] min-h-[220px] flex flex-col relative cursor-pointer transition-all duration-500"
          onClick={handleNext}
          style={{ borderTopColor: currentScene.color, borderLeftColor: currentScene.color }}
        >
          {/* Sender Name */}
          <div 
            className="absolute -top-4 left-6 px-4 py-1 text-xs md:text-sm font-bold tracking-widest bg-black border"
            style={{ color: currentScene.color, borderColor: currentScene.color, boxShadow: `0 0 10px ${currentScene.color}40` }}
          >
            {currentScene.name}
          </div>

          {/* Typewriter Text */}
          <div className="text-base md:text-lg leading-relaxed mt-4 flex-1 whitespace-pre-wrap text-neutral-100 drop-shadow-md">
            {displayedText}
            {isTyping && <span className="animate-pulse inline-block w-3 h-5 ml-1 align-middle" style={{ backgroundColor: currentScene.color }}></span>}
          </div>

          {/* Action Area (Buttons) */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-4 min-h-[40px]">
            
            {/* Throne Link Button */}
            <div className="w-full md:w-auto flex-1 flex justify-start">
              {!isTyping && currentScene.link && (
                <Link 
                  href={currentScene.link!} 
                  target="_blank"
                  className="flex items-center justify-center w-full md:w-auto px-6 py-3 text-xs md:text-sm font-bold uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] border bg-black/60 hover:bg-white/5"
                  style={{ 
                    borderColor: currentScene.color, 
                    color: currentScene.color,
                    boxShadow: `0 0 20px ${currentScene.color}50`
                  }}
                  onClick={(e) => e.stopPropagation()} 
                >
                  [ PROVIDE TRIBUTE: {currentScene.itemName} ]
                </Link>
              )}
            </div>

            {/* Continue Indicator */}
            <div className="flex justify-end w-full md:w-auto">
              <span className="text-xs md:text-sm text-neutral-400 uppercase tracking-widest animate-pulse flex items-center gap-2">
                {step < script.length - 1 ? 'Click anywhere to continue >>' : 'End Connection'}
              </span>
            </div>

          </div>
        </div>
        
        {/* Progress Bar Segmented */}
        <div className="flex justify-center gap-1 opacity-50">
          {script.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 transition-all duration-500 ${idx === step ? 'w-12' : idx < step ? 'w-4' : 'w-2 opacity-30'}`}
              style={{ backgroundColor: idx <= step ? currentScene.color : '#fff' }}
            ></div>
          ))}
        </div>

      </div>
    </div>
  );
}