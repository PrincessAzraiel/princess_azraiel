import GlitchText from '../components/GlitchText';

const secretLinks = [
  {
    label: "Tribute Now",
    url: "https://throne.com/princessazraiel"
  },
  {
    label: "Spread the Gospel",
    url: "https://twitter.com/intent/tweet?text=I+just+offered+my+devotion+to+Princess+Azraiel+~+come+submit+too+%F0%9F%92%96+https://princessazraiel.vercel.app/"
  },
  {
    label: "Discord Entry",
    url: "https://discord.gg/sCusdWXxZF"
  },
  {
    label: "Corrupt Me More",
    url: "https://gofile.io/d/2uZY0d"
  },
  {
    label: "Steam Wishlist",
    url: "https://store.steampowered.com/wishlist/profiles/76561199854908095/?sort=discount"
  }
];

export default function SecretButtonsPage() {
  return (
    <>

      <div className="magic-bg min-h-screen text-pink-300 flex flex-col items-center justify-center p-6 relative">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="floating-heart"
            style={{
              left: `${Math.random() * 100}vw`,
              top: `${Math.random() * 100}vh`,
              animationDelay: `${Math.random() * 5}s`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            ♡
          </div>
        ))}

        <div className="z-10 text-center space-y-8">
          <GlitchText text="Choose Your Fate, Pet" />

          <div className="flex flex-col space-y-4 max-w-sm mx-auto">
            {secretLinks.map(({ label, url }, idx) => (
              <a
                key={idx}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500/80 to-purple-600/80 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 hover:shadow-pink-500/30"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 opacity-50">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
          ))}
        </div>
      </div>
    </>
  );
}