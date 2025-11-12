import React from "react";
import { View, Text, StyleSheet } from "react-native";

const AuthScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Me2U</Text>
      <Text style={styles.subtitle}>Please sign in or sign up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default AuthScreen;
