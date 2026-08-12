import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

interface PhotoEditorProps {
  image: string;
  onCropComplete: (croppedArea: any, croppedAreaPixels: any) => void;
  filter: string;
}

export default function PhotoEditor({ image, onCropComplete, filter }: PhotoEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropCompleteInternal = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    onCropComplete(croppedArea, croppedAreaPixels);
  }, [onCropComplete]);

  // Map filter strings to CSS filter classes or styles
  const getFilterStyle = (f: string) => {
    switch(f) {
      case 'Goa Warm': return { filter: 'sepia(30%) contrast(110%) saturate(120%)' };
      case 'Sunset': return { filter: 'brightness(110%) sepia(40%) hue-rotate(-10deg) saturate(150%)' };
      case 'Tropical': return { filter: 'saturate(150%) contrast(110%) brightness(105%) hue-rotate(10deg)' };
      case 'Vintage': return { filter: 'sepia(50%) contrast(90%) brightness(90%)' };
      default: return {};
    }
  };

  return (
    <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-transparent">
      <div style={getFilterStyle(filter)} className="absolute inset-0 w-full h-full">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropCompleteInternal}
          showGrid={false}
          classes={{
            containerClassName: 'w-full h-full',
            mediaClassName: 'object-cover'
          }}
        />
      </div>
    </div>
  );
}
