import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { api } from "../../convex/_generated/api.js";
import { useMutation, useQuery, useConvex } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: Id<"users"> | null;
  user: any | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const convex = useConvex();

  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [, forceUpdate] = useState({}); // Dummy state to force updates

  const registerUser = useMutation(api.auth.register);
  const loginUser = useMutation(api.auth.login);

  // Storage helper functions that work across platforms
  const setStorageItem = async (key: string, value: string) => {
    // On web, always use AsyncStorage
    if (Platform.OS === 'web') {
      return AsyncStorage.setItem(key, value);
    }
    
    // On native, use SecureStore but with try-catch in case of issues
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('SecureStore failed, falling back to AsyncStorage:', error);
      return AsyncStorage.setItem(key, value);
    }
  };

  const getStorageItem = async (key: string) => {
    // On web, always use AsyncStorage
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    
    // On native, use SecureStore but with try-catch in case of issues
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('SecureStore failed, falling back to AsyncStorage:', error);
      return AsyncStorage.getItem(key);
    }
  };

  const deleteStorageItem = async (key: string) => {
    // On web, always use AsyncStorage
    if (Platform.OS === 'web') {
      return AsyncStorage.removeItem(key);
    }
    
    // On native, use SecureStore but with try-catch in case of issues
    try {
      return await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('SecureStore failed, falling back to AsyncStorage:', error);
      return AsyncStorage.removeItem(key);
    }
  };

  // Fetch user details reactively when userId is set
  const userData = useQuery(
    api.users.getUserById,
    userId ? { id: userId } : "skip"
  );

  // Load auth state from storage on app start
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      let token, storedUserId;
      try {
        token = await getStorageItem("authToken");
        storedUserId = await getStorageItem("userId");
      } catch (storageError) {
        console.error("Storage error during loading auth state:", storageError);
        // Continue with default behavior (not authenticated) if storage fails
      }

      if (token && storedUserId) {
        // Set userId which will trigger the userData query
        // Convert the stored string ID to the proper Convex ID type
        setUserId(storedUserId as Id<"users">);
        setIsAuthenticated(true);
        // We remain loading until user data is loaded
      } else {
        // No stored credentials, so we're done loading
        setIsLoading(false);
        // Explicitly set auth state to false when no credentials found
        setIsAuthenticated(false);
        setUserId(null);
        setUser(null);
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
      setIsLoading(false);
      // Ensure we're in a non-authenticated state if there's an error
      setIsAuthenticated(false);
      setUserId(null);
      setUser(null);
    }
  };

  // Update user state when userData changes and finish loading if we were waiting
  useEffect(() => {
    // Update user state whenever userData changes
    if (userData !== undefined) {
      setUser(userData);
    }
    
    // When we have authentication state and user data loaded, stop loading
    // But only if we were previously waiting to load user data after finding stored credentials
    if (userId && isAuthenticated && userData !== undefined) {
      setIsLoading(false);
    }
  }, [userData, userId, isAuthenticated]);

  // Sign in
  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const result = await loginUser({ email, password });
        if (result) {
          try {
            await setStorageItem("authToken", "valid_token");
            await setStorageItem("userId", result.id);
          } catch (storageError) {
            console.error("Storage error during sign in:", storageError);
            // Continue with auth state update even if storage fails
          }

          setUserId(result.id);
          setUser(result);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    [loginUser]
  );

  // Sign up
  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      try {
        const result = await registerUser({ name, email, password });
        if (result) {
          try {
            await setStorageItem("authToken", "valid_token");
            await setStorageItem("userId", result.id);
          } catch (storageError) {
            console.error("Storage error during sign up:", storageError);
            // Continue with auth state update even if storage fails
          }

          setUserId(result.id);
          setUser(result);
          setIsAuthenticated(true);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Sign up error:", error);
        return false;
      }
    },
    [registerUser]
  );

  // Sign out
const signOut = useCallback(async () => {
  console.log("Starting sign out process");
  setIsLoading(true);

  try {
    // Remove stored tokens / user info
    await deleteStorageItem("authToken");
    await deleteStorageItem("userId");
    console.log("Storage items deleted");

    // Reset auth state
    setUser(null);
    setUserId(null);
    setIsAuthenticated(false); // ✅ triggers RootNavigator to switch to SignIn

    console.log("State updated, isAuthenticated:", false);
  } catch (error) {
    console.error("Sign out error:", error);
  } finally {
    setIsLoading(false);
  }

  console.log("Sign out process completed");
}, []);


  const value: AuthContextType = {
    isLoading,
    isAuthenticated,
    userId,
    user,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use context
export const useConvexAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useConvexAuthContext must be used within AuthProvider");
  }
  return context;
};
