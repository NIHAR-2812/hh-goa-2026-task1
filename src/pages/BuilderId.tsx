import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { ArrowLeft, Download, Share2, RefreshCw, Shuffle } from 'lucide-react';
import UploadPhoto from '../components/UploadPhoto';
import { generateTitle } from '../utils/titleGenerator';

// --- TITLE DATABASE & LOGIC ---
const ROLE_OPTIONS = [
  'Frontend / UI', 'Backend / Systems', 'Full Stack', 'AI / ML', 'Data',
  'Blockchain / Web3', 'Cloud / DevOps', 'UI/UX / Design', 'Product',
  'Growth / Marketing', 'Founder / Builder', 'Other / Ideas'
];

const SINGLE_TITLES: Record<string, string[]> = {
  'Frontend / UI': ["Pixel Sorcerer", "UI Alchemist", "Interface Architect", "Pixel Poet", "Design Tinkerer", "Visual Virtuoso", "Screen Sorcerer", "CSS Conjurer", "Interface Illusionist", "Frontend Magician", "Pixel Wizard", "Web Stylist", "UX Whisperer", "Interaction Alchemist", "Browser Bard", "Visual Code Crafter", "Digital Stylist", "Component Crafter", "Interface Ninja", "Pixel Perfectionist", "Web Alchemist", "UI Wizard", "Experience Crafter", "Frontend Forger", "Screen Sculptor"],
  'Backend / Systems': ["Logic Alchemist", "Server Sorcerer", "API Wizard", "Backend Blacksmith", "Logic Architect", "Data Dungeon Master", "Server Whisperer", "API Alchemist", "Code Blacksmith", "Backend Wizard", "System Sorcerer", "Database Whisperer", "Request Ranger", "Server Sage", "Infrastructure Tinkerer", "Logic Crafter", "Backend Bard", "API Architect", "System Smith", "Code Mechanic", "Server Shaman", "Protocol Wizard", "Data Forger", "Backend Beast", "Logic Wizard"],
  'Full Stack': ["Code Polymath", "Full Stack Sorcerer", "Stack Alchemist", "Code Architect", "Digital Swiss Army Knife", "Stack Wizard", "Full Stack Wizard", "End-to-End Alchemist", "Code Multitasker", "Web Worldbuilder", "Stack Samurai", "Software Shapeshifter", "Digital Architect", "Full Stack Magician", "Code Generalist", "Stack Crafter", "Application Alchemist", "Code All-Rounder", "Web Alchemist", "Full Stack Forger", "Software Sorcerer", "Stack Whisperer", "Digital Builder", "Code Nomad", "The Stack Master"],
  'AI / ML': ["AI Alchemist", "Intelligence Architect", "Machine Whisperer", "Neural Sorcerer", "AI Wizard", "Intelligence Crafter", "Prompt Sorcerer", "Digital Oracle", "Neural Navigator", "AI Magician", "Model Whisperer", "Neural Alchemist", "Algorithm Oracle", "AI Architect", "Synthetic Sage", "Brain Builder", "Neural Ninja", "Intelligence Smith", "AI Dreamweaver", "Machine Mind", "Digital Brainiac", "Neural Crafter", "AI Conjurer", "Pattern Whisperer", "Model Alchemist", "Data Sorcerer", "Prediction Prophet", "Algorithm Alchemist", "Model Magician", "Pattern Hunter"],
  'Data': ["Data Detective", "Data Oracle", "Insight Alchemist", "Pattern Hunter", "Number Ninja", "Data Whisperer", "Insight Architect", "Data Diviner", "Trend Hunter", "Analytics Alchemist", "Insight Wizard", "Number Sorcerer", "Pattern Prophet", "Data Storyteller", "Statistical Sage", "Insight Miner", "Data Decoder", "Trend Tactician", "Data Sherlock", "Analytics Wizard"],
  'Blockchain / Web3': ["Chain Alchemist", "Block Wizard", "Protocol Sorcerer", "Ledger Whisperer", "On-Chain Architect", "Crypto Alchemist", "Smart Contract Smith", "Chain Systems Sorcerer", "Protocol Wizard", "Blocksmith", "Web3 Wizard", "Decentralized Dreamer", "Chain Architect", "Consensus Sorcerer", "Ledger Alchemist", "Token Tinkerer", "Protocol Pathfinder", "Crypto Crafter", "On-Chain Oracle", "Block Builder"],
  'Cloud / DevOps': ["Cloud Alchemist", "Sky Architect", "Cloud Sorcerer", "Infrastructure Wizard", "Sky Whisperer", "Cloud Navigator", "Infrastructure Alchemist", "Cloud Crafter", "Cloud Conjurer", "Infrastructure Sage", "Cloud Wizard", "Sky Smith", "Deployment Wizard", "Pipeline Sorcerer", "Automation Alchemist", "CI/CD Conjurer", "Infrastructure Whisperer", "Release Wizard", "Deployment Alchemist", "Automation Architect"],
  'UI/UX / Design': ["Pixel Poet", "Experience Alchemist", "Visual Storyteller", "Interface Artist", "User Whisperer", "Experience Architect", "Design Sorcerer", "Pixel Sculptor", "Interaction Alchemist", "Visual Alchemist", "Interface Poet", "Experience Crafter", "Design Dreamer", "UX Whisperer", "Human Interface Hacker", "Pixel Philosopher", "Visual Architect", "Design Tinkerer", "Experience Wizard", "Interface Sculptor"],
  'Product': ["Product Alchemist", "Idea Conductor", "Vision Architect", "Product Whisperer", "Roadmap Ranger", "Feature Shepherd", "Chaos Coordinator", "Idea Navigator", "Product Sorcerer", "Vision Crafter", "Problem Hunter", "Product Pathfinder", "Feature Alchemist", "Strategy Wizard", "Product Storyteller"],
  'Growth / Marketing': ["Growth Hacker", "Attention Alchemist", "Community Catalyst", "Story Sorcerer", "Brand Alchemist", "Audience Architect", "Growth Wizard", "Community Whisperer", "Marketing Magician", "Narrative Ninja", "Engagement Alchemist", "Culture Crafter", "Brand Bard", "Growth Navigator", "Story Architect"],
  'Founder / Builder': ["Idea Alchemist", "Visionary Builder", "Startup Sorcerer", "Product Dreamer", "Innovation Alchemist", "Idea Architect", "Future Builder", "Problem Slayer", "Build Wizard", "Digital Dreamer", "Innovation Wizard", "Prototype Pirate", "Tech Tinkerer", "Solution Sorcerer", "Product Pirate", "Build Beast", "Ship Captain", "Hacksmith", "Code Crafter", "Digital Explorer"],
  'Other / Ideas': ["Innovation Alchemist", "Idea Architect", "Problem Solver", "Future Builder", "Digital Explorer", "Tech Tinkerer", "Solution Sorcerer", "Creative Technologist", "Prototype Wizard", "Idea Crafter", "Innovation Wizard", "Digital Dreamer", "Future Shaper", "Concept Alchemist", "Possibility Architect"]
};

