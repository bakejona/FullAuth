import { StyleSheet, Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React from "react";
import { useSignIn } from "@clerk/clerk-expo";

export default function SignIn() {
  const { SignIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState();
  const [password, setPassword] = React.useState();
  const onSignIn = async () => {
    if (!isLoaded) {
      return;
    }
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password: password,
      });
    } catch (err) {
      console.error("Sign in err", err + " ", JSON.stringify(err, null, 2));
    }
  };

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
  },
});
