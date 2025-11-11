import * as SecureStore from 'expo-secure-store';

// Define the TokenCache interface
interface TokenCache {
  getToken: (key: string) => Promise<string | undefined>;
  saveToken: (key: string, token: string) => Promise<void>;
  clearToken: (key: string) => Promise<void>;
}

// Create the token cache
const tokenCache: TokenCache = {
  async getToken(key: string) {
    try {
      const token = await SecureStore.getItemAsync(key);
      return token || undefined;
    } catch (error) {
      console.error(`Error getting token: ${key}`, error);
      return undefined;
    }
  },

  async saveToken(key: string, token: string) {
    try {
      await SecureStore.setItemAsync(key, token);
      return Promise.resolve();
    } catch (error) {
      console.error(`Error saving token: ${key}`, error);
      return Promise.reject(error);
    }
  },

  async clearToken(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
      return Promise.resolve();
    } catch (error) {
      console.error(`Error clearing token: ${key}`, error);
      return Promise.reject(error);
    }
  },
};

export default tokenCache;