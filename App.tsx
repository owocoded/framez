import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { ClerkProvider, useAuth, ClerkLoaded } from '@clerk/clerk-expo';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuthContext } from './src/context/AuthContext';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ClerkLoaded>
        <ConvexProvider client={convex}>
          <AuthProvider>
            <SafeAreaProvider>
              <StatusBar style="auto" />
              <AppWrapper />
            </SafeAreaProvider>
          </AuthProvider>
        </ConvexProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AppWrapper() {
  const { isSignedIn, isLoaded } = useAuth();
  const { isLoading } = useAuthContext();

  // Wait for both Clerk and our custom auth context to load
  if (!isLoaded || isLoading) {
    // Show a loading indicator while authentication status is being determined
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}