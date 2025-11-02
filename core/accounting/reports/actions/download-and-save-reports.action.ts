import * as FileSystem from 'expo-file-system';
import { StorageAdapter } from '@/core/adapters/storage.adapter';

export const downloadAndSaveReport = async (
  startDate: string,
  endDate: string
): Promise<string> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  if (!API_URL) {
    throw new Error('No API URL found');
  }
  const token = await StorageAdapter.getItem('access_token');
  if (!token) {
    throw new Error('No token found');
  }
  const fileName = `report-${startDate}-${endDate}.pdf`;
  const url = `${API_URL}/reports/generate?startDate=${startDate}&endDate=${endDate}`;
  const destinationUri = FileSystem.documentDirectory + fileName;

  const { uri } = await FileSystem.downloadAsync(url, destinationUri, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return uri;
};
