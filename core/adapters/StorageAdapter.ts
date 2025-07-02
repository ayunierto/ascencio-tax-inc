import * as SecureStore from 'expo-secure-store';

class StorageAdapter {
  private storage;

  constructor() {
    this.storage = SecureStore;
  }

  public async setItem(key: string, value: string) {
    try {
      await this.storage.setItemAsync(key, value);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getItem(key: string) {
    try {
      return await this.storage.getItemAsync(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async updateItem(key: string, value: string) {
    try {
      await this.storage.setItemAsync(key, value);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async removeItem(key: string) {
    try {
      await this.storage.deleteItemAsync(key);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async setAccessToken(token: string) {
    return this.setItem('access_token', token);
  }
  public async getAccessToken() {
    return this.getItem('access_token');
  }
  public async removeAccessToken() {
    return this.removeItem('access_token');
  }
  public async updateAccessToken(token: string) {
    return this.setItem('access_token', token);
  }
}

export const storageAdapter = new StorageAdapter();
