import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useConvexAuthContext } from "../context/AuthContext";

// Define the navigation types for the Auth stack
type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// Define the navigation prop type for this screen
type SignInScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'SignIn'>;

// Add navigation prop to component props
type Props = {
  navigation: SignInScreenNavigationProp;
};

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const { signIn } = useConvexAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError(""); // Clear any previous errors
    setIsLoading(true);
    try {
      const success = await signIn(email, password);
      if (success) {
        // Navigation to main app will be handled by RootNavigator based on auth state
        console.log("Sign in successful");
      } else {
        setError("Invalid email or password");
      }
    } catch (error: any) {
      console.error("Sign in error:", error);
      setError(error.message || "Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.appTitle}>Framez</Text>
      <Text style={styles.title}>Log In</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Error message display */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Log In</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#121212", // Dark background
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    position: "absolute",
    top: 50, // Position at top
    left: 20, // Position at left
    zIndex: 1, // Ensure it's above other elements
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#fff", // Make sure the title is visible against dark background
  },
  input: {
    height: 50,
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#333", // Darker input background
    color: "#fff", // White text in inputs
  },
  errorText: {
    color: "red",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4A90E2",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkButton: {
    alignItems: "center",
  },
  linkText: {
    color: "#4A90E2",
    fontSize: 14,
  },
});

export default SignInScreen;
