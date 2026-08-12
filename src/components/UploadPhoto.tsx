import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface UploadPhotoProps {
  onPhotoSelect: (photoUrl: string) => void;
}

export default function UploadPhoto({ onPhotoSelect }: UploadPhotoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Camera States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("That photo didn't make it to Goa. Try another one (JPG/PNG/HEIC).");
      return;
    }
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      onPhotoSelect(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // --- Camera Logic ---
  const startCamera = async () => {
    setError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setError("Unable to access camera. Please check your browser permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraActive(false);
  }, []);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      
      // Mirror the canvas so the selfie looks natural
      ctx?.translate(canvas.width, 0);
      ctx?.scale(-1, 1);
      
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      onPhotoSelect(canvas.toDataURL('image/jpeg', 0.9));
      stopCamera();
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  return (
    <div className="w-full flex flex-col items-center">
      {error && <p className="font-mono text-red-500 text-sm text-center font-bold mb-2">{error}</p>}
      
      {isCameraActive ? (
        <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center border-2 border-black/10">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover -scale-x-100" />
          <button 
            onClick={capturePhoto} 
            className="font-mono absolute bottom-3 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full font-bold text-[10px] shadow-lg uppercase tracking-widest hover:bg-gray-200 transition-colors"
          >
            Snap
          </button>
          <button 
            onClick={stopCamera} 
            className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="w-full flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="font-mono flex-1 h-[42px] flex items-center justify-center gap-1.5 font-bold text-black/70 hover:text-black bg-white/50 hover:bg-white border border-black/10 rounded-lg transition-all text-[10px] tracking-wider uppercase shadow-sm whitespace-nowrap px-2"
          >
            <Upload size={14} /> Upload Photo
          </button>
          <button 
            onClick={startCamera}
            className="font-mono flex-1 h-[42px] flex items-center justify-center gap-1.5 font-bold text-black/70 hover:text-black bg-white/50 hover:bg-white border border-black/10 rounded-lg transition-all text-[10px] tracking-wider uppercase shadow-sm whitespace-nowrap px-2"
          >
            <Camera size={14} /> Use Camera
          </button>
        </div>
      )}

      <input 
        type="file" 
        accept="image/jpeg,image/png,image/heic,image/heif" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />
    </div>
  );
}