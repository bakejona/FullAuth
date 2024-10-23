import { StyleSheet, Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn(); // Corrected function name
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState(""); // New state for error messages

  const onSignIn = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    // Basic validation
    if (!emailAddress || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createdSessionId, // Corrected property name
        });
        router.push("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        setErrorMessage("Sign in failed. Please try again."); // Set error message
      }
    } catch (err) {
      console.error("Sign in error", err.message);
      setErrorMessage(err.message); // Set error message for UI feedback
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}{" "}
      {/* Display error message */}
      <View style={styles.signInArea}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          keyboardType="email-address"
          placeholder="Email"
          onChangeText={setEmailAddress}
        />
        <TextInput
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <Button mode="outlined" onPress={onSignIn}>
          <Text>Sign In</Text> {/* Corrected button text */}
        </Button>
      </View>
      <View style={styles.needAccount}>
        <Text>Don't have an account?</Text>
        <Link style={styles.signUpButton} href="/sign-up">
          <Text>Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  signInArea: {
    marginBottom: 20,
  },
  needAccount: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: Colors.ORANGE,
    color: "white",
    borderRadius: 50,
  },
});
