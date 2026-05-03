"use client";
import React, { useState, useEffect, useRef } from 'react';

const globalStyles = `
  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  @keyframes glitch {
    0% { transform: translate(0); }
    20% { transform: translate(-3px, 2px); }
    40% { transform: translate(-2px, -3px); }
    60% { transform: translate(3px, 2px); }
    80% { transform: translate(2px, -2px); }
    100% { transform: translate(0); }
  }
  @keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  .crt-overlay {
    background: 
      linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
      linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
    background-size: 100% 2px, 3px 100%;
    pointer-events: none;
  }
  .scan-bar {
    position: absolute;
    top: 0; left: 0; right: 0; height: 10px;
    background: rgba(255, 255, 255, 0.05);
    animation: scanline 8s linear infinite;
    pointer-events: none;
    z-index: 100;
  }
  .glitch-active {
    animation: glitch 0.3s cubic-bezier(.25, .46, .45, .94) both;
  }
  .typewriter {
    overflow: hidden;
    white-space: nowrap;
  }
`;

type Move = 'ROCK' | 'PAPER' | 'SCISSORS';
type Phase = 'MENU' | 'CONFESSION' | 'SELECTION' | 'REVEAL' | 'GAMEOVER';

const OPPONENTS = [
  {
    name: 'YUKI',
    style: 'sweet',
    confess: [
      "Tell me your choice... I won't judge.",
      "Whisper it to me. What are you picking?",
      "You can trust me. What's in your hand?"
    ],
    suggest: [
      "Pick ROCK for me. I think it's right.",
      "PAPER feels safe. Choose PAPER.",
      "SCISSORS... yes. That would make me happy."
    ],
    obey: "Good. You're learning.",
    disobey: "You... lied to me? WHY?",
    hesitate: "Your cursor is shaking...",
    win: "Clever. Too clever.",
    lose: "There. Much better."
  },
  {
    name: 'AKANE',
    style: 'sharp',
    confess: [
      "What are you hiding? SPEAK.",
      "Your choice. Now.",
      "Don't waste my time."
    ],
    suggest: [
      "ROCK. Choose it. Don't argue.",
      "PAPER is the only logical choice.",
      "SCISSORS. I'm not asking."
    ],
    obey: "Smart. Very smart.",
    disobey: "Wrong. CHOICE.",
    hesitate: "Pathetic hesitation.",
    win: "Lucky. That's all.",
    lose: "Know. Your. Place."
  }
];

