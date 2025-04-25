import React, { useEffect, useState } from 'react';

import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { useCameraStore } from '@/core/camera/store';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import { SinglePhotoViewer } from '@/core/components/SinglePhotoViewer';

interface ExpenseImageProps {
  image: string | null;
  onChange?: (image: string | undefined) => void;
}

const ExpenseImage = ({ image, onChange }: ExpenseImageProps) => {
  const { selectedImages, clearImages } = useCameraStore();

  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const openViewer = () => setIsViewerVisible(true);
  const closeViewer = () => setIsViewerVisible(false);

  useEffect(() => {
    if (onChange) {
      onChange(selectedImages[0]?.uri);
    }
  }, [selectedImages]);

  const removeImage = () => {
    clearImages();

    if (onChange) {
      onChange(undefined);
    }
  };

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
                source={{ uri: image }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.radius,
                }}
              />
            </TouchableOpacity>
            <SinglePhotoViewer
              imageUrl={image}
              isVisible={isViewerVisible}
              onClose={closeViewer}
            />
          </>
        ) : (
          <ThemedText>No receipt selected</ThemedText>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={() => removeImage()}>
            <Ionicons
              name="trash-outline"
              color={theme.foreground}
              size={24}
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
