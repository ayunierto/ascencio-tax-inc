import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  View,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

import { useQuery } from '@tanstack/react-query';

import { Button, ButtonIcon, ButtonText } from '@/components/ui/Button';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { ThemedText } from '@/components/ui/ThemedText';
import { theme } from '@/components/ui/theme';
import Divider from '@/components/ui/Divider';
import {
  downloadAndSaveReport,
  getReports,
} from '@/core/accounting/reports/actions';
import { Report } from '@/core/accounting/reports/interfaces';
import { useRevenueCat } from '@/providers/RevenueCat';
import { CardContent } from '@/components/ui/Card/CardContent';
import { goPro } from '@/core/accounting/actions/go-pro.action';
import z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { EmptyContent } from '@/core/components';
import { AxiosError } from 'axios';
import { ServerException } from '@/core/interfaces/server-exception.response';
import Loader from '@/components/Loader';
import DateTimePicker from '@/components/ui/DateTimePicker/DateTimePicker';
import { DateTime } from 'luxon';
import Toast from 'react-native-toast-message';

export const reportSchema = z
  .object({
    startDate: z.string({ required_error: 'Please select a start date' }),
    endDate: z.string({ required_error: 'Please select an end date' }),
  })
  .superRefine((data, ctx) => {
    const { endDate, startDate } = data;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Invalid date format',
        path: ['startDate'], // o ["endDate"]
      });
      return;
    }

    if (start > end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'End date must be after start date',
        path: ['endDate'],
      });
    }

    if (start.getTime() === end.getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Start and end dates cannot be the same',
        path: ['endDate'],
      });
    }
  });

export type ReportFormFields = z.infer<typeof reportSchema>;

const ReportsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { isPro } = useRevenueCat();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ReportFormFields>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      startDate: DateTime.now().minus({ days: 7 }).toUTC().toISODate(),
      endDate: DateTime.now().toISODate(),
    },
  });

  const {
    data: reportsHistory,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<Report[], AxiosError<ServerException>, Report[]>({
    queryKey: ['reports'],
    queryFn: () => getReports(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [])
  );

  const downloadAndOpenPDFReport = async ({
    endDate,
    startDate,
  }: ReportFormFields) => {
    try {
      const uri = await downloadAndSaveReport(startDate, endDate);
      if (uri) {
        await openPDFReport(uri);
      }
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error generating report',
        text2: 'Please try again later',
      });
    }
  };

  const openPDFReport = async (uri: string) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
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

  if (isError) {
    return (
      <EmptyContent
        title="Error"
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }
  if (isLoading) {
    return <Loader message="Loading reports..." />;
  }

  return (
    <View
      style={{ padding: 20, gap: 10, flex: 1, justifyContent: 'space-between' }}
    >
      <Button onPress={() => setModalVisible(true)}>
        <ButtonText>Create Report</ButtonText>
      </Button>

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
            <View style={{ gap: 20 }}>
              <ThemedText style={styles.modalTitle}>
                Select a date range
              </ThemedText>

              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    labelText="Start date"
                    error={!!errors.startDate}
                    errorMessage={errors.startDate?.message}
                    value={value ?? null}
                    mode="date"
                    onChange={onChange}
                  />
                )}
              />

              <Controller
                control={control}
                name="endDate"
                render={({ field: { onChange, value } }) => (
                  <DateTimePicker
                    labelText="End date"
                    error={!!errors.endDate}
                    errorMessage={errors.endDate?.message}
                    value={value ?? null}
                    mode="date"
                    onChange={onChange}
                  />
                )}
              />
            </View>

            <Divider style={{ marginVertical: 20 }} />

            <View style={{ gap: 10 }}>
              <Button
                fullWidth
                variant="default"
                onPress={handleSubmit(downloadAndOpenPDFReport)}
              >
                <ButtonIcon name="download-outline" />
                <ButtonText>Download</ButtonText>
              </Button>

              <Button
                variant="outline"
                fullWidth
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Card style={{ flex: 1 }}>
        <CardContent>
          <SimpleCardHeader>
            <Ionicons
              name={'flash-outline'}
              size={20}
              color={theme.foreground}
            />
            <SimpleCardHeaderTitle>Recent Reports</SimpleCardHeaderTitle>
          </SimpleCardHeader>
          <FlatList
            style={{ paddingHorizontal: 20 }}
            data={reportsHistory || []}
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
        </CardContent>
      </Card>
    </View>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  modalTitle: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 18,
  },
});
