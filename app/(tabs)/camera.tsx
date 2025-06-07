import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Alert,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

interface RecognitionResult {
  name: string;
  confidence: number;
  description?: string;
}

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const dynamicStyles = createDynamicStyles(isDark);

  useEffect(() => {
    // Speak instructions when component mounts
    const timer = setTimeout(() => {
      Speech.speak('カメラが開きました。撮影ボタンを押して物の写真を撮ってください。', {
        language: 'ja-JP',
        rate: 0.8,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={80} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <Text style={[styles.permissionTitle, dynamicStyles.text]}>
            カメラの許可が必要です
          </Text>
          <Text style={[styles.permissionMessage, dynamicStyles.text]}>
            物の名前を認識するために{'\n'}カメラへのアクセスを許可してください
          </Text>
          <Pressable
            style={[styles.permissionButton, dynamicStyles.permissionButton]}
            onPress={requestPermission}
            accessible={true}
            accessibilityLabel="カメラの許可を求める"
            accessibilityRole="button"
          >
            <Text style={styles.permissionButtonText}>許可する</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsLoading(true);
      Speech.speak('写真を撮影中です');

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
      });

      if (photo) {
        // Mock AI recognition for now
        await recognizeObject(photo.base64!);
      }
    } catch (error) {
      console.error('Photo capture error:', error);
      Alert.alert('エラー', '写真の撮影に失敗しました');
      Speech.speak('写真の撮影に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const recognizeObject = async (base64Image: string) => {
    try {
      // Mock recognition result for now
      // In a real app, this would call Google Vision API or similar service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = [
        { name: 'りんご', confidence: 0.95, description: '赤い果物' },
        { name: 'ペン', confidence: 0.88, description: '書くための道具' },
        { name: 'コップ', confidence: 0.92, description: '飲み物を入れる容器' },
        { name: '本', confidence: 0.85, description: '読むための本' },
        { name: '時計', confidence: 0.90, description: '時間を知るための道具' },
      ];

      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      
      setResult(randomResult);
      
      // Speak the result
      const message = `これは${randomResult.name}です。${randomResult.description}。`;
      Speech.speak(message, {
        language: 'ja-JP',
        rate: 0.8,
      });

    } catch (error) {
      console.error('Recognition error:', error);
      Alert.alert('エラー', '物の認識に失敗しました');
      Speech.speak('物の認識に失敗しました');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    Speech.speak('カメラを切り替えました');
  };

  const clearResult = () => {
    setResult(null);
    Speech.speak('結果をクリアしました');
  };

  const repeatResult = () => {
    if (result) {
      const message = `これは${result.name}です。${result.description}。`;
      Speech.speak(message, {
        language: 'ja-JP',
        rate: 0.8,
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          {/* Camera Controls Overlay */}
          <View style={styles.overlay}>
            {/* Top Controls */}
            <View style={styles.topControls}>
              <Pressable
                style={[styles.controlButton, dynamicStyles.controlButton]}
                onPress={toggleCameraFacing}
                accessible={true}
                accessibilityLabel="カメラを切り替える"
                accessibilityRole="button"
              >
                <Ionicons name="camera-reverse" size={24} color="white" />
              </Pressable>
            </View>

            {/* Bottom Controls */}
            <View style={styles.bottomControls}>
              <Pressable
                style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={isLoading}
                accessible={true}
                accessibilityLabel="写真を撮影する"
                accessibilityRole="button"
              >
                {isLoading ? (
                  <ActivityIndicator size="large" color="white" />
                ) : (
                  <Ionicons name="camera" size={40} color="white" />
                )}
              </Pressable>
            </View>
          </View>
        </CameraView>
      </View>

      {/* Result Display */}
      {result && (
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

      {/* Instructions */}
      {!result && !isLoading && (
        <View style={[styles.instructionsContainer, dynamicStyles.instructionsContainer]}>
          <Text style={[styles.instructionsText, dynamicStyles.text]}>
            物をカメラに向けて撮影ボタンを押してください
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
  },
  permissionMessage: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
  },
  permissionButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    minHeight: 56,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 40,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    paddingBottom: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  captureButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  resultContainer: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
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
  instructionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
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
    permissionButton: {
      backgroundColor: '#3b82f6',
    },
    controlButton: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    resultContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    clearButton: {
      backgroundColor: isDark ? '#374151' : '#f3f4f6',
    },
    actionButton: {
      backgroundColor: '#3b82f6',
    },
    instructionsContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
  });
};