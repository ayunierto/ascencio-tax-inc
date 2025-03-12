import * as SecureStore from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';

export const DownloadAndSaveReport = async (
  startDate: string,
  endDate: string
) => {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;

  const token = await SecureStore.getItemAsync('token');
  if (!token) {
    throw new Error('Token not found');
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
    throw new Error('Unable to download or save reports');
  }
};