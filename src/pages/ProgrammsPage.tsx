import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ProgrammsPage() {
  const programms = [
    {
      title: 'Obedience Program',
      description: 'A 10-minute obedience trial. Follow commands, earn your place.',
      link: 'https://gofile.io/d/2uZY0d',
    },
    {
      title: 'SweetDrain',
      description: 'A long edgeware session. Push your limits, embrace the void.',
      link: 'https://gofile.io/d/ndMdxH',
    },
    {
      title: 'Love Protocol (Beta)',
      description: 'A 2-minute love trial. Experience the thrill of devotion.',
      link: 'https://gofile.io/d/qsbdzs',
    },
    {
      title: 'Her.exe ACT 01',
      description: 'A 3-minute interactive experience. Enter the world of Princess Azraiel.',
      link: 'https://gofile.io/d/yhQrNt',
    },
    {
      title: 'Corruption',
      description: 'Ready to corrupt yourself? Enter the realm of Princess Azraiel.',
      link: '/corruption',
    },
    {
      title: 'Drone extension',
      description: 'A browser extension that allows you to submit your devotion to ME',
      link: 'https://gofile.io/d/xW6gGR',
    },
  ];

  return (
    <div className="magic-bg min-h-screen w-full flex items-center justify-center text-pink-300">
      <div className="text-center space-y-10 max-w-3xl px-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-bold shimmer-text">Available Rituals</h1>
        <p className="text-pink-400 italic text-lg">Choose your poison, pet.</p>
        <p className="text-pink-400 italic text-sm">make sure to read the README files!! 
            all these programms don't need money or internet to run, but they do require you to have a brain and read the instructions.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {programms.map(({ title, description, link }) => (
            <div
              key={title}
              className="bg-pink-950/40 border border-pink-800 rounded-2xl p-6 shadow-lg hover:shadow-pink-700/40 transition"
            >
              <h2 className="text-2xl font-semibold mb-2 shimmer-text">{title}</h2>
              <p className="mb-4 text-pink-400">{description}</p>
              //all links should open in new tap, except the "/corrupt"
              
              <Link to={link}>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-lg py-3">
                  Enter
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Link to="/">
            <Button variant="ghost" className="text-pink-400 hover:text-pink-200">
              ← Return to Submission Gate
            </Button>
          </Link>
        </div>
      </div>

      <style>{`
        .shimmer-text {
          background: linear-gradient(90deg, #ff69eb, #ffffff, #ff69eb);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s infinite;
        }
      `}</style>
    </div>
  );
}
