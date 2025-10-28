import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';

import 'react-native-get-random-values';
import {
  ConfirmImageButton,
  GalleryButton,
  RetakeImageButton,
  ReturnCancelButton,
  ShutterButton,
} from '@/core/camera/components';

import { Buffer } from 'buffer';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonText } from '@/components/ui/Button';
import { Card } from '@/components/ui';
import { CardContent } from '@/components/ui/Card/CardContent';
import { Octicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { useScanReceipts } from '@/core/accounting/expenses/hooks/useScanReceipts';
globalThis.Buffer = Buffer;

export default function ScanReceiptScreen() {
  const { id } = useLocalSearchParams(); // new or uuid
  console.log({ id });
  if (!id) throw new Error('Mode is required');

  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaPermission] = MediaLibrary.usePermissions();

  const {
    loading,
    cameraRef,
    pictureUri,
    confirmPicture,
    retakePicture,
    dismissReceiptScanner,
    pickFromGallery,
    takePicture,
    statusMessage,
  } = useScanReceipts(id as string);

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

  // Permission not granted view
  if (!cameraPermission.granted) {
    return (
      <View style={{ ...styles.container, padding: 20 }}>
        <Card>
          <CardContent style={{ alignItems: 'center', gap: 10 }}>
            <Octicons name="unlock" size={50} color={theme.foreground} />
            <ThemedText style={styles.message}>
              We need your permission to show the camera and gallery
            </ThemedText>
            <Button onPress={onRequestPermissions}>
              <ButtonText>Grant</ButtonText>
            </Button>
          </CardContent>
        </Card>
      </View>
    );
  }

  if (loading) {
    return <Loader message={statusMessage} />;
  }

  // Picture to confirm view
  if (pictureUri) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: pictureUri }}
          style={{ flex: 1, resizeMode: 'contain' }}
        />
        <ConfirmImageButton
          loading={loading}
          disabled={loading}
          onPress={confirmPicture}
        />
        <RetakeImageButton onPress={retakePicture} />
        <ReturnCancelButton onPress={dismissReceiptScanner} />
      </View>
    );
  }

  // Camera
  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={'back'}>
        <GalleryButton
          onPress={pickFromGallery}
          style={{ position: 'absolute', right: 30, bottom: 45 }}
        />

        <View style={styles.buttonsBottomContainer}>
          <ShutterButton onPress={takePicture} />
        </View>

        <ReturnCancelButton onPress={dismissReceiptScanner} />
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
