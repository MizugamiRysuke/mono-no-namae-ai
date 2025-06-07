export interface RecognitionResult {
  name: string;
  confidence: number;
  description?: string;
  category?: string;
  alternativeNames?: string[];
}

export interface FavoriteItem {
  id: string;
  name: string;
  description?: string;
  confidence: number;
  timestamp: number;
  imageUri?: string;
}

export interface CameraSettings {
  flashMode: 'on' | 'off' | 'auto';
  quality: number;
  ratio?: string;
}

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  speechRate: number;
  speechVolume: number;
  theme: 'light' | 'dark' | 'auto';
  language: 'ja' | 'en';
  enableHaptics: boolean;
  autoSpeakResults: boolean;
}