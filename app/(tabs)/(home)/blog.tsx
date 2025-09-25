import React from "react";

import { FlatList, Linking, TouchableOpacity, View } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { getPosts } from "@/core/posts/actions/get-posts";
import { EmptyContent } from "@/core/components";
import Loader from "@/components/Loader";
import { PostCard } from "@/components/posts/PostCard";
import { ServerException } from "@/core/interfaces/server-exception.response";
import { Post } from "@/core/posts/interfaces";

const BlogScreen = (): JSX.Element => {
  const {
    data: posts,
    isLoading,
    isFetching,
  } = useQuery<Post[], AxiosError<ServerException>>({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (!posts || "error" in posts) {
    return (
      <EmptyContent
        title="Error"
        subtitle="An unexpected error occurred while fetching logs."
      />
    );
  }

  if (posts.length === 0) {
    return <EmptyContent title="No entries found." />;
  }

  return (
    <FlatList
      style={{
        padding: 10,
      }}
      data={posts}
      numColumns={1}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <PostCard post={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default BlogScreen;
