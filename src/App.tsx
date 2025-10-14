import { Routes, Route } from 'react-router-dom';
// import OfferingPage from './pages/OfferingPage';
import SecretButtonsPage from  './pages/SecretButtons'
import CorruptionRainPage from './pages/CorruptionRainPage';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ProgrammsPage from './pages/ProgrammsPage';
import Nav from './components/Nav';
import PreOrderPage from './pages/NewProgram';
import { Analytics } from "@vercel/analytics/next"
import RiskyLinkPage from './pages/Bambam';
import YanderePage from './pages/YanderePage';
import CorruptionPage from './pages/CorruptionPage';
import LoveProtocol from './pages/LoveProtocol';
import TrickOrTreatPage from './pages/TrickOrTreatPage';
import PersonalityPage from './pages/PersonalityPage';




export default function App() {
  return (
    <>
      
      <Nav />
      <Analytics />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/corruption" element={<CorruptionRainPage />} />
        <Route path="/corruption2" element={<CorruptionPage />} />
        <Route path="/links" element={<SecretButtonsPage />} />
         <Route path="/about" element={<AboutPage />} />
        <Route path="/programms" element={<ProgrammsPage />} />
        <Route path="/pre-order" element={<PreOrderPage />} />
        <Route path="/infection-protocol" element={<PreOrderPage />} />
        <Route path="/love-protocol" element={<LoveProtocol />} />
        <Route path="/bam" element={<RiskyLinkPage />} />
        <Route path="/yandere" element={<YanderePage />} />
        <Route path="/trick-or-treat" element={<TrickOrTreatPage />} />
        <Route path="/personality/:slug" element={<PersonalityPage />} />
        <Route path="/verification" element={<iframe src="https://premium.chat/verify/1731002" style={{width: '100%', height: '100vh', border: 'none'}} />} />
      </Routes>
      <Analytics/>
    </>
  );
}
