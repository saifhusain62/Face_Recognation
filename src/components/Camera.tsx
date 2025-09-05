import React, { useEffect, useRef } from 'react';
import { Camera as CameraIcon, Square, Play, Pause } from 'lucide-react';
import { useFaceRecognition } from '../hooks/useFaceRecognition';
import clsx from 'clsx';

interface CameraProps {
  isActive: boolean;
  onToggle: () => void;
  className?: string;
}

export const Camera: React.FC<CameraProps> = ({ isActive, onToggle, className }) => {
  const {
    isModelLoaded,
    isLoading,
    error,
    detectedFaces,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    recognizeFaces
  } = useFaceRecognition();
  
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isActive && isModelLoaded) {
      startCamera();
      intervalRef.current = setInterval(recognizeFaces, 100);
    } else {
      stopCamera();
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isModelLoaded, startCamera, stopCamera, recognizeFaces]);

  if (isLoading) {
    return (
      <div className={clsx("flex items-center justify-center bg-gray-900 rounded-lg", className)}>
        <div className="text-center text-gray-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading face recognition models...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={clsx("flex items-center justify-center bg-red-900/20 border border-red-500/30 rounded-lg", className)}>
        <div className="text-center text-red-400">
          <CameraIcon className="h-12 w-12 mx-auto mb-4" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("relative bg-gray-900 rounded-lg overflow-hidden", className)}>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-full object-cover"
          style={{ transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ transform: 'scaleX(-1)' }}
        />
        
        {!isActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
            <div className="text-center text-gray-300">
              <CameraIcon className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg mb-4">Camera is off</p>
              <button
                onClick={onToggle}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                <Play className="h-4 w-4" />
                Start Camera
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onToggle}
          className={clsx(
            "p-2 rounded-full transition-all duration-200",
            isActive 
              ? "bg-red-600 hover:bg-red-700 text-white" 
              : "bg-green-600 hover:bg-green-700 text-white"
          )}
        >
          {isActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      </div>
      
      {isActive && detectedFaces.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3">
            <p className="text-white text-sm mb-2">
              Detected: {detectedFaces.length} face{detectedFaces.length !== 1 ? 's' : ''}
            </p>
            <div className="space-y-1">
              {detectedFaces.map((face, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className={face.match ? "text-green-400" : "text-red-400"}>
                    {face.match ? face.match.name : 'Unknown'}
                  </span>
                  {face.confidence && (
                    <span className="text-gray-300">
                      {face.confidence.toFixed(1)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};