import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import * as Speech from 'expo-speech';

interface FavoriteItem {
  id: string;
  name: string;
  description?: string;
  confidence: number;
  timestamp: number;
}

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const dynamicStyles = createDynamicStyles(isDark);

  useEffect(() => {
    loadFavorites();
    
    // Speak instructions when component mounts
    const timer = setTimeout(() => {
      Speech.speak('お気に入り画面です。過去に認識した物の名前を確認できます。', {
        language: 'ja-JP',
        rate: 0.8,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await SecureStore.getItemAsync('favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed.sort((a: FavoriteItem, b: FavoriteItem) => b.timestamp - a.timestamp));
      } else {
        // Add some mock data for demonstration
        const mockFavorites: FavoriteItem[] = [
          {
            id: '1',
            name: 'りんご',
            description: '赤い果物',
            confidence: 0.95,
            timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
          },
          {
            id: '2',
            name: 'ペン',
            description: '書くための道具',
            confidence: 0.88,
            timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          },
          {
            id: '3',
            name: 'コップ',
            description: '飲み物を入れる容器',
            confidence: 0.92,
            timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          },
        ];
        setFavorites(mockFavorites);
        await SecureStore.setItemAsync('favorites', JSON.stringify(mockFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      await SecureStore.setItemAsync('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
      Alert.alert('エラー', 'お気に入りの保存に失敗しました');
    }
  };

  const deleteFavorite = (id: string) => {
    Alert.alert(
      '確認',
      'このお気に入りを削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            const newFavorites = favorites.filter(item => item.id !== id);
            saveFavorites(newFavorites);
            Speech.speak('お気に入りを削除しました');
          },
        },
      ]
    );
  };

  const speakItem = (item: FavoriteItem) => {
    const message = `${item.name}。${item.description}。信頼度${Math.round(item.confidence * 100)}パーセント。`;
    Speech.speak(message, {
      language: 'ja-JP',
      rate: 0.8,
    });
  };

  const clearAllFavorites = () => {
    Alert.alert(
      '確認',
      'すべてのお気に入りを削除しますか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'すべて削除',
          style: 'destructive',
          onPress: () => {
            saveFavorites([]);
            Speech.speak('すべてのお気に入りを削除しました');
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'たった今';
    } else if (diffInHours < 24) {
      return `${diffInHours}時間前`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}日前`;
    }
  };

  const renderFavoriteItem = ({ item }: { item: FavoriteItem }) => (
    <View style={[styles.favoriteItem, dynamicStyles.favoriteItem]}>
      <Pressable
        style={styles.favoriteContent}
        onPress={() => speakItem(item)}
        accessible={true}
        accessibilityLabel={`${item.name}を読み上げる`}
        accessibilityRole="button"
      >
        <View style={styles.favoriteHeader}>
          <Text style={[styles.favoriteName, dynamicStyles.text]}>
            {item.name}
          </Text>
          <Text style={[styles.favoriteTime, dynamicStyles.secondaryText]}>
            {formatDate(item.timestamp)}
          </Text>
        </View>
        
        {item.description && (
          <Text style={[styles.favoriteDescription, dynamicStyles.secondaryText]}>
            {item.description}
          </Text>
        )}
        
        <Text style={[styles.favoriteConfidence, dynamicStyles.secondaryText]}>
          信頼度: {Math.round(item.confidence * 100)}%
        </Text>
      </Pressable>
      
      <View style={styles.favoriteActions}>
        <Pressable
          style={[styles.actionButton, dynamicStyles.speakButton]}
          onPress={() => speakItem(item)}
          accessible={true}
          accessibilityLabel="読み上げる"
          accessibilityRole="button"
        >
          <Ionicons name="volume-high" size={20} color="white" />
        </Pressable>
        
        <Pressable
          style={[styles.actionButton, dynamicStyles.deleteButton]}
          onPress={() => deleteFavorite(item.id)}
          accessible={true}
          accessibilityLabel="削除する"
          accessibilityRole="button"
        >
          <Ionicons name="trash" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, dynamicStyles.container]}>
        <View style={styles.centerContainer}>
          <Text style={[styles.loadingText, dynamicStyles.text]}>
            読み込み中...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, dynamicStyles.container]}>
      <View style={styles.content}>
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons 
              name="heart-outline" 
              size={80} 
              color={isDark ? '#60a5fa' : '#3b82f6'} 
            />
            <Text style={[styles.emptyTitle, dynamicStyles.text]}>
              お気に入りがありません
            </Text>
            <Text style={[styles.emptyMessage, dynamicStyles.secondaryText]}>
              カメラやギャラリーで物を認識すると{'\n'}ここに結果が保存されます
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, dynamicStyles.text]}>
                お気に入り ({favorites.length}件)
              </Text>
              
              {favorites.length > 0 && (
                <Pressable
                  style={[styles.clearAllButton, dynamicStyles.clearAllButton]}
                  onPress={clearAllFavorites}
                  accessible={true}
                  accessibilityLabel="すべて削除"
                  accessibilityRole="button"
                >
                  <Ionicons name="trash" size={16} color={isDark ? '#ef4444' : '#dc2626'} />
                  <Text style={[styles.clearAllText, dynamicStyles.clearAllText]}>
                    すべて削除
                  </Text>
                </Pressable>
              )}
            </View>

            <FlatList
              data={favorites}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}

        {/* Instructions */}
        <View style={[styles.instructionsContainer, dynamicStyles.instructionsContainer]}>
          <Text style={[styles.instructionsTitle, dynamicStyles.text]}>
            使い方
          </Text>
          <View style={styles.instructionItem}>
            <Ionicons name="finger-print" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.instructionText, dynamicStyles.secondaryText]}>
              項目をタップして読み上げ
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="volume-high" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.instructionText, dynamicStyles.secondaryText]}>
              音声ボタンで再読み上げ
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="trash" size={20} color={isDark ? '#60a5fa' : '#3b82f6'} />
            <Text style={[styles.instructionText, dynamicStyles.secondaryText]}>
              削除ボタンで項目を削除
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
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  clearAllText: {
    fontSize: 14,
    marginLeft: 4,
    fontWeight: '600',
  },
  listContainer: {
    paddingBottom: 20,
  },
  favoriteItem: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  favoriteName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  favoriteTime: {
    fontSize: 12,
    marginLeft: 12,
  },
  favoriteDescription: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  favoriteConfidence: {
    fontSize: 14,
    marginBottom: 12,
  },
  favoriteActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionsContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    marginLeft: 8,
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
    favoriteItem: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
    clearAllButton: {
      borderColor: isDark ? '#ef4444' : '#dc2626',
      backgroundColor: isDark ? '#7f1d1d' : '#fef2f2',
    },
    clearAllText: {
      color: isDark ? '#ef4444' : '#dc2626',
    },
    speakButton: {
      backgroundColor: '#3b82f6',
    },
    deleteButton: {
      backgroundColor: '#ef4444',
    },
    instructionsContainer: {
      backgroundColor: isDark ? '#1f2937' : '#ffffff',
    },
  });
};