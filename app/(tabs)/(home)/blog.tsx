import React from 'react';

import { FlatList, Linking, TouchableOpacity, View } from 'react-native';
import { DateTime } from 'luxon';
import { useQuery } from '@tanstack/react-query';

import { getPosts } from '@/core/posts/actions/get-posts';
import { EmptyList } from '@/core/components';
import Loader from '@/components/Loader';
import { Card, SimpleCardHeader, SimpleCardHeaderTitle } from '@/components/ui';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/components/ui/theme';
import { ThemedText } from '@/components/ui/ThemedText';

const BlogScreen = (): JSX.Element => {
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  });

  if (isLoading || isFetching) {
    return <Loader />;
  }

  return (
    <FlatList
      style={{ padding: 20 }}
      data={data ?? []}
      numColumns={1}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
          <Card style={{ marginBottom: 10 }}>
            <SimpleCardHeader>
              <Ionicons
                name={'link-outline'}
                size={20}
                color={theme.foreground}
              />
              <SimpleCardHeaderTitle
                style={{ textDecorationLine: 'underline' }}
              >
                {item.title}
              </SimpleCardHeaderTitle>
            </SimpleCardHeader>
            <View>
              <ThemedText
                style={{ color: theme.muted, textAlign: 'right', fontSize: 12 }}
              >{`By: ${item.user.name} ${
                item.user.lastName
              } \n${DateTime.fromISO(
                item.createdAt
              ).toRelative()}`}</ThemedText>
            </View>
          </Card>
        </TouchableOpacity>
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={<EmptyList title="No entries found." />}
    />
  );
};

export default BlogScreen;
