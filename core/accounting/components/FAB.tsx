import React, { useState, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '@/components/ui/Button';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { useRevenueCat } from '@/providers/RevenueCat';

export const FAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isPro } = useRevenueCat();
  const animation = useRef(new Animated.Value(0)).current;

  const toggleButtons = () => {
    setIsExpanded(!isExpanded);

    Animated.timing(animation, {
      toValue: isExpanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.quad), // Use a more natural easing
      useNativeDriver: true, // Important for performance
    }).start();
  };

  const translateY = animation.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1], // Adjust distance as needed
  });

  const opacity = animation.interpolate({
    inputRange: [0, 0.5, 1], // Fade in slightly later
    outputRange: [0, 0, 1],
  });

  // const rotate = animation.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: ['0deg', '45deg'],
  // });

  const goPro = async () => {
    const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall({
      displayCloseButton: true,
    });

    console.log(paywallResult);

    switch (paywallResult) {
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      case PAYWALL_RESULT.CANCELLED:
        return false;
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return true;
      default:
        return false;
    }
  };

  return (
    <View
      style={{
        position: 'absolute',
        right: 20,
        bottom: 20,
        gap: 10,
        alignItems: 'center',
      }}
    >
      <Animated.View
        style={[
          { gap: 10 },
          {
            transform: [{ translateY }],
            opacity,
          },
        ]}
      >
        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            if (!isPro) {
              goPro();
            } else {
              router.push('/(tabs)/accounting/receipts/expense/create');
            }
            toggleButtons();
          }}
        >
          <ThemedText>
            <Ionicons
              name="receipt-outline"
              size={20}
              color={theme.foreground}
            />
          </ThemedText>
        </Button>

        <Button
          style={{
            width: 52,
            height: 52,
          }}
          onPress={() => {
            if (!isPro) {
              goPro();
            } else {
              router.push('/scan-receipts');
            }
            toggleButtons();
          }}
        >
          <ThemedText>
            <Ionicons
              name="camera-outline"
              size={20}
              color={theme.foreground}
            />
          </ThemedText>
        </Button>
      </Animated.View>

      <Button
        style={[
          {
            width: 56,
            height: 56,
          },
          // { transform: [{ rotate: '45deg' }] },
        ]}
        onPress={toggleButtons}
      >
        <ThemedText>
          <Ionicons name="add" size={24} color="white" />
        </ThemedText>
      </Button>
    </View>
  );
};
