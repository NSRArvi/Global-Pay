import { useEffect } from "react";
import { Stack } from "expo-router";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LogBox } from "react-native";
import "../global.css";
import { AuthProvider } from "../context/AuthContext";

LogBox.ignoreLogs([
  "Can't perform a React state update on a component that hasn't mounted yet",
]);
export default function RootLayout() {
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    // Load theme from storage
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem("theme");
        if (storedTheme) {
          setColorScheme(storedTheme);
        } else {
          setColorScheme("system");
        }
      } catch (error) {
        console.error("Failed to load theme", error);
      }
    };
    loadTheme();
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
