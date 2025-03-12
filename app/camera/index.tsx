import React, { useRef, useState } from 'react';
import { router } from 'expo-router';
import { Alert, Image, StyleSheet, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';

import { useCameraStore } from '../../core/camera/store/useCameraStore';
import {
  ConfirmImageButton,
  FlipCameraButton,
  GalleryButton,
  RetakeImageButton,
  ReturnCancelButton,
  ShutterButton,
} from '@/core/camera/components';
import Loader from '@/components/Loader';
import { ThemedText } from '@/components/ui/ThemedText';
import Button from '@/components/ui/Button';

export default function CameraScreen() {
  const { addSelectedImage, clearImages } = useCameraStore();

  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [, requestMediaPermission] = MediaLibrary.usePermissions();

  const [selectedImage, setSelectedImage] = useState<string>();
  const cameraRef = useRef<CameraView>(null);

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
    // Camera permissions are still loading.
    return <Loader />;
  }

  if (!cameraPermission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={{ ...styles.container, padding: 20 }}>
        <ThemedText style={styles.message}>
          We need your permission to show the camera and gallery
        </ThemedText>
        <Button onPress={onRequestPermissions}>Grant permission</Button>
      </View>
    );
  }

  const onShutterButtonPress = async () => {
    if (!cameraRef.current) return;

    const picture = await cameraRef.current.takePictureAsync({
      quality: 1,
      base64: true,
    });

    if (!picture?.uri) return;

    setSelectedImage(picture.uri);

    // TODO: Save Image
  };

  const onReturnCancel = () => {
    // TODO: Clean state
    clearImages();
    router.dismiss();
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  }

  const onPictureConfirm = async () => {
    // TODO: Implement
    if (!selectedImage) return;
    await MediaLibrary.createAssetAsync(selectedImage);
    addSelectedImage({ uri: selectedImage, base64: undefined });
    router.dismiss();
  };

  const onRetakePicture = () => {
    setSelectedImage(undefined);
  };

  const onPickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled) return;

    clearImages();
    result.assets.map((img) =>
      addSelectedImage({
        uri: img.uri,
        base64: undefined,
      })
    );

    router.dismiss();
  };

  if (selectedImage) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: selectedImage }} style={styles.camera} />
        <ConfirmImageButton onPress={onPictureConfirm} />
        <RetakeImageButton onPress={onRetakePicture} />
        <ReturnCancelButton onPress={onReturnCancel} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.buttonsBottomContainer}>
          <GalleryButton onPress={onPickImages} />
          <ShutterButton onPress={onShutterButtonPress} />
          <FlipCameraButton onPress={toggleCameraFacing} />
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
