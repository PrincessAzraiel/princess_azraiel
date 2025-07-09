import { Routes, Route } from 'react-router-dom';
// import OfferingPage from './pages/OfferingPage';
import SecretButtonsPage from  './pages/SecretButtons'
import CorruptionRainPage from './pages/CorruptionRainPage';
import LandingPage from './pages/LandingPage';
// import AboutPage from './pages/AboutPage';
import ProgrammsPage from './pages/ProgrammsPage';
import Nav from './components/Nav';
import { Analytics } from "@vercel/analytics/next"



export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/corruption" element={<CorruptionRainPage />} />
        <Route path="/links" element={<SecretButtonsPage />} />
         {/* <Route path="/about" element={<AboutPage />} /> */}
        <Route path="/programms" element={<ProgrammsPage />} />
      </Routes>
      <Analytics/>
    </>
  );
}
