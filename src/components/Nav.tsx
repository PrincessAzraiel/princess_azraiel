import { Link } from 'react-router-dom';

export default function Nav() {
  return (
    <nav className="fixed top-6 left-6 bg-black/70 text-pink-300 px-6 py-3 rounded-2xl shadow-lg z-50 space-x-4 font-medium text-lg backdrop-blur">
      <Link to="/" className="hover:text-pink-400">Offer</Link>
      <Link to="/about" className="hover:text-pink-400">About</Link>
      <Link to="/programs" className="hover:text-pink-400">Programs</Link>
    </nav>
  );
}