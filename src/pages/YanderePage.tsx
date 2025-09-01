import { useState, useRef, useEffect } from "react";

type Message = {
  sender: "yandere" | "sub";
  text?: string;
  image?: string;
  choices?: { text: string; next: () => void }[];
};

function YanderePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
//   const [revealed, setRevealed] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (msg: Message, delay = 2500) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, msg]);
        resolve();
      }, delay);
    });
  };

  const startStory = async () => {
    setMessages([]);
    setLoading(true);

    await addMessage({ sender: "yandere", text: "Ehh~ you actually came here… how bold of you ♥" }, 3000);
    await addMessage({ sender: "yandere", text: "Do you know… I can see you already, in my little world?" }, 3000);

    // First choice
    await addMessage({
      sender: "yandere",
      text: "Do you want me to show you something… special?",
      choices: [
        { text: "Yes…", next: () => firstChoice(true) },
        { text: "No…", next: () => firstChoice(false) },
      ],
    });

    setLoading(false); // waiting for user to pick
  };

  const firstChoice = async (yes: boolean) => {
    setLoading(true);
    if (yes) {
      await addMessage({ sender: "sub", text: "Yes…" });
      await addMessage({ sender: "yandere", text: "Fufu~ that’s what I like to hear ♥" }, 3000);
    } else {
      await addMessage({ sender: "sub", text: "No…" });
      await addMessage({ sender: "yandere", text: "Oh? You’re stubborn… I like that too~" }, 3500);
    }

    // Continue story
    await addMessage({ sender: "yandere", text: "Hold still… don’t move a muscle." }, 4000);
    await addMessage({ sender: "yandere", image: "/yandere/yandere.webp" }, 4500);
    await addMessage({ sender: "yandere", text: "Do you like this…? Fufu~"}, 3500);

    // Geolocation attempt
    if (!navigator.geolocation) {
      await addMessage({ sender: "yandere", text: "Tch. Your device won’t let me peek… but I’ll find you anyway ♥" }, 4000);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // setRevealed(true);
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        let address = "Address not found";
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
          );
          const data = await res.json();
          address = data.display_name || address;
        } catch {
          // Ignore errors when fetching address
        }

        await addMessage({ sender: "yandere", text: `Latitude: ${lat.toFixed(6)}` }, 3500);
        await addMessage({ sender: "yandere", text: `Longitude: ${lon.toFixed(6)}` }, 3500);

        // Second fake choice: Obsessive teasing
        await addMessage({
          sender: "yandere",
          text: `Ahh… so this is where you’ve been hiding ♥`,
          choices: [
            { text: "Please… I’m scared", next: () => secondChoice(true, address) },
            { text: "I… like it", next: () => secondChoice(false, address) },
          ],
        });

        setLoading(false);
      },
      async () => {
        await addMessage({ sender: "yandere", text: "You denied me? How cruel… but I’ll keep watching." }, 4000);
        setLoading(false);
      }
    );
  };

  const secondChoice = async (scared: boolean, address: string) => {
    setLoading(true);
    if (scared) {
      await addMessage({ sender: "sub", text: "Please… I’m scared" });
      await addMessage({ sender: "yandere", text: "Fufu~ don’t be scared, I’ll keep you safe… just for me ♥" }, 4000);
    } else {
      await addMessage({ sender: "sub", text: "I… like it" });
      await addMessage({ sender: "yandere", text: "Mmm~ I knew you’d enjoy it. You belong to me ♥" }, 4000);
    }

    // End obsessive sequence
    await addMessage({ sender: "yandere", text: `Your address: ${address}` }, 4000);
    await addMessage({ sender: "yandere", image: "/yandere/yandere_2.webp" }, 4500);
    await addMessage({ sender: "yandere", text: "Now you’re mine, forever and ever." }, 4000);
    await addMessage({ sender: "yandere", text: "Obey me, love me, or I’ll watch you even closer ♥" }, 4000);

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-pink-400 flex flex-col items-center justify-center p-4 font-mono">
      <div className="max-w-2xl w-full bg-zinc-900 rounded-2xl shadow-lg border border-pink-500 flex flex-col">
        {/* Chat window */}
        <div ref={chatRef} className="p-4 flex-1 overflow-y-auto space-y-3 h-[500px]">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "yandere" ? "justify-start" : "justify-end"} flex-col`}>
              {msg.text && (
                <div
                  className={`px-4 py-2 rounded-2xl max-w-[75%] shadow
                  ${msg.sender === "yandere" ? "bg-pink-600 text-white" : "bg-zinc-700 text-gray-200"}`}
                >
                  {msg.text}
                </div>
              )}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="Yandere image"
                  className="max-w-[75%] rounded-2xl border-2 border-pink-500 shadow-lg mt-1"
                />
              )}
              {msg.choices && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.choices.map((choice, idx) => (
                    <button
                      key={idx}
                      onClick={choice.next}
                      className="px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-700 text-white font-semibold"
                    >
                      {choice.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start button */}
        {!messages.length && (
          <div className="flex justify-center p-4 border-t border-pink-500">
            <button
              onClick={startStory}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 shadow-lg text-white font-semibold transition"
            >
              {loading ? "Typing…" : "Start Chat"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default YanderePage;
