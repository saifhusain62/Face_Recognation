import { FaceData, Recognition } from '../types';

const STORAGE_KEYS = {
  USERS: 'facerecog_users',
  RECOGNITIONS: 'facerecog_recognitions'
};

export const saveUsersToStorage = (users: FaceData[]): void => {
  try {
    // Convert Float32Array to regular array for JSON serialization
    const serializedUsers = users.map(user => ({
      ...user,
      descriptor: Array.from(user.descriptor),
      registeredAt: user.registeredAt.toISOString(),
      lastSeen: user.lastSeen?.toISOString()
    }));
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(serializedUsers));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
};

export const loadUsersFromStorage = (): FaceData[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((user: any) => ({
      ...user,
      descriptor: new Float32Array(user.descriptor),
      registeredAt: new Date(user.registeredAt),
      lastSeen: user.lastSeen ? new Date(user.lastSeen) : undefined
    }));
  } catch (error) {
    console.error('Error loading users from storage:', error);
    return [];
  }
};

export const saveRecognitionsToStorage = (recognitions: Recognition[]): void => {
  try {
    const serialized = recognitions.map(rec => ({
      ...rec,
      timestamp: rec.timestamp.toISOString()
    }));
    localStorage.setItem(STORAGE_KEYS.RECOGNITIONS, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error saving recognitions to storage:', error);
  }
};

export const loadRecognitionsFromStorage = (): Recognition[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECOGNITIONS);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((rec: any) => ({
      ...rec,
      timestamp: new Date(rec.timestamp)
    }));
  } catch (error) {
    console.error('Error loading recognitions from storage:', error);
    return [];
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USERS);
  localStorage.removeItem(STORAGE_KEYS.RECOGNITIONS);
};