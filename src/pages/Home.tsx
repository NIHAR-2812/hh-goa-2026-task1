import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Info, Volume2, VolumeX } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-goa-green">
      
      {/* Background Environment */}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(max-aspect-ratio: 3/4)" srcSet="/assets/chatgpt_mobile.png?v=2" />
        <img 
          src="/assets/homepage_wide.jpg" 
          alt="Hacker House Goa 2026 Village" 
          className="w-full h-full object-cover object-center"
        />
      </picture>

      {/* Floating Particles Animation */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Simple particle effect could go here */}
      </div>

      {/* Hotspots Container - Positions relative to the full screen */}
      <div className="absolute inset-0 w-full h-full z-10">
        
        {/* Left Shop - Frame Your Moment */}
        <div 
          className="absolute left-[13%] top-[56%] w-[32%] h-[12%] md:left-[31.5%] md:top-[51%] md:w-[15%] md:h-[15%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          onClick={() => navigate('/frame')}
          title="Frame Your Moment"
        >
          {/* Subtle glow and Centered ENTER Text */}
          <div className="w-full h-full rounded-sm bg-black/2 group-hover:bg-black/2 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white/90 group-hover:text-white font-black text-xl md:text-3xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-110">
              ENTER
            </span>
          </div>
        </div>

        {/* Right Shop - Builder ID Lab */}
        <div 
          className="absolute left-[83%] top-[58%] w-[32%] h-[12%] md:left-[66%] md:top-[53%] md:w-[15%] md:h-[15%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          onClick={() => navigate('/id-card')}
          title="Builder ID Lab"
        >
          {/* Subtle glow and Centered ENTER Text */}
          <div className="w-full h-full rounded-sm bg-black/2 group-hover:bg-black/2 transition-colors duration-300 flex items-center justify-center">
            <span className="text-white/90 group-hover:text-white font-black text-xl md:text-3xl tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-110">
              ENTER
            </span>
          </div>
        </div>

      </div>

      {/* Minimal Navigation Overlay */}
      <nav className="absolute top-6 left-0 right-0 px-6 flex justify-between items-start z-40 pointer-events-none">
        <div className="pointer-events-auto">
          {/* Logo / Title Area (invisible/subtle if baked into image) */}
        </div>
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          <button 
            onClick={() => setShowHowItWorks(true)}
            className="flex items-center gap-2 bg-black/30 hover:bg-black/50 text-white/90 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 transition-all text-sm font-medium"
          >
            <Info size={16} />
            How It Works
          </button>
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center justify-center w-10 h-10 bg-black/30 hover:bg-black/50 text-white/90 backdrop-blur-md rounded-full border border-white/10 transition-all"
            aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </nav>

      {/* How It Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowHowItWorks(false)}
          >
            <motion.div 
              initial={{ y: 20, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f4eee0] w-full max-w-2xl rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-[#335c43] relative overflow-hidden text-[#113424]"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#ef7b6c]" />
              
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">How It Works</h2>
                <button 
                  onClick={() => setShowHowItWorks(false)}
                  className="p-2 bg-[#113424]/10 hover:bg-[#113424]/20 rounded-full transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#ef7b6c] flex items-center gap-2">
                    <span className="bg-[#ef7b6c] text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                    Frame Your Moment
                  </h3>
                  <ul className="space-y-3 font-medium opacity-80">
                    <li className="flex gap-2"><span>•</span> Upload or take a photo</li>
                    <li className="flex gap-2"><span>•</span> Pick your HH Goa frame</li>
                    <li className="flex gap-2"><span>•</span> Adjust the photo</li>
                    <li className="flex gap-2"><span>•</span> Download & share to X</li>
                  </ul>
                  <button 
                    onClick={() => navigate('/frame')}
                    className="mt-6 w-full py-3 bg-[#113424] text-[#f4eee0] rounded-xl font-bold hover:bg-[#335c43] transition-colors"
                  >
                    Go to Frame Shop
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-[#f5b942] flex items-center gap-2">
                    <span className="bg-[#f5b942] text-[#113424] w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                    Builder ID
                  </h3>
                  <ul className="space-y-3 font-medium opacity-80">
                    <li className="flex gap-2"><span>•</span> Upload or take a photo</li>
                    <li className="flex gap-2"><span>•</span> Add your builder details</li>
                    <li className="flex gap-2"><span>•</span> Get your builder title</li>
                    <li className="flex gap-2"><span>•</span> Download & share to X</li>
                  </ul>
                  <button 
                    onClick={() => navigate('/id-card')}
                    className="mt-6 w-full py-3 bg-[#f5b942] text-[#113424] rounded-xl font-bold hover:brightness-110 transition-all"
                  >
                    Go to ID Lab
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}