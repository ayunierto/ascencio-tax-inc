import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Redirect, router } from 'expo-router';

import { usePlanStore } from '@/core/accounting/plans/store/usePlanStore';
import Select, { type Option } from '@/components/ui/Select';
import { ThemedText } from '@/components/ui/ThemedText';
import Divider from '@/components/ui/Divider';
import { Card } from '@/components/ui/Card/Card';
import { theme } from '@/components/ui/theme';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const CartScreen = () => {
  const [defaultSelectedPeriod, setDefaultSelectedPeriod] = useState<Option>();
  const [price, setPrice] = useState<number>(0);
  const [save, setSave] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<{
    months: number;
    discount: number;
  }>();

  const { selectedPlan, highestDiscount, setSubtotal, setMonths } =
    usePlanStore();

  useEffect(() => {
    if (selectedPlan) {
      const maximumDiscountPeriod = selectedPlan.discounts.find(
        (discount) => discount.discount === highestDiscount
      );
      if (maximumDiscountPeriod) {
        const { discount, months } = maximumDiscountPeriod;
        const defaultOption = {
          label: months + ' months',
          value: discount.toString(),
        };
        setDefaultSelectedPeriod(defaultOption);

        setSelectedPeriod({
          discount,
          months,
        });
      }
    }
  }, [selectedPlan]);

  useEffect(() => {
    if (selectedPlan && selectedPeriod) {
      setPrice(
        selectedPeriod.discount > 0
          ? +selectedPlan.price * (1 - selectedPeriod.discount / 100)
          : +selectedPlan.price
      );
    }
  }, [selectedPeriod]);

  useEffect(() => {
    if (selectedPlan && selectedPeriod) {
      const period = selectedPlan.discounts.find(
        (discount) => discount.discount === selectedPeriod.discount
      );
      if (period) {
        setSave((+selectedPlan.price - price) * period.months);
      }
    }
  }, [price]);

  const onSelectPeriod = (period: Option): void => {
    setSelectedPeriod({
      discount: +period.value,
      months: +period.label.split(' ')[0],
    });
  };

  if (!selectedPlan) return <Redirect href={'/accounting/subscriptions'} />;
  if (!selectedPeriod) return;

  return (
    <View style={{ padding: 20 }}>
      <ThemedText style={styles.title}>Your cart</ThemedText>

      <Card
        style={{
          padding: 20,
          marginBottom: 20,
        }}
      >
        <ThemedText
          style={{ fontSize: 30, fontWeight: 'bold', marginBottom: 10 }}
        >
          {selectedPlan.name} Plan
        </ThemedText>
        <Divider style={{ backgroundColor: '#8883', marginVertical: 20 }} />

        <Select
          placeholder="Select period"
          enableFilter={false}
          options={selectedPlan.discounts.map((discount) => {
            return {
              label: discount.months + ' months',
              value: discount.discount.toString(),
            };
          })}
          style={{ marginBottom: 20 }}
          onSelect={onSelectPeriod}
          selectedOptions={defaultSelectedPeriod}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View>
            <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
              ${price.toFixed(2)}/month
            </ThemedText>

            {selectedPeriod.discount > 0 && (
              <ThemedText
                style={{
                  fontSize: 18,
                  color: theme.muted,
                  textDecorationLine: 'line-through',
                }}
              >
                ${selectedPlan.price}/month
              </ThemedText>
            )}
          </View>

          {selectedPeriod.discount > 0 && (
            <ThemedText
              style={{
                backgroundColor: `${theme.primary}33`,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: theme.radius,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Save ${save.toFixed(2)}
            </ThemedText>
          )}
        </View>
      </Card>
      <Card>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <ThemedText style={{ fontSize: 25, fontWeight: 'bold' }}>
            Subtotal
          </ThemedText>

          <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
            ${(price * selectedPeriod.months).toFixed(2)}
          </ThemedText>
        </View>

        {selectedPeriod.discount > 0 && (
          <ThemedText style={{ fontSize: 16 }}>
            -{selectedPeriod.discount}% discount
          </ThemedText>
        )}

        <ThemedText
          style={{
            marginBottom: 20,
            color: theme.muted,
          }}
        >
          Subtotal does not include applicable taxes
        </ThemedText>

        <ThemedText
          style={{ fontSize: 16, color: theme.primary, marginBottom: 10 }}
        >
          Do you have a discount coupon?
        </ThemedText>
        <ThemedText style={{ color: theme.muted, marginBottom: 10 }}>
          Enter the discount coupon
        </ThemedText>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 30,
          }}
        >
          <Input placeholder="Coupon" style={{ flex: 2 }} />
          <Button style={{ flex: 1 }}>Apply</Button>
        </View>
        <Button
          onPress={() => {
            setSubtotal(price * selectedPeriod.months);
            setMonths(selectedPeriod.months);
            router.push('/accounting/subscriptions/checkout');
          }}
        >
          Continue
        </Button>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default CartScreen;
