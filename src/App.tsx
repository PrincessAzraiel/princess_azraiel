import { Routes, Route } from 'react-router-dom';
// import OfferingPage from './pages/OfferingPage';
import SecretButtonsPage from  './pages/SecretButtons'
import CorruptionRainPage from './pages/CorruptionRainPage';
// import AboutPage from './pages/AboutPage';
// import ProgramsPage from './pages/ProgramsPage';
import Nav from './components/Nav';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<SecretButtonsPage />} />
        <Route path="/corruption" element={<CorruptionRainPage />} />
         {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/programs" element={<ProgramsPage />} /> */} 
      </Routes>
    </>
  );
}
