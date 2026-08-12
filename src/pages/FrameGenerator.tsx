import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { ArrowLeft, Download, Share2, RefreshCw } from 'lucide-react';
import UploadPhoto from '../components/UploadPhoto';
import PhotoEditor from '../components/PhotoEditor';

const FRAMES = [
  { id: '1', src: '/assets/frame1.png', name: 'Frame 01' },
  { id: '2', src: '/assets/frame2.png', name: 'Frame 02' },
  { id: '3', src: '/assets/frame3.png', name: 'Frame 03' },
];

const FILTERS = ['Original', 'Goa Warm', 'Sunset', 'Tropical', 'Vintage'];

export default function FrameGenerator() {
  const navigate = useNavigate();
  const [photo, setPhoto] = useState<string | null>(null);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0]);
  const [filter, setFilter] = useState('Original');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const frameRef = useRef<HTMLDivElement>(null);

  const getFilterStyle = (f: string) => {
    switch(f) {
      case 'Goa Warm': return { filter: 'sepia(30%) contrast(110%) saturate(120%)' };
      case 'Sunset': return { filter: 'brightness(110%) sepia(40%) hue-rotate(-10deg) saturate(150%)' };
      case 'Tropical': return { filter: 'saturate(150%) contrast(110%) brightness(105%) hue-rotate(10deg)' };
      case 'Vintage': return { filter: 'sepia(50%) contrast(90%) brightness(90%)' };
      default: return {};
    }
  };

  const waitForFrameReady = async () => {
    if (!frameRef.current) return;
    if (document.fonts) {
      await document.fonts.ready;
    }
    const images = Array.from(frameRef.current.querySelectorAll('img'));
    await Promise.all(
      images.map((img) => {
        if (img.complete && img.naturalWidth !== 0) return Promise.resolve();
        return new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      })
    );
  };

  const handleDownload = useCallback(async () => {
    if (!frameRef.current) return;
    setIsGenerating(true);
    try {
      await waitForFrameReady();
      const dataUrl = await htmlToImage.toPng(frameRef.current, { cacheBust: true, pixelRatio: 4 });
      const link = document.createElement('a');
      link.download = 'HH-Goa-Frame.png';
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
      alert('Failed to generate your frame. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleShare = useCallback(async () => {
    if (!frameRef.current) return;
    setIsGenerating(true);
    try {
      await waitForFrameReady();
      const dataUrl = await htmlToImage.toPng(frameRef.current, { cacheBust: true, pixelRatio: 4 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'HH-Goa-Frame.png', { type: 'image/png' });
      const text = "Just framed my moment in Goa 🌴💻\nHH Goa 2026\n#FrameInGoa";

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          text,
          files: [file],
        });
      } else {
        // Fallback for desktop: download and open intent
        handleDownload();
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + '\n\nYour image is ready — attach it to your post!')}`;
        window.open(intentUrl, '_blank');
      }
    } catch (err) {
      console.error('Failed to share', err);
    } finally {
      setIsGenerating(false);
    }
  }, [handleDownload]);

  return (
    <div className="relative w-full min-h-screen bg-goa-green flex flex-col">
      <picture className="fixed inset-0 w-full h-full pointer-events-none z-0">
        <source media="(max-aspect-ratio: 3/4)" srcSet="/assets/frame_bg_mobile.jpg" />
        <img 
          src="/assets/frame_bg.png" 
          alt="Frame Background" 
          className="w-full h-full object-cover object-center blur-[1px]"
        />
      </picture>

      <div className="relative z-10 w-full min-h-screen p-4 md:p-8 flex flex-col justify-between">
        <header className="w-full mb-4 md:mb-6 flex-shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-10 h-10 bg-black/40 hover:bg-black/60 text-white backdrop-blur-md rounded-full transition-colors border border-white/20"
            title="Back to Home"
          >
            <ArrowLeft size={20} />
          </button>
        </header>

        <main className="flex-1 w-full max-w-3xl mx-auto flex flex-col items-center justify-center my-auto py-4">
          
          <div className="w-full bg-[#f8f5ec] p-6 md:p-8 rounded-[1.2rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col text-[#1a1a1a]">
            
            {/* Header */}
            <div className="text-center w-full mb-8">
              <h1 className="font-hero text-2xl md:text-3xl font-black mb-1 tracking-wide uppercase">
                Frame Your Moment
              </h1>
              <p className="text-sm font-semibold opacity-70">Choose a frame. Make it yours.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-start">
              
              {/* LEFT COLUMN: Controls */}
              <div className="flex flex-col gap-8 order-2 md:order-1">
                
                {/* Frame Selection */}
                <div className="w-full">
                  <h3 className="font-mono font-bold text-center md:text-left text-sm mb-3 tracking-widest uppercase">Choose Your Frame</h3>
                  <div className="flex justify-center md:justify-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {FRAMES.map((f) => (
                      <div key={f.id} className="flex flex-col items-center gap-1 min-w-[50px]">
                        <button
                          onClick={() => setSelectedFrame(f)}
                          className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                            selectedFrame.id === f.id ? 'border-black scale-110' : 'border-black/20 hover:border-black/50'
                          }`}
                        >
                          {/* Show the uploaded photo underneath the frame in the thumbnail */}
                          {photo && (
                            <img 
                              src={photo} 
                              alt="" 
                              className="absolute inset-0 w-full h-full object-cover z-0" 
                              style={getFilterStyle(filter)} 
                            />
                          )}
                          <img src={f.src} alt={f.name} className="relative z-10 w-full h-full object-cover" />
                        </button>
                        <span className="font-mono text-[10px] font-bold opacity-60 uppercase">{f.name.replace('Frame ', 'F')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filter Selection */}
                <div className="w-full">
                  <h3 className="font-mono font-bold text-center md:text-left text-sm mb-3 tracking-widest uppercase">Image Filter</h3>
                  <div className="flex justify-center md:justify-start gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {FILTERS.map((f) => (
                      <div key={f} className="flex flex-col items-center gap-1 min-w-[50px]">
                        <button
                          onClick={() => setFilter(f)}
                          className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${
                            filter === f ? 'border-black scale-110' : 'border-black/20 hover:border-black/50'
                          }`}
                        >
                          <div className="w-full h-full bg-[url('/assets/homepage_wide.jpg')] bg-cover bg-center" style={getFilterStyle(f)} />
                        </button>
                        <span className="font-mono text-[10px] font-bold opacity-60 uppercase text-center leading-tight">
                          {f.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Photo Area & Actions */}
              <div className="flex flex-col items-center justify-center order-1 md:order-2 w-full md:sticky md:top-6 min-h-[350px]">
                
                {!photo ? (
                  /* Upload State (Tightly bounded to prevent layout stretching) */
                  <div className="w-full max-w-[300px] aspect-square rounded-xl border-2 border-dashed border-black/20 bg-white/40 overflow-hidden flex items-center justify-center p-4 mb-6 shadow-inner relative">
                    <div className="absolute inset-0 overflow-y-auto scrollbar-hide flex flex-col items-center justify-center p-2 w-full">
                      <UploadPhoto onPhotoSelect={setPhoto} />
                    </div>
                  </div>
                ) : (
                  /* Frame Preview State */
                  <div className="w-full flex flex-col items-center mb-6">
                    <div 
                      ref={frameRef} 
                      className="relative w-full max-w-[300px] aspect-square rounded-xl overflow-hidden shadow-inner bg-[#e6e2d6]/50 border border-black/10 isolate"
                    >
                      {/* 1. Fallback Photo Layer (Guarantees image shows up behind transparent frame) */}
                      <img 
                        src={photo} 
                        alt="Uploaded" 
                        className="absolute inset-0 w-full h-full object-cover z-0"
                        style={getFilterStyle(filter)} 
                      />
                      
                      {/* 2. Photo Editor Layer (Positioned explicitly to fill container) */}
                      <div className="absolute inset-0 w-full h-full z-10 pointer-events-auto">
                        <PhotoEditor 
                          image={photo} 
                          onCropComplete={() => {}} 
                          filter={filter} 
                        />
                      </div>
                      
                      {/* 3. Frame Overlay Layer */}
                      <img 
                        src={selectedFrame.src} 
                        alt="Selected Frame" 
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-30"
                      />
                      
                      {/* 4. Hover Replace Button */}
                      <button 
                        onClick={() => setPhoto(null)}
                        className="absolute top-2 right-2 z-40 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                        title="Replace Photo"
                      >
                        <RefreshCw size={16} />
                      </button>
                    </div>
                    <button onClick={() => setPhoto(null)} className="font-mono mt-4 text-[10px] font-bold text-black/50 hover:text-black tracking-widest uppercase">
                      Replace Photo
                    </button>
                  </div>
                )}

                {/* Actions below preview */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[300px]">
                  <button
                    onClick={handleShare}
                    disabled={isGenerating || !photo}
                    className="font-mono flex flex-1 items-center justify-center gap-2 py-2.5 bg-black text-white font-bold text-xs rounded-lg hover:bg-black/80 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    <Share2 size={16} /> Share to X
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={isGenerating || !photo}
                    className="font-mono flex flex-1 items-center justify-center gap-2 py-2.5 bg-transparent text-black border-2 border-black font-bold text-xs rounded-lg hover:bg-black/5 transition-colors uppercase tracking-widest disabled:opacity-50"
                  >
                    <Download size={16} /> Download
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