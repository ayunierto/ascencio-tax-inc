import React, { useEffect, useState } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Toast from 'react-native-toast-message';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';

import { usePlanStore } from '@/core/accounting/plans/store/usePlanStore';
import { Card } from '@/components/ui/Card/Card';
import { ThemedText } from '@/components/ui/ThemedText';
import Divider from '@/components/ui/Divider';
import { theme } from '@/components/ui/theme';
import Button from '@/components/ui/Button';
import { createSubscription } from '@/core/accounting/subscriptions/actions/create-subscription.action';
import { router } from 'expo-router';

const CheckoutScreen = () => {
  const [publishableKey, setPublishableKey] = useState('');
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const { selectedPlan, subtotal, months } = usePlanStore();

  const fetchPaymentSheetParams = async () => {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;

    const amount = parseFloat(subtotal.toFixed(2)) * 100;

    const response = await fetch(`${API_URL}/payments/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'cad',
      }),
    });

    const { paymentIntent, ephemeralKey, customer, publishableKey } =
      await response.json();

    setPublishableKey(publishableKey);

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Ascencio Tax Inc.',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        // name: 'Jane Doe',
        // email: 'jana-doe@example.com',
        // phone: '+51 999 999 999',
      },
      // returnURL: Linking.createURL('/payment-complete'),
      returnURL: Linking.createURL('stripe-redirect'),

      applePay: {
        merchantCountryCode: 'CA',
      },
    });

    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      // Alert.alert(`Error code: ${error.code}`, error.message);
      Toast.show({
        type: 'error',
        text1: 'Your order is not confirmed!',
        text2: 'Please try again or contact support.',
      });
    } else {
      // Alert.alert('Success', 'Your order is confirmed!');

      if (selectedPlan) {
        await createSubscription({
          durationInMonths: months,
          planId: selectedPlan.id,
        }).then(() => {
          Toast.show({
            type: 'success',
            text1: 'Your order is confirmed!',
            text2: 'Thank you for your purchase.',
          });
          router.replace('/accounting/subscriptions');
        });
      }
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.ayunierto.ascenciotaxinc" // required for Apple Pay
      // urlScheme={Linking.createURL('/')?.split(':')[0]} // required for 3D Secure and bank redirects
      urlScheme={'ascenciotax'} // required for 3D Secure and bank redirects
    >
      <ScrollView>
        <View style={{ padding: 20, gap: 10 }}>
          <Card style={{ gap: 10 }}>
            <View style={styles.cardHeader}>
              <ThemedText style={styles.cardTitle}>Order Summary</ThemedText>
            </View>
            <ThemedText style={styles.cardSubtitle}>
              {selectedPlan?.name} Plan
            </ThemedText>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText>{months} month(s) plan</ThemedText>
              <ThemedText>${subtotal.toFixed(2)}</ThemedText>
            </View>
            <Divider style={{ marginVertical: 10 }} />

            {/* <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText style={styles.cardSubtitle}>Subtotal</ThemedText>
              <ThemedText>${subtotal.toFixed(2)}</ThemedText>
            </View> */}
            {/* <Divider style={{ marginVertical: 10 }} /> */}

            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <ThemedText style={styles.cardSubtitle}>Total</ThemedText>
              <ThemedText style={styles.cardSubtitle}>
                ${subtotal.toFixed(2)}
              </ThemedText>
            </View>
          </Card>
          {/* 
          <Card style={{ gap: 20 }}>
            <View style={styles.cardHeader}>
              <View style={styles.cardNumber}>
                <ThemedText
                  style={{
                    color: theme.primary,
                  }}
                >
                  1
                </ThemedText>
              </View>
              <ThemedText style={styles.cardTitle}>Billing address</ThemedText>
            </View>

            <View style={styles.inputsContainer}>
              <View style={styles.inputContainer}>
                <ThemedText>Name</ThemedText>
                <Input placeholder="Name" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Last name</ThemedText>
                <Input placeholder="Last name" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Phone number</ThemedText>
                <Input placeholder="Phone number" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Country of residence *</ThemedText>
                <Input placeholder="Country of residence" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Address</ThemedText>
                <Input placeholder="Address" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>City</ThemedText>
                <Input placeholder="City" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Region/province</ThemedText>
                <Input placeholder="Region/province" />
              </View>

              <View style={styles.inputContainer}>
                <ThemedText>Postal code</ThemedText>
                <Input placeholder="Postal code" />
              </View>
            </View>
          </Card> */}

          <Card style={{ gap: 20 }}>
            <View style={styles.cardHeader}>
              <View style={styles.cardNumber}>
                <ThemedText
                  style={{
                    color: theme.primary,
                  }}
                >
                  1
                </ThemedText>
              </View>
              <ThemedText style={styles.cardTitle}>Pay</ThemedText>
            </View>

            <Button loading={!loading} onPress={openPaymentSheet}>
              Send payment
            </Button>
            <View
              style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}
            >
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color={theme.primary}
              />
              <ThemedText> Encrypted and secure payments</ThemedText>
            </View>
            <ThemedText>
              By completing the purchase, you agree to our{' '}
              <Link
                style={{
                  color: theme.primary,
                  textDecorationLine: 'underline',
                }}
                href={'/'}
              >
                Terms of Service
              </Link>{' '}
              and you confirm that you have read our{' '}
              <Link
                href={'/'}
                style={{
                  color: theme.primary,
                  textDecorationLine: 'underline',
                }}
              >
                Privacy Policy
              </Link>
              . You can cancel recurring payments at any time.
            </ThemedText>
          </Card>
        </View>
      </ScrollView>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  cardHeader: { flexDirection: 'row', gap: 10 },
  cardNumber: {
    width: 30,
    height: 30,
    alignItems: 'center',
    borderColor: 'gray',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 9999,
  },
  cardTitle: { fontSize: 20, fontWeight: 'bold' },
  cardSubtitle: { fontSize: 18, fontWeight: 'bold' },
  inputsContainer: { gap: 10 },
  inputContainer: { gap: 5 },
});

export default CheckoutScreen;
