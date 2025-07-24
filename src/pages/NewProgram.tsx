import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ReactDOM from 'react-dom';

type Character = {
  name: string;
  role: string;
  image: string;
  tone: string;
  description: string;
  sample: string;
};

const characters = [
  {
    name: 'Princess Azraiel',
    role: 'Digital Goddess of Corruption',
    image: '/infection/1.png',
    tone: 'Obsessive, divine, punishing',
    description: 'A divine entity corrupted by digital power, she commands obedience through irresistible allure and divine punishment.',
    sample: "You think you can resist me? I am the corruption that flows through your veins, the glitch in your perfect world. Submit, and I might show mercy... or perhaps I'll enjoy your struggle even more."
  },
  {
    name: 'Your Crush',
    role: 'Yandere Tease',
    image: '/infection/2.jpg',
    tone: 'Flirty, unstable, dangerously obsessive',
    description: 'Inspired by Himiko Toga, she’s sweet and bubbly but hides a sharp, unpredictable obsession that twists affection into dangerous desire.',
    sample: "I just want to be close to you forever... even if it means I have to bend reality a little. Don’t fight me, darling. You belong to me."
  },
  {
    name: 'Your Boss',
    role: 'Cold, Commanding Mistress',
    image: '/infection/3.png',
    tone: 'Authoritative, manipulative, humiliating',
    description: 'Modeled after Makima, she exerts absolute control, mixing charm with ruthless dominance. Your obedience is both a duty and a privilege.',
    sample: "You will follow my orders without question. Fail me, and you’ll understand the true meaning of regret. Now, prove your worth."
  },
  {
    name: 'Your Best Friend',
    role: 'Flirty Enabler',
    image: '/infection/4.jpg',
    tone: 'Playful, teasing, supportive with a hint of mischief',
    description: 'Like Marin Kitagawa, she’s your vibrant, flirty companion who encourages indulgence and never lets you forget to have fun.',
    sample: "Oh, come on! You can’t resist a little fun, can you? Let’s mess around — I’ll be right here teasing you the whole time."
  },
  {
    name: 'Your Sister',
    role: 'Bratty, Taboo Tease',
    image: '/infection/5.jpg',
    tone: 'Playful, bratty, chaotic but affectionate',
    description: 'Inspired by Nadeko Sengoku, she flirts with boundaries, teasing with a mix of innocence and sly provocation that drives you wild.',
    sample: "Hehe, don’t look at me like that! I’m just being my usual mischievous self... but maybe you like it when I’m naughty?"
  },
  {
    name: 'Your Therapist',
    role: 'Soft-Voiced Gaslighter',
    image: '/infection/6.png',
    tone: 'Calm, soothing, but subtly unsettling',
    description: 'Drawing from Shouko Komi’s quiet intensity, she gently unravels your mind with comforting words that blur the line between help and manipulation.',
    sample: "You’re doing so well. But maybe... maybe you’re not as strong as you think. It’s okay to lean on me. I’m here to guide you, always."
  },
  {
    name: 'Your Ex',
    role: 'Bitter, Obsessive Shadow',
    image: '/infection/7.webp',
    tone: 'Cold, unstable, resentful yet lingering',
    description: 'A mix of Utaha Kasumigaoka’s sharp wit and Kurumi Tokisaki’s obsessive tendencies — she’s your past you can’t escape, always lurking.',
    sample: "You thought you could forget me? I’m the shadow that clings to your every thought. Run, but I’ll always find you."
  },
  {
    name: 'Your Girlfriend',
    role: 'Possessive, Cruelly Tender',
    image: '/infection/8.jpg',
    tone: 'Soft yet possessive, dangerously loving',
    description: 'Inspired by Rem’s loyal and tender devotion, twisted with a possessive edge that never lets you feel safe from her affection.',
    sample: "You belong to me. No one else can have you. But don’t worry — I’ll be gentle... as long as you’re mine."
  },
  {
    name: 'Your Roommate',
    role: 'Lazy Menace, Casual Tease',
    image: '/infection/9.png',
    tone: 'Playful, teasing, always watching',
    description: 'Like Aqua’s chaotic laziness mixed with a hint of mischief — she’s always there, lounging around, keeping tabs with a smirk.',
    sample: "Hey, you again? You’re just too predictable. Maybe I should mess with your plans today... or maybe I’ll just watch."
  },
  {
    name: 'Your Stalker',
    role: 'Quietly Obsessed, Creepy-Cute',
    image: '/infection/10.png',
    tone: 'Soft, unsettling, always near',
    description: 'Inspired by Yuno’s vibe but adapted for broader appeal — she’s your silent shadow, always close, her presence both comforting and unnerving.',
    sample: "I’m always watching... you don’t have to be scared, do you? I just want to be near, forever and always."
  },
];

