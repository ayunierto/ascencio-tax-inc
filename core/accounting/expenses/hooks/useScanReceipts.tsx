import { useRef, useState } from 'react';

import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { CameraView } from 'expo-camera';
import Toast from 'react-native-toast-message';
import { useReceiptImageMutation } from './useReceiptImageMutation';
import { useExpenseStore } from '../store/useExpenseStore';

export const useScanReceipts = (id: string) => {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const ref = useRef<CameraView>(null);
  const [pictureUri, setPictureUri] = useState<string | null>(null);
  const { setDetails } = useExpenseStore();
  const { uploadImageMutation, getReceiptValuesMutation } =
    useReceiptImageMutation();

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      // setPictureUri(photo.uri);

      setLoading(true);
      const compressedUri = await compressPicture(photo?.uri);
      setPictureUri(compressedUri);
      setLoading(false);
    }
  };

  const pickFromGallery = async () => {
    setLoading(true);

    const selectedPicture = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
    });

    if (selectedPicture.canceled) {
      setLoading(false);
      return;
    }

    setStatusMessage('Compressing picture...');
    const compressedPicture = await compressPicture(
      selectedPicture.assets[0].uri
    );

    setPictureUri(compressedPicture);
    setLoading(false);
  };

  const confirmPicture = async () => {
    if (!pictureUri) return;

    try {
      setLoading(true);
      setStatusMessage('Processing receipt image...');

      // Save to media library (optional)
      // setStatusMessage('Saving image to media library...');
      // await MediaLibrary.createAssetAsync(picture.uri);

      // 1. Upload picture.
      setStatusMessage('Uploading image...');
      const uploadedPicture = await uploadPicture(pictureUri);
      setDetails({
        imageUrl: uploadedPicture.url,
      });

      setStatusMessage('Extracting receipt values...');
      // 2. Extract receipt values (OCR + GPT)
      const extractedValues = await getReceiptValues(uploadedPicture.url);
      setDetails({ ...extractedValues });

      // 3. Redirect
      if (id === 'new') {
        router.replace('/(tabs)/accounting/receipts/expense/new'); // from scan
        return;
      }
      setPictureUri(null);
      router.replace({
        pathname: '/(tabs)/accounting/receipts/expense/[id]', // from create
        params: { id },
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1:
          (error instanceof Error && error.message) ||
          'Unknown error, please try again.',
      });
    } finally {
      setLoading(false);
      setPictureUri(null);
    }
  };

  // Helpers
  const compressPicture = async (uri: string): Promise<string> => {
    const { uri: compressedUri } = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 1280 } }],
      { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
    );
    return compressedUri;
  };

  const uploadPicture = async (uri: string) => {
    return await uploadImageMutation.mutateAsync(uri, {
      onSuccess: async () => {
        Toast.show({
          type: 'success',
          text1: 'Image uploaded.',
        });
      },
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Error uploading image.',
          text2: error.response?.data.message || error.message,
        });
      },
    });
  };

  const getReceiptValues = async (imageUrl: string) => {
    return await getReceiptValuesMutation.mutateAsync(imageUrl, {
      onError: (error) => {
        Toast.show({
          type: 'error',
          text1: 'Error getting receipt values.',
          text2: error.response?.data.message || error.message,
        });
      },
    });
  };

  const retakePicture = () => {
    setPictureUri(null);
  };

  const dismissReceiptScanner = () => {
    setPictureUri(null);
    router.dismiss();
  };

  return {
    loading,
    cameraRef: ref,
    takePicture,
    pictureUri,
    confirmPicture,
    retakePicture,
    dismissReceiptScanner,
    pickFromGallery,
    statusMessage,
  };
};
