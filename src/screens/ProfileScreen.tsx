import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api.js";
import PostCard from "../components/PostCard";
import Avatar from "../components/Avatar";
import { useConvexAuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const {
    signOut,
    user: convexUser,
    isLoading: authLoading,
  } = useConvexAuthContext();
  const navigation = useNavigation();
  const [signOutLoading, setSignOutLoading] = React.useState(false);

  const userPosts =
    useQuery(api.posts.getUserPosts, {
      authorId: convexUser?._id || "",
    }) || [];

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => console.log("Sign out cancelled"),
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setSignOutLoading(true);
          try {
            await signOut();
            // Navigate to auth stack after successful signout
            navigation.reset({
              index: 0,
              routes: [{ name: "SignIn" }],
            });
          } catch (error) {
            console.error("Sign out error:", error);
          } finally {
            setSignOutLoading(false);
          }
        },
      },
    ]);
  };

  const renderPost = ({ item }: { item: any }) => <PostCard post={item} />;

  if (authLoading || !convexUser) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar
          uri={convexUser?.avatar || undefined}
          name={convexUser?.name || convexUser?.email || ""}
          size={80}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>
            {convexUser?.name || convexUser?.email}
          </Text>
          <Text style={styles.userEmail}>{convexUser?.email}</Text>
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

      <TouchableOpacity
        style={[styles.signOutButton, signOutLoading && styles.disabledButton]}
        onPress={async () => {
          setSignOutLoading(true);
          await signOut();
          setSignOutLoading(false);
        }}
        disabled={signOutLoading}
      >
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
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  userDetails: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 15,
    marginBottom: 10,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  signOutButton: {
    backgroundColor: "#e74c3c",
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  disabledButton: {
    backgroundColor: "#a9a9a9",
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  postsList: {
    flex: 1,
  },
});

export default ProfileScreen;
