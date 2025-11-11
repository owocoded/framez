import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api.js';
import { useConvex } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { useConvexAuthContext } from '../context/AuthContext';
import Avatar from '../components/Avatar';

const CreatePostScreen = () => {
  const [text, setText] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const createPost = useMutation(api.posts.createPost);
  const convex = useConvex();
  const { user: convexUser } = useConvexAuthContext();

  const pickImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    // Request permission to access camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImageAndGetUrl = async (imageUri: string) => {
    try {
      // Generate upload URL from Convex
      const uploadUrl = await convex.mutation(api.upload.generateUploadUrl);
      
      // Upload the image to Convex storage
      const imageResponse = await fetch(imageUri);
      const imageBlob = await imageResponse.blob();
      
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: imageBlob,
        headers: {
          'Content-Type': 'image/jpeg',
        },
      });
      
      const result = await response.json();
      const storageId = result.storageId;
      
      // Return the public URL for the uploaded image
      return `https://api.convex.cloud/api/storage/${storageId}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleCreatePost = async () => {
    if (!text.trim()) {
      Alert.alert('Error', 'Please enter some text for your post');
      return;
    }
    
    if (!convexUser || !convexUser._id) {
      Alert.alert('Error', 'User not found');
      return;
    }
    
    setUploading(true);
    try {
      let imageUrl = undefined;
      if (imageUri) {
        imageUrl = await uploadImageAndGetUrl(imageUri);
      }

      await createPost({
        content: text,
        imageUrl,
        authorId: convexUser._id,
      });

      // Reset form
      setText('');
      setImageUri(null);
      
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.header}>
        <Avatar 
          uri={convexUser?.avatar} 
          name={convexUser?.name || convexUser?.email || ''} 
          size={40} 
        />
        <Text style={styles.headerText}>
          {convexUser?.name || convexUser?.email}
        </Text>
      </View>
      
      <TextInput
        style={styles.textInput}
        placeholder="What's on your mind?"
        value={text}
        onChangeText={setText}
        multiline
        textAlignVertical="top"
        numberOfLines={6}
      />
      
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      )}
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
          <Text style={styles.mediaButtonText}>📷 Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <Text style={styles.mediaButtonText}>📸 Camera</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={[styles.submitButton, uploading && styles.submitButtonDisabled]} 
        onPress={handleCreatePost}
        disabled={uploading}
      >
        <Text style={styles.submitButtonText}>
          {uploading ? 'Posting...' : 'Share'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  headerText: {
    marginLeft: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },
  textInput: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    lineHeight: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 150,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  mediaButton: {
    flex: 0.48,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  mediaButtonText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePostScreen;