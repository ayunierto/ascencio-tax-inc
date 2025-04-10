import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { CustomerInfo } from 'react-native-purchases';

const APIKeys = {
  ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string,
  android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
};

interface RevenueCatProps {
  isPro: boolean;
}

const RevenueCatContext = createContext<Partial<RevenueCatProps>>({});

export const RevenueCatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPro, setIsPro] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [customerInfoReceived, setCustomerInfoReceived] = useState(false);

  useEffect(() => {
    init();
  }, []);

  console.warn({ isConfigured });
  console.warn({ customerInfoReceived });

  const init = async () => {
    setIsReady(true);

    try {
      if (Platform.OS === 'android') {
        await Purchases.configure({ apiKey: APIKeys.android });
      } else {
        await Purchases.configure({ apiKey: APIKeys.ios });
      }
      setIsConfigured(true);
    } catch (error) {
      console.error('Error configuring RevenueCat:', error);
      setIsConfigured(false);
    }

    await Purchases.setLogLevel(LOG_LEVEL.ERROR);

    Purchases.addCustomerInfoUpdateListener((customerInfo) => {
      console.log('customerInfo', customerInfo);
      updateCustomerInfo(customerInfo);
    });
  };

  const updateCustomerInfo = async (customerInfo: CustomerInfo) => {
    if (customerInfo.entitlements.active['Pro'] !== undefined) {
      setIsPro(true);
    } else {
      setIsPro(false);
    }
    setCustomerInfoReceived(true);
  };

  if (!isReady) return <></>;

  return (
    <RevenueCatContext.Provider value={{ isPro }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = () => {
  return useContext(RevenueCatContext);
};
