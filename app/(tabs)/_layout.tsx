import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#60a5fa' : '#3b82f6',
        tabBarInactiveTintColor: colorScheme === 'dark' ? '#9ca3af' : '#6b7280',
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="camera"
        options={{
          title: 'カメラ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera" size={size + 4} color={color} />
          ),
          headerTitle: 'カメラで撮影',
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'ギャラリー',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="images" size={size + 4} color={color} />
          ),
          headerTitle: 'ギャラリーから選択',
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'お気に入り',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size + 4} color={color} />
          ),
          headerTitle: 'お気に入り',
        }}
      />
    </Tabs>
  );
}