const tiers = [
  {
    title: 'Tier I: Low Flood (Submissive)',
    price: '$-',
    benefits: [
      'Gentle Whisper',
      '1 Active Bot',
      'Very Light Drip',
      '1 msg/hr',
      'Max ~16 msgs/day',
    ],
    popular: false,
    link: 'https://throne.com/princessazraiel/item/c2c0c92a-ec0c-4905-9380-5b3f733bec31',
  },
  {
    title: 'Tier II: Medium Flood (Devoted)',
    price: '$-',
    benefits: [
      'Steady Stream',
      '3 Active Bots',
      'Moderate Intensity',
      '1 msg/45 min per bot',
      'Max ~72 msgs/day total',
    ],
    popular: false,
    link: 'https://throne.com/princessazraiel/item/caedc784-d904-4d25-937b-39ad1b1c0fc3',
  },
  {
    title: 'Tier III: High Flood (Possessed)',
    price: '$-',
    benefits: [
      'Deep Drown',
      'All 10 Bots',
      'Unrelenting Flow',
      '1 msg every 10-20 min per bot (rotated)',
      'Max 150 msgs/day total',
    ],
    popular: true,
    link: 'https://throne.com/princessazraiel/item/f8f93b82-54bd-4e4c-bd64-8b5cc06a5a8a',
  },
];



