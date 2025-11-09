import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import { useAuth } from '@clerk/clerk-expo';
import PostCard from '../components/PostCard';
import Avatar from '../components/Avatar';
import { useAuthContext } from '../context/AuthContext';

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const clerkUser = useAuth();
  const { user: convexUser, isLoading } = useAuthContext();
  
  const userPosts = useQuery(api.posts.getUserPosts, {
    authorId: convexUser?._id || "",
  }) || [];

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: () => signOut() }
      ]
    );
  };

  const renderPost = ({ item }: { item: any }) => (
    <PostCard post={item} />
  );

  if (isLoading || !convexUser) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar 
          uri={clerkUser.user?.imageUrl || undefined} 
          name={clerkUser.user?.fullName || clerkUser.user?.primaryEmailAddress?.emailAddress || ''} 
          size={80} 
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {clerkUser.user?.fullName || clerkUser.user?.primaryEmailAddress?.emailAddress}
          </Text>
          <Text style={styles.userEmail}>
            {clerkUser.user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{userPosts.length}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
      
      <Text style={styles.postsTitle}>Your Posts</Text>
      
      <FlatList
        data={userPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        style={styles.postsList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingVertical: 15,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  signOutButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  postsList: {
    flex: 1,
  },
});

export default ProfileScreen;