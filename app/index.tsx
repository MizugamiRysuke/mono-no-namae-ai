import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  const isDark = colorScheme === 'dark';
  const dynamicStyles = createDynamicStyles(isDark, width);

  const speakWelcome = () => {
    Speech.speak('ものの名前おしえますAIへようこそ。カメラで物を撮影して名前を調べることができます。', {
      language: 'ja-JP',
      rate: 0.8,
    });
  };

  const navigateToCamera = () => {
    Speech.speak('カメラ画面に移動します');
    router.push('/(tabs)/camera');
  };

  React.useEffect(() => {
    // Welcome message on app start
    const timer = setTimeout(() => {
      speakWelcome();
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.titleContainer}>
          <Ionicons 
            name="camera" 
            size={80} 
            color={isDark ? '#60a5fa' : '#3b82f6'} 
          />
          <Text style={[styles.title, dynamicStyles.title]}>
            ものの名前{'\n'}おしえますAI
          </Text>
          <Text style={[styles.subtitle, dynamicStyles.subtitle]}>
            カメラをかざすだけで{'\n'}物の名前がわかります
          </Text>
        </View>

        {/* Main Action Button */}
        <Pressable
          style={[styles.mainButton, dynamicStyles.mainButton]}
          onPress={navigateToCamera}
          accessible={true}
          accessibilityLabel="カメラを開く"
          accessibilityRole="button"
        >
          <Ionicons name="camera" size={40} color="white" />
          <Text style={styles.mainButtonText}>カメラで撮影</Text>
        </Pressable>

        {/* Feature List */}
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons 
              name="eye" 
              size={32} 
              color={isDark ? '#60a5fa' : '#3b82f6'} 
            />
            <Text style={[styles.featureText, dynamicStyles.text]}>
              物をカメラで撮影
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons 
              name="volume-high" 
              size={32} 
              color={isDark ? '#60a5fa' : '#3b82f6'} 
            />
            <Text style={[styles.featureText, dynamicStyles.text]}>
              名前を音声で読み上げ
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons 
              name="heart" 
              size={32} 
              color={isDark ? '#60a5fa' : '#3b82f6'} 
            />
            <Text style={[styles.featureText, dynamicStyles.text]}>
              お気に入りに保存
            </Text>
          </View>
        </View>

        {/* Help Button */}
        <Pressable
          style={[styles.helpButton, dynamicStyles.helpButton]}
          onPress={speakWelcome}
          accessible={true}
          accessibilityLabel="音声ガイドを再生"
          accessibilityRole="button"
        >
          <Ionicons name="help-circle" size={24} color={isDark ? '#60a5fa' : '#3b82f6'} />
          <Text style={[styles.helpButtonText, dynamicStyles.text]}>
            音声ガイド
          </Text>
        </Pressable>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
  },
  mainButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    minHeight: 80,
    minWidth: 250,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  featureList: {
    width: '100%',
    maxWidth: 300,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 20,
    marginLeft: 16,
    flex: 1,
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 20,
  },
  helpButtonText: {
    fontSize: 18,
    marginLeft: 8,
    fontWeight: '600',
  },
});

const createDynamicStyles = (isDark: boolean, width: number) => {
  const isTablet = width > 768;
  
  return StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#111827' : '#f9fafb',
    },
    title: {
      color: isDark ? '#ffffff' : '#111827',
      fontSize: isTablet ? 36 : 32,
    },
    subtitle: {
      color: isDark ? '#d1d5db' : '#6b7280',
      fontSize: isTablet ? 24 : 20,
    },
    text: {
      color: isDark ? '#ffffff' : '#111827',
    },
    mainButton: {
      backgroundColor: '#3b82f6',
    },
    helpButton: {
      borderColor: isDark ? '#60a5fa' : '#3b82f6',
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
  });
};