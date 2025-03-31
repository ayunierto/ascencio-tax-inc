import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Linking, Modal, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

import { useQuery } from '@tanstack/react-query';

import Button from '@/components/ui/Button';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import Divider from '@/components/ui/Divider';
import DateTimeInput from '@/components/ui/DateTimePicker/DateTimePicker';
import {
  DownloadAndSaveReport,
  getReports,
} from '@/core/accounting/reports/actions';
import { Report } from '@/core/accounting/reports/interfaces';
import { useRevenueCat } from '@/providers/RevenueCat';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';

const ReportsScreen = () => {
  const [recentReports, setRecentReports] = useState<Report[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const { isPro } = useRevenueCat();

  const reportsQuery = useQuery({
    queryKey: ['reports'],
    queryFn: () => getReports(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useFocusEffect(
    useCallback(() => {
      reportsQuery.refetch();
    }, [])
  );

  useEffect(() => {
    if (reportsQuery.data) {
      setRecentReports(reportsQuery.data);
    }
  }, [reportsQuery.data]);

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

  const downloadAndOpenPDFReport = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select a start and end date');
      return;
    }

    if (!isPro) {
      goPro();
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      Alert.alert('Error', 'Start date must be before end date');
      return;
    }
    if (startDate === endDate) {
      Alert.alert('Error', 'Start date and end date must be different');
      return;
    }

    const uri = await DownloadAndSaveReport(startDate, endDate);
    if (uri) {
      await openPDFReport(uri);
    }
    setModalVisible(false);
  };

  const openPDFReport = async (uri: string) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        console.error("You can't open the uri:", uri);
      }
    } catch (error) {
      console.error('Error opening the PDF:', error);
      try {
        await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      } catch (error) {
        console.error('Error opening the PDF:', error);
      }
    }
  };

  return (
    <View
      style={{ padding: 20, gap: 10, flex: 1, justifyContent: 'space-between' }}
    >
      <Button onPress={() => setModalVisible(true)}>Generate new report</Button>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#0009',
          }}
        >
          <View
            style={{
              backgroundColor: theme.background,
              borderRadius: 20,
              padding: 20,
              width: '90%',
              maxWidth: 360,
              maxHeight: '80%',
            }}
          >
            <View style={{ gap: 10 }}>
              <ThemedText>Start date</ThemedText>
              <DateTimeInput onChange={(date) => setStartDate(date)} />
              <ThemedText>End date</ThemedText>
              <DateTimeInput onChange={(date) => setEndDate(date)} />
            </View>

            <Divider style={{ marginVertical: 20 }} />

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Button
                variant="outlined"
                style={{ flex: 1 }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Close
              </Button>
              <Button
                style={{ flex: 1 }}
                onPress={() => downloadAndOpenPDFReport()}
              >
                Generate
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Card style={{ flex: 1 }}>
        <SimpleCardHeader>
          <Ionicons name={'flash-outline'} size={20} color={theme.foreground} />
          <SimpleCardHeaderTitle>Recent Reports</SimpleCardHeaderTitle>
        </SimpleCardHeader>
        <FlatList
          style={{ paddingHorizontal: 20 }}
          data={recentReports}
          numColumns={1}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{}}>
              <ThemedText>
                Report created at:{' '}
                <ThemedText style={{ color: theme.muted }}>
                  {new Date(item.createdAt).toLocaleString()}
                </ThemedText>
              </ThemedText>
            </View>
          )}
          onEndReachedThreshold={0.8}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedText style={{ color: theme.muted }}>
              There is no recent reports
            </ThemedText>
          }
        />
      </Card>
    </View>
  );
};

export default ReportsScreen;
