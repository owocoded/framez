import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: any;
}

const Avatar = ({ uri, name, size = 40, style }: AvatarProps) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.avatar, { width: size, height: size }, style]}
      />
    );
  }

  // Generate initial avatar if no image is provided
  const initials = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <View style={[
      styles.avatar,
      { width: size, height: size },
      styles.initialsContainer,
      style
    ]}>
      <Text style={[styles.initialsText, { fontSize: size / 2.5 }]}>
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 50,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer: {
    backgroundColor: '#4A90E2',
  },
  initialsText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Avatar;