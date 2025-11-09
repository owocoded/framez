import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { SignIn, SignUp } from '@clerk/clerk-expo';

const AuthScreen = () => {
  const { isSignedIn } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Me2U</Text>
      <View style={styles.authContainer}>
        {isSignedIn ? (
          <Text>You are already signed in!</Text>
        ) : (
          <SignIn 
            path="/sign-in" 
            routing="path" 
            signUpUrl="/sign-up"
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  authContainer: {
    width: '100%',
    maxWidth: 400,
  },
});

export default AuthScreen;