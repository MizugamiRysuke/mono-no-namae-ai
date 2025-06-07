import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';

export default function App() {
  const [currentTest, setCurrentTest] = useState('待機中');
  const [isLoading, setIsLoading] = useState(false);

  const basicTest = () => {
    setCurrentTest('基本機能テスト完了');
    Alert.alert('成功', 'アプリが正常に動作しています！');
  };

  const simpleTest = () => {
    setCurrentTest('シンプルテスト完了');
    Alert.alert('テスト', 'ボタンが正常に動作しました！');
  };

  const stateTest = () => {
    setIsLoading(!isLoading);
    setCurrentTest(isLoading ? '状態リセット' : '状態変更中');
    Alert.alert('状態テスト', `ローディング状態: ${!isLoading ? 'ON' : 'OFF'}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>シンプルテストアプリ</Text>
      <Text style={styles.subtitle}>基本動作確認用</Text>
      
      <Text style={styles.status}>状態: {currentTest}</Text>
      
      <View style={styles.buttonContainer}>
        <Pressable 
          style={[styles.button, styles.primaryButton]} 
          onPress={basicTest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>基本テスト</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.secondButton]} 
          onPress={simpleTest}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>シンプルテスト</Text>
        </Pressable>

        <Pressable 
          style={[styles.button, styles.thirdButton]} 
          onPress={stateTest}
          disabled={false}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'リセット' : '状態変更'}
          </Text>
        </Pressable>
      </View>
      
      <Text style={styles.instructions}>
        各ボタンをタップして動作確認
      </Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#34495e',
    marginBottom: 20,
    textAlign: 'center',
  },
  status: {
    fontSize: 18,
    color: '#27ae60',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 30,
  },
  button: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3498db',
  },
  secondButton: {
    backgroundColor: '#9b59b6',
  },
  thirdButton: {
    backgroundColor: '#e74c3c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  instructions: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});