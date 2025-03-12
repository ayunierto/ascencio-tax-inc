import { useRef, useState } from 'react';

import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useCameraStore } from '@/core/camera/store';
import { router } from 'expo-router';
import {
  AnalyzeExpenseCommand,
  TextractClient,
} from '@aws-sdk/client-textract';

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
  const { addSelectedImage, clearImages } = useCameraStore();

  const onReturnCancel = () => {
    clearImages();
    router.dismiss();
  };

  const onPictureConfirm = async () => {
    // TODO: Implement
    setLoading(true);
    if (!selectedImage) return;
    await MediaLibrary.createAssetAsync(selectedImage);

    addSelectedImage({ uri: selectedImage });

    const { date, merchant, tax, total } = await analyzeExpense(
      selectedBase64Image as string
    );
    setLoading(false);

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

    if (result.canceled) return;

    clearImages();
    addSelectedImage({
      uri: result.assets[0].uri,
    });
    const { date, merchant, tax, total } = await analyzeExpense(
      result.assets[0].base64!
    );

    setLoading(false);

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

  const analyzeExpense = async (base64Image: string) => {
    const config = {
      region: '',
      credentials: {
        accessKeyId: '',
        secretAccessKey: '',
      },
    };
    const client = new TextractClient(config);

    if (!base64Image) {
      throw new Error('An image to analyze was not provided.');
    }

    const input = {
      Document: {
        Bytes: base64Image ? Buffer.from(base64Image, 'base64') : undefined,
      },
    };
    const command = new AnalyzeExpenseCommand(input);

    const detectedValues = {
      merchant: '',
      date: '',
      total: new Date().toISOString(),
      tax: '',
    };

    try {
      const response = await client.send(command);
      if (response.ExpenseDocuments)
        response.ExpenseDocuments[0].SummaryFields?.map((field) => {
          if (field.Type && field.Type.Text === 'VENDOR_NAME') {
            detectedValues.merchant = field.ValueDetection?.Text as string;
          }
          if (field.Type && field.Type.Text === 'TOTAL') {
            detectedValues.total = cleanPrice(
              field.ValueDetection?.Text as string
            );
          }
          if (field.Type && field.Type.Text === 'INVOICE_RECEIPT_DATE') {
            if (field.ValueDetection && field.ValueDetection.Text) {
              detectedValues.date = field.ValueDetection.Text;
            }
          }
          if (field.Type && field.Type.Text === 'TAX') {
            detectedValues.tax = cleanPrice(
              field.ValueDetection?.Text as string
            );
          }
        });

      return detectedValues;
    } catch (error) {
      console.error(error);
      throw new Error('The receipt could not be analyzed.');
    }
  };

  const cleanPrice = (price: string) => {
    const pattern = /\b\d+(\.\d{2})\b/;
    // Remove currency symbols (e.g., S/, $, €) and replace commas with periods
    const cleanedString = price.replace(/[S/$€]/g, '').replace(',', '.');
    const match = cleanedString.match(pattern);
    if (match) {
      return match[0];
    } else {
      return '00.00';
    }
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
