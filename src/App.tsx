import { Routes, Route } from 'react-router-dom';
import OfferingPage from './pages/OfferingPage';
// import AboutPage from './pages/AboutPage';
// import ProgramsPage from './pages/ProgramsPage';
import Nav from './components/Nav';

export default function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/" element={<OfferingPage />} />
         {/* <Route path="/about" element={<AboutPage />} /> */}
        {/* <Route path="/programs" element={<ProgramsPage />} /> */} 
      </Routes>
    </>
  );
}