const HYBRID_TITLES: Record<string, string[]> = {
  'AI / ML|Frontend / UI': ["Neural Pixelist", "AI Interface Alchemist", "Intelligent UI Wizard", "Pixel Intelligence Architect", "Neural Interface Crafter", "AI Experience Sorcerer", "Smart UI Alchemist", "Neural UX Wizard", "Intelligent Interface Architect"],
  'AI / ML|Backend / Systems': ["AI Systems Alchemist", "Neural Backend Wizard", "Intelligence Infrastructure Architect", "AI Server Sorcerer", "Model API Magician", "Backend Brain Builder", "Intelligent Systems Smith"],
  'Backend / Systems|Frontend / UI': ["Stack Alchemist", "Code Architect", "Interface & Logic Wizard", "Web Worldbuilder", "Full Stack Sorcerer", "Digital Architect", "End-to-End Alchemist", "Front-to-Back Forger", "Stack Shapeshifter", "Web Alchemist"],
  'AI / ML|Backend / Systems|Frontend / UI': ["Digital Intelligence Architect", "Full Stack AI Alchemist", "Neural Stack Wizard", "Intelligent Web Worldbuilder", "AI Application Sorcerer", "Full Stack Brain Builder", "Neural Systems Crafter"],
  'AI / ML|Data': ["Pattern Alchemist", "Data Intelligence Wizard", "Insight & Prediction Oracle", "Model Miner", "Data Pattern Whisperer", "Predictive Data Architect", "Algorithmic Insight Alchemist"],
  'Backend / Systems|Cloud / DevOps': ["Infrastructure Alchemist", "Cloud Systems Sorcerer", "Server Skywalker", "Cloud Backend Wizard", "Distributed Systems Smith", "Infrastructure Architect"],
  'AI / ML|Cloud / DevOps': ["Cloud Intelligence Architect", "AI Infrastructure Alchemist", "Neural Cloud Wizard", "Machine Skywalker", "AI Cloud Sorcerer", "Intelligence Infrastructure Smith"],
  'AI / ML|Blockchain / Web3': ["Chain Intelligence Alchemist", "Neural Protocol Wizard", "AI Chain Architect", "Intelligent Ledger Smith", "Crypto Intelligence Sorcerer", "Neural Block Builder"],
  'Backend / Systems|Blockchain / Web3': ["Protocol Alchemist", "Smart Contract Smith", "Chain Systems Sorcerer", "Backend Protocol Wizard", "Ledger Systems Architect", "On-Chain Systems Crafter"],
  'Blockchain / Web3|Data': ["Data Chain Alchemist", "Ledger Oracle", "On-Chain Data Wizard", "Blockchain Data Architect", "Protocol Data Sorcerer"],
  'Product|UI/UX / Design': ["Experience Architect", "Idea Alchemist", "Product Storyteller", "Vision Crafter", "Experience Sorcerer", "Design Strategist"]
};

