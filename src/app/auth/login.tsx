import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert("Error", error.message);
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const goToSignUp = () => {
    router.push("/auth/signup");
  };

  return (
    <LinearGradient
      colors={["#0f0f23", "#1a1a2e", "#16213e"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={styles.title}>StudyPath</Text>
          <Text style={styles.subtitle}>Welcome Back!</Text>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#6b7280"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={goToSignUp}
            >
              <Text style={styles.secondaryButtonText}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Sign in to continue your learning journey
          </Text>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 100,
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#00d4ff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#9ca3af",
    textAlign: "center",
    marginBottom: 48,
  },
  form: {
    marginBottom: 32,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#ffffff",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#00d4ff",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#00d4ff",
  },
  buttonText: {
    color: "#0f0f23",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#00d4ff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
});
