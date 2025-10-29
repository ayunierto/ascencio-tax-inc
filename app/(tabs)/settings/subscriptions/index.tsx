import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Linking,
  Platform,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { PurchasesEntitlementInfo } from 'react-native-purchases';
import { Ionicons } from '@expo/vector-icons';
import { useRevenueCat } from '@/providers/RevenueCat';
import { goPro } from '@/core/accounting/actions';
import Loader from '@/components/Loader';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';

// --- Consts Color for Dark Mode ---
const secondaryTextColor = '#A9CCE3';
const cardBackgroundColor = 'rgba(255, 255, 255, 0.08)';
const separatorColor = 'rgba(255, 255, 255, 0.15)';
const secondaryButtonBackground = 'rgba(255, 255, 255, 0.15)';
const secondaryButtonText = '#E0F2FE';

const openSubscriptionManagement = async () => {
  Alert.alert(
    'Manage Subscription',
    "You'll be redirected to your app store's subscription settings to manage your subscription.",
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Continue',
        onPress: async () => {
          try {
            let url = '';
            if (Platform.OS === 'ios') {
              url = 'itms-apps://apps.apple.com/account/subscriptions';
            } else if (Platform.OS === 'android') {
              url = 'https://play.google.com/store/account/subscriptions';
              // Opcional: Añadir SKU y paquete si quieres enlazar a una específica
              // url = `https://play.google.com/store/account/subscriptions?sku=tu_sku&package=tu.paquete.app`;
            }

            if (url) {
              await Linking.openURL(url);
            } else {
              console.warn(
                'SubscriptionManager: Plataforma no soportada para deep linking de suscripciones.'
              );
            }
          } catch (error) {
            console.error(
              'SubscriptionManager: Error al abrir la gestión de suscripciones:',
              error
            );
            Alert.alert(
              'Error',
              'No se pudo abrir la página de gestión de suscripciones. Por favor, hazlo manualmente desde la App Store o Google Play Store.'
            );
          }
          try {
            let url = '';
            if (Platform.OS === 'ios') {
              url = 'itms-apps://apps.apple.com/account/subscriptions';
            } else if (Platform.OS === 'android') {
              url = 'https://play.google.com/store/account/subscriptions';
            }

            if (url) {
              await Linking.openURL(url);
            } else {
              console.warn(
                'SubscriptionManager: Plataforma no soportada para deep linking de suscripciones.'
              );
            }
          } catch (error) {
            console.error(
              'SubscriptionManager: Error al abrir la gestión de suscripciones:',
              error
            );
            Alert.alert(
              'Error',
              'The subscription management page could not be opened.'
            );
          }
        },
      },
    ],
    { userInterfaceStyle: 'dark' }
  );
};

