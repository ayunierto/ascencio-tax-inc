import { useRef, useState } from 'react';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useCameraStore } from '@/core/camera/store';
import { router } from 'expo-router';
import { getReceiptValues } from '../../receipts/actions';
import Toast from 'react-native-toast-message';
// import {
//   AnalyzeExpenseCommand,
//   TextractClient,
// } from '@aws-sdk/client-textract';

export const useScanReceipts = () => {
  const [loading, setLoading] = useState(false);

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaPermission] = MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string>();
  const [selectedBase64Image, setSelectedBase64Image] = useState<string>();
  const cameraRef = useRef<CameraView>(null);

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
    });

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);
    setSelectedBase64Image(picture.base64);
  };
  const { selectImage: addSelectedImage, clearImages } = useCameraStore();

  const onReturnCancel = () => {
    clearImages();
    router.dismiss();
  };

  const onPictureConfirm = async () => {
    setLoading(true);
    if (!selectedImage) return;
    await MediaLibrary.createAssetAsync(selectedImage);

    addSelectedImage({ uri: selectedImage });

    const response = await getReceiptValues(selectedBase64Image as string);
    console.log({ response });

    setLoading(false);

    if ('statusCode' in response) {
      Toast.show({
        text1: 'Error getting values.',
        text2: response.message,
      });
      return;
    }

    const { date, merchant, tax, total } = response;

    router.replace({
      pathname: '/accounting/receipts/expense/create',
      params: {
        merchant,
        date,
        total,
        tax,
      },
    });
  };

  const onRetakePicture = () => {
    setSelectedImage(undefined);
  };

  const onPickImages = async () => {
    setLoading(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (result.canceled) {
      setLoading(false);
      return;
    }

    clearImages();
    addSelectedImage({
      uri: result.assets[0].uri,
    });

    const response = await getReceiptValues(result.assets[0].base64!);

    setLoading(false);

    if ('statusCode' in response) {
      Toast.show({
        text1: 'Error getting values.',
      });
      return;
    }

    const { date, merchant, tax, total } = response;

    router.replace({
      pathname: '/accounting/receipts/expense/create',
      params: {
        merchant,
        date,
        total,
        tax,
      },
    });
  };

  return {
    loading,
    requestCameraPermission,
    requestMediaPermission,
    cameraPermission,
    cameraRef,
    onShutterButtonPress,
    selectedImage,
    onPictureConfirm,
    onRetakePicture,
    onReturnCancel,
    onPickImages,
  };
};
