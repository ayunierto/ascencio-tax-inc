import React from 'react';

import { Card } from '@/components/ui/Card';
import { CardContent } from '@/components/ui/Card/CardContent';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';
import { Feather, Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ListItem = ({
  icon,
  label,
  external = false,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  external?: boolean;
}) => (
  <TouchableOpacity onPress={onPress}>
    <Card>
      <CardContent>
        <View style={styles.itemRow}>
          <View style={styles.itemLeft}>
            <Ionicons name={icon} size={22} color={theme.foreground} />
            <ThemedText style={styles.itemLabel}>{label}</ThemedText>
          </View>
          {external ? (
            <Feather name="external-link" size={20} color={theme.foreground} />
          ) : (
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.mutedForeground}
            />
          )}
        </View>
      </CardContent>
    </Card>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabel: {
    fontSize: 16,
    marginLeft: 10,
    color: theme.foreground,
  },
});

export default ListItem;
