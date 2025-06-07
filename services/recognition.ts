import { RecognitionResult } from '../types';

// Mock recognition service for development
// In production, this would integrate with Google Vision API or similar service
export class RecognitionService {
  private static mockResults: RecognitionResult[] = [
    {
      name: 'りんご',
      confidence: 0.95,
      description: '赤い果物',
      category: '食べ物',
      alternativeNames: ['アップル', 'apple'],
    },
    {
      name: 'ペン',
      confidence: 0.88,
      description: '書くための道具',
      category: '文房具',
      alternativeNames: ['ボールペン', 'pen'],
    },
    {
      name: 'コップ',
      confidence: 0.92,
      description: '飲み物を入れる容器',
      category: '食器',
      alternativeNames: ['グラス', 'カップ', 'cup'],
    },
    {
      name: 'ねこ',
      confidence: 0.94,
      description: 'かわいい動物',
      category: '動物',
      alternativeNames: ['猫', 'cat', 'にゃんこ'],
    },
    {
      name: '車',
      confidence: 0.89,
      description: '移動する乗り物',
      category: '乗り物',
      alternativeNames: ['自動車', 'car', 'くるま'],
    },
    {
      name: '花',
      confidence: 0.91,
      description: '美しい植物',
      category: '植物',
      alternativeNames: ['お花', 'flower', 'はな'],
    },
    {
      name: 'ケーキ',
      confidence: 0.87,
      description: '甘いお菓子',
      category: '食べ物',
      alternativeNames: ['cake', 'スイーツ'],
    },
    {
      name: 'スマートフォン',
      confidence: 0.93,
      description: '通信機器',
      category: '電子機器',
      alternativeNames: ['スマホ', 'smartphone', '携帯電話'],
    },
    {
      name: '本',
      confidence: 0.85,
      description: '読むための本',
      category: '文房具',
      alternativeNames: ['書籍', 'book', 'ほん'],
    },
    {
      name: '時計',
      confidence: 0.90,
      description: '時間を知るための道具',
      category: '装身具',
      alternativeNames: ['腕時計', 'watch', 'とけい'],
    },
  ];

  static async recognizeImage(base64Image: string): Promise<RecognitionResult> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Simulate occasional errors
    if (Math.random() < 0.1) {
      throw new Error('Recognition service temporarily unavailable');
    }

    // Return random mock result
    const randomResult = this.mockResults[Math.floor(Math.random() * this.mockResults.length)];
    
    // Add some variance to confidence
    const confidenceVariance = (Math.random() - 0.5) * 0.1;
    const adjustedConfidence = Math.max(0.5, Math.min(0.99, randomResult.confidence + confidenceVariance));

    return {
      ...randomResult,
      confidence: adjustedConfidence,
    };
  }

  static async recognizeImageWithGoogleVision(base64Image: string, apiKey: string): Promise<RecognitionResult> {
    // This would be the actual Google Vision API implementation
    // For now, we'll use the mock service
    return this.recognizeImage(base64Image);
    
    /*
    // Actual Google Vision API implementation would look like this:
    try {
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: base64Image,
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            ],
          }],
        }),
      });

      const data = await response.json();
      
      if (data.responses && data.responses[0]) {
        const labels = data.responses[0].labelAnnotations || [];
        const objects = data.responses[0].localizedObjectAnnotations || [];
        
        // Process and return the best result
        const bestLabel = labels[0];
        const bestObject = objects[0];
        
        const result = bestObject || bestLabel;
        
        if (result) {
          return {
            name: this.translateToJapanese(result.description || result.name),
            confidence: result.score || result.confidence || 0,
            description: this.getDescription(result.description || result.name),
            category: this.getCategory(result.description || result.name),
          };
        }
      }
      
      throw new Error('No objects detected');
    } catch (error) {
      console.error('Google Vision API error:', error);
      throw error;
    }
    */
  }

  private static translateToJapanese(englishName: string): string {
    const translations: { [key: string]: string } = {
      'apple': 'りんご',
      'pen': 'ペン',
      'cup': 'コップ',
      'cat': 'ねこ',
      'car': '車',
      'flower': '花',
      'cake': 'ケーキ',
      'phone': 'スマートフォン',
      'book': '本',
      'watch': '時計',
      // Add more translations as needed
    };

    return translations[englishName.toLowerCase()] || englishName;
  }

  private static getDescription(name: string): string {
    const descriptions: { [key: string]: string } = {
      'apple': '赤い果物',
      'pen': '書くための道具',
      'cup': '飲み物を入れる容器',
      'cat': 'かわいい動物',
      'car': '移動する乗り物',
      'flower': '美しい植物',
      'cake': '甘いお菓子',
      'phone': '通信機器',
      'book': '読むための本',
      'watch': '時間を知るための道具',
    };

    return descriptions[name.toLowerCase()] || '';
  }

  private static getCategory(name: string): string {
    const categories: { [key: string]: string } = {
      'apple': '食べ物',
      'pen': '文房具',
      'cup': '食器',
      'cat': '動物',
      'car': '乗り物',
      'flower': '植物',
      'cake': '食べ物',
      'phone': '電子機器',
      'book': '文房具',
      'watch': '装身具',
    };

    return categories[name.toLowerCase()] || 'その他';
  }
}