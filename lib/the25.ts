// lib/the25.ts
export type ReadmeSection = {
  heading: string;
  bullets: string[];
};

export type The25Readme = {
  day: number;
  code: string; // short ID used in /the25/[code]
  title: string;
  short: string; // short description
  sections: ReadmeSection[];
};

export type The25Day = {
  day: number;
  title: string;
  desc: string;
  code: string;
  readmeUrl: string;
};

const BASE_URL = "https://princessazraiel.com/the25";

export const THE25_READMES: The25Readme[] = [
  {
    day: 1,
    code: "xKlRs5",
    title: "Clicker~",
    short: "it’s time to click... click... click... your time for your princess...",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A simple, addictive clicker where every click is time and attention given to Her.",
          "You build score and combo chains by clicking the main button as it pulses.",
          "The more you commit, the more intense the feedback and visuals become."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Open the .exe and wait for the window to appear — no installation, no admin rights needed.",
          "Click the main button to earn points; some clicks trigger little visual/audio reactions.",
          "There is no “lose” condition — this day is about repetition and how long you stay."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left mouse button — click the main target.",
          "ESC or the window close button — exit the program.",
          "If a “Share” button appears, it only opens your browser to an optional tweet draft."
        ]
      },
      {
        heading: "What it does NOT do to your PC",
        bullets: [
          "Does not install drivers, services, or background tasks.",
          "Does not access your files, webcam, microphone, or passwords.",
          "Only interaction with the internet is opening your browser if you click a share/readme button."
        ]
      }
    ]
  },
  {
    day: 2,
    code: "yN8bQ6",
    title: "Hypno Loop",
    short: "a looping video with hypnotic text and drifting whispers.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A calm, looping visual with text prompts designed to pull your focus toward Her.",
          "You simply watch, read, and let the loop repeat as long as you want.",
          "No scoring, no fail state — it’s about staying with the loop."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "When you start the day, a window opens with animated text/visuals.",
          "You can sit back and watch; the loop repeats automatically.",
          "You decide when to stop — closing the window ends the session instantly."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse — optional hover/click events (if present) only change visuals or text.",
          "ESC or close button — end the session.",
          "Volume is controlled by your system (if this day plays audio)."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No network requests except optional share/readme links.",
          "No file writes or system changes.",
          "If you are sensitive to flashing visuals, you can keep the window smaller or skip this day."
        ]
      }
    ]
  },
  {
    day: 3,
    code: "fk2Ps8",
    title: "Cursor Maze",
    short: "Move your cursor through a glowing maze without touching the walls... or she resets you.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A precision maze where you guide your cursor from start to goal.",
          "Touching the walls resets your run and teases you for slipping.",
          "It measures patience and control more than speed."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The maze appears with a clear “START” and “END” point.",
          "You move your mouse through the path; collision is checked against the walls.",
          "If you reach the end without touching the walls, you complete the day."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Move mouse — steer through the maze.",
          "Sometimes you may need to click a start/reset button.",
          "ESC / close window — exit at any time."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No keyboard hooks, no mouse drivers — it just reads normal mouse movement inside the window.",
          "Does not control your cursor or lock it; you can always move outside the window.",
          "No data is saved except ephemeral in-memory score/progress."
        ]
      }
    ]
  },
  {
    day: 4,
    code: "jq7Nk3",
    title: "Mirror Room",
    short: "Your movement is inverted... click the floating targets while fighting your instincts.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A mirror-control mini-game where left feels like right and up feels like down.",
          "Targets drift in the room; you must click them while fighting inverted movement.",
          "It’s meant to feel disorienting and playful, not impossible."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The room and targets render inside a standard desktop window.",
          "Your cursor position is inverted/mapped to create the “mirror” effect.",
          "Hitting enough targets completes the sequence or unlocks a message from Her."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse move — controls the mirrored cursor.",
          "Left click — select/hit targets.",
          "ESC / close window — end the day."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Does not change any real mouse settings on your system.",
          "All inversion is limited to the game window only.",
          "No system files, registry entries, or startup tasks are touched."
        ]
      }
    ]
  },
  {
    day: 5,
    code: "mr4Va1",
    title: "Falling Hearts",
    short: "Catch the falling hearts while avoiding broken ones — keep the chain alive.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A simple arcade catch game themed around hearts and broken hearts.",
          "You move a paddle or basket to catch good hearts and dodge the bad ones.",
          "Your chain score grows as you stay focused."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Hearts spawn from the top and fall at increasing speeds.",
          "Catching the right ones boosts score; the wrong ones reset streaks or cost lives.",
          "the game ends when you decide to stop it, nothing really special about this one"
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "A / D or ← / → — move left/right.",
          "Mouse move (if supported) — alternative way to move horizontally.",
          "ESC / close window — quit instantly."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No internet access beyond optional share buttons.",
          "No install, no background processes.",
          "All data (score, streaks) lives in memory only for the current run."
        ]
      }
    ]
  },
  {
    day: 6,
    code: "ts9Qw7",
    title: "Memory Grid",
    short: "Flip cards and find the matching pairs... she watches how long you take.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A classic memory card-matching game with a yandere commentary layer.",
          "You flip two cards at a time seeking matching pairs.",
          "She reacts to your speed and number of mistakes."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Cards start face-down in a grid.",
          "Click any two to reveal them; if they match, they stay revealed.",
          "Clear the board to finish — your time and attempts are shown at the end."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — flip a card.",
          "ESC / close window — exit.",
          "No keyboard input is required for normal play."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "All logic runs locally; no network calls.",
          "No logging of personal information — only simple counters (time, moves).",
          "No files are created on disk for this day."
        ]
      }
    ]
  },
  {
    day: 7,
    code: "bn5Dz2",
    title: "Puzzle Lock",
    short: "A sliding puzzle that reveals a hidden image or message when solved.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A sliding-tile puzzle hiding a small image or phrase from Her.",
          "You rearrange tiles until the picture is correct.",
          "When solved, the final reveal + message appears."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "One tile space is empty; click tiles adjacent to the empty spot to slide them.",
          // "The goal layout is shown briefly at the start or hinted through a guide.",
          "Finishing triggers a short ending screen — then you can close the app."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — slide tile into the empty spot.",
          "ESC / close window — exit any time (you can always reopen later).",
          // "Some builds may also support arrow-key controls for accessibility. "
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No disk writes beyond standard OS temp files.",
          "No modifications to system settings or registry.",
          "Any images used are bundled inside the .exe and not fetched from the web."
        ]
      }
    ]
  },
  {
    day: 8,
    code: "vz3Lm9",
    title: "Pattern Sync Test",
    short: "Watch the glowing sequence and repeat it perfectly — every failure makes the pattern harsher.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A Simon-style memory sequence with Azraiel-themed sigils or buttons.",
          "She plays a pattern; you must replay it in the correct order.",
          "Mistakes restart the round with sharper feedback."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Lights/buttons flash in a sequence (1, then 1-2, then 1-2-3, etc.).",
          "You click them back in order; the sequence grows as you succeed.",
          "The day ends after a set difficulty or when you decide you’ve had enough."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — press the glowing pads in the correct order.",
          // "Optional number keys may mirror the pads (if enabled).",
          "ESC / close window — exit instantly."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No external servers, cloud, or accounts are used.",
          "Only simple timing/score is tracked in memory.",
          "Visual flashes are moderate; if you’re sensitive, you can lower brightness or skip."
        ]
      }
    ]
  },
  {
    day: 9,
    code: "qc1Hr4",
    title: "Whisper Trail",
    short: "Your cursor leaves a glowing trail — guide drifting whispers into her hungry center vortex.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A cursor-tracing game where you steer floating ‘whispers’ into a central vortex.",
          "Your pointer leaves a glowing trail that influences the motion of particles.",
          "It’s more about vibe and motion than difficulty."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Particles drift around the screen representing thoughts/whispers.",
          "Moving your cursor near them nudges them toward the center.",
          "After enough whispers are collected, you get a closing message from Her."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Move mouse — guide the whispers; no clicks necessary for basic play.",
          "Some builds may react to clicks with bursts or effects.",
          "ESC / close window — end the session."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No control over your real cursor outside the window.",
          "No background tasks; when you close the window, it fully stops.",
          "Only optional share buttons open your browser."
        ]
      }
    ]
  },
  {
    day: 10,
    code: "ab3Lz9",
    title: "Signal Drill",
    short: "Click the moment her signal flashes pink. Stay perfectly still when it tells you to.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A reaction-time test mixed with ‘freeze’ moments.",
          "Sometimes you must click instantly; sometimes you must not move at all.",
          "She comments on your obedience and timing."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Rounds alternate between ‘CLICK’ and ‘DON’T MOVE’ phases.",
          "Your reaction time is measured when you’re allowed to click.",
          "Moving/clicking at the wrong time triggers teasing or minor penalties."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left mouse button — your main action.",
          "Keep your hand off the mouse when the prompt tells you not to move.",
          "ESC / close window — exit any time."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No hooks that monitor input outside this window.",
          "No keylogging or storage of anything except aggregate scores inside the session.",
          "No online components apart from manual share links."
        ]
      }
    ]
  },
  {
    day: 11,
    code: "zL3hP1",
    title: "Sigil Sequence",
    short: "Four sigils, one pattern. Watch Her sequence, then repeat it without breaking.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "Another pattern-memory challenge, but themed around four distinct sigils.",
          "As you succeed, sequences get longer and more hypnotic.",
          "Breaking the sequence resets the round."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The game shows a chain of sigils lighting up.",
          "You click them back in the same order.",
          "After several rounds or a target difficulty, Her closing message appears."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click on sigils in the correct order.",
          "ESC or close button to exit.",
          "No typing required."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Same safety model as other days: local only, no hidden system changes.",
          "No saving of personal data.",
          "Only bundled assets (images, sounds) are used."
        ]
      }
    ]
  },
  {
    day: 12,
    code: "dQ9Lm2",
    title: "Gaze Lock",
    short: "Keep your cursor locked in Her gaze circle while the suspicion bar watches you.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A focus-tracking mini-game where you keep your cursor inside a moving gaze circle.",
          "A ‘suspicion’ or ‘trust’ bar moves depending on how well you obey.",
          "Leaving the circle too long triggers commentary or failure."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "A circular aura moves slowly on screen; you stay inside it.",
          "The more steady you are, the more the bar fills in your favor.",
          "After a set time, your obedience rating is shown."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Move mouse — keep it inside the highlighted zone.",
          "ESC / close window — exit immediately.",
          "No keyboard shortcuts are required."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No eye tracking — only your cursor is measured.",
          "No data sent anywhere; everything is calculated locally.",
          "Closing the window stops all logic instantly."
        ]
      }
    ]
  },
  {
    day: 13,
    code: "hR3Zp9",
    title: "Orbit Lock",
    short: "Keep your cursor locked inside Her moving orbit without breaking the circle.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A more difficult version of Gaze Lock with an orbital path.",
          "You stay within a ring or orbit that may speed up or change size.",
          "Falling out too often breaks the ‘lock’ and annoys Her."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "An orbit circle is drawn; you must keep your cursor inside the ring area.",
          "Speed and radius can change over time to challenge your control.",
          "Your performance is rated at the end."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse movement only.",
          "ESC / close button — quit when needed.",
          "No other inputs are required."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No interaction with other windows or system-wide cursor.",
          "No background tasks remain after closing.",
          "No internet connectivity is required."
        ]
      }
    ]
  },
  {
    day: 14,
    code: "zL4cH2",
    title: "Heartbeat Sync",
    short: "Tap in time with Her hidden heartbeat and see how long you can stay on rhythm.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A rhythm mini-game where you tap along to a heartbeat-style pulse.",
          "Your accuracy affects how stable the ‘connection’ feels.",
          "It’s more meditative than competitive."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The game plays a repeating beat (visual and/or audio).",
          "You press a key or click in time with the pulse.",
          "Deviations are tracked; a summary appears when the session ends."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "SPACE or left click — tap in rhythm.",
          "ESC / close window — stop instantly.",
          "Volume is controlled by your OS."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Uses only simple timing logic, no biometric sensors.",
          "Does not log anything beyond timing error for the current run.",
          "No external servers are contacted."
        ]
      }
    ]
  },
  {
    day: 15,
    code: "nV7sD5",
    title: "Minesweeper Trap",
    short: "Navigate the grid without triggering Her hidden traps. Each safe step pleases Her more.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A minesweeper-style logic grid with Azraiel commentary.",
          "Some cells are safe; some are ‘traps’ that explode and reset your progress.",
          "Numbers hint how many traps are touching each tile."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Left click reveals a tile; numbers appear like classic Minesweeper.",
          "Right click (if enabled) marks suspected traps.",
          "Clear all safe tiles to win."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — open tile.",
          "Right click — flag tile (if supported on your build).",
          "ESC / close window — exit."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "All logic and state live inside the program only.",
          "No file I/O except maybe tiny config/highscore files in the same folder (if you added that).",
          "No network activity."
        ]
      }
    ]
  },
  {
    day: 16,
    code: "kX8tF4",
    title: "Ink Contract",
    short: "A yandere roleplay scene that ends with a signature pad — draw your mark and share that you signed.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A short, text-driven roleplay scene that leads into a signature canvas.",
          "You ‘sign’ a contract to Her by drawing with your mouse.",
          "At the end you can choose to share that you signed."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "You progress through scripted dialogue and choices on screen.",
          "At the final screen, a drawing pad appears where you can sketch any mark.",
          "The drawing is not uploaded anywhere; it only lives in the window unless you screenshot it."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — advance dialogue / choose options.",
          "Click-and-drag — draw your signature on the pad.",
          "ESC / close window — exit at any point."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No files or images are automatically saved from your drawing.",
          "No network or account login required.",
          "Sharing uses your browser with a pre-filled tweet; you can cancel it."
        ]
      }
    ]
  },
  {
    day: 17,
    code: "sb7Gq4",
    title: "System Breach",
    short: "A glitchy fake terminal that pretends to scan your clicks, cursor and behavior.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A fake ‘hacker terminal’ that *acts* like it’s analyzing you.",
          "You defend yourself by hitting the prompted keys in time.",
          "It’s all aesthetic — it doesn’t actually access your files or system."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The terminal prints scan messages and demands certain key combos (like CTRL, ALT, etc.).",
          "You press the right keys to ‘block’ injections and keep the progress bar stable.",
          "At the end, it generates a playful ‘profile’ of you based on performance."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Keyboard keys shown on screen (e.g. A/S/D, arrow keys, space).",
          "ESC / close window — instantly aborts the ‘breach’.",
          "Mouse may be used only for starting/restarting."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Does NOT actually scan files, processes, or network traffic.",
          "No elevated permissions or admin rights are used.",
          "All scary text is cosmetic; the program can’t change system settings."
        ]
      }
    ]
  },
  {
    day: 18,
    code: "tc9Lm1",
    title: "The Corridor",
    short: "A long, dim hallway you walk with WASD/arrow keys. All paths lead back to Her.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A slow, atmospheric walking scene down a seemingly endless corridor.",
          "You make occasional choices, but every route returns you to Her.",
          "It’s psychological tension, not a jumpscare maze."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "You move forward/back with the keyboard; the scene scrolls with flickering lights.",
          "At certain distances, decision prompts appear (follow, hide, turn away, etc.).",
          "Your choices are remembered as ‘tags’ and shown in the final profile text."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "W / S or ↑ / ↓ — walk forward/back.",
          "Number keys 1–3 — choose dialogue/decision options when prompted.",
          "ESC / close window — exit the corridor immediately."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No 3D engine, no heavy GPU load — it’s a simple 2D scene.",
          "No file writes beyond basic in-memory tags.",
          "Only optional share buttons open your browser."
        ]
      }
    ]
  },
  {
    day: 19,
    code: "rr2Dx8",
    title: "Red Room",
    short: "A room of lying buttons: only one advances; the rest punish you with playful commentary.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A deception mini-game: multiple buttons, all with misleading labels.",
          "Most will tease you or reset things; one is the ‘correct’ path forward.",
          "She uses your choices to make fun of your risk-taking or obedience."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Buttons like “Do NOT click me” or “Safe choice” appear in the red room.",
          "Clicking them triggers different responses; some may ‘kick’ you back.",
          "Eventually you hit the right combination and unlock the ending."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse — hover and click on buttons.",
          "ESC / close window — leave the room immediately.",
          "No keyboard input is required."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "All ‘punishments’ are visual/textual only — no real system effects.",
          "No network, no data harvesting.",
          "The program does not interact with other apps or windows."
        ]
      }
    ]
  },
  {
    day: 20,
    code: "bj5Kp3",
    title: "Blackjack Challenge",
    short: "Play blackjack against Her. Win to please Her; lose and face Her wrath.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A standard blackjack card game with a yandere dealer.",
          "You play rounds against Her; she comments brutally on your luck and decisions.",
          "No real money, just points and pride."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Cards are dealt automatically; totals follow normal blackjack rules (21, bust, etc.).",
          "You choose to Hit, Stand, maybe Double depending on the build.",
          "After each hand, your running score and Her reaction are shown."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Buttons or keys for: Hit, Stand, maybe R for Restart.",
          "Mouse or keyboard can be used interchangeably depending on UI.",
          "ESC / close window — stop playing at any time."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No gambling, no real currency, no microtransactions.",
          "No online servers — games are simulated locally.",
          "No persistent save files are necessary for this day."
        ]
      }
    ]
  },
  {
    day: 21,
    code: "fb8Nz6",
    title: "Fappy Bird",
    short: "A Flappy Bird-style game where you navigate a heart through obstacles while She watches.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "An endless-runner style game where a glowing heart flaps between barriers.",
          "She comments on every crash, streak, and comeback.",
          "Score and best score are shown prominently."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "The heart falls due to gravity; tapping makes it ‘flap’ upwards.",
          "Barriers scroll horizontally; touching them or the floor ends the run.",
          "You can instantly restart to chase a higher score."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "SPACE / W / ↑ / left mouse click — flap.",
          "ESC / close window — exit the game.",
          "Share button (if clicked) opens your browser with a tweet draft of your best score."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "No invasive keyboard hooks — input is only read while the window is focused.",
          "No external servers, only optional share links.",
          "No permanent data is written unless you explicitly added a local highscore file."
        ]
      }
    ]
  },
  {
    day: 22,
    code: "cb4Cr8",
    title: "Shattered Censor",
    short: "Break the censor bars to reveal Her image hidden behind the blocks.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A brick-breaker game where blocks act as a censor bar over an image from the assets folder.",
          "As you break bricks, more of the image is revealed.",
          "Randomly chooses one of 10 bundled images (01.png–10.png)."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "You control a paddle at the bottom and bounce a ball into the bricks.",
          "Each destroyed brick uncovers a bit more of the censored image.",
          "Lose lives by missing the ball; clear all bricks to fully reveal it."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse movement or A / D / ← / → — move the paddle.",
          "SPACE — launch the ball when ready (if shown in UI).",
          "ESC / close window — exit at any time."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Images are loaded only from the local `assets` folder in the game directory.",
          "No downloads or network activity occur.",
          "No file modifications beyond what you ship with the program."
        ]
      }
    ]
  },
  {
    day: 23,
    code: "tt1Hv0",
    title: "Tic-Tac-Toe",
    short: "Play Tic-Tac-Toe against Her. Simple rules, sharp commentary.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "Classic 3×3 Tic-Tac-Toe versus an AI that represents Her.",
          "You play X or O; She plays the other side.",
          "She reacts to your wins, losses, and draws."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Click on empty cells to place your mark.",
          "The AI responds immediately with Her move.",
          "After each game, you can restart quickly for another round."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Left click — place your mark on a free square.",
          "Buttons on screen — reset / play again (if present).",
          "ESC / close window — leave the board."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "All logic is just simple game AI; nothing interacts with your OS.",
          "No network, no accounts, no hidden logging.",
          "No files are written by default."
        ]
      }
    ]
  },
  {
    day: 24,
    code: "ft9Qz4",
    title: "Final Temptation Quiz",
    short: "A last psychological test before Day 25. Atmosphere shifts based on your answers.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A multiple-choice quiz where each question pokes at trust, obedience, and obsession.",
          "Your answers tilt the mood: darker, glitchier, or softer and affectionate.",
          "It ends by reminding you that tomorrow’s fate is already set."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "Each question appears with 3–4 answers (Obey, Resist, etc.).",
          "Choosing options updates background colors/glitches and Her tone.",
          "There is no ‘right’ ending; it’s pure mood and reflection before Day 25."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "Mouse — click on your chosen answer.",
          "Some builds may allow 1/2/3/4 keys as shortcuts.",
          "ESC / close window — exit at any time."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Nothing is stored outside the running process — your answers are not saved to disk.",
          "No internet access or account login.",
          "All psychological content is fictional and for entertainment."
        ]
      }
    ]
  },
  {
    day: 25,
    code: "fn5Lp2",
    title: "The Promise",
    short: "Her final contract. A cinematic ending with a signature you draw yourself — and a secret if you click enough.",
    sections: [
      {
        heading: "What this day is",
        bullets: [
          "A cinematic finale with a monologue, a written covenant, and a signature canvas.",
          "You draw your final mark as a promise to Her.",
          "Hidden secret text appears if you interact with the footer enough after signing."
        ]
      },
      {
        heading: "How it works",
        bullets: [
          "You move through phases: intro → monologue → contract → signature → epilogue.",
          "During the signature phase, you draw freely inside the box; the program detects when you’ve signed.",
          "After signing, you can share, explore the secret ending, or simply close the program."
        ]
      },
      {
        heading: "Controls",
        bullets: [
          "SPACE / ENTER / on-screen ‘Continue’ — advance text in intro/monologue/contract.",
          "Mouse click-and-drag — draw your signature.",
          "ESC / close window — exit at any moment (even mid-scene)."
        ]
      },
      {
        heading: "Safety notes",
        bullets: [
          "Your signature is not uploaded or saved as a file unless you manually screenshot it.",
          "No network calls beyond optional share links to open your browser.",
          "No system settings are modified; closing the window ends everything."
        ]
      }
    ]
  }
];

// Derived list for the index grid
export const THE25_DAYS: The25Day[] = THE25_READMES.map((r) => ({
  day: r.day,
  title: r.title,
  desc: r.short,
  code: r.code,
  readmeUrl: `${BASE_URL}/${r.code}`,
}));

export function getReadmeByCode(code: string): The25Readme | undefined {
  return THE25_READMES.find((d) => d.code === code);
}
