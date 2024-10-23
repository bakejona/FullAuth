import { StyleSheet, Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React from "react";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter, Link } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function SignIn() {
  const { SignIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState();
  const [password, setPassword] = React.useState();
  const onSignIn = React.useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password: password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({
          session: signInAttempt.createSessionId,
        });
        router.push("/(tabs)");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error("Sign in err", err + " ", JSON.stringify(err, null, 2));
    }
  }, [isLoaded, emailAddress, password]);

  return (
    <View style={styles.container}>
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
          <Text>Sign Up</Text>
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
    display: "flex",
    flex: 1,
    padding: 20,
  },
  signInArea: {
    marginBottom: 20,
  },
  needAccount: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButton: {
    marginTop: "20px",
    padding: 10,
    backgroundColor: Colors.ORANGE,
    color: "white",
    borderRadius: 50,
  },
});