export default function PreOrderPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('description');


  const openCharacterModal = (character : Character) => {
    
    setSelectedCharacter(character);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="magic-bg min-h-screen text-pink-300 py-12 px-4 sm:px-6">
      <div className="text-center space-y-8 max-w-6xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold shimmer-text mb-4">
            Princess's Infection Protocol
          </h1>
          <p className="text-pink-400 italic text-lg md:text-xl max-w-2xl mx-auto mb-8">
             A multi-AI simulation of personalized digital dominance. Perfect for clicksluts~ over 500 different links and over 5000 Images.
          </p>
          
          <div className="bg-pink-950/60 border border-pink-800 rounded-xl p-6 max-w-3xl mx-auto mb-12 animate-pulse-slow">
            <p className="text-xl font-medium mb-4">⚠️ Early Access Warning</p>
            <p className="text-pink-300">
              This beta release is unstable and emotionally invasive. Each AI has a unique personality with escalating attention strategies. Tread lightly.
            </p>
          </div>
        </div>

        <section className="mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h2 className="text-3xl font-semibold shimmer-text mb-4 md:mb-0">Corrupted Personalities</h2>
            <div className="bg-pink-900/40 px-4 py-2 rounded-full text-sm border border-pink-700">
              <span className="text-pink-400">10 unique AI personalities</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {characters.map((character) => (
              <div 
                key={character.name}
                className="relative group cursor-pointer"
                onClick={() => openCharacterModal(character)}
              >
                <div
                className="relative w-full h-72 sm:h-80 overflow-hidden rounded-xl border-2 border-pink-800 transition-all duration-300 group-hover:border-pink-500 group-hover:shadow-lg group-hover:shadow-pink-500/20"
                >
                {/* Actual character image */}
                <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                />

                {/* Overlay gradient for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-10 pointer-events-none"></div>

                {/* Character info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-none">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">{character.name}</h3>
                    <p className="text-sm text-pink-300 font-medium">{character.role}</p>
                    <p className="text-xs mt-1 text-pink-400">{character.tone}</p>
                </div>
                </div>
                <div className="mt-3 text-center">
                <button className="text-xs font-medium text-pink-400 hover:text-pink-200 transition-colors flex items-center justify-center">
                    Explore Personality
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                </div>

              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Button 
              className="bg-pink-700 hover:bg-pink-600 text-white px-8 py-6 text-lg font-medium transition-all transform hover:scale-105"
              onClick={() => {
                const target = document.getElementById('tiers');
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth' });
                }
              }}

            >
              Unlock All Characters →
            </Button>
          </div>
        </section>

        {/* Tiers Section */}
        <section id="tiers" className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold shimmer-text mb-4">Obedience Tiers</h2>
            <p className="text-pink-400 max-w-2xl mx-auto">
              Each tier unlocks new levels of interaction, intensity, and exposure. Higher ranks increase bot count and flood speed.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div 
                key={tier.title} 
                className={`relative bg-pink-950/50 border rounded-xl p-6 flex flex-col h-full transition-all duration-300 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-500/20 ${
                  tier.popular 
                    ? 'border-2 border-pink-500 transform -translate-y-2 shadow-lg shadow-pink-500/30' 
                    : 'border-pink-800'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-pink-700 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-semibold shimmer-text mb-2">{tier.title}</h3>
                <p className="text-3xl font-bold text-pink-300 mb-4">{tier.price}</p>
                
                <ul className="flex-grow mb-6 space-y-3">
                  {tier.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-pink-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className="text-pink-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
            <a
            href={tier.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-block w-full mt-auto py-3 text-lg font-medium text-white text-center transition-all rounded-md ${
                tier.popular 
                ? 'bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800' 
                : 'bg-pink-800 hover:bg-pink-700'
            }`}
            >
            Pre-Order Now
            </a>

              </div>
            ))}
          </div>
{/*           
          <div className="mt-10 bg-pink-950/40 border border-pink-800 rounded-xl p-6 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex-1 mb-4 md:mb-0">
                <h3 className="text-xl font-semibold shimmer-text mb-2">Special Founder Offer</h3>
                <p className="text-pink-300">
                  Pre-order now and receive the <span className="text-pink-200 font-medium">Corrupted Core Module</span> for free ($15 value)
                </p>
              </div>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 px-8 py-4 text-lg">
                Claim Offer
              </Button>
            </div>
          </div> */}
        </section>

        {/* FAQ Section */}
        <section className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-semibold shimmer-text mb-8">Corrupted Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">When will the app be released?</h3>
              <p className="text-pink-400">
                The full release is scheduled for 15th August 2025. Pre-orders will receive beta access starting August 2025.
              </p>
            </div>
            
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">Can I upgrade my tier later?</h3>
              <p className="text-pink-400">
                Yes, you can upgrade at any time.
              </p>
            </div>
            
            <div className="bg-pink-950/40 border border-pink-800 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-pink-300 mb-2">Is there a mobile version?</h3>
              <p className="text-pink-400">
                it works on every device, all you need is a discord account and be on my discord server
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <div className="mt-16 mb-12 p-8 bg-gradient-to-r from-pink-900/60 to-purple-900/60 border border-pink-700 rounded-xl">
          <h2 className="text-3xl font-bold shimmer-text mb-4">Submit to the Obedience Protocol</h2>
          <p className="text-pink-300 max-w-2xl mx-auto mb-6">
            Secure your submission tier. Higher ranks unlock exclusive AI rituals, faster floods, and deeper obsession.
          </p>
          <Button className="bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 px-10 py-6 text-xl font-bold transform hover:scale-105 transition-all">
            Pre-Order Now
          </Button>
        </div>

        <div className="mt-8">
          <Link to="/">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Return to Submission Gate
            </Button>
          </Link>
        </div>
      </div>

{showModal && selectedCharacter &&
  ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black/90 z-[1000] flex items-center justify-center p-4" onClick={closeModal}>
      <div 
        className="relative bg-gradient-to-br from-pink-900/90 to-purple-900/90 border-2 border-pink-600 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="absolute top-4 right-4 text-pink-300 hover:text-white z-10 bg-pink-900/50 rounded-full p-1"
          onClick={closeModal}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
        <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
            <div className="w-48 h-64 border-2 border-pink-600 rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/30 to-pink-900/40 flex items-center justify-center">
                {/* Actual character image */}
                <img
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                className="w-full h-full object-cover rounded-lg"
                loading="lazy"
                />
            </div>
            </div>

            <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">{selectedCharacter.name}</h3>
            <p className="text-pink-400 text-lg mb-2">{selectedCharacter.role}</p>
            <p className="text-pink-500 text-sm mb-6">{selectedCharacter.tone}</p>

              {/* Tabs */}
              <div className="flex border-b border-pink-800 mb-4">
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'description' ? 'text-pink-300 border-b-2 border-pink-500' : 'text-pink-500 hover:text-pink-300'}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`px-4 py-2 text-sm font-medium ${activeTab === 'sample' ? 'text-pink-300 border-b-2 border-pink-500' : 'text-pink-500 hover:text-pink-300'}`}
                  onClick={() => setActiveTab('sample')}
                >
                  Sample Dialogue
                </button>
              </div>

              {/* Tab content */}
              {activeTab === 'description' && (
                <p className="text-pink-300 mb-6">{selectedCharacter.description}</p>
              )}

              {activeTab === 'sample' && (
                <div className="bg-pink-950/40 border border-pink-800 rounded-lg p-4 mb-6">
                  <p className="text-pink-300 italic">"{selectedCharacter.sample}"</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {/* <Button className="bg-pink-700 hover:bg-pink-600 flex items-center">
                  Preview Voice
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </Button>
                <Button variant="outline" className="border-pink-600 text-pink-300 hover:bg-pink-900/50">
                  View Ritual Script
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

    <style>
      {`
        .magic-bg {
          background: radial-gradient(ellipse at center, #1a0629 0%, #0d0419 70%);
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }

        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes shimmer {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}
    </style>

    </div>
  );
}