const UNIVERSAL_TITLES = [
  "Code Alchemist", "Build Wizard", "Digital Nomad", "Problem Slayer", "Ship Captain", "Idea Hacker", 
  "Innovation Alchemist", "Tech Tinkerer", "Digital Dreamer", "Future Builder", "Solution Sorcerer", 
  "Build Beast", "Ship Shaman", "Chaos Engineer", "Prototype Pirate", "Feature Forger", "Hacksmith", 
  "Stack Shapeshifter", "Logic Wizard", "Tech Blacksmith", "Digital Explorer", "Builder Bard", 
  "Code Conjurer", "Tech Pathfinder", "Product Pirate", "Innovation Wizard", "Code Crafter", 
  "Digital Builder", "Future Shaper", "Idea Architect"
];

function getRandomTitle(roles: string[], currentTitle?: string): string {
  let pool = UNIVERSAL_TITLES;

  if (roles.length > 0) {
    const sortedKey = [...roles].sort().join('|');
    if (HYBRID_TITLES[sortedKey]) {
      pool = HYBRID_TITLES[sortedKey];
    } else {
      pool = SINGLE_TITLES[roles[0]] || UNIVERSAL_TITLES;
    }
  }

  const available = pool.filter(t => t !== currentTitle);
  const finalPool = available.length > 0 ? available : pool;
  
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}


