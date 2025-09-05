export interface FaceData {
  id: string;
  name: string;
  email: string;
  descriptor: Float32Array;
  imageUrl: string;
  registeredAt: Date;
  lastSeen?: Date;
  recognitionCount: number;
}

export interface Recognition {
  id: string;
  userId: string;
  timestamp: Date;
  confidence: number;
  location: string;
}

export interface DetectedFace {
  detection: any;
  descriptor: Float32Array;
  match?: FaceData;
  confidence?: number;
}

export interface SystemStats {
  totalUsers: number;
  totalRecognitions: number;
  averageConfidence: number;
  activeToday: number;
}