import React from "react";
import {
  Linking,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DateTime } from "luxon";

import { Card, SimpleCardHeader } from "../ui/Card";
import { CardContent } from "../ui/Card/CardContent";
import { theme } from "../ui/theme";
import { ThemedText } from "../ui/ThemedText";
import { Post } from "@/core/posts/interfaces";

interface PostCardProps {
  post: Post;
  style?: StyleProp<ViewStyle>;
}

export const PostCard = ({ post, style }: PostCardProps) => {
  return (
    <TouchableOpacity onPress={() => Linking.openURL(post.url)} style={[style]}>
      <Card>
        <CardContent>
          <SimpleCardHeader>
            <Ionicons
              name={"link-outline"}
              size={20}
              color={theme.foreground}
            />
            <ThemedText style={{ fontSize: 16, flex: 1 }}>
              {post.title}
            </ThemedText>
          </SimpleCardHeader>
          <View>
            <ThemedText
              style={{
                color: theme.muted,
                textAlign: "right",
                fontSize: 12,
              }}
            >{`By: ${post.user.firstName} ${
              post.user.lastName
            } \n${DateTime.fromISO(post.createdAt).toRelative()}`}</ThemedText>
          </View>
        </CardContent>
      </Card>
    </TouchableOpacity>
  );
};
