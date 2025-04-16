import Loader from '@/components/Loader';
import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL, PurchasesOffering, CustomerInfo } from 'react-native-purchases';

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
  const [currentOffering, setCurrentOffering] = useState<PurchasesOffering | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {

    const setup = async () => {
      try {
        // Configurar Purchases
        if (Platform.OS === "android") {
          Purchases.configure({ apiKey: APIKeys.google });
        } else if (Platform.OS === 'ios') {
          Purchases.configure({ apiKey: APIKeys.apple });
        }
        await Purchases.setLogLevel(LOG_LEVEL.DEBUG);

        // --- Listener para actualizaciones ---
        Purchases.addCustomerInfoUpdateListener((customerInfo) => {
          console.log("RC Listener: CustomerInfo updated", customerInfo.entitlements.active);
          setCustomerInfo(customerInfo); // Actualiza el estado con la nueva info
          // Verifica el entitlement 'Pro' (asegúrate que 'Pro' es el identificador correcto)
          setIsPro(customerInfo.entitlements.active['Pro'] !== undefined);
        });

        // --- Obtener estado inicial ---
        console.log("RC Provider: Obteniendo CustomerInfo inicial...");
        const initialCustomerInfo = await Purchases.getCustomerInfo();
        console.log("RC Provider: CustomerInfo inicial obtenido", initialCustomerInfo.entitlements.active);
        setCustomerInfo(initialCustomerInfo);
        setIsPro(initialCustomerInfo.entitlements.active['Pro'] !== undefined);

        console.log("RC Provider: Obteniendo Offerings iniciales...");
        const offerings = await Purchases.getOfferings();
        console.log("RC Provider: Offerings obtenidos", offerings.current?.identifier);
        setCurrentOffering(offerings.current);

      } catch (error) {
        console.error('RC Provider: Error durante la configuración o fetch inicial:', error);
      } finally {
        // Marcar como listo DESPUÉS de intentar la configuración y el fetch inicial
        console.log("RC Provider: Configuración completada. Marcando como listo.");
        setIsReady(true);
      }
    };

    setup().catch(console.error);

  }, []);

  // Muestra el Loader mientras RevenueCat no está listo
  if (!isReady) {
    console.log("RC Provider: Renderizando Loader porque isReady es false.");
    return <Loader />;
  }

  return (
    <RevenueCatContext.Provider value={{ isPro, customerInfo, currentOffering, isReady }}>
      {children}
    </RevenueCatContext.Provider>
  );
};

// Hook para consumir el contexto con verificación para asegurar que se use dentro del provider.
export const useRevenueCat = () => {
  const context = useContext(RevenueCatContext);
  if (context === undefined) {
    throw new Error('useRevenueCat debe ser usado dentro de un RevenueCatProvider');
  }
  return context;
};