// --- COMPONENT ---
export default function BuilderId() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [xHandle, setXHandle] = useState('');
  const [teamName, setTeamName] = useState('');
  const [title, setTitle] = useState('Goa Builder');
  
  // Gesture Adjustment States
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const pinchStartDist = useRef(0);
  const initialScale = useRef(1);

  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShuffleTitle = useCallback(() => {
    setTitle(getRandomTitle(selectedRoles, title));
  }, [selectedRoles, title]);

  useEffect(() => {
    setTitle(getRandomTitle(selectedRoles));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoles.join('|')]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role) 
        : [...prev, role].slice(0, 3)
    );
  };

  // --- Photo Handlers ---
  const handlePhotoSelect = (newPhoto: string | null) => {
    setPhoto(newPhoto);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // --- Gesture Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      // Pinch-to-zoom on laptop touchpad
      const zoomSensitivity = 0.01;
      const newScale = Math.max(0.5, Math.min(scale - e.deltaY * zoomSensitivity, 4));
      setScale(newScale);
    } else {
      // Two-finger swipe to pan on laptop touchpad
      setPosition(prev => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY
      }));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDist.current = dist;
      initialScale.current = scale;
    } else if (e.touches.length === 1) {
      isDragging.current = true;
      dragStart.current = { x: e.touches[0].clientX - position.x, y: e.touches[0].clientY - position.y };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist / pinchStartDist.current;
      setScale(Math.max(0.5, Math.min(initialScale.current * delta, 4)));
    } else if (e.touches.length === 1 && isDragging.current) {
      setPosition({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y
      });
    }
  };

  // --- Export Logic ---
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 6 });
      const link = document.createElement('a');
      link.download = 'HH-Goa-Builder-ID.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate your ID. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true, pixelRatio: 6 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'HH-Goa-Builder-ID.png', { type: 'image/png' });
      const text = `Just got my HH Goa 2026 Builder ID 🌴⚡\n\nI'm a ${title}.\n\nSee you in Goa.\n\n#FrameInGoa #HHGoa2026`;

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          text,
          files: [file],
        });
      } else {
        handleDownload();
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + '\n\n(Attach your downloaded ID card!)')}`;
        window.open(intentUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to share', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const displayRoles = selectedRoles.length > 0 
    ? selectedRoles.map(r => r.split('/')[0].trim()).join(', ') 
    : 'BUILDER';

  return (
    <div className="relative w-full h-screen bg-goa-green overflow-hidden">
      <picture className="absolute inset-0 w-full h-full fixed">
        <source media="(max-aspect-ratio: 3/4)" srcSet="/assets/id_bg_mobile.jpg" />
        <img 
          src="/assets/id_bg.png" 
          alt="ID Lab Background" 
          className="w-full h-full object-cover object-center blur-[1px]"
        />
      </picture>

      <div className="relative z-10 w-full h-screen p-4 md:p-8 flex flex-col">
        <header className="w-full mb-6 flex-shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md rounded-full transition-colors border border-white/20"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center py-2 px-4 overflow-hidden">
          
          <div className="w-full bg-[#f8f5ec] p-4 md:p-6 rounded-[1.2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col text-[#1a1a1a] max-h-full overflow-y-auto scrollbar-thin scrollbar-thumb-black/20 scrollbar-track-transparent">
            
            <div className="text-center w-full mb-4 flex-shrink-0">
              <h1 className="font-hero text-xl md:text-2xl font-black mb-0.5 tracking-wide uppercase">
                Builder ID Lab
              </h1>
              <p className="text-xs font-semibold opacity-70">Build your identity.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
              
              {/* LEFT: Form */}
              <div className="flex flex-col gap-3 order-2 md:order-1">
                
                <div className="mb-1">
                  <label className="font-mono block text-[10px] font-bold text-black/70 mb-1 uppercase tracking-widest">Photo</label>
                  {!photo ? (
                    <div className="w-full sm:max-w-[220px] flex flex-col gap-2">
                      <UploadPhoto onPhotoSelect={handlePhotoSelect} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 w-full sm:max-w-[220px]">
                      <button 
                        onClick={() => handlePhotoSelect(null)} 
                        className="font-mono text-[10px] font-bold text-black/60 hover:text-black uppercase tracking-widest border-2 border-black/10 py-2 rounded-lg bg-white/50 hover:bg-black/5 transition-colors flex items-center justify-center gap-2 w-full"
                      >
                        <RefreshCw size={14} /> Replace Photo
                      </button>
                      <p className="font-mono text-[8px] text-center text-black/50 tracking-widest uppercase mt-1">
                        Drag & Pinch photo to adjust
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-mono block text-[10px] font-bold text-black/70 mb-0.5 uppercase tracking-widest">Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Nupoor Mahajan"
                    maxLength={35}
                    className="w-full bg-white border border-black/10 rounded-lg px-3 py-1.5 text-black placeholder:text-black/30 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-end mb-1">
                    <label className="font-mono block text-[10px] font-bold text-black/70 uppercase tracking-widest">Roles (Select up to 3)</label>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-[72px] overflow-y-auto scrollbar-hide bg-black/5 p-2 rounded-lg border border-black/10">
                    {ROLE_OPTIONS.map(role => (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border transition-all ${
                          selectedRoles.includes(role) 
                            ? 'bg-[#113424] text-white border-[#113424] shadow-sm' 
                            : 'bg-white/60 text-black/60 border-black/10 hover:border-black/30 hover:bg-white'
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-mono block text-[10px] font-bold text-black/70 mb-0.5 uppercase tracking-widest">X Handle (optional)</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-black/40 text-xs">@</span>
                    <input 
                      type="text" 
                      value={xHandle} 
                      onChange={(e) => setXHandle(e.target.value.replace('@', ''))} 
                      placeholder="username"
                      maxLength={15}
                      className="w-full bg-white border border-black/10 rounded-lg pl-7 pr-3 py-1.5 text-black placeholder:text-black/30 focus:outline-none focus:border-black text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono block text-[10px] font-bold text-black/70 mb-0.5 uppercase tracking-widest">Team Name (optional)</label>
                  <input 
                    type="text" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)} 
                    placeholder="e.g. Pixel Pioneers"
                    maxLength={35}
                    className="w-full bg-white border border-black/10 rounded-lg px-3 py-1.5 text-black placeholder:text-black/30 focus:outline-none focus:border-black text-xs"
                  />
                </div>

                <button
                  onClick={handleShuffleTitle}
                  className="font-mono w-full py-1.5 bg-black/5 text-black font-bold text-[10px] rounded-lg hover:bg-black/10 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest mt-1"
                >
                  <Shuffle size={12} /> Shuffle Title
                </button>
              </div>

              {/* RIGHT: Live Preview & Actions */}
              <div className="flex flex-col items-center justify-center order-1 md:order-2 w-full sticky top-0">
                <div className="w-full flex flex-col items-center mb-3">
                  <div 
                    ref={cardRef} 
                    className="relative w-full max-w-[210px] rounded-xl overflow-hidden shadow-inner bg-[#f4eee0] border border-black/10"
                  >
                    {/* Reference ID Template */}
                    <img 
                      src="/assets/new_id.png" 
                      alt="ID Template" 
                      className="w-full h-auto block z-0 pointer-events-none"
                    />

                    {/* Overlaid Data */}
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-start py-[10%] px-[10%]">
                      {/* Avatar Area with Native Gestures */}
                      <div 
                        className="w-[56%] flex-shrink-0 aspect-square rounded-full overflow-hidden border-[3px] border-[#f5b942] shadow-md bg-[#113424] mt-[54%] relative cursor-move touch-none"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onWheel={handleWheel}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleMouseUp}
                      >
                        {photo && (
                          <img 
                            src={photo} 
                            className="absolute inset-0 w-full h-full object-cover origin-center pointer-events-none" 
                            alt="Profile" 
                            style={{
                              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                            }}
                          />
                        )}
                      </div>

                      {/* Text Details Area */}
                      <div className="w-full text-center flex flex-col items-center flex-1 mt-0.5 relative pointer-events-none">
                        
                        <h2 className={`font-hero text-white uppercase tracking-wider mb-0.3 origin-center drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,1)] w-[98%] text-center leading-[1.1] break-words ${
                          name.length > 20 ? 'text-[11px]' : name.length > 13 ? 'text-[13px]' : 'text-[16px]'
                        }`}>
                          {name || 'YOUR NAME'}
                        </h2>
                        
                        <div className={`font-secondary font-semibold text-[#F5B942] px-2 py-0.5 rounded-full uppercase tracking-widest mb-auto drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,1)] max-w-[95%] text-center leading-[1.1] ${
                          title.length > 20 ? 'text-[9px]' : title.length > 14 ? 'text-[11px]' : 'text-[13px]'
                        }`}>
                          {title}
                        </div>

                        {/* Divider Layout: Roles | X Handle */}
                        <div className="flex w-full items-center justify-center gap-2 mt-0.5 mb-3.5">
                          <p className="font-mono font-bold text-[#FFFFFF] text-[9px] uppercase tracking-wider leading-[1.2] flex-1 text-right break-words whitespace-normal">
                            {displayRoles}
                          </p>
                          <div className="w-px min-h-[12px] h-full bg-black/50 self-stretch"></div>
                          <p className="font-body text-[#FFFFFF] font-bold text-[8px] flex-1 text-left truncate">
                            {xHandle ? `@${xHandle}` : 'X HANDLE'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Team Name / #FRAMEINGOA - Absolute positioned to bottom center */}
                      <p className={`absolute bottom-[3.7%] left-1/2 -translate-x-1/2 font-secondary text-[#F5B942]/100 font-bold tracking-widest drop-shadow-[0_2px_1.5px_rgba(0,0,0,1)] w-[95%] text-center leading-[1.2] break-words whitespace-normal pointer-events-none ${
                        (teamName || '#FRAMEINGOA').length > 20 ? 'text-[7px]' : (teamName || '#FRAMEINGOA').length > 14 ? 'text-[8px]' : 'text-[9px]'
                      }`}>
                        {teamName ? teamName.toUpperCase() : 'TEAM NAME'}
                      </p>

                    </div>
                  </div>
                </div>

                {/* Actions below preview */}
                <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[210px]">
                  <button
                    onClick={handleShare}
                    disabled={isGenerating || !photo || !name}
                    className="font-mono flex flex-1 items-center justify-center gap-2 py-2 bg-black text-white font-bold text-[10px] rounded-lg hover:bg-black/80 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    <Share2 size={12} /> Share to X
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating || !photo || !name}
                    className="font-mono flex flex-1 items-center justify-center gap-2 py-2 bg-transparent text-black border-2 border-black font-bold text-[10px] rounded-lg hover:bg-black/5 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}