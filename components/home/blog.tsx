import React from "react";

import { ScrollView, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getPostsAction } from "@/core/posts/actions/get-posts";
import { EmptyContent } from "@/core/components";
import Loader from "@/components/Loader";
import { PostCard } from "@/components/posts/PostCard";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { Post } from "@/core/posts/interfaces";

const BlogScreen = () => {
  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[], AxiosError<ServerException>, Post[]>({
    queryKey: ["posts"],
    queryFn: getPostsAction,
  });

  if (isError) {
    return (
      <EmptyContent
        title="Something went wrong."
        subtitle={error.response?.data.message || error.message}
        icon="sad-outline"
      />
    );
  }
  if (isLoading) {
    return <Loader message="Loading posts..." />;
  }
  if (!posts || posts.length === 0) {
    return (
      <EmptyContent title="No posts found." icon="information-circle-outline" />
    );
  }

  return (
    <ScrollView>
      <View style={{ padding: 10, flex: 1 }}>
        <View style={{ flexDirection: "column", gap: 10 }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default BlogScreen;
