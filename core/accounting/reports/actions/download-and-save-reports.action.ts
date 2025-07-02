import * as FileSystem from 'expo-file-system';
import { storageAdapter } from '@/core/adapters/StorageAdapter';
import { DownloadAndSaveReportResponse } from '../interfaces';

export const DownloadAndSaveReport = async (
  startDate: string,
  endDate: string
): Promise<DownloadAndSaveReportResponse> => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const token = await storageAdapter.getAccessToken();
  if (!token) {
    return {
      message: 'Download and save report failed for token not found.',
      error: 'Token not found',
    };
  }

  try {
    const { uri } = await FileSystem.downloadAsync(
      `${API_URL}/reports/generate?startDate=${startDate}&endDate=${endDate}`,
      FileSystem.documentDirectory + `report.pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return uri;
  } catch (error) {
    console.error('Error when downloading and saving pdf:', error);
    return {
      message: 'Download and save report failed.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
