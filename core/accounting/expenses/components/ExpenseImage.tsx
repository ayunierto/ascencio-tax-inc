import React, { useEffect, useState } from 'react';

import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useCameraStore } from '@/core/camera/store';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import { SinglePhotoViewer } from '@/core/components/SinglePhotoViewer';
import { ImagePickerAsset } from 'expo-image-picker';

type ExpenseImageProps = {
  image?: string | ImagePickerAsset;
  onChange?: (image: ImagePickerAsset | undefined) => void;
};

/**
 * @component ExpenseImage
 * @description A component for displaying and managing an expense receipt image. Allows viewing, removing and capturing new images.
 *
 * @param {Object} props
 * @param {string|ImagePickerAsset} [props.image] - The image to display, can be a URI string or ImagePickerAsset
 * @param {function} [props.onChange] - Callback function triggered when the image changes or is removed
 *
 * @example
 * <ExpenseImage
 *   image={receiptImage}
 *   onChange={(newImage) => handleImageChange(newImage)}
 * />
 */
const ExpenseImage = ({ image, onChange }: ExpenseImageProps) => {
  const { selectedImage, removeImage } = useCameraStore();

  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const openViewer = () => setIsViewerVisible(true);
  const closeViewer = () => setIsViewerVisible(false);

  useEffect(() => {
    if (onChange) {
      onChange(selectedImage);
    }
  }, [selectedImage]);

  const handleRemoveImage = () => {
    removeImage();

    if (onChange) {
      onChange(undefined);
    }
  };

  const imageToShow = typeof image === 'string' ? image : image && image.uri;

  return (
    <View style={styles.imageContainer}>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {image ? (
          <>
            <TouchableOpacity onPress={openViewer}>
              <Image
                source={{ uri: imageToShow }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.radius,
                }}
              />
            </TouchableOpacity>

            <SinglePhotoViewer
              imageUrl={imageToShow}
              isVisible={isViewerVisible}
              onClose={closeViewer}
            />
          </>
        ) : (
          <ThemedText>No receipt image selected</ThemedText>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => handleRemoveImage()}>
            <Ionicons
              name="trash-outline"
              color={theme.foreground}
              size={28}
              style={{
                backgroundColor: theme.mutedForeground,
                borderRadius: theme.radius,
                padding: 8,
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/camera')}>
            <Ionicons
              name="camera-outline"
              color={theme.foreground}
              size={24}
              style={{
                backgroundColor: theme.mutedForeground,
                borderRadius: theme.radius,
                padding: 8,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    borderColor: theme.foreground,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default ExpenseImage;
