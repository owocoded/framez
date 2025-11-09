import React from 'react';
import { View, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import PostCard from '../components/PostCard';

const FeedScreen = () => {
  const posts = useQuery(api.posts.getAllPosts);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Since Convex is real-time, we don't need to manually refresh
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.container}>
        {!posts ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <Text style={styles.emptyText}>No posts yet. Be the first to share!</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default FeedScreen;