import * as faceapi from 'face-api.js';

let modelsLoaded = false;

export const loadFaceApiModels = async (): Promise<void> => {
  if (modelsLoaded) return;
  
  try {
    const MODEL_URL = 'https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights';
    
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
    ]);
    
    modelsLoaded = true;
    console.log('Face-api models loaded successfully');
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw error;
  }
};

export const detectFaces = async (input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement) => {
  try {
    const detections = await faceapi
      .detectAllFaces(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();
    
    return detections;
  } catch (error) {
    console.error('Error detecting faces:', error);
    return [];
  }
};

export const matchFace = (descriptor: Float32Array, knownFaces: Float32Array[], threshold = 0.6) => {
  const distances = knownFaces.map(face => faceapi.euclideanDistance(descriptor, face));
  const minDistance = Math.min(...distances);
  const matchIndex = distances.indexOf(minDistance);
  
  if (minDistance < threshold) {
    return {
      index: matchIndex,
      distance: minDistance,
      confidence: Math.max(0, (1 - minDistance) * 100)
    };
  }
  
  return null;
};

export const getFaceDescriptor = async (imageElement: HTMLImageElement): Promise<Float32Array | null> => {
  try {
    const detection = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    return detection?.descriptor || null;
  } catch (error) {
    console.error('Error getting face descriptor:', error);
    return null;
  }
};