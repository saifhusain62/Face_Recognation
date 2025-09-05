import { FaceData, Recognition } from '../types';

// Generate mock face data representing a 10,000 user dataset
export const generateMockFaceData = (): FaceData[] => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa', 'Robert', 'Amy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com', 'university.edu'];
  
  const mockData: FaceData[] = [];
  
  // Generate 50 sample users (representing 10k dataset)
  for (let i = 0; i < 50; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${domains[Math.floor(Math.random() * domains.length)]}`;
    
    // Generate random face descriptor (in real app, this would be from actual face images)
    const descriptor = new Float32Array(128);
    for (let j = 0; j < 128; j++) {
      descriptor[j] = Math.random() * 2 - 1; // Random values between -1 and 1
    }
    
    mockData.push({
      id: `user-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email,
      descriptor,
      imageUrl: `https://images.pexels.com/photos/${1000000 + i * 1000}/pexels-photo-${1000000 + i * 1000}.jpeg?auto=compress&cs=tinysrgb&w=400`,
      registeredAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      lastSeen: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
      recognitionCount: Math.floor(Math.random() * 100)
    });
  }
  
  return mockData;
};

export const generateMockRecognitions = (users: FaceData[]): Recognition[] => {
  const locations = ['Main Entrance', 'Office Floor 1', 'Office Floor 2', 'Cafeteria', 'Parking Garage', 'Conference Room A'];
  const recognitions: Recognition[] = [];
  
  // Generate recognition history
  for (let i = 0; i < 200; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    recognitions.push({
      id: `rec-${i + 1}`,
      userId: user.id,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      confidence: 70 + Math.random() * 30,
      location: locations[Math.floor(Math.random() * locations.length)]
    });
  }
  
  return recognitions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};