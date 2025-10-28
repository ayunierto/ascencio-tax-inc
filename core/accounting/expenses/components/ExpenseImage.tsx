import React, { useState } from 'react';

import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import { SinglePhotoViewer } from '@/core/components/SinglePhotoViewer';
import { Button, ButtonIcon } from '@/components/ui/Button';

type ExpenseImageProps = {
  imageUrl?: string;
  onChange: (image: { imagePublicId: string; imageUrl: string } | null) => void;
};

const ReceiptUploader = ({ imageUrl, onChange }: ExpenseImageProps) => {
  const [isViewerVisible, setIsViewerVisible] = useState(false);

  const openViewer = () => setIsViewerVisible(true);
  const closeViewer = () => setIsViewerVisible(false);

  const handleRemoveImage = () => {
    onChange(null);
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
        {imageUrl ? (
          <>
            <TouchableOpacity onPress={openViewer}>
              <Image
                source={{ uri: imageUrl }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: theme.radius,
                }}
              />
            </TouchableOpacity>

            <SinglePhotoViewer
              imageUrl={imageUrl}
              isVisible={isViewerVisible}
              onClose={closeViewer}
            />
          </>
        ) : (
          <ThemedText>No receipt image selected</ThemedText>
        )}

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button
            variant="default"
            size="icon"
            onPress={() =>
              router.push({
                pathname: '/scan-receipts',
                params: { id: 'replace-image' },
              })
            }
          >
            <ButtonIcon name="camera-outline" />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onPress={() => handleRemoveImage()}
            disabled={!imageUrl}
          >
            <ButtonIcon name="trash-outline" />
          </Button>
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

export default ReceiptUploader;
