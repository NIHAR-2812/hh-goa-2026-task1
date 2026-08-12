import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import FrameGenerator from './pages/FrameGenerator';
import BuilderId from './pages/BuilderId';

function App() {
  return (
    <div className="min-h-screen bg-goa-green">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/frame" element={<FrameGenerator />} />
        <Route path="/id-card" element={<BuilderId />} />
      </Routes>
    </div>
  );
}

export default App;
