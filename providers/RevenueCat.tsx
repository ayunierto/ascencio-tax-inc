import Loader from '@/components/Loader';
import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PurchasesOffering,
  CustomerInfo,
} from 'react-native-purchases';

const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY as string,
  google: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY as string,
};

interface RevenueCatProps {
  isPro: boolean;
  customerInfo: CustomerInfo | null; // <-- Añadido
  currentOffering: PurchasesOffering | null;
  isReady: boolean; // <-- Añadido para controlar la carga fuera del provider
}

const RevenueCatContext = createContext<Partial<RevenueCatProps>>({
  isPro: false,
  customerInfo: null,
  currentOffering: null,
  isReady: false, // <-- Inicia como false
});

export const RevenueCatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPro, setIsPro] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null); // <-- Estado para CustomerInfo
  const [currentOffering, setCurrentOffering] =
    useState<PurchasesOffering | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        // Configurar Purchases
        if (Platform.OS === 'android') {
          Purchases.configure({ apiKey: APIKeys.google });
        } else if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: APIKeys.apple });
        }
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // --- Listener para actualizaciones ---
        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          setCustomerInfo(customerInfo); // Actualiza el estado con la nueva info
          // Verifica el entitlement 'Pro' (asegúrate que 'Pro' es el identificador correcto)
          setIsPro(customerInfo.entitlements.active['Pro'] !== undefined);
        });

        // --- Obtener estado inicial ---
        const initialCustomerInfo = await Purchases.getCustomerInfo();

        setCustomerInfo(initialCustomerInfo);
        setIsPro(initialCustomerInfo.entitlements.active['Pro'] !== undefined);

        const offerings = await Purchases.getOfferings();

        setCurrentOffering(offerings.current);
      } catch (error) {
        console.error(
          'RC Provider: Error durante la configuración o fetch inicial:',
          error
        );
      } finally {
        // Marcar como listo DESPUÉS de intentar la configuración y el fetch inicial
        setIsReady(true);
      }
    };

    setup().catch(console.error);
  }, []);

  // Muestra el Loader mientras RevenueCat no está listo
  if (!isReady) {
    return <Loader />;
  }

  return (
    <RevenueCatContext.Provider
      value={{ isPro, customerInfo, currentOffering, isReady }}
    >
      {children}
    </RevenueCatContext.Provider>
  );
};

// Hook para consumir el contexto con verificación para asegurar que se use dentro del provider.
export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error(
      'useRevenueCat debe ser usado dentro de un RevenueCatProvider'
    );
  }
  return context;
};
