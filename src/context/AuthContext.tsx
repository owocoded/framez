import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { api } from '../../convex/_generated/api.js';
import { useQuery } from 'convex/react';

interface AuthContextType {
  isLoading: boolean;
  userId: string | null;
  user: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  
  // Query the user from our Convex database
  const convexUser = useQuery(api.users.getUserByClerkId, {
    clerkId: user?.id || "",
  });

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    if (!isSignedIn) {
      setUserId(null);
      setIsLoading(false);
      return;
    }

    // Set the user ID from Convex when available
    if (convexUser) {
      setUserId(convexUser._id);
    }

    setIsLoading(false);
  }, [isSignedIn, isLoaded, convexUser]);

  const value = {
    isLoading,
    userId,
    user: convexUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};