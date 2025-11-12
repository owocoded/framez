import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Share } from 'react-native';
import moment from "moment";
import Avatar from "./Avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import { Id } from "../../convex/_generated/dataModel";
import { useConvexAuthContext } from "../context/AuthContext";

interface Post {
  _id: Id<"posts">;
  authorId: Id<"users">;
  content: string;
  imageUrl?: string;
  likes?: Id<"users">[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // Get author info using the authorId
  const author = useQuery(api.users.getUserById, { id: post.authorId });
  const { userId: currentUserId } = useConvexAuthContext();
  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = () => {
    if (!currentUserId) return; // Don't allow like if not authenticated
    toggleLike({ postId: post._id, userId: currentUserId });
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this post from Framez:\n\n${post.content}\n\nShared from Framez app`,
        title: `Framez Post by ${author?.name || 'User'}`,
        url: post.imageUrl ? (post.imageUrl.startsWith('http') ? post.imageUrl : `https://my-project.cloud.convexcdn.com/storage/${post.imageUrl}`) : undefined,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log('Shared with activity type:', result.activityType);
        } else {
          console.log('Shared successfully');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      Alert.alert('Error', 'Could not share post');
    }
  };

  // Check if the current user has liked this post
  const hasLiked = post.likes && currentUserId ? post.likes.includes(currentUserId) : false;
  const likesCount = post.likes ? post.likes.length : 0;

  // Function to generate proper Convex storage URL from storage ID
  // The deployment ID is usually the prefix of your Convex URL
  // Format: https://<deployment-id>.cloud.convexcdn.com/storage/<storageId>
  // For now, we'll try to construct it based on common patterns
  const getStorageUrl = (storageId: string) => {
    // This is a placeholder - in a real app, you'd get the deployment ID from your config
    // or use the proper Convex client method to generate the URL
    // The actual URL format depends on your Convex deployment
    // Standard format: https://<deployment-id>.cloud.convexcdn.com/storage/<storageId>
    
    // For the purpose of this implementation, we'll look for the URL in environment or config
    // Since we can't access it directly, let's assume we have the proper full URL stored in the DB
    // If it's not a full URL, we'll need to construct it somehow
    
    // If imageUrl starts with http, it's already a full URL
    if (post.imageUrl?.startsWith('http')) {
      return post.imageUrl;
    }
    
    // For Convex storage, the URL format is https://<deployment-id>.cloud.convexcdn.com/storage/<storageId>
    // Since we can't directly access the deployment URL from the client here,
    // we need to construct it from available information
    // This would need to be updated with your actual deployment ID
    const deploymentId = "my-project"; // Replace this with your actual deployment ID from convex.json
    
    // Construct the proper URL
    return `https://${deploymentId}.cloud.convexcdn.com/storage/${storageId}`;
  };

  // Determine the image URL - if it's already a full URL, use as-is; if it's a storage ID, construct the URL
  const imageUrl = post.imageUrl && post.imageUrl.startsWith('http') 
    ? post.imageUrl 
    : post.imageUrl 
      ? getStorageUrl(post.imageUrl) 
      : undefined;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={author?.avatar} name={author?.name || ""} size={40} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{author?.name}</Text>
          <Text style={styles.timestamp}>
            {moment(post.createdAt).fromNow()}
          </Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Text style={styles.moreText}>•••</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.postText}>{post.content}</Text>

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.postImage}
          resizeMode="cover"
          onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
          onLoad={(success) => console.log('Image load success:', imageUrl)}
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Text style={styles.actionText}>
            {hasLiked ? '❤️ Liked' : '🤍 Like'} {likesCount > 0 ? `(${likesCount})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionText}>↗️ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.0,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    paddingBottom: 8,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timestamp: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },
  moreButton: {
    padding: 5,
  },
  moreText: {
    fontSize: 16,
  },
  postText: {
    fontSize: 15,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  postImage: {
    width: "100%",
    height: 350,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionButton: {
    padding: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#666",
  },
});

export default PostCard;