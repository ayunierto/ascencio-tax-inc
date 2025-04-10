import React from 'react';

import { Linking, TouchableOpacity, View } from 'react-native';
import * as MailComposer from 'expo-mail-composer';

import Logo from '@/components/Logo';
import { CardContent } from '@/components/ui/Card/CardContent';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { ThemedText } from '@/components/ui/ThemedText';
import Alert from '@/components/ui/Alert';

const SupportScreen = () => {
  return (
    <View style={{ flex: 1, padding: 20, gap: 10 }}>
      <Logo />

      <Alert>
        If you need help, please contact us using the following methods:
      </Alert>

      <TouchableOpacity
        onPress={() =>
          MailComposer.composeAsync({
            recipients: ['ascenciotaxinc@gmail.com'],
            subject: 'Support Request',
            body: 'I need help with the app',
          })
        }
      >
        <Card>
          <CardContent>
            <SimpleCardHeader>
              <SimpleCardHeaderTitle>Contact email</SimpleCardHeaderTitle>
            </SimpleCardHeader>
            <ThemedText>ascenciotaxinc@gmail.com</ThemedText>
          </CardContent>
        </Card>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => Linking.openURL('tel:+14166581208')}>
        <Card>
          <CardContent>
            <SimpleCardHeader>
              <SimpleCardHeaderTitle>Contact phone</SimpleCardHeaderTitle>
            </SimpleCardHeader>
            <ThemedText>(416) 658-1208</ThemedText>
          </CardContent>
        </Card>
      </TouchableOpacity>
    </View>
  );
};

export default SupportScreen;