const SubscriptionManager = () => {
  const { customerInfo, isPro, isReady } = useRevenueCat();
  const [isPaywallLoading, setIsPaywallLoading] = useState(false);

  const handleGoPro = async () => {
    if (isPaywallLoading) return;
    setIsPaywallLoading(true);
    try {
      const success = await goPro();
      if (success) {
        console.log(
          'SubscriptionManager: Paywall successful purchase or restoration.'
        );
      } else {
        console.log(
          'SubscriptionManager: Paywall closed without purchase or restoration.'
        );
      }
    } catch (error) {
      console.error('SubscriptionManager: Error to present paywall:', error);

      Alert.alert('Error', 'The purchase screen could not be displayed.');
    } finally {
      setIsPaywallLoading(false);
    }
  };

  // --- Estado de Carga Inicial ---
  if (!isReady) {
    return <Loader />;
  }
  if (!customerInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons
          name="cloud-offline-outline"
          size={40}
          color={secondaryTextColor}
        />
        <ThemedText style={styles.errorText}>
          Subscription information could not be loaded.
        </ThemedText>
        <ThemedText style={styles.errorText}>
          Please check your connection and try again.
        </ThemedText>
      </View>
    );
  }

  const proEntitlement: PurchasesEntitlementInfo | undefined =
    customerInfo.entitlements.active['Pro'];

  return (
    // Asegúrate que el contenedor padre de este componente tenga backgroundColor: darkBackground
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.card}>
        <ThemedText style={styles.title}>Your Pro Subscription</ThemedText>

        {/* --- Sección Estado Actual --- */}
        <View style={styles.statusSection}>
          <Ionicons
            name={isPro ? 'checkmark-circle' : 'close-circle-outline'}
            size={28}
            color={isPro ? theme.success : theme.destructive} // Verde o Rojo claro
            style={styles.statusIcon}
          />
          <ThemedText
            style={[
              styles.statusText,
              { color: isPro ? theme.success : theme.destructive },
            ]}
          >
            State: {isPro ? 'Active' : 'Inactive'}
          </ThemedText>
        </View>

        {/* --- Detalles si está Activa --- */}
        {isPro && proEntitlement && (
          <View style={styles.detailsSection}>
            <ThemedText style={styles.detailLabel}>Granted Access:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {proEntitlement.identifier}
            </ThemedText>

            <ThemedText style={styles.detailLabel}>
              Purchased Product:
            </ThemedText>
            <ThemedText style={styles.detailValue}>
              {proEntitlement.productIdentifier}
            </ThemedText>

            {proEntitlement.expirationDate && (
              <>
                <ThemedText style={styles.detailLabel}>Valid until:</ThemedText>
                <ThemedText style={styles.detailValue}>
                  {new Date(proEntitlement.expirationDate).toLocaleDateString()}
                </ThemedText>
              </>
            )}
            {proEntitlement.latestPurchaseDate && (
              <>
                <ThemedText style={styles.detailLabel}>
                  Última Facturación:
                </ThemedText>
                <ThemedText style={styles.detailValue}>
                  {new Date(
                    proEntitlement.latestPurchaseDate
                  ).toLocaleDateString()}
                </ThemedText>
              </>
            )}
            <ThemedText style={styles.detailLabel}>Store:</ThemedText>
            <ThemedText style={styles.detailValue}>
              {proEntitlement.store === 'APP_STORE'
                ? 'App Store'
                : proEntitlement.store === 'PLAY_STORE'
                  ? 'Google Play'
                  : proEntitlement.store}
            </ThemedText>

            {/* Botón para Gestionar en la Tienda */}
            <TouchableOpacity
              style={[styles.button, styles.manageButton]} // Botón secundario
              onPress={openSubscriptionManagement}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={secondaryButtonText}
                style={styles.buttonIcon}
              />
              <ThemedText
                style={[styles.buttonText, { color: secondaryButtonText }]}
              >
                Manage in Store
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        {/* --- Sección para Activar si está Inactiva --- */}
        {!isPro && (
          <View style={styles.activateSection}>
            <ThemedText style={styles.activateText}>
              ¡Unlock all features by going Pro user!
            </ThemedText>
            {/* Botón para Activar */}
            <Button
              style={{ width: '100%' }}
              onPress={handleGoPro}
              disabled={isPaywallLoading}
            >
              <ButtonIcon name="sparkles-outline" />
              <ButtonText>
                {isPaywallLoading ? 'Loading...' : 'Go Pro'}
              </ButtonText>
            </Button>
          </View>
        )}
      </View>

      {/* Nota de ayuda */}
      <ThemedText style={styles.footerText}>
        Cancellation or changes are made directly in the{' '}
        {Platform.OS === 'ios' ? 'App Store' : 'Google Play Store'}.
      </ThemedText>
    </ScrollView>
  );
};

// --- Estilos para Fondo Oscuro (#002e5d) ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: darkBackground // Quitar si el padre ya lo tiene, si no, ponerlo aquí
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: darkBackground // Quitar si el padre ya lo tiene
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: secondaryTextColor, // Texto secundario claro
  },
  errorText: {
    marginTop: 10,
    fontSize: 15,
    color: theme.destructive, // Color de error claro
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: cardBackgroundColor, // Fondo de tarjeta semi-transparente
    borderRadius: 12,
    padding: 25,
    marginBottom: 20,
    // Sombras no suelen verse bien en fondos oscuros, quitamos o hacemos muy sutil
    // elevation: 0,
    // shadowOpacity: 0,
    borderWidth: 1, // Borde sutil para definir la tarjeta
    borderColor: separatorColor,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.foreground, // Texto blanco
    textAlign: 'center',
    marginBottom: 25,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderRadius: 8,
    // Sin fondo extra, usa el de la tarjeta
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    // El color se aplica dinámicamente (activeColor/inactiveColor)
  },
  detailsSection: {
    marginTop: 10,
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: separatorColor, // Separador claro
    paddingTop: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: secondaryTextColor, // Texto secundario claro
    marginBottom: 3,
  },
  detailValue: {
    fontSize: 16,
    color: theme.foreground, // Texto principal blanco
    fontWeight: '500',
    marginBottom: 15,
  },
  activateSection: {
    marginTop: 15,
    alignItems: 'center',
  },
  activateText: {
    fontSize: 16,
    color: secondaryTextColor, // Texto secundario claro
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
    width: '100%',
    minHeight: 48,
    borderWidth: 1, // Añadimos borde a todos para consistencia
    borderColor: 'transparent', // Por defecto transparente
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  manageButton: {
    // Botón secundario
    backgroundColor: secondaryButtonBackground, // Fondo semi-transparente
    borderColor: secondaryButtonText, // Borde con el color del texto
  },
  // El color del texto del botón primario se aplica inline
  footerText: {
    fontSize: 13,
    color: secondaryTextColor, // Texto secundario claro
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 10,
  },
});

export default SubscriptionManager;
