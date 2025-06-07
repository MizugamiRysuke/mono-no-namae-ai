import * as SecureStore from 'expo-secure-store';
import { FavoriteItem, AppSettings } from '../types';

export class StorageService {
  private static readonly FAVORITES_KEY = 'favorites';
  private static readonly SETTINGS_KEY = 'app_settings';

  // Favorites management
  static async getFavorites(): Promise<FavoriteItem[]> {
    try {
      const stored = await SecureStore.getItemAsync(this.FAVORITES_KEY);
      if (stored) {
        const favorites = JSON.parse(stored);
        return favorites.sort((a: FavoriteItem, b: FavoriteItem) => b.timestamp - a.timestamp);
      }
      return [];
    } catch (error) {
      console.error('Error loading favorites:', error);
      return [];
    }
  }

  static async saveFavorite(item: Omit<FavoriteItem, 'id' | 'timestamp'>): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const newItem: FavoriteItem = {
        ...item,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      
      favorites.unshift(newItem);
      
      // Keep only the latest 50 favorites to prevent storage bloat
      const trimmedFavorites = favorites.slice(0, 50);
      
      await SecureStore.setItemAsync(this.FAVORITES_KEY, JSON.stringify(trimmedFavorites));
    } catch (error) {
      console.error('Error saving favorite:', error);
      throw error;
    }
  }

  static async deleteFavorite(id: string): Promise<void> {
    try {
      const favorites = await this.getFavorites();
      const filteredFavorites = favorites.filter(item => item.id !== id);
      await SecureStore.setItemAsync(this.FAVORITES_KEY, JSON.stringify(filteredFavorites));
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  }

  static async clearAllFavorites(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.FAVORITES_KEY);
    } catch (error) {
      console.error('Error clearing favorites:', error);
      throw error;
    }
  }

  // Settings management
  static async getSettings(): Promise<AppSettings> {
    try {
      const stored = await SecureStore.getItemAsync(this.SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.getDefaultSettings();
    } catch (error) {
      console.error('Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  }

  private static getDefaultSettings(): AppSettings {
    return {
      fontSize: 'large',
      speechRate: 0.8,
      speechVolume: 1.0,
      theme: 'auto',
      language: 'ja',
      enableHaptics: true,
      autoSpeakResults: true,
    };
  }

  // Utility methods
  static async exportData(): Promise<string> {
    try {
      const favorites = await this.getFavorites();
      const settings = await this.getSettings();
      
      const exportData = {
        favorites,
        settings,
        exportDate: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.favorites && Array.isArray(data.favorites)) {
        await SecureStore.setItemAsync(this.FAVORITES_KEY, JSON.stringify(data.favorites));
      }
      
      if (data.settings) {
        await SecureStore.setItemAsync(this.SETTINGS_KEY, JSON.stringify(data.settings));
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.FAVORITES_KEY);
      await SecureStore.deleteItemAsync(this.SETTINGS_KEY);
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }
}