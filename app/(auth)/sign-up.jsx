import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error messages

  const onSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    // Basic validation
    if (!emailAddress || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
      setErrorMessage(""); // Clear error message on success
    } catch (err) {
      console.error("Signup error", err.message);
      setErrorMessage(err.message); // Set error message for UI feedback
    }
  };

  const onVerifyEmail = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({
          session: completeSignUp.createdSessionId,
        });
        router.push("/(tabs)");
      } else {
        console.error(
          "Verification incomplete",
          JSON.stringify(completeSignUp, null, 2)
        );
        setErrorMessage("Verification failed. Please try again."); // Set error message
      }
    } catch (err) {
      console.error("Verification error", err.message);
      setErrorMessage(err.message); // Set error message for UI feedback
    }
  };

  return (
    <View style={styles.container}>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}{" "}
      {/* Display error message */}
      {!pendingVerification ? (
        <>
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
          <Button mode="outlined" onPress={onSignUp}>
            <Text>Sign Up</Text> {/* Corrected button text */}
          </Button>
        </>
      ) : (
        <>
          <TextInput
            value={code}
            placeholder="Verification Code"
            keyboardType="numeric"
            onChangeText={setCode}
          />
          <Button mode="outlined" onPress={onVerifyEmail}>
            <Text>Verify Email</Text>
          </Button>
        </>
      )}
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
});
