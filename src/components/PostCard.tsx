import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Avatar from './Avatar';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface Post {
  _id: Id<"posts">;
  authorId: Id<"users">;
  content: string;
  imageUrl?: string;
  createdAt: string; // ISO string
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  // Get author info using the authorId
  const author = useQuery(api.users.getUserById, { id: post.authorId });

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar uri={author?.avatar} name={author?.name || ''} size={40} />
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
      
      {post.imageUrl && (
        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
      )}
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>❤️ Like</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>↗️ Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 6,
    marginHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 2.00,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  userInfo: {
    marginLeft: 10,
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  timestamp: {
    color: '#888',
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
    width: '100%',
    height: 350,
    resizeMode: 'cover',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButton: {
    padding: 6,
  },
  actionText: {
    fontSize: 14,
    color: '#666',
  },
});

export default PostCard;