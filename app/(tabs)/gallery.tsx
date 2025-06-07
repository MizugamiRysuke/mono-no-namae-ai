import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  useColorScheme,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Speech from 'expo-speech';

interface RecognitionResult {
  name: string;
  confidence: number;
  description?: string;
}

export default function GalleryScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const dynamicStyles = createDynamicStyles(isDark);

  React.useEffect(() => {
    // Speak instructions when component mounts
    const timer = setTimeout(() => {
      Speech.speak('ギャラリー画面です。写真を選択ボタンを押して、認識したい物の写真を選んでください。', {
        language: 'ja-JP',
        rate: 0.8,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const pickImage = async () => {
    try {
      Speech.speak('写真を選択中です');

      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('エラー', '写真ライブラリへのアクセス許可が必要です');
        Speech.speak('写真ライブラリへのアクセス許可が必要です');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        Speech.speak('写真を選択しました。認識を開始します');
        await recognizeObject(result.assets[0].base64!);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('エラー', '写真の選択に失敗しました');
      Speech.speak('写真の選択に失敗しました');
    }
  };

  const recognizeObject = async (base64Image: string) => {
    try {
      setIsLoading(true);
      
      // Mock recognition result for now
      // In a real app, this would call Google Vision API or similar service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        { name: 'ねこ', confidence: 0.94, description: 'かわいい動物' },
        { name: '車', confidence: 0.89, description: '移動する乗り物' },
        { name: '花', confidence: 0.91, description: '美しい植物' },
        { name: 'ケーキ', confidence: 0.87, description: '甘いお菓子' },
        { name: 'スマートフォン', confidence: 0.93, description: '通信機器' },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setResult(randomResult);
      
      // Speak the result
      const message = `この写真には${randomResult.name}が写っています。${randomResult.description}です。`;
      Speech.speak(message, {
        language: 'ja-JP',
        rate: 0.8,
      });

    } catch (error) {
      console.error('Recognition error:', error);
      Alert.alert('エラー', '物の認識に失敗しました');
      Speech.speak('物の認識に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const clearResult = () => {
    setResult(null);
    setSelectedImage(null);
    Speech.speak('結果をクリアしました');
  };

  const repeatResult = () => {
    if (result) {
      const message = `この写真には${result.name}が写っています。${result.description}です。`;
      Speech.speak(message, {
        language: 'ja-JP',
        rate: 0.8,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.content}>
        {/* Instructions */}
        {!selectedImage && (
          <View style={styles.instructionsContainer}>
            <Ionicons 
              name="images" 
              size={80} 
              color={isDark ? '#60a5fa' : '#3b82f6'} 
            />
            <Text style={[styles.instructionsTitle, dynamicStyles.text]}>
              写真から認識
            </Text>
            <Text style={[styles.instructionsText, dynamicStyles.secondaryText]}>
              ギャラリーから写真を選んで{'\n'}物の名前を調べることができます
            </Text>
          </View>
        )}

        {/* Selected Image */}
        {selectedImage && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.selectedImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* Loading */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.loadingText, dynamicStyles.text]}>
              認識中です...
            </Text>
          </View>
        )}

        {/* Result Display */}
        {result && !isLoading && (
          <View style={[styles.resultContainer, dynamicStyles.resultContainer]}>
            <View style={styles.resultHeader}>
              <Text style={[styles.resultTitle, dynamicStyles.text]}>認識結果</Text>
              <Pressable
                style={[styles.clearButton, dynamicStyles.clearButton]}
                onPress={clearResult}
                accessible={true}
                accessibilityLabel="結果をクリア"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
              </Pressable>
            </View>
            
            <Text style={[styles.resultName, dynamicStyles.text]}>
              {result.name}
            </Text>
            
            {result.description && (
              <Text style={[styles.resultDescription, dynamicStyles.secondaryText]}>
                {result.description}
              </Text>
            )}
            
            <Text style={[styles.resultConfidence, dynamicStyles.secondaryText]}>
              信頼度: {Math.round(result.confidence * 100)}%
            </Text>

            <View style={styles.resultActions}>
              <Pressable
                style={[styles.actionButton, dynamicStyles.actionButton]}
                onPress={repeatResult}
                accessible={true}
                accessibilityLabel="もう一度読み上げる"
                accessibilityRole="button"
              >
                <Ionicons name="volume-high" size={20} color="white" />
                <Text style={styles.actionButtonText}>もう一度</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Main Action Button */}
        <View style={styles.buttonContainer}>
          {!selectedImage || result ? (
            <Pressable
              style={[styles.mainButton, dynamicStyles.mainButton]}
              onPress={pickImage}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="写真を選択する"
              accessibilityRole="button"
            >
              <Ionicons name="images" size={32} color="white" />
              <Text style={styles.mainButtonText}>
                {selectedImage ? '別の写真を選択' : '写真を選択'}
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.mainButton, dynamicStyles.mainButton]}
              onPress={() => recognizeObject('')}
              disabled={isLoading}
              accessible={true}
              accessibilityLabel="選択した写真を認識する"
              accessibilityRole="button"
            >
              <Ionicons name="search" size={32} color="white" />
              <Text style={styles.mainButtonText}>認識する</Text>
            </Pressable>
          )}
        </View>

        {/* Help Section */}
        <View style={[styles.helpContainer, dynamicStyles.helpContainer]}>
          <Text style={[styles.helpTitle, dynamicStyles.text]}>使い方</Text>
          <View style={styles.helpItem}>
            <Ionicons name="finger-print" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.helpText, dynamicStyles.secondaryText]}>
              「写真を選択」ボタンをタップ
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Ionicons name="images" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.helpText, dynamicStyles.secondaryText]}>
              ギャラリーから写真を選択
            </Text>
          </View>
          <View style={styles.helpItem}>
            <Ionicons name="search" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.helpText, dynamicStyles.secondaryText]}>
              AIが自動で物の名前を認識
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionsContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  instructionsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  selectedImage: {
    width: 300,
    height: 200,
    borderRadius: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 40,
  },
  loadingText: {
    fontSize: 18,
    marginTop: 16,
  },
  resultContainer: {
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultConfidence: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minHeight: 64,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  helpContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
});

const createDynamicStyles = (isDark: boolean) => {
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#111827' : '#f9fafb',
    },
    text: {
      color: isDark ? '#ffffff' : '#111827',
    },
    secondaryText: {
      color: isDark ? '#d1d5db' : '#6b7280',
    },
    resultContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    clearButton: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
    },
    mainButton: {
      backgroundColor: '#3b82f6',
    },
    actionButton: {
      backgroundColor: '#3b82f6',
    },
    helpContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
  });
};