import * as SecureStore from "expo-secure-store";
import { Stack } from "expo-router";
import { ClerkProvider, ClerkLoaded, SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function RootLayout() {
  const tokenCache = {
    async getToken(key: string) {
      try {
        const item = await SecureStore.getItemAsync(key)
        if (item) {
          console.log(`${key} was used 🔐 \n`)
        } else {
          console.log('No values stored under key: ' + key)
        }
        return item
      } catch (error) {
        console.error('SecureStore get item error: ', error)
        await SecureStore.deleteItemAsync(key)
        return null
      }
    },
    async saveToken(key: string, value: string) {
      try {
        return SecureStore.setItemAsync(key, value)
      } catch (err) {
        return
      }
    },
  }
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

  if (!publishableKey) {
    throw new Error(
      'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <Stack screenOptions={{headerShown: false}}>
          <SignedIn>
            <Stack.Screen name="tabs" options={{headerShown: false}}></Stack.Screen>
          </SignedIn>
          <SignedOut>
            <Stack.Screen name="index" options={{title: "Welcome", headerShown: false}}></Stack.Screen>
            <Stack.Screen name="auth/sign-in" options={{title: "Sign In"}}/>
            <Stack.Screen name="auth/sign-up" options={{title: "Sign Up"}}/>
          </SignedOut>        
        </Stack>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
