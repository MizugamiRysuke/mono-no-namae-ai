import * as Speech from 'expo-speech';
import { AppSettings } from '../types';

export class SpeechService {
  private static defaultSettings = {
    language: 'ja-JP',
    rate: 0.8,
    pitch: 1.0,
    volume: 1.0,
  };

  static async speak(text: string, settings?: Partial<AppSettings>): Promise<void> {
    try {
      const speechOptions: Speech.SpeechOptions = {
        language: this.defaultSettings.language,
        rate: settings?.speechRate || this.defaultSettings.rate,
        pitch: this.defaultSettings.pitch,
        volume: settings?.speechVolume || this.defaultSettings.volume,
      };

      await Speech.speak(text, speechOptions);
    } catch (error) {
      console.error('Speech synthesis error:', error);
    }
  }

  static async speakResult(name: string, description?: string, confidence?: number, settings?: Partial<AppSettings>): Promise<void> {
    let message = `これは${name}です。`;
    
    if (description) {
      message += `${description}。`;
    }
    
    if (confidence && confidence > 0) {
      const confidencePercent = Math.round(confidence * 100);
      message += `信頼度は${confidencePercent}パーセントです。`;
    }

    await this.speak(message, settings);
  }

  static async speakInstruction(instruction: string, settings?: Partial<AppSettings>): Promise<void> {
    await this.speak(instruction, settings);
  }

  static async speakError(errorType: 'camera' | 'recognition' | 'permission' | 'general', settings?: Partial<AppSettings>): Promise<void> {
    const errorMessages = {
      camera: 'カメラでエラーが発生しました。もう一度お試しください。',
      recognition: '物の認識に失敗しました。照明や角度を変えてお試しください。',
      permission: '必要な権限が許可されていません。設定を確認してください。',
      general: 'エラーが発生しました。もう一度お試しください。',
    };

    await this.speak(errorMessages[errorType], settings);
  }

  static async speakWelcome(settings?: Partial<AppSettings>): Promise<void> {
    const welcomeMessage = 'ものの名前おしえますAIへようこそ。カメラで物を撮影して名前を調べることができます。';
    await this.speak(welcomeMessage, settings);
  }

  static async speakNavigationHelp(currentScreen: 'home' | 'camera' | 'gallery' | 'favorites', settings?: Partial<AppSettings>): Promise<void> {
    const helpMessages = {
      home: 'ホーム画面です。カメラで撮影ボタンを押して物の名前を調べることができます。',
      camera: 'カメラ画面です。撮影ボタンを押して物の写真を撮ってください。',
      gallery: 'ギャラリー画面です。写真を選択ボタンを押して、認識したい物の写真を選んでください。',
      favorites: 'お気に入り画面です。過去に認識した物の名前を確認できます。項目をタップして読み上げます。',
    };

    await this.speak(helpMessages[currentScreen], settings);
  }

  static stop(): void {
    Speech.stop();
  }

  static async isSpeaking(): Promise<boolean> {
    return Speech.isSpeakingAsync();
  }

  static getAvailableLanguages(): Promise<Speech.Voice[]> {
    return Speech.getAvailableVoicesAsync();
  }

  // Accessibility announcements
  static async announceForAccessibility(text: string): Promise<void> {
    // This would integrate with the device's accessibility services
    // For now, we'll use the regular speech synthesis
    await this.speak(text, { speechRate: 1.0 });
  }

  // Interactive speech for step-by-step guidance
  static async provideCameraGuidance(step: 'start' | 'ready' | 'capture' | 'processing' | 'result', settings?: Partial<AppSettings>): Promise<void> {
    const guidanceMessages = {
      start: 'カメラを起動しています。物をカメラに向けてください。',
      ready: 'カメラの準備ができました。撮影ボタンを押してください。',
      capture: '写真を撮影しています。動かないでください。',
      processing: '写真を解析中です。しばらくお待ちください。',
      result: '認識が完了しました。結果をお伝えします。',
    };

    await this.speak(guidanceMessages[step], settings);
  }

  static async provideGalleryGuidance(step: 'start' | 'select' | 'processing' | 'result', settings?: Partial<AppSettings>): Promise<void> {
    const guidanceMessages = {
      start: 'ギャラリーから写真を選択してください。',
      select: '写真を選択しました。認識を開始します。',
      processing: '写真を解析中です。しばらくお待ちください。',
      result: '認識が完了しました。結果をお伝えします。',
    };

    await this.speak(guidanceMessages[step], settings);
  }
}