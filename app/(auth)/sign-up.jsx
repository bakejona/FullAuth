import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [emailAddress, setEmailAddress] = useState(""); // Corrected variable name
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  const onSignUp = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress, // Corrected variable name
        password,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setPendingVerification(true);
    } catch (err) {
      console.error("Signup error", err.message);
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
      }
    } catch (err) {
      console.error("Verification error", err.message);
    }
  };

  return (
    <View style={styles.container}>
      {!pendingVerification ? (
        <>
          <TextInput
            autoCapitalize="none"
            value={emailAddress} // Corrected variable name
            keyboardType="email-address" // Corrected keyboard type
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
            <Text>Sign Up</Text>
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
    display: "flex",
    flex: 1,
  },
});
