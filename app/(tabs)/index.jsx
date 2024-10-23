import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import React from "react";
import { useClerk } from "@clerk/clerk-expo";
import { useNavigation } from "expo-router";

export default function index() {
  const { signOut } = useClerk();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace("index");
    } catch (error) {
      console.log("Sign out error", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text>home</Text>
      <Button style={styles.btn} mode="outlined" onPress={handleSignOut}>
        <Text style={styles.whiteText}>Sign Out</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  btn: {
    backgroundColor: Colors.ORANGE,
    padding: 20,
    borderRadius: 50,
    marginTop: 50,
    color: "#fff",
    width: "100%",
  },
  whiteText: {
    color: "#fff",
    textAlign: "center",
  },
});
