import React from 'react';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { CameraView } from 'expo-camera';

import 'react-native-get-random-values';
import {
  ConfirmImageButton,
  GalleryButton,
  RetakeImageButton,
  ReturnCancelButton,
  ShutterButton,
} from '@/core/camera/components';
import { useScanReceipts } from '@/core/accounting/scan-receipts/hooks/useScanReceipts';

import { Buffer } from 'buffer';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import Button from '@/components/ui/Button';
globalThis.Buffer = Buffer;

export default function ScanReceiptScreen() {
  const {
    requestCameraPermission,
    loading,
    requestMediaPermission,
    cameraPermission,
    cameraRef,
    selectedImage,
    onPictureConfirm,
    onRetakePicture,
    onReturnCancel,
    onPickImages,
    onShutterButtonPress,
  } = useScanReceipts();

  const onRequestPermissions = async () => {
    try {
      const { status: cameraPermissionStatus } =
        await requestCameraPermission();

      if (cameraPermissionStatus !== 'granted') {
        Alert.alert('Error', 'Camera permission not granted');
        return;
      }
      const { status: mediaPermissionStatus } = await requestMediaPermission();
      if (mediaPermissionStatus !== 'granted') {
        Alert.alert('Error', 'Gallery permission not granted');
        return;
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Permits could not be obtained');
    }
  };

  if (!cameraPermission) {
    return <Loader />;
  }

  if (!cameraPermission.granted) {
    return (
      <View style={{ ...styles.container, padding: 20 }}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera and gallery
        </ThemedText>
        <Button onPress={onRequestPermissions}>Grant permission</Button>
      </View>
    );
  }

  if (loading) {
    return <Loader />;
  }

  // Confirm image view
  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />
        <ConfirmImageButton
          loading={loading}
          disabled={loading}
          onPress={onPictureConfirm}
        />
        <RetakeImageButton onPress={onRetakePicture} />
        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  // Camera view
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={'back'}>
        <GalleryButton
          onPress={onPickImages}
          style={{ position: 'absolute', left: 30, bottom: 45 }}
        />
        <View style={styles.buttonsBottomContainer}>
          <ShutterButton onPress={onShutterButtonPress} />
        </View>
        <ReturnCancelButton onPress={onReturnCancel} />
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonsBottomContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    bottom: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
});
