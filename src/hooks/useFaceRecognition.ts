import { useState, useEffect, useRef, useCallback } from 'react';
import { FaceData, DetectedFace } from '../types';
import { loadFaceApiModels, detectFaces, matchFace } from '../utils/faceApi';
import { generateMockFaceData } from '../data/mockData';
import { saveUsersToStorage, loadUsersFromStorage } from '../utils/storage';

export const useFaceRecognition = () => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedFaces, setDetectedFaces] = useState<DetectedFace[]>([]);
  const [knownFaces, setKnownFaces] = useState<FaceData[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const initializeFaceApi = async () => {
      try {
        setIsLoading(true);
        await loadFaceApiModels();
        setIsModelLoaded(true);
        
        // Load existing users from storage, or generate mock data if none exist
        const storedUsers = loadUsersFromStorage();
        if (storedUsers.length > 0) {
          setKnownFaces(storedUsers);
        } else {
          const mockData = generateMockFaceData();
          setKnownFaces(mockData);
          saveUsersToStorage(mockData);
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to load face recognition models');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeFaceApi();
  }, []);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }
    } catch (err) {
      setError('Failed to access camera');
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const recognizeFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) return;

    try {
      const detections = await detectFaces(videoRef.current);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const facesWithMatches: DetectedFace[] = detections.map(detection => {
          const descriptor = detection.descriptor;
          const knownDescriptors = knownFaces.map(face => face.descriptor);
          const match = matchFace(descriptor, knownDescriptors);
          
          // Draw detection box
          const box = detection.detection.box;
          ctx.strokeStyle = match ? '#10B981' : '#EF4444';
          ctx.lineWidth = 2;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
          
          // Draw label
          if (match) {
            const matchedFace = knownFaces[match.index];
            ctx.fillStyle = '#10B981';
            ctx.font = '16px Arial';
            ctx.fillRect(box.x, box.y - 25, box.width, 25);
            ctx.fillStyle = 'white';
            ctx.fillText(`${matchedFace.name} (${match.confidence.toFixed(1)}%)`, box.x + 5, box.y - 8);
            
            return {
              detection,
              descriptor,
              match: matchedFace,
              confidence: match.confidence
            };
          } else {
            ctx.fillStyle = '#EF4444';
            ctx.font = '16px Arial';
            ctx.fillRect(box.x, box.y - 25, box.width, 25);
            ctx.fillStyle = 'white';
            ctx.fillText('Unknown', box.x + 5, box.y - 8);
            
            return {
              detection,
              descriptor
            };
          }
        });
        
        setDetectedFaces(facesWithMatches);
      }
    } catch (err) {
      console.error('Error in face recognition:', err);
    }
  }, [isModelLoaded, knownFaces]);

  const addNewFace = useCallback(async (name: string, email: string, imageFile: File): Promise<boolean> => {
    try {
      // Create a permanent URL for the image by converting to base64
      const imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(imageFile);
      });
      
      const img = new Image();
      
      return new Promise((resolve) => {
        img.onload = async () => {
          try {
            const detections = await detectFaces(img);
            if (detections.length > 0) {
              const newFace: FaceData = {
                id: `user-${Date.now()}`,
                name,
                email,
                descriptor: detections[0].descriptor,
                imageUrl,
                registeredAt: new Date(),
                recognitionCount: 0
              };
              
              setKnownFaces(prev => {
                const updated = [...prev, newFace];
                saveUsersToStorage(updated);
                return updated;
              });
              resolve(true);
            } else {
              resolve(false);
            }
          } catch (error) {
            console.error('Error processing face:', error);
            resolve(false);
          }
        };
        
        img.crossOrigin = 'anonymous';
        img.src = imageUrl;
      });
    } catch (error) {
      console.error('Error adding new face:', error);
      return false;
    }
  }, []);

  return {
    isModelLoaded,
    isLoading,
    error,
    detectedFaces,
    knownFaces,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    recognizeFaces,
    addNewFace,
    setKnownFaces: (faces: FaceData[]) => {
      setKnownFaces(faces);
      saveUsersToStorage(faces);
    }
  };
};