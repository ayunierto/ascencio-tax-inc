import Loader from "@/components/Loader";
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import Purchases, { LOG_LEVEL, PurchasesOffering, CustomerInfo } from "react-native-purchases";

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string,
  google: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
};

interface RevenueCatProps {
  isPro: boolean;
  customerInfo: CustomerInfo | null;
  currentOffering: PurchasesOffering | null;
  isReady: boolean;
}

const RevenueCatContext = createContext<Partial<RevenueCatProps>>({
  isPro: false,
  customerInfo: null,
  currentOffering: null,
  isReady: false,
});

export const RevenueCatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        if (Platform.OS === "android") {
          Purchases.configure({ apiKey: APIKeys.google });
        } else if (Platform.OS === "ios") {
          Purchases.configure({ apiKey: APIKeys.apple });
        }
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          setCustomerInfo(customerInfo);
          setIsPro(customerInfo.entitlements.active["Pro"] !== undefined);
        });

        const initialCustomerInfo = await Purchases.getCustomerInfo();

        setCustomerInfo(initialCustomerInfo);
        setIsPro(initialCustomerInfo.entitlements.active["Pro"] !== undefined);

        const offerings = await Purchases.getOfferings();

        setCurrentOffering(offerings.current);
      } catch (error) {
        // console.log("RC Provider: Error during setup or fetching initial data: ", error);
      } finally {
        // Mark as ready AFTER attempting setup and initial fetch
        setIsReady(true);
        // TODO: remove this in production
        setIsPro(true);
      }
    };

    setup().catch(console.log);
  }, []);

  // Show the Loader while RevenueCat is not ready
  if (!isReady) {
    return <Loader />;
  }

  return (
    <RevenueCatContext.Provider value={{ isPro, customerInfo, currentOffering, isReady }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

// Hook for accessing RevenueCat context
export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error("useRevenueCat must be used within a RevenueCatProvider");
  }
  return context;
};