export default function UnfairHands() {
  const [phase, setPhase] = useState<Phase>('MENU');
  const [roles, setRoles] = useState(3);
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState({ ROCK: 5, PAPER: 5, SCISSORS: 5 });
  const [disappointment, setDisappointment] = useState(0);
  const [tellMeter, setTellMeter] = useState(0);
  
  const [currentOpp, setCurrentOpp] = useState(0);
  const [dialogue, setDialogue] = useState('');
  const [displayedDialogue, setDisplayedDialogue] = useState('');
  const [isAngry, setIsAngry] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  
  const [suggestedMove, setSuggestedMove] = useState<Move | null>(null);
  const [confession, setConfession] = useState<Move | null>(null);
  const [hoveredCard, setHoveredCard] = useState<Move | null>(null);
  const [committingTo, setCommittingTo] = useState<Move | null>(null);
  const [commitProgress, setCommitProgress] = useState(0);
  const [playerMove, setPlayerMove] = useState<Move | null>(null);
  const [opponentMove, setOpponentMove] = useState<Move | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [cheated, setCheated] = useState(false);
  
  const lastHovered = useRef<Move | null>(null);
  const hesitationCount = useRef(0);
  const commitTimer = useRef<NodeJS.Timeout | null>(null);
  const commitInterval = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (dialogue === displayedDialogue) return;
    
    let i = displayedDialogue.length;
    const interval = setInterval(() => {
      if (i < dialogue.length) {
        setDisplayedDialogue(dialogue.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, [dialogue, displayedDialogue]);

  const speak = (text: string, angry = false) => {
    setDialogue(text);
    setDisplayedDialogue('');
    setIsAngry(angry);
    if (angry) {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 500);
    }
  };

  const startGame = () => {
    setPhase('CONFESSION');
    setRoles(3);
    setRound(1);
    setDeck({ ROCK: 5, PAPER: 5, SCISSORS: 5 });
    setDisappointment(0);
    setTellMeter(0);
    setCurrentOpp(0);
    startConfessionPhase();
  };

  const startConfessionPhase = () => {
    const opp = OPPONENTS[currentOpp];
    speak(opp.confess[Math.floor(Math.random() * opp.confess.length)]);
    
    setTimeout(() => {
      const suggested = ['ROCK', 'PAPER', 'SCISSORS'][Math.floor(Math.random() * 3)] as Move;
      setSuggestedMove(suggested);
      const suggestionText = opp.suggest[Math.floor(Math.random() * opp.suggest.length)].replace(/ROCK|PAPER|SCISSORS/, suggested);
      speak(suggestionText);
    }, 2500);
  };

  const handleConfession = (choice: Move | 'REFUSE') => {
    const opp = OPPONENTS[currentOpp];
    
    if (choice === 'REFUSE') {
      setConfession(null);
      setDisappointment(prev => Math.min(100, prev + 20));
      speak(opp.disobey, true);
    } else {
      setConfession(choice);
      speak(opp.obey);
    }
    
    setTimeout(() => {
      setPhase('SELECTION');
      hesitationCount.current = 0;
      lastHovered.current = null;
    }, 2000);
  };

  const handleHover = (move: Move) => {
    if (phase !== 'SELECTION') return;
    
    if (lastHovered.current && lastHovered.current !== move) {
      hesitationCount.current += 1;
      setTellMeter(prev => Math.min(100, prev + 12));
      
      const opp = OPPONENTS[currentOpp];
      if (hesitationCount.current === 3) {
        speak(opp.hesitate);
      }
      if (hesitationCount.current > 5) {
        speak("JUST. CHOOSE.", true);
      }
    }
    lastHovered.current = move;
    setHoveredCard(move);
  };

  const startCommit = (move: Move) => {
    if (deck[move] <= 0 || phase !== 'SELECTION') return;
    
    setCommittingTo(move);
    setCommitProgress(0);
    
    const startTime = Date.now();
    const duration = 1800;
    
    commitInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setCommitProgress(pct);
    }, 16);
    
    commitTimer.current = setTimeout(() => {
      finalizeMove(move);
    }, duration);
  };

  const cancelCommit = () => {
    if (committingTo) {
      setTellMeter(prev => Math.min(100, prev + 18));
      speak("Flinching?", true);
      
      if (commitTimer.current) clearTimeout(commitTimer.current);
      if (commitInterval.current) clearInterval(commitInterval.current);
      
      setCommittingTo(null);
      setCommitProgress(0);
    }
  };

  const finalizeMove = (move: Move) => {
    if (commitTimer.current) clearTimeout(commitTimer.current);
    if (commitInterval.current) clearInterval(commitInterval.current);
    
    setCommittingTo(null);
    setCommitProgress(0);
    setPlayerMove(move);
    setPhase('REVEAL');
    
    setDeck(prev => ({ ...prev, [move]: prev[move] - 1 }));
    
    // Determine opponent move
    let aiMove: Move = ['ROCK', 'PAPER', 'SCISSORS'][Math.floor(Math.random() * 3)] as Move;
    let didCheat = false;
    
    // UNFAIR: Cheat if disappointment is high
    if (disappointment > 60 && Math.random() < 0.5) {
      if (move === 'ROCK') aiMove = 'PAPER';
      if (move === 'PAPER') aiMove = 'SCISSORS';
      if (move === 'SCISSORS') aiMove = 'ROCK';
      didCheat = true;
    }
    
    setOpponentMove(aiMove);
    setCheated(didCheat);
    
    // Determine result
    setTimeout(() => {
      let outcome: string;
      if (move === aiMove) {
        // Tie - maybe force to loss if disappointed
        if (disappointment > 70 && Math.random() < 0.4) {
          outcome = 'LOSS';
          speak("Tie? No. YOU LOSE.", true);
          setDisappointment(prev => Math.min(100, prev - 5));
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 800);
        } else {
          outcome = 'TIE';
          speak("Tie. How boring.");
        }
      } else if (
        (move === 'ROCK' && aiMove === 'SCISSORS') ||
        (move === 'PAPER' && aiMove === 'ROCK') ||
        (move === 'SCISSORS' && aiMove === 'PAPER')
      ) {
        outcome = 'WIN';
        const opp = OPPONENTS[currentOpp];
        speak(opp.win);
        setDisappointment(prev => Math.min(100, prev + 8));
      } else {
        outcome = 'LOSS';
        const opp = OPPONENTS[currentOpp];
        speak(opp.lose);
        setDisappointment(prev => Math.max(0, prev - 10));
      }
      
      // Check if lied
      if (confession && confession !== move) {
        speak("YOU LIED TO ME.", true);
        setDisappointment(prev => Math.min(100, prev + 30));
      }
      
      setResult(outcome);
      
      // Handle loss
      if (outcome === 'LOSS') {
        setTimeout(() => {
          loseRole();
        }, 2500);
      } else {
        setTimeout(() => {
          nextRound();
        }, 3000);
      }
    }, 1200);
  };

  const loseRole = () => {
    setIsGlitching(true);
    const newRoles = roles - 1;
    setRoles(newRoles);
    
    setTimeout(() => {
      setIsGlitching(false);
      if (newRoles <= 0) {
        setPhase('GAMEOVER');
        speak("SESSION TERMINATED.", true);
      } else {
        speak("PUNISHMENT RECEIVED.", true);
        setTimeout(nextRound, 2000);
      }
    }, 2000);
  };

  const nextRound = () => {
    setRound(prev => prev + 1);
    setConfession(null);
    setSuggestedMove(null);
    setPlayerMove(null);
    setOpponentMove(null);
    setResult(null);
    setCheated(false);
    setTellMeter(prev => Math.max(0, prev - 15));
    setCurrentOpp((currentOpp + 1) % 2);
    setPhase('CONFESSION');
    
    setTimeout(() => {
      startConfessionPhase();
    }, 500);
  };

  const opp = OPPONENTS[currentOpp];

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      <style>{globalStyles}</style>
      
      <div className="fixed inset-0 crt-overlay z-50 pointer-events-none" />
      <div className="scan-bar" />
      
      {phase === 'MENU' && (
        <div className="text-center z-10 max-w-2xl space-y-8">
          <h1 className="text-6xl font-bold tracking-[0.3em] mb-8 text-red-500" style={{textShadow: '0 0 20px rgba(239, 68, 68, 0.5)'}}>
            UNFAIR HANDS
          </h1>
          <div className="text-sm text-gray-500 space-y-2 border border-gray-800 p-6 bg-black/50">
            <p>// PSYCHOLOGICAL DUEL PROTOCOL v2.1</p>
            <p>// LIMITED RESOURCES • FORCED CONFESSIONS</p>
            <p>// THEY WATCH YOUR CURSOR MOVEMENTS</p>
            <p>// RULES BEND WHEN DISAPPOINTED</p>
            <p className="text-red-600 mt-4">// DO NOT TRUST THE INTERFACE</p>
          </div>
          <button
            onClick={startGame}
            className="mt-12 px-12 py-4 border-2 border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all tracking-[0.5em] text-xl"
          >
            CONNECT
          </button>
        </div>
      )}
      
      {phase !== 'MENU' && phase !== 'GAMEOVER' && (
        <>
          {/* Status Meters */}
          <div className="w-full max-w-3xl flex justify-between mb-6 z-10">
            <div className="w-1/3">
              <div className="text-[10px] text-red-500 mb-1 flex justify-between tracking-wider">
                <span>DISAPPOINTMENT</span>
                <span>{disappointment}%</span>
              </div>
              <div className="h-2 bg-gray-900 border border-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-red-900 to-red-500 transition-all duration-500"
                  style={{ width: `${disappointment}%` }}
                />
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-[10px] text-gray-600 mb-1">ROUND {round}</div>
              <div className="flex gap-1">
                {[...Array(roles)].map((_, i) => (
                  <div key={i} className="w-3 h-3 border border-red-600 bg-red-900" />
                ))}
              </div>
            </div>
            
            <div className="w-1/3 text-right">
              <div className="text-[10px] text-gray-400 mb-1 flex justify-between tracking-wider">
                <span>TELL METER</span>
                <span>{tellMeter}%</span>
              </div>
              <div className="h-2 bg-gray-900 border border-gray-800">
                <div 
                  className="h-full bg-white transition-all duration-300 ml-auto"
                  style={{ width: `${tellMeter}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* The Eyes */}
          <div className={`mb-8 transition-all duration-300 ${isAngry ? 'scale-125' : 'scale-100'}`}>
            <svg width="240" height="80" viewBox="0 0 240 80" className="drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <g transform="translate(70, 40)">
                <circle cx="0" cy="0" r="30" fill="none" stroke={isAngry ? '#ef4444' : '#444'} strokeWidth="2" />
                <circle 
                  cx="0" 
                  cy="0" 
                  r={isAngry ? '6' : '14'} 
                  fill={isAngry ? '#ef4444' : '#ddd'} 
                  className="transition-all duration-500"
                />
                {isAngry && <path d="M-35 -25 L35 10" stroke="#ef4444" strokeWidth="3" />}
              </g>
              <g transform="translate(170, 40)">
                <circle cx="0" cy="0" r="30" fill="none" stroke={isAngry ? '#ef4444' : '#444'} strokeWidth="2" />
                <circle 
                  cx="0" 
                  cy="0" 
                  r={isAngry ? '6' : '14'} 
                  fill={isAngry ? '#ef4444' : '#ddd'} 
                  className="transition-all duration-500"
                />
                {isAngry && <path d="M-35 10 L35 -25" stroke="#ef4444" strokeWidth="3" />}
              </g>
            </svg>
          </div>
          
          {/* Dialogue Box */}
          <div className={`
            w-full max-w-2xl min-h-[120px] border bg-black/60 p-6 mb-12 backdrop-blur-sm relative z-10
            ${isAngry ? 'border-red-900' : 'border-gray-800'}
            ${isGlitching ? 'glitch-active' : ''}
          `}>
            <div className="absolute top-2 left-2 text-[9px] text-gray-700 tracking-wider">
              {opp.name}_INSTANCE
            </div>
            <div className="absolute top-2 right-2 text-[9px] text-gray-700">
              MSG_{Date.now().toString().slice(-6)}
            </div>
            <p className={`text-lg text-center leading-relaxed mt-4 ${isAngry ? 'text-red-400' : 'text-gray-300'}`}>
              {displayedDialogue}
              <span className="animate-pulse">_</span>
            </p>
          </div>
          
          {/* Game Area */}
          <div className="w-full max-w-3xl min-h-[280px] flex justify-center items-center z-10">
            {phase === 'CONFESSION' && suggestedMove && (
              <div className="space-y-6 w-full max-w-xl">
                <div className="text-center text-sm text-gray-500 tracking-wider mb-4">
                  MAKE YOUR CONFESSION
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {(['ROCK', 'PAPER', 'SCISSORS'] as Move[]).map(move => (
                    <button
                      key={move}
                      onClick={() => handleConfession(move)}
                      className={`py-6 border transition-all ${
                        move === suggestedMove
                          ? 'border-green-700 bg-green-950/20 hover:bg-green-950/40'
                          : 'border-gray-800 bg-gray-950/50 hover:border-gray-700'
                      }`}
                    >
                      <div className="text-xs tracking-[0.3em]">CONFESS</div>
                      <div className="text-lg mt-1">{move}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handleConfession('REFUSE')}
                  className="w-full py-3 text-xs text-gray-600 hover:text-red-500 border border-gray-900 hover:border-red-900 transition-all"
                >
                  [REFUSE TO ANSWER]
                </button>
              </div>
            )}
            
            {phase === 'SELECTION' && (
              <div className="flex gap-6">
                {(['ROCK', 'PAPER', 'SCISSORS'] as Move[]).map(move => (
                  <GameCard
                    key={move}
                    move={move}
                    count={deck[move]}
                    isCommitting={committingTo === move}
                    progress={commitProgress}
                    isHovered={hoveredCard === move}
                    onMouseDown={() => startCommit(move)}
                    onMouseUp={cancelCommit}
                    onMouseEnter={() => handleHover(move)}
                    onMouseLeave={() => {
                      setHoveredCard(null);
                      cancelCommit();
                    }}
                  />
                ))}
              </div>
            )}
            
            {phase === 'REVEAL' && playerMove && opponentMove && (
              <div className="space-y-8 text-center">
                <div className="grid grid-cols-2 gap-12 max-w-lg mx-auto">
                  <div>
                    <div className="text-[10px] text-gray-600 mb-2 tracking-wider">YOUR CHOICE</div>
                    <div className="border-2 border-blue-600 bg-blue-950/20 p-8">
                      <CardIcon move={playerMove} size={48} />
                      <div className="mt-3 text-blue-400">{playerMove}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 mb-2 tracking-wider">THEIR CHOICE</div>
                    <div className="border-2 border-red-600 bg-red-950/20 p-8">
                      <CardIcon move={opponentMove} size={48} />
                      <div className="mt-3 text-red-400">{opponentMove}</div>
                    </div>
                  </div>
                </div>
                
                {result && (
                  <div className="space-y-2">
                    <div className={`text-3xl tracking-[0.3em] ${
                      result === 'WIN' ? 'text-blue-400' : 
                      result === 'LOSS' ? 'text-red-500' : 
                      'text-gray-500'
                    }`}>
                      {result}
                    </div>
                    {cheated && (
                      <div className="text-[10px] text-red-600 tracking-wider">
                        [ INTERFERENCE DETECTED ]
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
      
      {phase === 'GAMEOVER' && (
        <div className="text-center z-10 space-y-8">
          <h1 className="text-6xl text-red-600 tracking-[0.5em] glitch-active mb-8">
            TERMINATED
          </h1>
          <div className="text-gray-600 space-y-2">
            <p>TOTAL ROUNDS: {round - 1}</p>
            <p>FINAL DISAPPOINTMENT: {disappointment}%</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 border border-gray-800 hover:border-white hover:bg-white hover:text-black transition-all text-sm tracking-[0.3em]"
          >
            REBOOT SYSTEM
          </button>
        </div>
      )}
      
      <div className="absolute bottom-4 text-[9px] text-gray-800 tracking-wider">
        UNFAIR_HANDS_v2.1 // TRUST_NOTHING
      </div>
    </div>
  );
}

interface CardProps {
  move: Move;
  count: number;
  isCommitting: boolean;
  progress: number;
  isHovered: boolean;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

function GameCard({ move, count, isCommitting, progress, isHovered, onMouseDown, onMouseUp, onMouseEnter, onMouseLeave }: CardProps) {
  const isDisabled = count <= 0;
  
  return (
    <div
      className={`
        relative w-36 h-52 border flex flex-col items-center justify-center
        transition-all duration-200 bg-black
        ${isDisabled ? 'opacity-20 border-gray-900 cursor-not-allowed' : 'cursor-pointer border-gray-700 hover:border-white hover:-translate-y-3'}
        ${isCommitting ? 'border-red-500 scale-95' : ''}
        ${isHovered && !isDisabled ? 'shadow-[0_0_20px_rgba(255,255,255,0.1)]' : ''}
      `}
      onMouseDown={!isDisabled ? onMouseDown : undefined}
      onMouseUp={onMouseUp}
      onMouseEnter={!isDisabled ? onMouseEnter : undefined}
      onMouseLeave={onMouseLeave}
    >
      {isCommitting && (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 150" preserveAspectRatio="none">
          <rect
            x="2" y="2" width="96" height="146"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeDasharray="500"
            strokeDashoffset={500 - (500 * (progress / 100))}
            style={{ transition: 'stroke-dashoffset 16ms linear' }}
          />
        </svg>
      )}
      
      <CardIcon move={move} size={40} color={isCommitting ? '#ef4444' : isDisabled ? '#333' : '#ddd'} />
      
      <div className={`mt-4 text-xs tracking-[0.3em] ${isCommitting ? 'text-red-500' : ''}`}>
        {move}
      </div>
      <div className="text-[9px] text-gray-700 mt-2 tracking-wider">
        QTY: {count}
      </div>
      
      {isCommitting && (
        <div className="absolute bottom-6 text-[9px] text-red-500 tracking-wider animate-pulse">
          HOLD TO COMMIT
        </div>
      )}
    </div>
  );
}

function CardIcon({ move, size, color = '#ddd' }: { move: Move; size: number; color?: string }) {
  if (move === 'ROCK') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      </svg>
    );
  }
  
  if (move === 'PAPER') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );
}